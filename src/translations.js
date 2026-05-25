const translations = {
  ar: {
    header: { tagline: 'منتج فاخر. تجربة سينمائية.', home: 'الرئيسية' },
    categoryLabels: { 'T-Shirts': 'تيشيرتات', 'Hoodies': 'هوديات', 'Pants': 'سراويل', 'Sets': 'أطقم', Accessories: 'إكسسوارات', 'Pre-orders': 'الطلب المسبق' },
    controls: { currency: 'العملة', dark: 'الوضع الداكن', light: 'الوضع المضيء', toggleTheme: 'تغيير الوضع', toggleLanguage: 'تغيير اللغة' },
    hero: { newArrival: 'إصدار محدود', title: 'إطلالة فاخرة لكل موسم.', subtitle: 'اكتشف تشكيلة راقية من الأزياء الراقية مع تجربة واجهة مستخدم مصقولة وتدرجات سينمائية.', explore: 'تسوق الآن' },
    cart: { title: 'السلة', items: 'عناصر', empty: 'السلة فارغة', total: 'الإجمالي', checkout: 'إتمام الشراء', viewCart: 'عرض السلة كاملة' },
    detail: { material: 'المادة', delivery: 'شحن سريع مجاني', sizes: 'المقاسات' },
    toast: {
      addedTitle: 'تمت الإضافة', addedText: 'إلى السلة بنجاح',
      removedTitle: 'تمت الإزالة', removedText: 'تم حذف المنتج من السلة',
      errorTitle: 'خطأ', betaTitle: 'ميزة تجريبية',
      preorderTitle: 'تم تأكيد الطلب', preorderText: 'سنتواصل معك قريباً لتأكيد طلبك المسبق.',
      orderTitle: 'طلب جديد', orderText: 'تم استلام طلبك بنجاح'
    },
    admin: {
      title: 'لوحة الإدارة', subtitle: 'إدارة متجرك، المنتجات، والطلبات',
      sales: 'إجمالي المبيعات', orders: 'الطلبات العادية', visitors: 'طلبات مسبقة',
      revenueOverview: 'المبيعات الأخيرة', productList: 'المنتجات',
      edit: 'تعديل', delete: 'حذف', save: 'حفظ المنتج', update: 'تحديث المنتج', clear: 'إلغاء',
      sectionCategories: 'الأقسام', sectionProducts: 'المنتجات', sectionSettings: 'الإعدادات',
      tabProducts: 'المنتجات', tabOrders: 'الطلبات', tabPreorders: 'الطلبات المسبقة',
      toggleEnglish: 'عرض حقول اللغة الإنجليزية (اختياري)',
      orderId: 'رقم الطلب', orderDate: 'التاريخ', orderTotal: 'القيمة', orderStatus: 'الحالة', orderDetails: 'تفاصيل الطلب',
      customerName: 'الاسم', customerEmail: 'الإيميل', customerPhone: 'الهاتف', customerNotes: 'ملاحظات',
      emptyOrders: 'لا توجد طلبات حتى الآن.'
    },
    form: {
      name: 'اسم المنتج', price: 'السعر', category: 'الصنف', newCategory: 'صنف جديد', newCategoryPlaceholder: 'اسم الصنف...',
      material: 'المادة/القماش', description: 'الوصف', imageManagement: 'إدارة الصور (رابط أو رفع من الجهاز)',
      primaryImage: 'صورة 1 (الأساسية)', image2: 'صورة 2', image3: 'صورة 3', image4: 'صورة 4',
      galleryImages: 'صور المعرض', stock: 'المخزون (الكمية)', isPreorder: 'المنتج للطلب المسبق', uploadImage: 'رفع'
    },
    notFound: { title: 'الصفحة غير موجودة', description: 'الصفحة التي تبحث عنها غير متاحة.', cta: 'العودة' },
    footer: { notice: 'موقع تجريبي', follow: 'تابعنا', betaMessage: 'ميزة تجريبية.' },
    buttons: { continueShopping: 'العودة للتسوق', addToCart: 'أضف للسلة', browse: 'تصفح', goBack: 'العودة', preorder: 'طلب مسبق', soldOut: 'غير متوفر' },
    preorderPage: { title: 'طلب مسبق', email: 'البريد الإلكتروني', phone: 'رقم الهاتف', quantity: 'الكمية المطلوبة', submit: 'تأكيد الطلب المسبق', notes: 'ملاحظات' }
  },
  en: {
    header: { tagline: 'Premium product. Cinematic experience.', home: 'Home' },
    categoryLabels: { 'T-Shirts': 'T-Shirts', 'Hoodies': 'Hoodies', 'Pants': 'Pants', 'Sets': 'Sets', Accessories: 'Accessories', 'Pre-orders': 'Pre-orders' },
    controls: { currency: 'Currency', dark: 'Dark Mode', light: 'Light Mode', toggleTheme: 'Toggle Theme', toggleLanguage: 'Toggle Language' },
    hero: { newArrival: 'Limited Edition', title: 'Luxury look for every season.', subtitle: 'Discover a premium collection of high-end fashion.', explore: 'Shop Now' },
    cart: { title: 'Cart', items: 'items', empty: 'No items yet', total: 'Total', checkout: 'Checkout', viewCart: 'View Cart' },
    detail: { material: 'Material', delivery: 'Free express shipping', sizes: 'Sizes' },
    toast: {
      addedTitle: 'Added', addedText: 'successfully',
      removedTitle: 'Removed', removedText: 'Item removed',
      errorTitle: 'Error', betaTitle: 'Beta Feature',
      preorderTitle: 'Order Confirmed', preorderText: 'We will contact you soon.',
      orderTitle: 'New Order', orderText: 'Order received successfully'
    },
    admin: {
      title: 'Admin Dashboard', subtitle: 'Manage inventory and orders',
      sales: 'Total Sales', orders: 'Regular Orders', visitors: 'Pre-orders',
      revenueOverview: 'Recent Sales', productList: 'Products',
      edit: 'Edit', delete: 'Delete', save: 'Save Product', update: 'Update', clear: 'Clear',
      sectionCategories: 'Categories', sectionProducts: 'Products', sectionSettings: 'Settings',
      tabProducts: 'Products', tabOrders: 'Orders', tabPreorders: 'Pre-orders',
      toggleEnglish: 'Show English Fields (Optional)',
      orderId: 'Order ID', orderDate: 'Date', orderTotal: 'Total', orderStatus: 'Status', orderDetails: 'Details',
      customerName: 'Name', customerEmail: 'Email', customerPhone: 'Phone', customerNotes: 'Notes',
      emptyOrders: 'No orders yet.'
    },
    form: {
      name: 'Product name', price: 'Price', category: 'Category', newCategory: 'New category', newCategoryPlaceholder: 'Name...',
      material: 'Material', description: 'Description', imageManagement: 'Images (URL or Upload)',
      primaryImage: 'Image 1 (Hero)', image2: 'Image 2', image3: 'Image 3', image4: 'Image 4',
      galleryImages: 'Gallery', stock: 'Stock', isPreorder: 'Pre-order product', uploadImage: 'Upload'
    },
    notFound: { title: 'Not Found', description: 'Page unavailable.', cta: 'Back' },
    footer: { notice: 'Demo site', follow: 'Follow us', betaMessage: 'Experimental feature.' },
    buttons: { continueShopping: 'Continue Shopping', addToCart: 'Add to Cart', browse: 'Browse', goBack: 'Go Back', preorder: 'Pre-order', soldOut: 'Sold Out' },
    preorderPage: { title: 'Pre-order', email: 'Email', phone: 'Phone', quantity: 'Quantity', submit: 'Confirm', notes: 'Notes' }
  }
};
export default translations;
