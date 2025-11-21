/*
# Create Notifications System

## Overview
This migration creates a comprehensive notification system for the eCommerce platform.
Users will receive in-app notifications for order status changes and other important events.

## 1. New Tables

### notifications
Stores all user notifications with read/unread status.

**Columns:**
- `id` (uuid, primary key): Unique notification identifier
- `user_id` (uuid, references auth.users): User who receives the notification
- `title` (text, not null): Notification title/heading
- `message` (text, not null): Notification message content
- `type` (notification_type, not null): Type of notification (order, system, promotion)
- `related_id` (uuid, nullable): ID of related entity (e.g., order_id)
- `is_read` (boolean, default false): Whether notification has been read
- `created_at` (timestamptz, default now()): When notification was created

## 2. Enums

### notification_type
Defines the types of notifications:
- `order`: Order-related notifications (status changes, etc.)
- `system`: System notifications (maintenance, updates)
- `promotion`: Promotional notifications (offers, discounts)

## 3. Security

### Row Level Security (RLS)
- Enable RLS on notifications table
- Users can only view their own notifications
- Users can update their own notifications (mark as read)
- System/admin can insert notifications for any user

### Policies
1. **Users can view own notifications**: SELECT policy for authenticated users
2. **Users can update own notifications**: UPDATE policy for marking as read
3. **Admins can insert notifications**: INSERT policy for admin users
4. **System can insert notifications**: Allow service role to insert

## 4. Indexes
- Index on user_id for fast user notification queries
- Index on created_at for sorting by date
- Index on is_read for filtering unread notifications

## 5. Functions

### mark_notification_read
Marks a notification as read for the current user.

### mark_all_notifications_read
Marks all notifications as read for the current user.

### get_unread_count
Returns the count of unread notifications for the current user.
*/

-- Create notification type enum
CREATE TYPE notification_type AS ENUM ('order', 'system', 'promotion');

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type NOT NULL DEFAULT 'system'::notification_type,
  related_id uuid,
  is_read boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Create indexes for performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Admins can insert notifications for any user
CREATE POLICY "Admins can insert notifications" ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'::user_role
    )
  );

-- Policy: Service role can insert notifications (for system-generated notifications)
CREATE POLICY "Service role can insert notifications" ON notifications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Function: Mark a notification as read
CREATE OR REPLACE FUNCTION mark_notification_read(notification_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET is_read = true
  WHERE id = notification_id
  AND user_id = auth.uid();
END;
$$;

-- Function: Mark all notifications as read for current user
CREATE OR REPLACE FUNCTION mark_all_notifications_read()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE notifications
  SET is_read = true
  WHERE user_id = auth.uid()
  AND is_read = false;
END;
$$;

-- Function: Get unread notification count for current user
CREATE OR REPLACE FUNCTION get_unread_count()
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  unread_count bigint;
BEGIN
  SELECT COUNT(*)
  INTO unread_count
  FROM notifications
  WHERE user_id = auth.uid()
  AND is_read = false;
  
  RETURN unread_count;
END;
$$;

-- Function: Create notification for user (helper function)
CREATE OR REPLACE FUNCTION create_notification(
  p_user_id uuid,
  p_title text,
  p_message text,
  p_type notification_type DEFAULT 'system'::notification_type,
  p_related_id uuid DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, title, message, type, related_id)
  VALUES (p_user_id, p_title, p_message, p_type, p_related_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Trigger function: Create notification on order status change
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_title text;
  notification_message text;
BEGIN
  -- Only create notification if status actually changed
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Set notification title and message based on new status
    CASE NEW.status
      WHEN 'order_placed' THEN
        notification_title := 'Order Placed Successfully';
        notification_message := 'Your order #' || SUBSTRING(NEW.id::text, 1, 8) || ' has been placed successfully. We will confirm it shortly.';
      WHEN 'confirmed' THEN
        notification_title := 'Order Confirmed';
        notification_message := 'Your order #' || SUBSTRING(NEW.id::text, 1, 8) || ' has been confirmed and is being prepared for shipment.';
      WHEN 'shipped' THEN
        notification_title := 'Order Shipped';
        notification_message := 'Your order #' || SUBSTRING(NEW.id::text, 1, 8) || ' has been shipped and is on its way to you!';
      WHEN 'delivered' THEN
        notification_title := 'Order Delivered';
        notification_message := 'Your order #' || SUBSTRING(NEW.id::text, 1, 8) || ' has been delivered. Thank you for shopping with us!';
      WHEN 'cancelled' THEN
        notification_title := 'Order Cancelled';
        notification_message := 'Your order #' || SUBSTRING(NEW.id::text, 1, 8) || ' has been cancelled.';
      ELSE
        RETURN NEW;
    END CASE;
    
    -- Create the notification
    PERFORM create_notification(
      NEW.user_id,
      notification_title,
      notification_message,
      'order'::notification_type,
      NEW.id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for order status changes
DROP TRIGGER IF EXISTS trigger_order_status_notification ON orders;
CREATE TRIGGER trigger_order_status_notification
  AFTER INSERT OR UPDATE OF status ON orders
  FOR EACH ROW
  EXECUTE FUNCTION notify_order_status_change();

-- Trigger function: Create notification on return request status change
CREATE OR REPLACE FUNCTION notify_return_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  notification_title text;
  notification_message text;
  order_user_id uuid;
BEGIN
  -- Get the user_id from the related order
  SELECT user_id INTO order_user_id
  FROM orders
  WHERE id = NEW.order_id;
  
  -- Only create notification if status actually changed
  IF (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    -- Set notification title and message based on new status
    CASE NEW.status
      WHEN 'approved' THEN
        notification_title := 'Return Request Approved';
        notification_message := 'Your return request #' || SUBSTRING(NEW.id::text, 1, 8) || ' has been approved. Refund will be processed soon.';
      WHEN 'rejected' THEN
        notification_title := 'Return Request Rejected';
        notification_message := 'Your return request #' || SUBSTRING(NEW.id::text, 1, 8) || ' has been rejected. Please contact support for details.';
      WHEN 'refunded' THEN
        notification_title := 'Refund Processed';
        notification_message := 'Your refund for return request #' || SUBSTRING(NEW.id::text, 1, 8) || ' has been processed successfully.';
      ELSE
        RETURN NEW;
    END CASE;
    
    -- Create the notification
    PERFORM create_notification(
      order_user_id,
      notification_title,
      notification_message,
      'order'::notification_type,
      NEW.order_id
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for return request status changes
DROP TRIGGER IF EXISTS trigger_return_status_notification ON return_requests;
CREATE TRIGGER trigger_return_status_notification
  AFTER UPDATE OF status ON return_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_return_status_change();
