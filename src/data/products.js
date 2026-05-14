const products = [
  // T-Shirts
  ...Array.from({ length: 9 }, (_, i) => ({
    id: `t-shrt-${i + 1}`,
    name: `تيشيرت عصري ${i + 1}`,
    nameEn: `Modern T-Shirt ${i + 1}`,
    category: 'T-Shirts',
    price: 120 + i * 5,
    material: 'قطن بريميوم',
    materialEn: 'Premium Cotton',
    description: 'تيشيرت بتصميم فريد وقصة مريحة تناسب الاستخدام اليومي بلمسة فاخرة.',
    descriptionEn: 'A unique design t-shirt with a comfortable fit for daily luxury wear.',
    sizes: ['S', 'M', 'L', 'XL'],
    heroImage: new URL(`../../photo/t-shrt/${i + 1}/1.avif`, import.meta.url).href,
    images: [
      new URL(`../../photo/t-shrt/${i + 1}/1.avif`, import.meta.url).href,
      new URL(`../../photo/t-shrt/${i + 1}/2.avif`, import.meta.url).href,
      new URL(`../../photo/t-shrt/${i + 1}/3.avif`, import.meta.url).href,
    ],
  })),
  // Hoodies
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `hodi-${i + 1}`,
    name: `هودي فاخر ${i + 1}`,
    nameEn: `Luxury Hoodie ${i + 1}`,
    category: 'Hoodies',
    price: 250 + i * 10,
    material: 'صوف قطني ثقيل',
    materialEn: 'Heavy Cotton Fleece',
    description: 'هودي شتوي دافئ بتصميم عصري وألوان جذابة.',
    descriptionEn: 'A warm winter hoodie with a modern design and attractive colors.',
    sizes: ['M', 'L', 'XL'],
    heroImage: new URL(`../../photo/hodi/${i + 1}/1.avif`, import.meta.url).href,
    images: [
      new URL(`../../photo/hodi/${i + 1}/1.avif`, import.meta.url).href,
      new URL(`../../photo/hodi/${i + 1}/2.avif`, import.meta.url).href,
    ],
  })),
  // Pants
  ...Array.from({ length: 3 }, (_, i) => ({
    id: `jenz-${i + 1}`,
    name: `سروال جينز ${i + 1}`,
    nameEn: `Denim Jeans ${i + 1}`,
    category: 'Pants',
    price: 180 + i * 5,
    material: 'دينيم عالي الجودة',
    materialEn: 'High Quality Denim',
    description: 'سروال جينز بقصة متقنة وتفاصيل تعكس الجودة والفخامة.',
    descriptionEn: 'Well-tailored jeans with details reflecting quality and luxury.',
    sizes: ['30', '32', '34', '36'],
    heroImage: new URL(`../../photo/jenz/${i + 1}/1.avif`, import.meta.url).href,
    images: [
      new URL(`../../photo/jenz/${i + 1}/1.avif`, import.meta.url).href,
      new URL(`../../photo/jenz/${i + 1}/2.avif`, import.meta.url).href,
    ],
  })),
  // Sets
  {
    id: 'sets-1',
    name: 'طقم كامل بريميوم',
    nameEn: 'Full Premium Set',
    category: 'Sets',
    price: 380,
    material: 'ألياف تقنية فاخرة',
    materialEn: 'Premium Tech Fibers',
    description: 'طقم متكامل يجمع بين الأناقة والراحة المطلقة في كل الأوقات.',
    descriptionEn: 'An integrated set combining style and ultimate comfort at all times.',
    sizes: ['S', 'M', 'L'],
    heroImage: new URL('../../photo/Sets/1/1.avif', import.meta.url).href,
    images: [
      new URL('../../photo/Sets/1/1.avif', import.meta.url).href,
      new URL('../../photo/Sets/1/2.avif', import.meta.url).href,
    ],
  },
];

export default products;
