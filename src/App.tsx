import { CheckCircle2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { Footer } from './components/Footer.tsx';
import { Header } from './components/Header.tsx';
import { HomeStorefront } from './components/HomeStorefront.tsx';
import { OrderSuccessModal } from './components/OrderSuccessModal.tsx';
import { OrderTrackingPage } from './components/OrderTrackingPage.tsx';
import { PolicyModal, type PolicyTopic } from './components/PolicyModal.tsx';
import { ProductDetailView } from './components/ProductDetailView.tsx';
import { PRODUCTS, SEED_ORDER } from './data/catalog.ts';
import {
  confirmDeliveryLocally,
  createOrderLocally,
  lookupOrderLocally,
  updateOrderInstructionLocally,
  verifyPaymentLocally,
} from './utils/localOrderFallback.ts';
import type {
  CartItem,
  CategorySlug,
  CheckoutFormData,
  OrderRecord,
  Product,
  ProductVariant,
} from './types/herbal.ts';

const CART_STORAGE_KEY = 'herbalstore_mvp_cart_v1';

const INITIAL_CART: CartItem[] = [
  {
    productId: PRODUCTS[0].id,
    variantId: PRODUCTS[0].variants?.[0].id,
    name: PRODUCTS[0].name,
    variantLabel: PRODUCTS[0].packageSize,
    registrationNumber: PRODUCTS[0].registrationNumber,
    price: PRODUCTS[0].price,
    qty: 1,
    maxStock: PRODUCTS[0].stock,
    image: PRODUCTS[0].image,
  },
  {
    productId: PRODUCTS[1].id,
    variantId: PRODUCTS[1].variants?.[0].id,
    name: PRODUCTS[1].name,
    variantLabel: PRODUCTS[1].packageSize,
    registrationNumber: PRODUCTS[1].registrationNumber,
    price: PRODUCTS[1].price,
    qty: 1,
    maxStock: PRODUCTS[1].stock,
    image: PRODUCTS[1].image,
  },
  {
    productId: PRODUCTS[2].id,
    variantId: PRODUCTS[2].variants?.[0].id,
    name: PRODUCTS[2].name,
    variantLabel: PRODUCTS[2].packageSize,
    registrationNumber: PRODUCTS[2].registrationNumber,
    price: PRODUCTS[2].price,
    qty: 1,
    maxStock: PRODUCTS[2].stock,
    image: PRODUCTS[2].image,
  },
];

function loadSessionCart(): CartItem[] {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return INITIAL_CART;
    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : INITIAL_CART;
  } catch {
    return INITIAL_CART;
  }
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [activeView, setActiveView] = useState<'home' | 'product' | 'tracking'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategorySlug | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [cartItems, setCartItems] = useState<CartItem[]>(loadSessionCart);
  const [promoCode, setPromoCode] = useState('');
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOrder, setSuccessOrder] = useState<OrderRecord | null>(null);

  const [trackedOrder, setTrackedOrder] = useState<OrderRecord>(SEED_ORDER);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [policyTopic, setPolicyTopic] = useState<PolicyTopic | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  useEffect(() => {
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota issues
    }
  }, [cartItems]);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { products?: Product[] } | null) => {
        if (data?.products && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        // Keep local catalog fallback if offline
      });
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleNavigateHome = (sectionId?: string) => {
    setActiveView('home');
    setSelectedProduct(null);
    if (sectionId) {
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (slug: CategorySlug | 'all') => {
    setActiveCategory(slug);
    if (activeView !== 'home') {
      handleNavigateHome('katalog');
    }
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, qty = 1, variant?: ProductVariant) => {
    const activeVariant = variant || product.variants?.[0];
    const availableStock = activeVariant ? activeVariant.stock : product.stock;
    if (availableStock <= 0) return;

    const unitPrice = activeVariant ? activeVariant.price : product.price;
    const variantLabel = activeVariant ? activeVariant.label : product.packageSize;
    const variantId = activeVariant?.id;

    setCartItems((prev) => {
      const idx = prev.findIndex(
        (it) => it.productId === product.id && it.variantId === variantId
      );
      if (idx >= 0) {
        const next = [...prev];
        const nextQty = Math.min(availableStock, next[idx].qty + qty);
        next[idx] = { ...next[idx], qty: nextQty, maxStock: availableStock };
        return next;
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId,
          name: product.name,
          variantLabel,
          registrationNumber: product.registrationNumber,
          price: unitPrice,
          qty: Math.min(availableStock, qty),
          maxStock: availableStock,
          image: product.image,
        },
      ];
    });

    setCartOpen(true);
    showToast(`${product.name} ditambahkan ke keranjang.`);
  };

  const handleUpdateQty = (productId: number, variantId: string | undefined, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId && item.variantId === variantId) {
            const nextQty = Math.min(item.maxStock, item.qty + delta);
            return { ...item, qty: nextQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const handleRemoveItem = (productId: number, variantId: string | undefined) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.variantId === variantId))
    );
  };

  const handleProceedCheckout = () => {
    if (cartItems.length === 0) return;
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleSubmitOrder = async (form: CheckoutFormData, idempotencyKey: string) => {
    let createdOrder: OrderRecord | null = null;
    let updatedProducts: Product[] | null = null;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotencyKey,
          items: cartItems.map((it) => ({
            productId: it.productId,
            variantId: it.variantId,
            quantity: it.qty,
          })),
          form,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = (await response.json()) as {
          order?: OrderRecord;
          products?: Product[];
          error?: string;
        };
        if (!response.ok || !data.order) {
          throw new Error(data.error || 'Terjadi kesalahan saat membuat pesanan.');
        }
        createdOrder = data.order;
        updatedProducts = data.products || null;
      } else {
        const local = createOrderLocally(products, cartItems, form);
        createdOrder = local.order;
        updatedProducts = local.updatedProducts;
      }
    } catch (err) {
      if (err instanceof TypeError) {
        const local = createOrderLocally(products, cartItems, form);
        createdOrder = local.order;
        updatedProducts = local.updatedProducts;
      } else {
        throw err;
      }
    }

    if (updatedProducts) {
      setProducts(updatedProducts);
    }

    setCartItems([]);
    setPromoCode('');
    setCheckoutOpen(false);
    setTrackedOrder(createdOrder);
    setSuccessOrder(createdOrder);
  };

  const handleLookupOrder = async (orderNumber: string) => {
    setLookupError(null);
    const cleaned = encodeURIComponent(orderNumber.replace(/^#/, ''));
    try {
      const res = await fetch(`/api/orders/${cleaned}`);
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = (await res.json()) as { order?: OrderRecord; error?: string };
        if (!res.ok || !data.order) {
          const localOrder = lookupOrderLocally(orderNumber);
          if (localOrder) {
            setTrackedOrder(localOrder);
            showToast(`Menampilkan status pengiriman ${localOrder.orderNumber}`);
            return;
          }
          setLookupError(data.error || 'Nomor pesanan tidak ditemukan.');
          return;
        }
        setTrackedOrder(data.order);
        showToast(`Menampilkan status pengiriman ${data.order.orderNumber}`);
        return;
      }
    } catch {
      // Fallback below
    }

    const localOrder = lookupOrderLocally(orderNumber);
    if (localOrder) {
      setTrackedOrder(localOrder);
      showToast(`Menampilkan status pengiriman ${localOrder.orderNumber}`);
    } else {
      setLookupError(`Pesanan ${orderNumber} tidak ditemukan. Periksa kembali nomor pesanan Anda.`);
    }
  };

  const handleUpdateInstruction = async (orderNumber: string, instruction: string) => {
    const cleaned = encodeURIComponent(orderNumber.replace(/^#/, ''));
    try {
      const res = await fetch(`/api/orders/${cleaned}/instruction`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instruction }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = (await res.json()) as { order?: OrderRecord };
        if (res.ok && data.order) {
          setTrackedOrder(data.order);
          showToast('Instruksi kurir berhasil diperbarui.');
          return;
        }
      }
    } catch {
      // Fallback below
    }

    const updated = updateOrderInstructionLocally(orderNumber, instruction);
    if (updated) {
      setTrackedOrder(updated);
      showToast('Instruksi kurir berhasil diperbarui.');
    }
  };

  const handleConfirmDelivery = async (orderNumber: string) => {
    const cleaned = encodeURIComponent(orderNumber.replace(/^#/, ''));
    try {
      const res = await fetch(`/api/orders/${cleaned}/confirm-delivery`, {
        method: 'PATCH',
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = (await res.json()) as { order?: OrderRecord };
        if (res.ok && data.order) {
          setTrackedOrder(data.order);
          showToast('Terima kasih! Pesanan telah dikonfirmasi selesai.');
          return;
        }
      }
    } catch {
      // Fallback below
    }

    const updated = confirmDeliveryLocally(orderNumber);
    if (updated) {
      setTrackedOrder(updated);
      showToast('Terima kasih! Pesanan telah dikonfirmasi selesai.');
    }
  };

  const handleVerifyPaymentDemo = async (orderNumber: string) => {
    const cleaned = encodeURIComponent(orderNumber.replace(/^#/, ''));
    try {
      const res = await fetch(`/api/orders/${cleaned}/verify-payment`, {
        method: 'PATCH',
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = (await res.json()) as { order?: OrderRecord };
        if (res.ok && data.order) {
          setTrackedOrder(data.order);
          showToast('Pembayaran terverifikasi! Paket kini dalam pengiriman ekspedisi.');
          return;
        }
      }
    } catch {
      // Fallback below
    }

    const updated = verifyPaymentLocally(orderNumber);
    if (updated) {
      setTrackedOrder(updated);
      showToast('Pembayaran terverifikasi! Paket kini dalam pengiriman ekspedisi.');
    }
  };

  const handleTrackFromSuccess = (orderNumber: string) => {
    setSuccessOrder(null);
    setActiveView('tracking');
    handleLookupOrder(orderNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyPromoCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setPromoCode(code);
    showToast(`Kode promo ${code} disalin & siap dipakai di keranjang!`);
  };

  const relatedProducts = selectedProduct
    ? products
        .filter((p) => p.id !== selectedProduct.id && p.stock > 0)
        .slice(0, 4)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-surface-base text-[#1A2E26]">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onNavigateHome={handleNavigateHome}
        onNavigateTracking={() => {
          setActiveView('tracking');
          setLookupError(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeView={activeView}
      />

      {activeView === 'home' && (
        <HomeStorefront
          products={products}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          onSelectCategory={handleSelectCategory}
          onClearSearch={() => setSearchQuery('')}
          onResetFilters={() => {
            setSearchQuery('');
            setActiveCategory('all');
          }}
          onAddToCart={(product) => handleAddToCart(product, 1)}
          onOpenProduct={handleOpenProduct}
          onCopyPromoCode={handleCopyPromoCode}
        />
      )}

      {activeView === 'product' && selectedProduct && (
        <ProductDetailView
          product={
            products.find((p) => p.id === selectedProduct.id) || selectedProduct
          }
          relatedProducts={relatedProducts}
          onBack={() => handleNavigateHome('katalog')}
          onAddToCart={handleAddToCart}
          onOpenProduct={handleOpenProduct}
        />
      )}

      {activeView === 'tracking' && (
        <OrderTrackingPage
          order={trackedOrder}
          lookupError={lookupError}
          onLookupOrder={handleLookupOrder}
          onUpdateInstruction={handleUpdateInstruction}
          onConfirmDelivery={handleConfirmDelivery}
          onVerifyPaymentDemo={handleVerifyPaymentDemo}
          onBackHome={() => handleNavigateHome()}
        />
      )}

      <Footer
        onSelectCategory={(slug) => {
          setActiveCategory(slug);
          handleNavigateHome('katalog');
        }}
        onNavigateHome={handleNavigateHome}
        onNavigateTracking={() => {
          setActiveView('tracking');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPolicyModal={setPolicyTopic}
      />

      <CartDrawer
        open={cartOpen}
        items={cartItems}
        promoCode={promoCode}
        onApplyPromoCode={setPromoCode}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onProceedCheckout={handleProceedCheckout}
      />

      <CheckoutModal
        open={checkoutOpen}
        items={cartItems}
        initialPromoCode={promoCode}
        onClose={() => setCheckoutOpen(false)}
        onSubmitOrder={handleSubmitOrder}
      />

      <OrderSuccessModal
        order={successOrder}
        onClose={() => setSuccessOrder(null)}
        onTrackOrder={handleTrackFromSuccess}
      />

      <PolicyModal topic={policyTopic} onClose={() => setPolicyTopic(null)} />

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 max-w-sm bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 no-print"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1">{toastMessage}</span>
          <button
            type="button"
            aria-label="Tutup notifikasi"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
