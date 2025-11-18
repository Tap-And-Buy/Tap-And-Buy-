import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { db } from '@/db/api';
import type { CartItemWithProduct, Address } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, MapPin, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    } else {
      navigate('/login');
    }
  }, [user]);

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

  const subtotal = calculateSubtotal();
  const platformFee = 10;
  const deliveryFee = subtotal > 500 ? 0 : 60;

  let discount = 0;
  if (applyDiscount) {
    if (subtotal > 2500) discount = 150;
    else if (subtotal > 1200) discount = 100;
    else if (subtotal > 700) discount = 40;
  }

  const total = subtotal + platformFee + deliveryFee - discount;

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
        total,
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
                    <span className={deliveryFee === 0 ? 'text-primary font-semibold' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                </div>

                {subtotal > 700 && (
                  <div className="border rounded-lg p-3 bg-muted/50">
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="discount"
                        checked={applyDiscount}
                        onCheckedChange={(checked) => setApplyDiscount(checked as boolean)}
                      />
                      <div className="flex-1">
                        <Label htmlFor="discount" className="text-sm font-medium cursor-pointer">
                          Apply Discount
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {subtotal > 2500
                            ? 'Get ₹150 off on orders above ₹2500'
                            : subtotal > 1200
                            ? 'Get ₹100 off on orders above ₹1200'
                            : 'Get ₹40 off on orders above ₹700'}
                        </p>
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
