/*
# Add Order Placed Status

1. Changes
  - Add 'order_placed' to order_status enum
  - This status comes after 'processing' and before 'shipped'

2. Purpose
  - Better order tracking workflow
  - Distinguish between processing payment and order confirmed

3. Order Status Flow
  - pending → processing → order_placed → shipped → delivered
  - Can be cancelled at any stage before shipped
*/

ALTER TYPE order_status ADD VALUE IF NOT EXISTS 'order_placed' AFTER 'processing';
