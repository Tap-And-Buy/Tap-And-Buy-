import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '@/db/api';
import type { CartItemWithProduct, Address, CouponWithUsage, Coupon } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, MapPin, Plus, Tag, X, Ticket } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { getDeviceFingerprint } from '@/utils/deviceFingerprint';

export default function Checkout() {
  useScrollToTop();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isFirstOrder, setIsFirstOrder] = useState(false);
  const [checkingFirstOrder, setCheckingFirstOrder] = useState(true);
  
  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [availableCoupons, setAvailableCoupons] = useState<CouponWithUsage[]>([]);
  const [couponsDialogOpen, setCouponsDialogOpen] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  
  // Discount type: 'coupon', 'offer', or 'none'
  const [discountType, setDiscountType] = useState<'coupon' | 'offer' | 'none'>('none');

  useEffect(() => {
    if (user) {
      loadData();
      checkFirstOrder();
    } else {
      navigate('/login');
    }
  }, [user]);

  const checkFirstOrder = async () => {
    try {
      setCheckingFirstOrder(true);
      
      // Check both device fingerprint AND user profile
      const deviceId = await getDeviceFingerprint();
      const [existingDeviceOrder, profile] = await Promise.all([
        db.firstOrderDevices.checkDevice(deviceId),
        db.profiles.getCurrent()
      ]);
      
      // User is eligible for first order discount only if:
      // 1. Device hasn't been used for first order discount
      // 2. User profile hasn't used first order coupon
      const isEligible: boolean = !existingDeviceOrder && !!profile && !Boolean(profile.first_order_coupon_used);
      setIsFirstOrder(isEligible);
    } catch (error) {
      console.error('Error checking first order:', error);
      setIsFirstOrder(false);
    } finally {
      setCheckingFirstOrder(false);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [items, addrs] = await Promise.all([
        db.cart.getItems(),
        db.addresses.getAll(),
      ]);

      if (items.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }

      setCartItems(items);
      setAddresses(addrs);

      const defaultAddr = addrs.find(a => a.is_default);
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
      } else if (addrs.length > 0) {
        setSelectedAddressId(addrs[0].id);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load checkout data');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = item.product?.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  // New offer system: requires both quantity AND minimum order value
  const calculateQuantityDiscount = (totalQty: number, subtotal: number) => {
    if (totalQty >= 35 && subtotal >= 1500) return 150;
    if (totalQty >= 20 && subtotal >= 1000) return 80;
    if (totalQty >= 10 && subtotal >= 500) return 40;
    return 0;
  };

  const subtotal = calculateSubtotal();
  const totalQuantity = calculateTotalQuantity();
  const platformFee = 10;
  
  // Free delivery if order is above 999 rupees AND has 7+ products
  const isFreeDelivery = subtotal > 999 && totalQuantity >= 7;
  const deliveryFee = isFreeDelivery ? 0 : 60;

  // Calculate offer discount
  const offerDiscount = calculateQuantityDiscount(totalQuantity, subtotal);
  
  // Determine which discount to apply
  let discount = 0;
  if (discountType === 'coupon' && appliedCoupon) {
    discount = couponDiscount;
  } else if (discountType === 'offer' && applyDiscount) {
    discount = offerDiscount;
  }

  const firstOrderDiscount = isFirstOrder ? Math.round(subtotal * 0.02) : 0;
  const totalDiscount = discount + firstOrderDiscount;

  const total = subtotal + platformFee + deliveryFee - totalDiscount;

  // Load available coupons when cart changes
  useEffect(() => {
    if (user && cartItems.length > 0) {
      loadAvailableCoupons();
    }
  }, [cartItems, user]);

  const loadAvailableCoupons = async () => {
    try {
      const coupons = await db.coupons.getEligibleCoupons(subtotal, totalQuantity);
      setAvailableCoupons(coupons);
    } catch (error) {
      console.error('Error loading coupons:', error);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      setValidatingCoupon(true);
      const result = await db.coupons.validateCoupon(couponCode.trim(), subtotal, totalQuantity);

      if (result.valid && result.coupon && result.discount !== undefined) {
        setAppliedCoupon(result.coupon);
        setCouponDiscount(result.discount);
        setDiscountType('coupon');
        setApplyDiscount(false); // Disable offer if coupon is applied
        toast.success(result.message || 'Coupon applied successfully');
      } else {
        toast.error(result.message || 'Invalid coupon code');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    setDiscountType('none');
    toast.success('Coupon removed');
  };

  const handleSelectCoupon = async (coupon: CouponWithUsage) => {
    if (!coupon.is_eligible) {
      toast.error(coupon.ineligible_reason || 'This coupon is not eligible');
      return;
    }

    setCouponCode(coupon.code);
    setCouponsDialogOpen(false);
    
    // Auto-apply the selected coupon
    try {
      setValidatingCoupon(true);
      const result = await db.coupons.validateCoupon(coupon.code, subtotal, totalQuantity);

      if (result.valid && result.coupon && result.discount !== undefined) {
        setAppliedCoupon(result.coupon);
        setCouponDiscount(result.discount);
        setDiscountType('coupon');
        setApplyDiscount(false);
        toast.success('Coupon applied successfully');
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleToggleOffer = (checked: boolean) => {
    if (checked && appliedCoupon) {
      toast.error('Please remove the coupon first to use the offer');
      return;
    }
    setApplyDiscount(checked);
    setDiscountType(checked ? 'offer' : 'none');
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddress) {
      toast.error('Invalid address selected');
      return;
    }

    navigate('/payment', {
      state: {
        cartItems,
        address: selectedAddress,
        subtotal,
        platformFee,
        deliveryFee,
        discount,
        firstOrderDiscount,
        total,
        couponCode: appliedCoupon?.code || null,
        discountType,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="max-w-screen-xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Checkout</h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto p-4">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <Link to="/addresses">
                      <Plus className="h-4 w-4 mr-1" />
                      Add New
                    </Link>
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No addresses found</p>
                    <Button asChild>
                      <Link to="/addresses">Add Address</Link>
                    </Button>
                  </div>
                ) : (
                  <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                    <div className="space-y-3">
                      {addresses.map(address => (
                        <div
                          key={address.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedAddressId === address.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => setSelectedAddressId(address.id)}
                        >
                          <div className="flex items-start gap-3">
                            <RadioGroupItem value={address.id} id={address.id} />
                            <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                              <div className="font-semibold">{address.full_name}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {address.address_line1}
                                {address.address_line2 && `, ${address.address_line2}`}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {address.city}, {address.state} - {address.pincode}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Phone: {address.phone}
                              </div>
                              {address.is_default && (
                                <span className="inline-block mt-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                  Default
                                </span>
                              )}
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Items ({cartItems.length})</h2>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex gap-3 pb-3 border-b last:border-0">
                      <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                        {item.product?.image_urls?.[0] ? (
                          <img
                            src={item.product.image_urls[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2">
                          {item.product?.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          ₹{((item.product?.price || 0) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold">Price Details</h2>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className={isFreeDelivery ? 'text-primary font-semibold' : ''}>
                      {isFreeDelivery ? 'FREE 🎉' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {isFreeDelivery && (
                    <div className="text-xs text-primary">
                      ✓ Free delivery applied (₹999+ & 7+ products)
                    </div>
                  )}
                  {discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>
                        {discountType === 'coupon' 
                          ? `Coupon Discount (${appliedCoupon?.code})`
                          : `Offer Discount (${totalQuantity}+ items)`}
                      </span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  {firstOrderDiscount > 0 && (
                    <div className="flex justify-between text-primary font-semibold">
                      <span>First Order Discount (2%)</span>
                      <span>-₹{firstOrderDiscount}</span>
                    </div>
                  )}
                </div>

                {isFirstOrder && !checkingFirstOrder && (
                  <div className="border rounded-lg p-3 bg-primary/10">
                    <p className="text-sm font-semibold text-primary">🎉 First Order Discount Applied!</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      You're getting 2% off on your first order (₹{firstOrderDiscount} saved)
                    </p>
                  </div>
                )}

                {/* Coupon Code Section */}
                <div className="border rounded-lg p-4 bg-muted/30 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-primary" />
                    <span className="text-sm font-semibold">Have a Coupon Code?</span>
                  </div>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-mono font-semibold text-sm">{appliedCoupon.code}</p>
                          <p className="text-xs text-muted-foreground">
                            {appliedCoupon.description || 'Coupon applied'}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveCoupon}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1 uppercase"
                          disabled={validatingCoupon}
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          disabled={validatingCoupon || !couponCode.trim()}
                        >
                          {validatingCoupon ? 'Applying...' : 'Apply'}
                        </Button>
                      </div>
                      
                      <Dialog open={couponsDialogOpen} onOpenChange={setCouponsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="link" className="p-0 h-auto text-xs">
                            View all available coupons
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Available Coupons</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            {availableCoupons.length === 0 ? (
                              <div className="text-center py-8">
                                <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                <p className="text-sm text-muted-foreground">
                                  No coupons available for your current cart
                                </p>
                              </div>
                            ) : (
                              availableCoupons.map((coupon) => (
                                <div
                                  key={coupon.id}
                                  className={`border rounded-lg p-4 ${
                                    coupon.is_eligible
                                      ? 'bg-background hover:bg-muted/50 cursor-pointer'
                                      : 'bg-muted/30 opacity-60'
                                  }`}
                                  onClick={() => coupon.is_eligible && handleSelectCoupon(coupon)}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant={coupon.is_eligible ? 'default' : 'secondary'}>
                                        {coupon.code}
                                      </Badge>
                                      {!coupon.is_eligible && (
                                        <Badge variant="outline" className="text-xs">
                                          Not Eligible
                                        </Badge>
                                      )}
                                    </div>
                                    <span className="font-semibold text-primary">
                                      {coupon.discount_type === 'percentage'
                                        ? `${coupon.discount_value}% OFF`
                                        : `₹${coupon.discount_value} OFF`}
                                    </span>
                                  </div>
                                  <p className="text-sm mb-2">{coupon.description}</p>
                                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                    {coupon.min_order_value > 0 && (
                                      <span>• Min order: ₹{coupon.min_order_value}</span>
                                    )}
                                    {coupon.min_items > 0 && (
                                      <span>• Min items: {coupon.min_items}</span>
                                    )}
                                    {coupon.valid_until && (
                                      <span>
                                        • Valid until:{' '}
                                        {new Date(coupon.valid_until).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                  {!coupon.is_eligible && coupon.ineligible_reason && (
                                    <p className="text-xs text-destructive mt-2">
                                      {coupon.ineligible_reason}
                                    </p>
                                  )}
                                </div>
                              ))
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}
                </div>

                {/* All-Time Offer Section */}
                {offerDiscount > 0 && (
                  <div className="border rounded-lg p-3 bg-muted/50">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="discount"
                        checked={applyDiscount}
                        onCheckedChange={handleToggleOffer}
                        disabled={!!appliedCoupon}
                      />
                      <div className="flex-1">
                        <Label htmlFor="discount" className="text-sm font-medium cursor-pointer">
                          Apply All-Time Offer
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {totalQuantity >= 35 && subtotal >= 1500
                            ? '✨ Get ₹150 off on 35+ products & ₹1500+ order'
                            : totalQuantity >= 20 && subtotal >= 1000
                            ? '✨ Get ₹80 off on 20+ products & ₹1000+ order'
                            : totalQuantity >= 10 && subtotal >= 500
                            ? '✨ Get ₹40 off on 10+ products & ₹500+ order'
                            : 'Offer not applicable'}
                        </p>
                        {appliedCoupon && (
                          <p className="text-xs text-destructive mt-1">
                            Remove coupon to use this offer
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleProceedToPayment}
                  disabled={addresses.length === 0}
                >
                  Proceed to Payment
                </Button>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Prepaid payment only</p>
                  <p>• Delivery within 6-8 days</p>
                  <p>• Return available for damaged items</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
