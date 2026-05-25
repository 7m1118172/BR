import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import iconSun from '../icon/sunny.png';
import iconMoon from '../icon/moon.png';
import iconArabic from '../icon/arabic-language.png';
import iconEnglish from '../icon/english-language.png';
import iconCart from '../icon/shopping-basket.png';
import productsData from './data/products.js';
import translations from './translations.js';
import siteLogo from '../logo/clothing-store-logo-design-with-hanger-illustration-vector.webp';

function App() {
  const [mode, setMode] = useState('dark');
  const [locale, setLocale] = useState('ar');
  const [currency, setCurrency] = useState('SAR');
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('haya_cart');
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Failed to parse local cart', e);
      }
    }
    return [];
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('haya_products_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse local products', e);
      }
    }
    return productsData;
  });

  const [categories, setCategories] = useState(() => [...new Set(products.map((p) => p.category))]);
  const [toasts, setToasts] = useState([]);
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('haya_orders')) || []; } catch { return []; }
  });
  const [preorders, setPreorders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('haya_preorders')) || []; } catch { return []; }
  });

  // Save to LocalStorage whenever products change
  useEffect(() => {
    localStorage.setItem('haya_products_v3', JSON.stringify(products));
    setCategories([...new Set(products.map((p) => p.category))]);
  }, [products]);

  // Save cart to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('haya_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('haya_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('haya_preorders', JSON.stringify(preorders));
  }, [preorders]);

  useEffect(() => {
    document.documentElement.dataset.theme = mode;
  }, [mode]);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const t = translations[locale];

  const currencySymbol = useMemo(() => {
    const symbols = { USD: '$', EUR: '€', GBP: '£', AED: 'د.إ', KWD: 'د.ك', SAR: 'ر.س' };
    return symbols[currency] || 'ر.س';
  }, [currency]);

  const priceFactor = useMemo(() => {
    const factors = { USD: 0.27, EUR: 0.25, GBP: 0.22, AED: 0.28, KWD: 0.08, SAR: 1 };
    return factors[currency] || 1;
  }, [currency]);

  const toast = (title, description, variant = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => setToasts((prev) => prev.filter((item) => item.id !== id)), 4500);
  };

  const sortedProducts = useMemo(
    () => products.map((p) => ({ 
      ...p, 
      priceLabel: `${currencySymbol}${(p.price * priceFactor).toFixed(0)}` 
    })),
    [products, currencySymbol, priceFactor]
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <AppContent 
        mode={mode} setMode={setMode} 
        locale={locale} setLocale={setLocale} 
        currency={currency} setCurrency={setCurrency} 
        cart={cart} setCart={setCart} 
        cartOpen={cartOpen} setCartOpen={setCartOpen} 
        products={sortedProducts} setProducts={setProducts} 
        categories={categories} setCategories={setCategories} 
        toasts={toasts} toast={toast} 
        currencySymbol={currencySymbol} totalItems={totalItems} 
        t={t}
        orders={orders} setOrders={setOrders}
        preorders={preorders} setPreorders={setPreorders}
      />
    </BrowserRouter>
  );
}

function AppContent({ mode, setMode, locale, setLocale, currency, setCurrency, cart, setCart, cartOpen, setCartOpen, products, setProducts, categories, setCategories, toasts, toast, currencySymbol, totalItems, t, orders, setOrders, preorders, setPreorders }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`app shell ${mode}`}>
      <ToastPanel toasts={toasts} />
      
      {!isAdmin && (
        <>
          <CartDrawer open={cartOpen} cart={cart} currencySymbol={currencySymbol} onUpdate={(id, d) => {
            setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + d) } : item));
          }} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onClose={() => setCartOpen(false)} t={t} />

          <header className="header glass-panel">
            <div className="brand-block">
              <Link to="/" className="brand-link">
                <span className="brand-mark-new">
                  <img src={siteLogo} alt="HAYA Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </span>
                <div>
                  <span className="brand-name">HAYA</span>
                  <span className="brand-claim">{t.header.tagline}</span>
                </div>
              </Link>
            </div>

            <nav className="header-nav">
              <Link to="/">{t.header.home}</Link>
              {categories.map((category) => (
                <a key={category} href={`#category-${category}`} className="category-link">
                  {t.categoryLabels?.[category] || category}
                </a>
              ))}
            </nav>

            <div className="controls">
              <button type="button" className="icon-button" onClick={() => setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))} aria-label={t.controls.toggleTheme}>
                <img src={mode === 'dark' ? iconSun : iconMoon} alt="" />
              </button>
              <button type="button" className="icon-button" onClick={() => setLocale((prev) => (prev === 'ar' ? 'en' : 'ar'))} aria-label={t.controls.toggleLanguage}>
                <img src={locale === 'ar' ? iconEnglish : iconArabic} alt="" />
              </button>
              <button type="button" className="icon-button cart-header-button" onClick={() => window.location.href = '/sala'} aria-label={t.controls.cart}>
                <img src={iconCart} alt="" />
                {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
              </button>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} aria-label={t.controls.currency}>
                <option value="SAR">SAR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="AED">AED</option>
                <option value="KWD">KWD</option>
              </select>
            </div>
          </header>
        </>
      )}

      <main className={isAdmin ? "admin-wrapper" : "page-content glass-panel soft-shadow"}>
        <AnimatedRoutes
          products={products}
          cart={cart}
          setCart={setCart}
          t={t}
          currencySymbol={currencySymbol}
          categories={categories}
          setProducts={setProducts}
          setCategories={setCategories}
          toast={toast}
          orders={orders}
          setOrders={setOrders}
          preorders={preorders}
          setPreorders={setPreorders}
          locale={locale}
        />
      </main>
      
      {!isAdmin && <FooterBar t={t} onSocialClick={() => toast(t.toast.betaTitle, t.footer.betaMessage, 'warning')} />}
    </div>
  );
}

function AnimatedRoutes({ products, cart, setCart, t, currencySymbol, categories, setProducts, setCategories, toast, orders, setOrders, preorders, setPreorders, locale }) {
  const location = useLocation();

  const addToCart = (product) => {
    if (!product) return;
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast(t.toast.addedTitle, `${product.name} ${t.toast.addedText}`);
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage products={products || []} addToCart={addToCart} t={t} categories={categories || []} locale={locale} />} />
        <Route path="/product/:id" element={<ProductDetail products={products || []} addToCart={addToCart} t={t} currencySymbol={currencySymbol} locale={locale} />} />
        <Route path="/preorder/:id" element={<PreorderPage products={products || []} t={t} toast={toast} currencySymbol={currencySymbol} setPreorders={setPreorders} locale={locale} />} />
        <Route path="/sala" element={<SalaPage cart={cart || []} setCart={setCart} currencySymbol={currencySymbol} t={t} toast={toast} setOrders={setOrders} locale={locale} />} />
        <Route path="/admin" element={<AdminDashboard products={products || []} setProducts={setProducts} categories={categories || []} setCategories={setCategories} t={t} toast={toast} currencySymbol={currencySymbol} orders={orders} preorders={preorders} locale={locale} />} />
        <Route path="/track/:orderId" element={<TrackingPage t={t} locale={locale} />} />
        <Route path="*" element={<NotFound t={t} />} />
      </Routes>
    </AnimatePresence>
  );
}

function HomePage({ products, addToCart, t, categories, locale }) {
  const handleShopNow = (e) => {
    e.preventDefault();
    document.getElementById('shop-start').scrollIntoView({ behavior: 'smooth' });
  };

  const categorySections = categories
    .map((category) => ({
      category,
      items: products.filter((product) => product.category === category),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <motion.div className="home-grid" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      <section className="hero-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <span className="eyebrow">{t.hero.newArrival}</span>
          <h1>{t.hero.title}</h1>
          <p>{t.hero.subtitle}</p>
        </div>
        <div className="hero-actions" style={{ marginLeft: '40px' }}>
          <a href="#shop-start" className="hero-cta" onClick={handleShopNow} style={{ whiteSpace: 'nowrap' }}>{t.hero.explore}</a>
        </div>
      </section>

      <div id="shop-start" style={{ scrollMarginTop: '120px' }} />
      {categorySections.map((section) => (
        <CategorySection key={section.category} category={section.category} products={section.items} addToCart={addToCart} t={t} locale={locale} />
      ))}
    </motion.div>
  );
}

function CategorySection({ category, products, addToCart, t, locale }) {
  return (
    <section className="category-section" id={`category-${category}`}>
      <div className="category-header">
        <div>
          <span className="eyebrow">{t.categoryLabels?.[category] || category}</span>
          <h2>{t.categoryLabels?.[category] || category}</h2>
        </div>
        <span className="category-count">{products.length} {t.cart.items}</span>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} t={t} locale={locale} />
        ))}
      </div>
    </section>
  );
}

function ProductCard({ product, addToCart, t, locale }) {
  const navigate = useNavigate();
  
  return (
    <motion.article 
      className="product-card" 
      whileHover={{ y: -8 }} 
      initial={{ opacity: 0, scale: 0.98 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.35 }}
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="product-media">
        <img src={product.heroImage || product.images?.[0]} alt={product.name} className="primary-image" />
        {product.images?.[1] && <img src={product.images[1]} alt={`${product.name} angle`} className="hover-image" />}
        <div className="product-actions" onClick={(e) => e.stopPropagation()}>
          {product.stock <= 0 ? (
            <button type="button" className="sold-out-btn danger-button" disabled style={{ flex: 1, padding: '14px', borderRadius: '16px', background: '#e53935', color: '#fff', border: 'none', fontWeight: 'bold' }}>
              {t.buttons.soldOut || 'Sold Out'}
            </button>
          ) : (product.isPreorder || product.category === 'Pre-orders' || product.category === 'الطلب المسبق') ? (
            <button type="button" className="preorder-btn primary-button" onClick={() => navigate(`/preorder/${product.id}`)} style={{ flex: 1, padding: '14px', borderRadius: '16px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', fontWeight: 'bold' }}>
              {t.buttons.preorder || 'Pre-order'}
            </button>
          ) : (
            <>
              <button type="button" className="add-to-cart-btn" onClick={() => addToCart(product)}>
                {t.buttons.addToCart}
              </button>
              <Link to={`/product/${product.id}`} className="secondary-button highlight">
                {t.buttons.browse}
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="product-copy">
        <span className="product-category">{t.categoryLabels?.[product.category] || product.category}</span>
        <h2>{locale === 'en' ? product.nameEn || product.name : product.name}</h2>
        <p className="product-price">{product.priceLabel}</p>
      </div>
    </motion.article>
  );
}

function ProductDetail({ products, addToCart, t, currencySymbol, locale }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === id);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return <NotFound t={t} />;
  }

  return (
    <motion.section className="product-detail" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
      <button type="button" className="back-link" onClick={() => navigate(-1)}>← {t.buttons.goBack}</button>
      <div className="detail-shell">
        <div className="detail-visuals">
          <div className="detail-media glass-panel soft-shadow">
            <img src={product.images?.[activeImage] || product.heroImage || product.image} alt={product.name} />
          </div>
          <div className="detail-thumbnails">
            {(product.images || [product.heroImage || product.image]).map((src, index) => (
              <button key={src} type="button" className={`thumbnail-button ${activeImage === index ? 'active' : ''}`} onClick={() => setActiveImage(index)}>
                <img src={src} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{t.categoryLabels?.[product.category] || product.category}</span>
          <h1>{locale === 'en' ? product.nameEn || product.name : product.name}</h1>
          <p className="detail-price">{product.priceLabel}</p>
          <p className="product-desc">{locale === 'en' ? product.descriptionEn || product.description : product.description}</p>
          <div className="detail-actions">
            {product.stock <= 0 ? (
              <button type="button" className="danger-button" disabled style={{ flex: 1, padding: '20px', background: '#e53935', color: '#fff', border: 'none', borderRadius: '22px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {t.buttons.soldOut || 'Sold Out'}
              </button>
            ) : (product.isPreorder || product.category === 'Pre-orders' || product.category === 'الطلب المسبق') ? (
              <button type="button" className="primary-button" onClick={() => navigate(`/preorder/${product.id}`)} style={{ flex: 1, padding: '20px', background: 'var(--accent)', color: 'var(--bg)', border: 'none', borderRadius: '22px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                {t.buttons.preorder || 'Pre-order'}
              </button>
            ) : (
              <button type="button" className="primary-button" onClick={() => addToCart(product)} style={{ flex: 1, padding: '20px' }}>
                {t.buttons.addToCart}
              </button>
            )}
          </div>
          <div className="detail-specs">
            <p><strong>{t.detail.material}:</strong> {locale === 'en' ? (product.materialEn || product.material) : product.material}</p>
            <p><strong>{t.detail.delivery}</strong></p>
            <p><strong>{t.detail.sizes}:</strong> {(product.sizes || ['S', 'M', 'L']).join(' · ')}</p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

function AdminDashboard({ products, setProducts, categories, setCategories, t, toast, currencySymbol, orders, preorders }) {
  const [form, setForm] = useState({ 
    name: '', 
    nameEn: '',
    price: 0, 
    category: categories[0] || 'T-Shirts', 
    heroImage: '', 
    gallery1: '', 
    gallery2: '', 
    gallery3: '', 
    material: '', 
    materialEn: '',
    description: '',
    descriptionEn: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [customCategory, setCustomCategory] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [activeTab, setActiveTab] = useState('products');
  const [showEnglish, setShowEnglish] = useState(false);
  const locale = document.documentElement.lang;

  const categoryValue = useCustomCategory ? customCategory : form.category;

  const reset = () => {
    setForm({ 
      name: '', nameEn: '', price: 0, category: categories[0] || 'T-Shirts', 
      heroImage: '', gallery1: '', gallery2: '', gallery3: '', 
      material: '', materialEn: '', description: '', descriptionEn: '',
      stock: 50, isPreorder: false
    });
    setEditingId(null);
    setCustomCategory('');
    setUseCustomCategory(false);
  };

  const saveToServer = async (newList) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newList),
      });
      if (response.ok) {
        console.log('Saved to project files');
      }
    } catch (error) {
      console.warn('Backend save failed (Expected in local dev without server running)', error);
    }
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, [field]: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.name || !categoryValue) {
      toast(t.toast.validationTitle || 'خطأ', t.toast.validationText || 'يرجى ملء الحقول الأساسية', 'danger');
      return;
    }

    let finalNameEn = form.nameEn;
    let finalDescEn = form.descriptionEn;
    let finalMatEn = form.materialEn;

    const finalCategory = form.isPreorder ? 'Pre-orders' : categoryValue;

    if (!finalNameEn || !finalDescEn || !finalMatEn) {
      toast(t.toast.betaTitle || 'جاري المعالجة...', 'يتم الآن الترجمة التلقائية عبر الذكاء الاصطناعي...', 'warning');
      try {
        const translate = async (text) => {
          if (!text) return '';
          const res = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ar|en`);
          const data = await res.json();
          return data.responseData?.translatedText || text;
        };

        const [tName, tDesc, tMat] = await Promise.all([
          finalNameEn ? Promise.resolve(finalNameEn) : translate(form.name),
          finalDescEn ? Promise.resolve(finalDescEn) : translate(form.description),
          finalMatEn ? Promise.resolve(finalMatEn) : translate(form.material)
        ]);

        finalNameEn = tName;
        finalDescEn = tDesc;
        finalMatEn = tMat;
        
        toast(t.admin.createdTitle || 'تمت الترجمة', 'تم إضافة الترجمة الإنجليزية بنجاح!', 'success');
      } catch (err) {
        console.error('Translation Error:', err);
        toast(t.toast.errorTitle || 'خطأ', 'فشلت الترجمة التلقائية. تم حفظ النص العربي.', 'danger');
      }
    }

    const gallery = [form.gallery1, form.gallery2, form.gallery3].filter(Boolean);

    const payload = {
      ...form,
      id: editingId || `${Date.now()}`,
      category: finalCategory,
      price: Number(form.price),
      heroImage: form.heroImage || 'https://via.placeholder.com/600x800?text=HAYA+Luxury',
      images: [form.heroImage || 'https://via.placeholder.com/600x800?text=HAYA+Luxury', ...gallery],
      sizes: ['S', 'M', 'L', 'XL'],
      material: form.material || (locale === 'ar' ? 'قطن فاخر' : 'Premium Cotton'),
      materialEn: finalMatEn || form.material || 'Premium Cotton',
      description: form.description || (locale === 'ar' ? 'تصميم عصري وفريد من نوعه.' : 'Modern and unique design.'),
      descriptionEn: finalDescEn || form.description || 'Modern and unique design.',
      nameEn: finalNameEn || form.name,
      stock: Number(form.stock) || 0,
      isPreorder: Boolean(form.isPreorder),
    };

    let newList;
    if (editingId) {
      newList = products.map((product) => (product.id === editingId ? { ...product, ...payload } : product));
    } else {
      newList = [payload, ...products];
    }
    
    setProducts(newList);
    saveToServer(newList); // Persistence
    toast(editingId ? t.admin.updatedTitle : t.admin.createdTitle, editingId ? t.admin.updatedText : t.admin.createdText);

    if (categoryValue && !categories.includes(categoryValue)) {
      setCategories((prev) => [categoryValue, ...prev]);
    }

    reset();
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm({
      ...product,
      heroImage: product.heroImage || product.images?.[0] || '',
      gallery1: product.images?.[1] || '',
      gallery2: product.images?.[2] || '',
      gallery3: product.images?.[3] || '',
      stock: product.stock ?? 50,
      isPreorder: product.isPreorder || false,
    });
    setUseCustomCategory(false);
    setCustomCategory('');
  };

  const remove = (id) => {
    const newList = products.filter((product) => product.id !== id);
    setProducts(newList);
    saveToServer(newList); // Persistence
    toast(t.admin.deletedTitle || 'تم الحذف', t.admin.deletedText || 'تم حذف المنتج', 'warning');
  };

  const safeOrders = orders || [];
  const safePreorders = preorders || [];
  const totalRevenue = safeOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = safeOrders.length;
  const totalPreorders = safePreorders.length;

  const salesData = [
    { label: t.week1 || 'Week 1', value: safeOrders.length > 0 ? 30 : 0 },
    { label: t.week2 || 'Week 2', value: safeOrders.length > 0 ? 50 : 0 },
    { label: t.week3 || 'Week 3', value: safeOrders.length > 0 ? 20 : 0 },
    { label: t.week4 || 'Week 4', value: safeOrders.length > 0 ? 100 : 0 },
  ];

  return (
    <motion.section className="admin-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="admin-top glass-panel" style={{ padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>{t.admin.title}</h1>
          <p>{t.admin.subtitle}</p>
        </div>
      </div>

      <div className="admin-board">
        <div className="admin-notice glass-panel" style={{ padding: '24px', background: 'rgba(210, 183, 138, 0.1)', border: '1px solid var(--accent)', borderRadius: '24px' }}>
          <p style={{ margin: 0, color: 'var(--accent)', fontSize: '1.1rem', lineHeight: '1.6' }}>
            <strong style={{ display: 'block', marginBottom: '8px', fontSize: '1.3rem' }}>
              {locale === 'ar' ? '⚠️ طريقة إضافة الصور بشكل صحيح:' : '⚠️ How to add images correctly:'}
            </strong>
            {locale === 'ar' 
              ? 'يمكنك الآن إضافة الصور بطريقتين: إما عن طريق زر "رفع صورة" لاختيار الصورة من جهازك مباشرة، أو عن طريق لصق "رابط مباشر" للصورة في الخانة. يُنصح برفع الصور من جهازك لسهولة الاستخدام وضمان استقرارها على الموقع.' 
              : 'You can now add images in two ways: by uploading directly from your device using the "Upload Image" button, or by pasting a "Direct Link" in the field. Uploading from your device is recommended.'}
          </p>
        </div>
        <div className="bento-grid">
          <div className="metric-card glass-panel">
            <span>{t.admin.sales}</span>
            <strong>{currencySymbol}{totalRevenue}</strong>
          </div>
          <div className="metric-card glass-panel">
            <span>{t.admin.orders}</span>
            <strong>{totalOrders}</strong>
          </div>
          <div className="metric-card glass-panel">
            <span>{t.admin.visitors}</span>
            <strong>{totalPreorders}</strong>
          </div>
        </div>
        <div className="sales-chart glass-panel">
          <div className="sales-chart-header">
            <span>{t.admin.revenueOverview}</span>
            <strong style={{ color: 'var(--accent)' }}>{currencySymbol}{totalRevenue} {locale === 'ar' ? 'هذا الأسبوع' : 'this week'}</strong>
          </div>
          <div className="chart-grid">
            {salesData.map((item) => (
              <div key={item.label} className="chart-bar-item">
                <div className="chart-bar" style={{ height: `${item.value}%` }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <button type="button" className={activeTab === 'products' ? 'primary-button' : 'secondary-button'} onClick={() => setActiveTab('products')}>{t.admin.tabProducts || 'المنتجات'}</button>
        <button type="button" className={activeTab === 'orders' ? 'primary-button' : 'secondary-button'} onClick={() => setActiveTab('orders')}>{t.admin.tabOrders || 'الطلبات'}</button>
        <button type="button" className={activeTab === 'preorders' ? 'primary-button' : 'secondary-button'} onClick={() => setActiveTab('preorders')}>{t.admin.tabPreorders || 'الطلبات المسبقة'}</button>
      </div>

      {activeTab === 'products' && (
        <div className="admin-sections">
          <section className="admin-section glass-panel">
          <h2>{t.admin.sectionCategories}</h2>
          <div className="category-chip-list admin-category-list">
            {categories.map((category) => (
              <span key={category} className="category-chip">{category}</span>
            ))}
          </div>
        </section>

        <section className="admin-section glass-panel">
          <h2>{t.admin.sectionProducts}</h2>
          <div className="admin-layout">
            <form className="admin-form" onSubmit={handleSubmit}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                <button type="button" className="secondary-button" onClick={() => setShowEnglish(!showEnglish)} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                  {showEnglish ? 'إخفاء الحقول الإنجليزية' : t.admin.toggleEnglish || 'عرض الحقول الإنجليزية (اختياري)'}
                </button>
              </div>
              <div className={showEnglish ? 'bilingual-grid' : ''}>
                <label>
                  {t.form.name || 'اسم المنتج'}
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="مثال: تيشيرت صيفي" required />
                </label>
                {showEnglish && (
                  <label>
                    Product Name (English)
                    <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} placeholder="Ex: Summer T-Shirt" />
                  </label>
                )}
              </div>
              <div className="bilingual-grid">
                <label>
                  {t.form.price} ({currencySymbol})
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                </label>
                <label>
                  {t.form.stock || 'المخزون'}
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </label>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '18px', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 'auto' }} checked={form.isPreorder} onChange={(e) => setForm({ ...form, isPreorder: e.target.checked })} />
                {t.form.isPreorder || 'هذا المنتج للطلب المسبق'}
              </label>
              <label>
                {t.form.category}
                <select value={useCustomCategory ? 'new-category' : form.category} onChange={(e) => {
                  if (e.target.value === 'new-category') {
                    setUseCustomCategory(true);
                    setForm((prev) => ({ ...prev, category: '' }));
                  } else {
                    setUseCustomCategory(false);
                    setForm((prev) => ({ ...prev, category: e.target.value }));
                  }
                }}>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                  <option value="new-category">{t.form.newCategory}</option>
                </select>
              </label>
              {useCustomCategory && (
                <label>
                  {t.form.newCategory}
                  <input value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder={t.form.newCategoryPlaceholder} />
                </label>
              )}
              <div className={showEnglish ? 'bilingual-grid' : ''}>
                <label>
                  {t.form.description || 'الوصف'}
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" placeholder="اكتب وصفاً جذاباً للمنتج..." />
                </label>
                {showEnglish && (
                  <label>
                    Product Description (English)
                    <textarea value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} rows="3" placeholder="Write a catchy description..." />
                  </label>
                )}
              </div>
              <div className={showEnglish ? 'bilingual-grid' : ''}>
                <label>
                  {t.form.material || 'المادة'}
                  <input value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} placeholder="مثال: قطن 100%" />
                </label>
                {showEnglish && (
                  <label>
                    Material/Fabric (English)
                    <input value={form.materialEn} onChange={(e) => setForm({ ...form, materialEn: e.target.value })} placeholder="Ex: 100% Cotton" />
                  </label>
                )}
              </div>
              <div className="image-manager glass-panel" style={{ padding: '24px', display: 'grid', gap: '16px', borderRadius: '24px' }}>
                <h3 style={{ margin: 0 }}>{t.form.imageManagement}</h3>
                
                <div style={{ display: 'grid', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px' }}>
                  <label>
                    {t.form.primaryImage} ({locale === 'ar' ? 'رابط' : 'URL'})
                    <input value={form.heroImage} onChange={(e) => setForm({ ...form, heroImage: e.target.value })} placeholder="https://..." />
                  </label>
                  <label style={{ background: 'rgba(210, 183, 138, 0.1)', padding: '12px', borderRadius: '12px' }}>
                    <strong>{t.form.uploadImage || 'رفع صورة'}</strong>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'heroImage')} style={{ border: 'none', background: 'transparent', width: '100%' }} />
                  </label>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ display: 'grid', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px' }}>
                    <label>
                      {t.form.image2 || 'صورة 2'} ({locale === 'ar' ? 'رابط' : 'URL'})
                      <input value={form.gallery1} onChange={(e) => setForm({ ...form, gallery1: e.target.value })} placeholder="https://..." />
                    </label>
                    <label style={{ background: 'rgba(210, 183, 138, 0.1)', padding: '12px', borderRadius: '12px' }}>
                      <strong>{t.form.uploadImage || 'رفع صورة'}</strong>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery1')} style={{ border: 'none', background: 'transparent', width: '100%' }} />
                    </label>
                  </div>
                  <div style={{ display: 'grid', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px' }}>
                    <label>
                      {t.form.image3 || 'صورة 3'} ({locale === 'ar' ? 'رابط' : 'URL'})
                      <input value={form.gallery2} onChange={(e) => setForm({ ...form, gallery2: e.target.value })} placeholder="https://..." />
                    </label>
                    <label style={{ background: 'rgba(210, 183, 138, 0.1)', padding: '12px', borderRadius: '12px' }}>
                      <strong>{t.form.uploadImage || 'رفع صورة'}</strong>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery2')} style={{ border: 'none', background: 'transparent', width: '100%' }} />
                    </label>
                  </div>
                  <div style={{ display: 'grid', gap: '8px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '16px' }}>
                    <label>
                      {t.form.image4 || 'صورة 4'} ({locale === 'ar' ? 'رابط' : 'URL'})
                      <input value={form.gallery3} onChange={(e) => setForm({ ...form, gallery3: e.target.value })} placeholder="https://..." />
                    </label>
                    <label style={{ background: 'rgba(210, 183, 138, 0.1)', padding: '12px', borderRadius: '12px' }}>
                      <strong>{t.form.uploadImage || 'رفع صورة'}</strong>
                      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery3')} style={{ border: 'none', background: 'transparent', width: '100%' }} />
                    </label>
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="primary-button">{editingId ? t.admin.update : t.admin.save}</button>
                <button type="button" className="secondary-button" onClick={reset}>{t.admin.clear}</button>
              </div>
            </form>
            <div className="admin-table">
              <h3>{t.admin.productList}</h3>
              <div className="product-table">
                {products.map((product) => (
                  <div key={product.id} className="product-row">
                    <div>
                      <strong>{locale === 'en' ? product.nameEn || product.name : product.name}</strong>
                      <span>{t.categoryLabels?.[product.category] || product.category}</span>
                    </div>
                    <div className="admin-row-actions">
                      <button type="button" onClick={() => startEdit(product)}>{t.admin.edit}</button>
                      <button type="button" className="danger-button" onClick={() => remove(product.id)}>{t.admin.delete}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="admin-sections">
          <section className="admin-section glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ margin: 0 }}>{t.admin.tabOrders || 'الطلبات'}</h2>
              <span style={{ background: 'rgba(210, 183, 138, 0.1)', color: 'var(--accent)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid var(--accent)' }}>
                 {locale === 'ar' ? '📦 متصل آلياً بشركات الشحن (DHL / Aramex)' : '📦 Integrated with DHL / Aramex'}
              </span>
            </div>
            {safeOrders.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>{t.admin.emptyOrders || 'لا توجد طلبات.'}</p>
            ) : (
              <div className="orders-list" style={{ display: 'grid', gap: '16px' }}>
                {safeOrders.map(order => (
                  <div key={order.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '24px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '16px' }}>
                      <strong>{order.id}</strong>
                      <span style={{ color: 'var(--accent)' }}>{new Date(order.date).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{item.quantity}x {locale === 'en' ? item.nameEn || item.name : item.name}</span>
                          <span>{currencySymbol}{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <strong>{t.admin.orderTotal || 'Total'}:</strong>
                      <strong style={{ fontSize: '1.2rem', color: 'var(--text)' }}>{currencySymbol}{order.total}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'preorders' && (
        <div className="admin-sections">
          <section className="admin-section glass-panel" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
              <h2 style={{ margin: 0 }}>{t.admin.tabPreorders || 'الطلبات المسبقة'}</h2>
              <span style={{ background: 'rgba(210, 183, 138, 0.1)', color: 'var(--accent)', padding: '8px 16px', borderRadius: '20px', fontSize: '0.9rem', border: '1px solid var(--accent)' }}>
                 {locale === 'ar' ? '📦 متصل آلياً بشركات الشحن (DHL / Aramex)' : '📦 Integrated with DHL / Aramex'}
              </span>
            </div>
            {safePreorders.length === 0 ? (
              <p style={{ color: 'var(--muted)' }}>{t.admin.emptyOrders || 'لا توجد طلبات مسبقة.'}</p>
            ) : (
              <div className="orders-list" style={{ display: 'grid', gap: '16px' }}>
                {safePreorders.map(pre => (
                  <div key={pre.id} style={{ background: 'rgba(210, 183, 138, 0.05)', padding: '24px', borderRadius: '20px', border: '1px solid var(--accent)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid rgba(210, 183, 138, 0.1)', paddingBottom: '16px' }}>
                      <strong style={{ color: 'var(--accent)' }}>{pre.id}</strong>
                      <span style={{ color: 'var(--muted)' }}>{new Date(pre.date).toLocaleString()}</span>
                    </div>
                    <div style={{ display: 'grid', gap: '12px', fontSize: '1.1rem' }}>
                      <div><strong>{t.admin.productList || 'المنتج'}:</strong> {pre.product}</div>
                      <div><strong>{t.preorderPage?.quantity || 'الكمية'}:</strong> {pre.quantity}</div>
                      <div><strong>{t.preorderPage?.email || 'الإيميل'}:</strong> <a href={`mailto:${pre.email}`} style={{ color: 'var(--accent)' }}>{pre.email}</a></div>
                      <div><strong>{t.preorderPage?.phone || 'الرقم'}:</strong> <a href={`tel:${pre.phone}`} style={{ color: 'var(--text)' }}>{pre.phone}</a></div>
                      {pre.notes && (
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginTop: '8px' }}>
                          <strong>{t.preorderPage?.notes || 'الملاحظات'}:</strong><br/>
                          <p style={{ margin: '8px 0 0 0', lineHeight: '1.5' }}>{pre.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </motion.section>
  );
}

function CartHeaderButton({ count, onOpen }) {
  return (
    <button type="button" className="icon-button cart-header-button" onClick={onOpen} aria-label="Open cart">
      <img src={iconCart} alt="" />
      {count > 0 && <span className="cart-badge header-count">{count}</span>}
    </button>
  );
}

function CartDrawer({ open, cart, currencySymbol, onUpdate, onRemove, onClose, t }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();
  const locale = document.documentElement.lang;

  return (
    <aside className={`cart-drawer ${open ? 'open' : ''}`} style={{ 
      position: 'fixed', top: '0', right: '0', height: '100vh', width: 'min(400px, 100vw)', 
      background: 'var(--panel-strong)', zIndex: '200', padding: '32px', boxShadow: 'var(--shadow)',
      transform: open ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.4s ease'
    }}>
      <div className="cart-panel-header">
        <div>
          <strong>{t.cart.title}</strong>
          <span>{cart.length} {t.cart.items}</span>
        </div>
        <button type="button" className="close-button" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <div className="cart-items" style={{ maxHeight: 'calc(100vh - 250px)', overflowY: 'auto', marginTop: '24px' }}>
        {cart.length === 0 && <p className="empty-text">{t.cart.empty}</p>}
        {cart.map((item) => (
          <div key={item.id} className="cart-item">
            <div>
              <strong>{locale === 'en' ? item.nameEn || item.name : item.name}</strong>
              <span>{currencySymbol}{item.price}</span>
            </div>
            <div className="cart-actions">
              <button type="button" onClick={() => onUpdate(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => onUpdate(item.id, 1)}>+</button>
              <button type="button" className="remove-button" onClick={() => onRemove(item.id)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary" style={{ position: 'absolute', bottom: '32px', left: '32px', right: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <span>{t.cart.total}</span>
          <strong>{currencySymbol}{total.toFixed(0)}</strong>
        </div>
        <button type="button" className="primary-button" style={{ width: '100%' }} onClick={() => { navigate('/sala'); onClose(); }}>
          {t.cart.viewCart}
        </button>
      </div>
    </aside>
  );
}

function SalaPage({ cart, setCart, currencySymbol, t, toast, setOrders }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const navigate = useNavigate();
  const locale = document.documentElement.lang;

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  const handleCheckout = () => {
    const orderId = `ORD-${Date.now()}`;
    setOrders((prev) => [{ id: orderId, items: [...cart], total, date: new Date().toISOString() }, ...prev]);
    toast(
      locale === 'ar' ? 'تم الطلب بنجاح' : 'Order Successful',
      locale === 'ar' ? 'جاري تحويلك لصفحة تتبع الطلب...' : 'Redirecting to tracking page...',
      'success'
    );
    setCart([]);
    setTimeout(() => navigate(`/track/${orderId}`), 2000);
  };

  return (
    <motion.section className="sala-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 style={{ marginBottom: '40px' }}>{t.cart.title}</h1>
      <div className="sala-grid">
        <div className="sala-items">
          {cart.length === 0 && <p className="empty-text">{t.cart.empty}</p>}
          {cart.map((item) => (
            <div key={item.id} className="sala-item">
              <img src={item.heroImage} alt={locale === 'en' ? item.nameEn || item.name : item.name} />
              <div className="sala-item-details">
                <h3>{locale === 'en' ? item.nameEn || item.name : item.name}</h3>
                <p className="sala-item-price">{currencySymbol}{item.price}</p>
                <div className="cart-actions">
                  <button type="button" onClick={() => {
                    setCart(prev => {
                      const newList = prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0);
                      if (newList.length === 0) navigate('/');
                      return newList;
                    });
                  }}>-</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => setCart(prev => prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))}>+</button>
                </div>
              </div>
              <button type="button" className="sala-remove" onClick={() => {
                setCart(prev => {
                  const newList = prev.filter(i => i.id !== item.id);
                  if (newList.length === 0) navigate('/');
                  return newList;
                });
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          ))}
        </div>
        <div className="sala-summary-box">
          <h2 style={{ marginTop: 0 }}>{t.cart.total}</h2>
          <div className="sala-total-row">
            <span>{t.cart.total}: </span>
            <strong>{currencySymbol}{total.toFixed(0)}</strong>
          </div>
          <button className="primary-button checkout-btn" onClick={handleCheckout}>
            {t.cart.checkout}
          </button>
          <Link to="/" style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: 'var(--muted)' }}>
            {t.buttons.continueShopping}
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

function FooterBar({ t, onSocialClick }) {
  const socialButtons = [
    { label: 'Instagram', icon: 'instagram' },
    { label: 'TikTok', icon: 'tiktok' },
    { label: 'LinkedIn', icon: 'linkedin' },
  ];

  return (
    <footer className="footer-bar glass-panel soft-shadow">
      <p>{t.footer.notice}</p>
      <div className="social-links">
        <span>{t.footer.follow}</span>
        {socialButtons.map((item) => (
          <button key={item.label} type="button" className="social-button" onClick={onSocialClick}>
            <span className={`social-icon ${item.icon}`} aria-hidden="true" />
            {item.label}
          </button>
        ))}
      </div>
    </footer>
  );
}

function ToastPanel({ toasts }) {
  const navigate = useNavigate();
  return (
    <div className="toast-viewport">
      {toasts.map((toast) => (
        <motion.div 
          key={toast.id} 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -12 }} 
          className={`toast-card ${toast.variant}`}
          onClick={() => navigate('/sala')}
          style={{ cursor: 'pointer' }}
        >
          <strong>{toast.title}</strong>
          <p>{toast.description}</p>
        </motion.div>
      ))}
    </div>
  );
}

function PreorderPage({ products, t, toast, currencySymbol, setPreorders }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((item) => item.id === id);
  const locale = document.documentElement.lang;

  if (!product) {
    return <NotFound t={t} />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderData = {
      id: `PRE-${Date.now()}`,
      product: product.name,
      price: product.price,
      email: formData.get('email'),
      phone: formData.get('phone'),
      quantity: formData.get('quantity'),
      notes: formData.get('notes'),
      date: new Date().toISOString()
    };
    setPreorders((prev) => [orderData, ...prev]);
    toast(t.toast.preorderTitle || 'تم تأكيد الطلب', t.toast.preorderText || 'سنتواصل معك قريباً لتأكيد طلبك المسبق.', 'success');
    navigate('/');
  };

  return (
    <motion.section className="preorder-page" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ maxWidth: '800px', margin: '40px auto', padding: '40px', borderRadius: '30px', background: 'var(--panel)', boxShadow: 'var(--shadow)', border: '1px solid var(--border)' }}>
      <button type="button" className="back-link" onClick={() => navigate(-1)} style={{ marginBottom: '24px', display: 'inline-block' }}>← {t.buttons.goBack}</button>
      
      <div style={{ display: 'grid', gap: '32px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', alignItems: 'center' }}>
        <div className="detail-media" style={{ borderRadius: '24px', overflow: 'hidden' }}>
          <img src={product.heroImage || product.images?.[0]} alt={product.name} style={{ width: '100%', height: 'auto', objectFit: 'contain', background: 'var(--bg)' }} />
        </div>
        
        <div>
          <span className="eyebrow" style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{t.buttons.preorder || 'Pre-order'}</span>
          <h1 style={{ fontSize: '2.5rem', margin: '8px 0', lineHeight: '1.2' }}>{locale === 'en' ? product.nameEn : product.name}</h1>
          <p style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'var(--text)' }}>{product.price} {currencySymbol}</p>
          <p style={{ color: 'var(--muted)', marginBottom: '24px' }}>{locale === 'en' ? product.descriptionEn : product.description}</p>
          
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <label style={{ display: 'grid', gap: '8px' }}>
              {t.preorderPage?.email || 'Email Address'}
              <input type="email" name="email" required style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'grid', gap: '8px' }}>
              {t.preorderPage?.phone || 'Phone Number'}
              <input type="tel" name="phone" required style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'grid', gap: '8px' }}>
              {t.preorderPage?.quantity || 'Quantity'}
              <input type="number" name="quantity" min="1" defaultValue="1" required style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text)' }} />
            </label>
            <label style={{ display: 'grid', gap: '8px' }}>
              {t.preorderPage?.notes || 'Additional Notes'}
              <textarea name="notes" rows="3" style={{ padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text)', minHeight: '80px' }}></textarea>
            </label>
            <button type="submit" className="primary-button" style={{ marginTop: '16px', padding: '20px', borderRadius: '22px', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {t.preorderPage?.submit || 'Confirm Pre-order'}
            </button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}

function NotFound({ t }) {
  return (
    <motion.section className="not-found" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1>{t.notFound.title}</h1>
      <p>{t.notFound.description}</p>
      <Link to="/" className="hero-cta">{t.notFound.cta}</Link>
    </motion.section>
  );
}

function TrackingPage({ t }) {
  const { orderId } = useParams();
  const locale = document.documentElement.lang;
  const navigate = useNavigate();
  
  const steps = [
    { labelAr: 'قيد التجهيز في المصنع', labelEn: 'Processing in Factory', active: true },
    { labelAr: 'تم التسليم لشركة الشحن', labelEn: 'Handed to Shipping Company', active: false },
    { labelAr: 'قيد الشحن الدولي', labelEn: 'In International Transit', active: false },
    { labelAr: 'في مقر الشحن المحلي', labelEn: 'At Local Facility', active: false },
    { labelAr: 'مع المندوب وفي الطريق', labelEn: 'Out for Delivery', active: false },
    { labelAr: 'تم التوصيل', labelEn: 'Delivered', active: false }
  ];

  return (
    <motion.section className="tracking-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '60px 20px', maxWidth: '600px', margin: '40px auto' }}>
      <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>{locale === 'ar' ? 'تتبع الطلب' : 'Track Order'}</h2>
        <p style={{ textAlign: 'center', color: 'var(--accent)', marginBottom: '40px', fontSize: '1.2rem', fontWeight: 'bold' }}>{orderId}</p>
        
        <div className="tracking-timeline" style={{ display: 'grid', gap: '30px' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px', opacity: step.active ? 1 : 0.4 }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: step.active ? 'var(--accent)' : 'var(--border)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: step.active ? '0 0 15px var(--accent)' : 'none', flexShrink: 0 }}>
                {step.active && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--bg)' }} />}
              </div>
              <span style={{ fontSize: '1.3rem', fontWeight: step.active ? 'bold' : 'normal', color: step.active ? 'var(--text)' : 'var(--muted)' }}>
                {locale === 'en' ? step.labelEn : step.labelAr}
              </span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '50px', textAlign: 'center' }}>
          <button className="secondary-button" onClick={() => navigate('/')} style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            {t.buttons.goBack}
          </button>
        </div>
      </div>
    </motion.section>
  );
}

export default App;
