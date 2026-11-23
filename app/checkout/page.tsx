"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import {
    useGetAddressesQuery,
    useGuestCheckoutMutation,
} from "@/redux/api/userApi";
import { TrustedAvatars } from "@/components/shared/TrustedAvatars";
import { useGetCartQuery } from "@/redux/api/cartApi";
import { usePlaceOrderMutation } from "@/redux/api/orderApi";
import { TCart, TSavedAddress } from "@/types/common";
import {
    MapPin,
    Truck,
    CheckCircle,
    Plus,
    ChevronLeft,
    Loader2,
    ShieldCheck,
    Home,
    Briefcase,
    Building2,
    LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetSingleProductQuery } from "@/redux/api/productApi";
import { TProduct, TVariant } from "@/types/common";
import { AddressModal } from "@/components/dashboard/AddressModal";
import { isLoggedIn, storeUserInfo } from "@/services/auth.services";
import { loginUser } from "@/services/actions/loginUser";
import OrderSuccessModal from "@/components/checkout/OrderSuccessModal";
import { CodPaymentNotice } from "@/components/checkout/CodPaymentNotice";
import { CheckoutTotals } from "@/components/checkout/CheckoutTotals";
import { useCheckoutPricing } from "@/hooks/useCheckoutPricing";
import { BANGLADESH_DISTRICTS } from "@/lib/bangladeshDistricts";

// Redux local cart
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useGetDeliveryZonesQuery } from "@/redux/api/deliveryZoneApi";
import { useValidatePromotionMutation } from "@/redux/api/promotionApi";
import { clearLocalCart } from "@/redux/features/localCartSlice";
import { useAddToCartMutation } from "@/redux/api/cartApi";

type GuestCheckoutResponse = {
    accessToken?: string;
    data?: { accessToken?: string };
};

const getErrorMessage = (error: unknown, fallback: string) => {
    if (error instanceof Error) return error.message;
    if (typeof error !== "object" || error === null) return fallback;

    const responseData = "data" in error ? error.data : undefined;
    if (typeof responseData === "object" && responseData !== null && "message" in responseData) {
        return typeof responseData.message === "string" ? responseData.message : fallback;
    }
    return fallback;
};

// ── Address Card ─────────────────────────────────────────────────────────────
function AddressCard({
    address,
    selected,
    onSelect,
}: {
    address: TSavedAddress;
    selected: boolean;
    onSelect: () => void;
}) {
    const Icon =
        address.label === "Home"
            ? Home
            : address.label === "Office"
                ? Briefcase
                : Building2;

    return (
        <div
            onClick={onSelect}
            className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selected
                ? "border-[#B5451B] bg-orange-50/30 ring-4 ring-[#B5451B]/5"
                : "border-orange-100 bg-white hover:border-orange-200"
                }`}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${selected
                        ? "bg-[#B5451B] text-white"
                        : "bg-orange-50 text-[#B5451B]"
                        }`}
                >
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-gray-900">
                            {address.fullName}
                        </span>
                        {address.isDefault && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4860A] bg-orange-100 px-2 py-0.5 rounded-full">
                                Default
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{address.phone}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">
                        {address.address}, {address.city}, {address.district}
                    </p>
                </div>
            </div>
            {selected && (
                <div className="absolute top-4 right-4 text-[#B5451B]">
                    <CheckCircle className="w-5 h-5 fill-[#B5451B] text-white" />
                </div>
            )}
        </div>
    );
}

// ── Guest Checkout Form ──────────────────────────────────────────────────────
interface GuestShippingForm {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
}

function GuestShippingSection({
    form,
    onChange,
    errors,
}: {
    form: GuestShippingForm;
    onChange: (f: GuestShippingForm) => void;
    errors: Record<string, string>;
}) {
    const inputCls =
        "w-full rounded-xl border border-orange-100 bg-gray-50/50 px-4 py-3 text-sm font-semibold outline-none focus-visible:border-[#B5451B] focus-visible:bg-white transition-[border-color,background-color] shadow-sm";
    const errorInputCls =
        "w-full rounded-xl border border-red-300 bg-red-50/5 px-4 py-3 text-sm font-semibold outline-none focus-visible:border-red-500 transition-[border-color] shadow-sm";
    const labelCls =
        "text-[10px] font-bold text-gray-400 block px-1 mb-1.5";
    const errorLabelCls =
        "text-[10px] font-bold text-red-500 block px-1 mb-1.5";

    return (
        <section className="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-orange-100 shadow-sm relative overflow-hidden" aria-labelledby="guest-shipping-heading">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 opacity-20 rounded-full blur-2xl -mr-16 -mt-16" />
            <h3 id="guest-shipping-heading" className="text-2xl font-black text-gray-900 flex items-center gap-3 mb-8 tracking-tight">
                <div className="w-10 h-10 bg-[#B5451B] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#B5451B]/20">
                    <Truck className="w-5 h-5" />
                </div>
                Shipping Information
            </h3>

            <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className={errors.fullName ? errorLabelCls : labelCls}>Full Name *</label>
                        <input
                            type="text"
                            className={errors.fullName ? errorInputCls : inputCls}
                            placeholder="e.g. Asif Ahmed"
                            value={form.fullName}
                            onChange={(e) =>
                                onChange({ ...form, fullName: e.target.value })
                            }
                        />
                        {errors.fullName && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.fullName}</p>}
                    </div>
                    <div>
                        <label className={errors.email ? errorLabelCls : labelCls}>Email</label>
                        <input
                            type="email"
                            className={errors.email ? errorInputCls : inputCls}
                            placeholder="your@email.com"
                            value={form.email}
                            onChange={(e) =>
                                onChange({ ...form, email: e.target.value })
                            }
                        />
                        {errors.email && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.email}</p>}
                    </div>
                </div>

                <div>
                    <label className={errors.phone ? errorLabelCls : labelCls}>Phone Number *</label>
                    <input
                        type="tel"
                        className={errors.phone ? errorInputCls : inputCls}
                        placeholder="017XXXXXXXX"
                        value={form.phone}
                        onChange={(e) =>
                            onChange({ ...form, phone: e.target.value })
                        }
                    />
                    {errors.phone && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.phone}</p>}
                </div>

                <div>
                    <label className={errors.address ? errorLabelCls : labelCls}>Street Address *</label>
                    <textarea
                        rows={2}
                        className={`${errors.address ? errorInputCls : inputCls} resize-none`}
                        placeholder="House, Road, Area..."
                        value={form.address}
                        onChange={(e) =>
                            onChange({ ...form, address: e.target.value })
                        }
                    />
                    {errors.address && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                        <label className={errors.city ? errorLabelCls : labelCls}>City *</label>
                        <input
                            type="text"
                            className={errors.city ? errorInputCls : inputCls}
                            placeholder="e.g. Dhaka"
                            value={form.city}
                            onChange={(e) =>
                                onChange({ ...form, city: e.target.value })
                            }
                        />
                        {errors.city && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.city}</p>}
                    </div>
                    <div>
                        <label className={errors.district ? errorLabelCls : labelCls}>District *</label>
                        <select
                            className={`${errors.district ? errorInputCls : inputCls} bg-white`}
                            value={form.district}
                            onChange={(e) =>
                                onChange({ ...form, district: e.target.value })
                            }
                        >
                            <option value="">Select district</option>
                            {BANGLADESH_DISTRICTS.map((d) => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                        {errors.district && <p className="text-[10px] font-bold text-red-500 mt-1 uppercase px-1">{errors.district}</p>}
                    </div>
                    <div>
                        <label className={labelCls}>Postal Code</label>
                        <input
                            type="text"
                            className={inputCls}
                            placeholder="e.g. 1200"
                            value={form.postalCode}
                            onChange={(e) =>
                                onChange({ ...form, postalCode: e.target.value })
                            }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Main Checkout Content ────────────────────────────────────────────────────
function CheckoutPageContent() {
    // ... (rest of search/dispatch code)
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const productIdParam = searchParams.get("productId");
    const variantIdParam = searchParams.get("variantId");
    const qtyParam = searchParams.get("qty");

    const isDirectBuy = !!(productIdParam && variantIdParam && qtyParam);
    const userLoggedIn = isLoggedIn();

    // ── Remote data (only when logged in) ─────────────────────────────
    const { data: cartData, refetch: refetchCart, isLoading: cartLoading } = useGetCartQuery(
        {},
        { skip: isDirectBuy || !userLoggedIn }
    );
    const { data: singleProductData, isLoading: singleProductLoading } = useGetSingleProductQuery(
        productIdParam as string,
        { skip: !isDirectBuy }
    );
    const { data: addressData, isLoading: addressesLoading } = useGetAddressesQuery(
        {},
        { skip: !userLoggedIn }
    );
    const [placeOrder, { isLoading: isPlacing }] = usePlaceOrderMutation();
    const [guestCheckout, { isLoading: isGuestLoading }] = useGuestCheckoutMutation();
    const [addToCart] = useAddToCartMutation();

    // ── Local guest cart ───────────────────────────────────────────────
    const localCartItems = useAppSelector((state) => state.localCart.items);

    const cart = cartData as TCart | undefined;
    const addresses = useMemo(() => (addressData as TSavedAddress[]) || [], [addressData]);

    const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
    const { data: deliveryZonesData } = useGetDeliveryZonesQuery();
    const [validatePromotion, { isLoading: isValidatingCoupon }] = useValidatePromotionMutation();
    const [couponCode, setCouponCode] = useState("");
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [addressToEdit, setAddressToEdit] = useState<TSavedAddress | undefined>(undefined);

    // Guest shipping form state
    const [guestForm, setGuestForm] = useState<GuestShippingForm>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        postalCode: "",
    });
    // Inline form for logged-in users with no saved addresses
    const [loggedInForm, setLoggedInForm] = useState<GuestShippingForm>({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        postalCode: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [confirmedTotal, setConfirmedTotal] = useState(0);

    // Quick login state (for non-logged-in users on checkout)
    const [quickLoginEmail, setQuickLoginEmail] = useState("");
    const [isQuickLogging, setIsQuickLogging] = useState(false);

    const validateGuestForm = () => {
        const newErrors: Record<string, string> = {};
        if (!guestForm.fullName.trim()) newErrors.fullName = "Full name is required";
        if (guestForm.email.trim() && !/\S+@\S+\.\S+/.test(guestForm.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!guestForm.phone.trim()) newErrors.phone = "Phone number is required";
        if (!guestForm.address.trim()) newErrors.address = "Street address is required";
        if (!guestForm.city.trim()) newErrors.city = "City is required";
        if (!guestForm.district.trim()) newErrors.district = "District is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateLoggedInForm = () => {
        const newErrors: Record<string, string> = {};
        if (!loggedInForm.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!loggedInForm.phone.trim()) newErrors.phone = "Phone number is required";
        if (!loggedInForm.address.trim()) newErrors.address = "Street address is required";
        if (!loggedInForm.city.trim()) newErrors.city = "City is required";
        if (!loggedInForm.district.trim()) newErrors.district = "District is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleGuestFormChange = (f: GuestShippingForm) => {
        setGuestForm(f);
        // Clear errors as user types
        setErrors({});
    };

    const handleQuickLogin = async () => {
        if (!quickLoginEmail.trim()) return toast.error("Enter your email");
        setIsQuickLogging(true);
        try {
            const res = await loginUser({
                email: quickLoginEmail.trim(),
                password: process.env.NEXT_PUBLIC_DEFAULT_USER_PASS,
            });
            if (res?.data?.accessToken) {
                storeUserInfo({ accessToken: res.data.accessToken });
                toast.success("Logged in!");
                window.location.reload();
            } else {
                toast.error(res?.message || "Login failed — check your email");
            }
        } catch {
            toast.error("Login failed");
        } finally {
            setIsQuickLogging(false);
        }
    };

    useEffect(() => {
        if (addresses.length > 0) {
            const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
            setSelectedAddressId(defaultAddr._id!);
        }
    }, [addresses]);

    const directBuyItem = useMemo(() => {
        if (!isDirectBuy || !singleProductData) return null;
        const p = singleProductData as TProduct;
        const variant = p.variants.find(
            (v) => v._id === variantIdParam || v.sku === variantIdParam
        );
        if (!variant) return null;
        return {
            product: p,
            variantId: variant._id,
            quantity: Number(qtyParam) || 1,
            _id: "direct-buy",
        };
    }, [isDirectBuy, singleProductData, variantIdParam, qtyParam]);

    // Build checkout items list
    const checkoutItems = useMemo(() => {
        if (isDirectBuy) return directBuyItem ? [directBuyItem] : [];
        if (userLoggedIn) return cart?.items || [];
        // Guest: use local cart
        return localCartItems.map((item) => ({
            product: item.product,
            variantId: item.variantId,
            quantity: item.quantity,
            _id: `${item.productId}-${item.variantId}`,
        }));
    }, [isDirectBuy, directBuyItem, userLoggedIn, cart?.items, localCartItems]);

    const subtotal = useMemo(() => {
        return checkoutItems.reduce((acc, item) => {
            const product = item.product;
            const variant = product.variants.find(
                (v: TVariant) => v._id === item.variantId || v.sku === item.variantId
            );
            const price = variant?.discountPrice ?? variant?.price ?? 0;
            return acc + price * item.quantity;
        }, 0);
    }, [checkoutItems]);

    const activeDistrict = userLoggedIn
        ? (addresses.length === 0
            ? loggedInForm.district
            : addresses.find((address) => address._id === selectedAddressId)?.district ?? "")
        : guestForm.district;
    const deliveryZones = ((deliveryZonesData as unknown as { data?: typeof deliveryZonesData })?.data ?? deliveryZonesData ?? []);
    const { isDeliveryAvailable, shippingCharge, total } = useCheckoutPricing(subtotal, activeDistrict, deliveryZones, couponDiscount);
    const applyCoupon = async () => {
        if (!couponCode.trim()) return toast.error("Enter a coupon code");
        if (!userLoggedIn) return toast.info("Your coupon will be validated when the guest order is placed");
        try {
            const raw = await validatePromotion({ code: couponCode, subtotal }).unwrap() as unknown;
            const result = (raw as { data?: { discount: number } }).data ?? raw as { discount: number };
            setCouponDiscount(result.discount); toast.success("Coupon applied");
        } catch (error: unknown) { setCouponDiscount(0); toast.error(getErrorMessage(error, "Coupon could not be applied")); }
    };

    // ── Place order (logged-in user) ──────────────────────────────────
    const handlePlaceOrderLoggedIn = async () => {
        let shippingAddress;
        if (addresses.length === 0) {
            if (!validateLoggedInForm()) {
                toast.error("Please fill in the shipping information");
                return;
            }
            shippingAddress = {
                fullName: loggedInForm.fullName,
                phone: loggedInForm.phone,
                address: loggedInForm.address,
                city: loggedInForm.city,
                district: loggedInForm.district,
                postalCode: loggedInForm.postalCode || "0000",
                country: "Bangladesh",
            };
        } else {
            const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
            if (!selectedAddress) {
                toast.error("Please select a shipping address");
                return;
            }
            shippingAddress = {
                fullName: selectedAddress.fullName,
                phone: selectedAddress.phone,
                address: selectedAddress.address,
                city: selectedAddress.city,
                district: selectedAddress.district,
                postalCode: selectedAddress.postalCode || "0000",
                country: selectedAddress.country || "Bangladesh",
            };
        }

        try {
            const orderData = {
                shippingAddress,
                paymentMethod: "cod",
                paymentStatus: "pending",
                items: checkoutItems.map((item) => ({
                    productId: item.product._id,
                    variantId: item.variantId,
                    quantity: item.quantity,
                })),
                note: "",
                couponCode: couponCode.trim() || undefined,
            };

            await placeOrder(orderData).unwrap();
            toast.success("Order placed successfully!");
            setConfirmedTotal(total);
            if (!isDirectBuy) refetchCart();
            // router.push("/dashboard/user/orders");
            setIsSuccessModalOpen(true);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to place order"));
        }
    };

    // ── Place order (guest) ───────────────────────────────────────────
    const handlePlaceOrderGuest = async () => {
        if (!validateGuestForm()) {
            toast.error("Please correct the errors in the shipping form");
            return;
        }
        if (checkoutItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        try {
            const { fullName, email, phone, address, city, district } = guestForm;
            // 1. Create an isolated temporary session for this guest purchase.
            toast.loading("Preparing secure guest checkout...", { id: "guest-checkout" });
            const res = await guestCheckout({ email, fullName, phone }).unwrap() as GuestCheckoutResponse;

            // Handle both { data: { accessToken } } and direct { accessToken } formats
            const accessToken = res.data?.accessToken ?? res.accessToken;

            if (!accessToken) {
                throw new Error("Failed to authenticate your session");
            }

            // 2. Store token so subsequent API calls are authenticated
            storeUserInfo({ accessToken });
            toast.loading("Syncing your cart...", { id: "guest-checkout" });

            // 3. Sync local cart items to backend
            for (const item of localCartItems) {
                try {
                    await addToCart({
                        productId: item.productId,
                        variantId: item.variantId,
                        quantity: item.quantity,
                    }).unwrap();
                } catch {
                    // individual item failures are non-fatal
                }
            }

            // 4. Place the order
            toast.loading("Placing your order...", { id: "guest-checkout" });
            const orderData = {
                shippingAddress: {
                    fullName,
                    phone,
                    address,
                    city,
                    district,
                    postalCode: guestForm.postalCode || "0000",
                    country: "Bangladesh",
                },
                paymentMethod: "cod",
                items: checkoutItems.map((item) => ({
                    productId: item.product._id,
                    variantId: item.variantId,
                    quantity: item.quantity,
                })),
                note: "",
                couponCode: couponCode.trim() || undefined,
            };

            await placeOrder(orderData).unwrap();
            // console.log(res1);

            // 5. Clear local cart
            dispatch(clearLocalCart());

            toast.success("Order placed successfully! 🎉", { id: "guest-checkout" });
            setConfirmedTotal(total);
            // router.push("/shop");
            setIsSuccessModalOpen(true);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to place order"), {
                id: "guest-checkout",
            });
        }
    };

    // ── Redirect if cart is empty (logged-in) ─────────────────────────
    useEffect(() => {
        if (
            !cartLoading &&
            !isDirectBuy &&
            userLoggedIn &&
            !isSuccessModalOpen &&
            (!cart?.items || cart.items.length === 0)
        ) {
            router.push("/dashboard/user/orders");
        }
    }, [cartLoading, isDirectBuy, userLoggedIn, cart?.items, router, isSuccessModalOpen]);

    // ── Loading guard ──────────────────────────────────────────────────
    if (
        (userLoggedIn && (cartLoading || addressesLoading)) ||
        singleProductLoading
    ) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <Loader2 className="w-10 h-10 animate-spin text-[#B5451B]" />
            </div>
        );
    }

    if (!isDirectBuy && userLoggedIn && !isSuccessModalOpen && (!cart?.items || cart.items.length === 0)) {
        return null;
    }

    if (!isDirectBuy && !userLoggedIn && localCartItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center p-4">
                <p className="text-gray-500 font-bold mb-4">Your cart is empty.</p>
                <Link href="/shop">
                    <Button style={{ background: "#B5451B" }}>Start Shopping</Button>
                </Link>
            </div>
        );
    }

    if (isDirectBuy && !directBuyItem) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                <div className="text-center">
                    <p className="text-red-500 font-bold mb-4">Product details not found.</p>
                    <Link href="/shop">
                        <Button style={{ background: "#B5451B" }}>Back to Shop</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const isProcessing = isPlacing || isGuestLoading;

    return (
        <div className="min-h-screen bg-[#FAFAF8] py-12 lg:py-20">
            <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href={isDirectBuy ? `/shop/${productIdParam}` : "/cart"}
                        className="inline-flex items-center text-sm font-semibold text-[#B5451B] hover:gap-2 transition-all gap-1 mb-4"
                    >
                        <ChevronLeft className="w-4 h-4" /> Back to{" "}
                        {isDirectBuy ? "Product" : "Cart"}
                    </Link>
                    <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        Secure <span style={{ color: "#B5451B" }}>Checkout</span>
                    </h1>
                    <p className="text-gray-500 font-medium tracking-wide">
                        {isDirectBuy
                            ? "Complete your direct purchase"
                            : "Finalize your cart and get it delivered to your doorstep"}
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-10 items-start">
                    {/* Left: Forms */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* ── Shipping Address ── */}
                        {userLoggedIn ? (
                            <section className="bg-white rounded-[2.5rem] p-5 sm:p-8 border border-orange-100 shadow-sm relative overflow-hidden" aria-labelledby="saved-address-heading">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 opacity-20 rounded-full blur-2xl -mr-16 -mt-16" />
                                <div className="flex items-center justify-between mb-8">
                                    <h3 id="saved-address-heading" className="text-2xl font-black text-gray-900 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#B5451B] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#B5451B]/20">
                                            <Truck className="w-5 h-5" />
                                        </div>
                                        Shipping Information
                                    </h3>
                                    <Button
                                        onClick={() => {
                                            setAddressToEdit(undefined);
                                            setIsAddressModalOpen(true);
                                        }}
                                        variant="outline"
                                        className="rounded-full border-orange-100 text-[#B5451B] hover:bg-orange-50 font-bold cursor-pointer"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add New
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {addresses.map((addr: TSavedAddress) => (
                                        <div key={addr._id} className="relative group">
                                            <AddressCard
                                                address={addr}
                                                selected={selectedAddressId === addr._id}
                                                onSelect={() => setSelectedAddressId(addr._id!)}
                                            />
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setAddressToEdit(addr);
                                                    setIsAddressModalOpen(true);
                                                }}
                                                aria-label={`Edit address for ${addr.fullName}`}
                                                className="absolute top-4 right-12 p-1.5 rounded-lg bg-white/80 backdrop-blur-sm border border-orange-100 text-[#B5451B] opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 transition-all hover:bg-[#B5451B] hover:text-white"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                            </button>
                                        </div>
                                    ))}
                                    {addresses.length === 0 && (
                                        <div className="col-span-full">
                                            <GuestShippingSection
                                                form={loggedInForm}
                                                onChange={(f) => { setLoggedInForm(f); setErrors({}); }}
                                                errors={errors}
                                            />
                                        </div>
                                    )}
                                </div>
                            </section>
                        ) : (
                            /* Guest path: quick-login + shipping form */
                            <div className="space-y-6">
                                {/* Quick login card */}
                                <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-orange-100 shadow-sm">
                                    <h3 className="text-lg font-black text-gray-900 mb-1 flex items-center gap-2">
                                        <LogIn className="w-5 h-5" style={{ color: "#B5451B" }} />
                                        Already have an account?
                                    </h3>
                                    <p className="text-xs text-gray-400 mb-5">
                                        Enter your email to log in quickly — no need to remember your password
                                    </p>
                                    <div className="flex gap-3">
                                        <input
                                            type="email"
                                            placeholder="your@email.com"
                                            value={quickLoginEmail}
                                            onChange={(e) => setQuickLoginEmail(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && handleQuickLogin()}
                                            className="flex-1 border border-orange-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#B5451B] transition-colors"
                                        />
                                        <Button
                                            onClick={handleQuickLogin}
                                            disabled={isQuickLogging}
                                            className="rounded-xl text-white font-bold px-6 cursor-pointer"
                                            style={{ background: "#B5451B" }}
                                        >
                                            {isQuickLogging ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login →"}
                                        </Button>
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-3">
                                        Or continue below as a guest — no account needed
                                    </p>
                                </div>

                                {/* Guest shipping form */}
                                <GuestShippingSection
                                    form={guestForm}
                                    onChange={handleGuestFormChange}
                                    errors={errors}
                                />
                            </div>
                        )}

                        {/* ── Payment Method ── */}
                        <CodPaymentNotice />
                    </div>

                    {/* Right: Order Summary */}
                    <aside className="lg:col-span-4 sticky top-24">
                        <div className="bg-white rounded-[2.5rem] border border-orange-100 shadow-xl overflow-hidden">
                            <div className="p-8 border-b border-orange-100 bg-orange-50/20">
                                <h3 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">Order Summary</h3>
                                <div className="space-y-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                    {checkoutItems.map((item, idx) => {
                                        const product = item.product;
                                        const variant = product.variants.find(
                                            (v: TVariant) => v._id === item.variantId || v.sku === item.variantId
                                        );
                                        const price = variant?.discountPrice ?? variant?.price ?? 0;
                                        return (
                                            <div key={idx} className="flex gap-4">
                                                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-orange-100 bg-white flex-shrink-0">
                                                    <Image src={product.thumbnail} alt={product.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 leading-tight mb-1 truncate">{product.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{variant?.name} × {item.quantity}</p>
                                                    <p className="text-sm font-black text-[#B5451B]">৳{price * item.quantity}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <CheckoutTotals subtotal={subtotal} shippingCharge={shippingCharge} discount={couponDiscount} deliveryAvailable={isDeliveryAvailable} couponCode={couponCode} validatingCoupon={isValidatingCoupon} onCouponChange={(value) => { setCouponCode(value); setCouponDiscount(0); }} onApplyCoupon={applyCoupon} />

                            <div className="p-8 bg-white">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <p className="text-[11px] font-bold text-gray-400 mb-1">Total to pay</p>
                                        <p className="text-4xl font-black" style={{ color: "#B5451B" }}>৳{total}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[11px] font-bold text-green-600 flex items-center justify-end gap-1">
                                            <ShieldCheck className="w-3 h-3" /> Secure
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    onClick={userLoggedIn ? handlePlaceOrderLoggedIn : handlePlaceOrderGuest}
                                    disabled={isProcessing || checkoutItems.length === 0 || !isDeliveryAvailable}
                                    className="w-full py-8 rounded-[1.5rem] text-xl font-black shadow-2xl hover:shadow-[#B5451B]/20 transition-[opacity,transform] active:scale-[0.98] group flex items-center justify-center gap-3 cursor-pointer"
                                    style={{
                                        background: "linear-gradient(135deg, #B5451B, #D4860A)",
                                        color: "white",
                                    }}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            Place order{" "}
                                            <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                        </>
                                    )}
                                </Button>


                                <TrustedAvatars dark className="mt-6 justify-center" />

                                {!userLoggedIn && (
                                    <div className="mt-5 p-5 rounded-[1.5rem] bg-orange-50 border border-orange-100 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-20 h-20 bg-[#B5451B]/5 rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />
                                        <p className="text-[11px] text-gray-700 leading-relaxed relative z-10">
                                            <span className="font-black text-[#B5451B] block mb-1">Guest checkout</span>
                                            Your details are used only to process this order. Create an account separately to manage future orders online.
                                        </p>
                                    </div>
                                )}



                                {!userLoggedIn && (
                                    <p className="mt-4 text-center text-xs text-gray-400 font-medium">
                                        Already have an account?{" "}
                                        <Link href="/login" className="text-[#B5451B] font-bold hover:underline">
                                            Login here
                                        </Link>
                                    </p>
                                )}

                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <OrderSuccessModal
                isOpen={isSuccessModalOpen}
                orderItems={checkoutItems}
                totalPrice={confirmedTotal}
            />

            {userLoggedIn && (
                <AddressModal
                    isOpen={isAddressModalOpen}
                    onClose={() => setIsAddressModalOpen(false)}
                    addressToEdit={addressToEdit}
                />
            )}
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
                    <Loader2 className="w-10 h-10 animate-spin text-[#B5451B]" />
                </div>
            }
        >
            <CheckoutPageContent />
        </Suspense>
    );
}
