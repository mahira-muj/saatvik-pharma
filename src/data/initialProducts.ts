import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sp-001',
    name: 'Saatvik Organic KSM-66 Ashwagandha Gold',
    slug: 'saatvik-organic-ashwagandha-gold',
    category: 'Ayurvedic & Herbal',
    shortDescription: 'Clinically tested root extract with 5% withanolides for deep stress relief, energy vitality & peaceful sleep.',
    description: 'Saatvik Organic Ashwagandha features premium KSM-66 full-spectrum root extract, cultivated using ancient Vedic practices and certified organic farming. Known as the king of Ayurvedic adaptogens, it gently regulates cortisol levels, balances the nervous system, and revitalizes physical stamina without causing drowsiness.',
    keyIngredients: ['Organic KSM-66 Ashwagandha Root Extract (500mg)', 'Piperine Bio-Enhancer (5mg)', 'Vedic Plant Cellulose Capsule'],
    dosageInstructions: 'Take 1 to 2 capsules twice daily with warm milk or water after meals, or as directed by an Ayurvedic practitioner.',
    benefits: ['Helps reduce stress and anxiety levels by up to 27.9%', 'Supports restorative REM sleep cycles', 'Enhances physical endurance, vitality & muscle recovery', 'Certified Ayush Ministry & GMP compliant formulation'],
    rating: 4.9,
    reviewsCount: 342,
    featured: true,
    basePrice: 599,
    baseComparePrice: 799,
    defaultImageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
    galleryImages: [
      '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
      '/src/assets/images/hero_doctor_banner_1794289669837.jpg'
    ],
    variations: [
      {
        id: 'var-ash-01',
        size: '60 Veggie Capsules',
        price: 599,
        comparePrice: 799,
        stock: 45,
        imageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
        sku: 'SP-ASH-60'
      },
      {
        id: 'var-ash-02',
        size: '120 Veggie Capsules (Value Pack)',
        price: 999,
        comparePrice: 1499,
        stock: 28,
        imageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
        sku: 'SP-ASH-120'
      },
      {
        id: 'var-ash-03',
        size: '180 Veggie Capsules (Family Pack)',
        price: 1399,
        comparePrice: 1999,
        stock: 14,
        imageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
        sku: 'SP-ASH-180'
      }
    ]
  },
  {
    id: 'sp-002',
    name: 'Saatvik Triple Strength Pure Omega-3 Fish Oil',
    slug: 'saatvik-triple-strength-omega-3',
    category: 'Vitamins & Supplements',
    shortDescription: 'Ultra-purified molecularly distilled EPA 430mg & DHA 320mg softgels for heart, brain & joint flexibility.',
    description: 'Extracted from wild cold-water deep ocean anchovies, Saatvik Omega-3 undergoes molecular distillation to remove heavy metals, mercury, and toxins. Infused with natural lemon essence to eliminate fishy burps, providing optimum cardiovascular support and joint lubrication.',
    keyIngredients: ['Purified Deep Ocean Fish Oil (1200mg)', 'EPA (Eicosapentaenoic Acid) 430mg', 'DHA (Docosahexaenoic Acid) 320mg', 'Natural Lemon Zest Oil', 'd-Alpha Tocopherol (Vitamin E)'],
    dosageInstructions: 'Take 1 softgel twice daily with food or as advised by your healthcare physician.',
    benefits: ['Maintains healthy triglyceride and cholesterol balance', 'Supports cognitive acuity, focus and memory retention', 'Relieves morning joint stiffness and enhances mobility', 'Enteric coating prevents fishy aftertaste or reflux'],
    rating: 4.8,
    reviewsCount: 286,
    featured: true,
    basePrice: 749,
    baseComparePrice: 999,
    defaultImageUrl: '/src/assets/images/product_vitamin_omega3_1794289671639.jpg',
    galleryImages: [
      '/src/assets/images/product_vitamin_omega3_1794289671639.jpg'
    ],
    variations: [
      {
        id: 'var-omg-01',
        size: '60 Enteric Softgels',
        price: 749,
        comparePrice: 999,
        stock: 32,
        imageUrl: '/src/assets/images/product_vitamin_omega3_1794289671639.jpg',
        sku: 'SP-OMG-60'
      },
      {
        id: 'var-omg-02',
        size: '120 Enteric Softgels',
        price: 1299,
        comparePrice: 1799,
        stock: 19,
        imageUrl: '/src/assets/images/product_vitamin_omega3_1794289671639.jpg',
        sku: 'SP-OMG-120'
      },
      {
        id: 'var-omg-03',
        size: '180 Softgels (Mega Pack)',
        price: 1799,
        comparePrice: 2499,
        stock: 8,
        imageUrl: '/src/assets/images/product_vitamin_omega3_1794289671639.jpg',
        sku: 'SP-OMG-180'
      }
    ]
  },
  {
    id: 'sp-003',
    name: 'Saatvik Kumkumadi Rejuvenating Ayurvedic Miracle Tailam',
    slug: 'saatvik-kumkumadi-ayurvedic-tailam',
    category: 'Skin & Haircare',
    shortDescription: 'Authentic 26-herb Ayurvedic beauty elixir with Kashmiri Mogra Saffron for glowing, blemish-free skin.',
    description: 'Formulated according to the revered classical Ashtanga Hrudaya text, Saatvik Kumkumadi Tailam blends handpicked Kashmiri Saffron stigmas with sandalwood, vetiver, lotus pollen, and pure goat milk. It penetrates deep into dermal layers to erase hyperpigmentation, brighten dull complexion, and stimulate cellular repair.',
    keyIngredients: ['Pure Kashmiri Kesar (Saffron)', 'Red Sandalwood (Rakta Chandana)', 'Manjistha (Indian Madder)', 'Padmaka (Himalayan Cherry)', 'Organic Cold-Pressed Sesame Base'],
    dosageInstructions: 'Dispense 3-4 drops onto clean fingertips. Gently press and massage onto face and neck in upward circular motions before bedtime.',
    benefits: ['Illuminates natural radiance and evens skin tone', 'Reduces dark circles, blemishes and fine expression lines', 'Intensely hydrates and repairs sun damage', '100% natural, free of mineral oil, parabens & synthetic fragrances'],
    rating: 4.9,
    reviewsCount: 195,
    featured: true,
    basePrice: 899,
    baseComparePrice: 1299,
    defaultImageUrl: '/src/assets/images/product_ayurvedic_serum_1794289671969.jpg',
    galleryImages: [
      '/src/assets/images/product_ayurvedic_serum_1794289671969.jpg'
    ],
    variations: [
      {
        id: 'var-kum-01',
        size: '15ml Glass Dropper',
        price: 899,
        comparePrice: 1299,
        stock: 50,
        imageUrl: '/src/assets/images/product_ayurvedic_serum_1794289671969.jpg',
        sku: 'SP-KUM-15'
      },
      {
        id: 'var-kum-02',
        size: '30ml Luxury Dropper',
        price: 1499,
        comparePrice: 2199,
        stock: 22,
        imageUrl: '/src/assets/images/product_ayurvedic_serum_1794289671969.jpg',
        sku: 'SP-KUM-30'
      },
      {
        id: 'var-kum-03',
        size: '50ml Family Pack',
        price: 2199,
        comparePrice: 3200,
        stock: 12,
        imageUrl: '/src/assets/images/product_ayurvedic_serum_1794289671969.jpg',
        sku: 'SP-KUM-50'
      }
    ]
  },
  {
    id: 'sp-004',
    name: 'Saatvik Ortho-Relief Ayurvedic Joint & Muscle Pain Oil',
    slug: 'saatvik-ortho-relief-joint-oil',
    category: 'Pain Relief',
    shortDescription: 'Potent Ayurvedic concoction with Mahanarayan Tailam & Gandhapura for rapid relief from arthritis & back pain.',
    description: 'Saatvik Ortho-Relief is a therapeutic Ayurvedic pain formula steeped in 18 warming botanicals including Shallaki (Boswellia), Nirgundi, Camphor, and Eucalyptus. It quickly penetrates the joints to soothe chronic inflammation, reduce morning stiffness, and restore natural synovial fluid motion.',
    keyIngredients: ['Mahanarayan Taila (40%)', 'Gandhapura Oil (Wintergreen 15%)', 'Shallaki Extract (Boswellia 10%)', 'Nirgundi Herb (10%)', 'Nilgiri Oil (Eucalyptus 5%)'],
    dosageInstructions: 'Apply 5-10ml directly to affected joint or muscle. Massage gently in clockwise motion until absorbed. For enhanced relief, apply a warm compress.',
    benefits: ['Instant warm soothing sensation within 10 minutes of application', 'Aids cartilage nourishment and reduces stiffness', 'Effective for knee arthritis, cervical spondylitis & sciatica pain', 'Non-sticky and leaves no greasy stains on clothing'],
    rating: 4.7,
    reviewsCount: 174,
    featured: true,
    basePrice: 389,
    baseComparePrice: 499,
    defaultImageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
    galleryImages: [
      '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg'
    ],
    variations: [
      {
        id: 'var-ort-01',
        size: '50ml Roll-On',
        price: 389,
        comparePrice: 499,
        stock: 60,
        imageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
        sku: 'SP-ORT-50'
      },
      {
        id: 'var-ort-02',
        size: '100ml Glass Bottle',
        price: 549,
        comparePrice: 750,
        stock: 35,
        imageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
        sku: 'SP-ORT-100'
      },
      {
        id: 'var-ort-03',
        size: '200ml Family Dispenser',
        price: 899,
        comparePrice: 1200,
        stock: 18,
        imageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
        sku: 'SP-ORT-200'
      }
    ]
  },
  {
    id: 'sp-005',
    name: 'Saatvik DiabaCare Glycemic Balance Churna',
    slug: 'saatvik-diabacare-glycemic-balance',
    category: 'Daily Wellness',
    shortDescription: 'Traditional Madhunashini Ayurvedic blend with Karela, Jamun seed, Vijaysar & Gurmar for healthy blood sugar.',
    description: 'Expertly formulated to support pancreatic beta-cell health, Saatvik DiabaCare synergizes bitter herbs known as natural insulin mimickers. Clinically evaluated to assist fasting and postprandial glucose metabolism.',
    keyIngredients: ['Gymnema Sylvestre (Gurmar 25%)', 'Jamun Seed Extract (20%)', 'Bitter Gourd (Karela 20%)', 'Vijaysar Wood Extract (15%)', 'Methi (Fenugreek 10%)', 'Shilajit Purified (10%)'],
    dosageInstructions: 'Mix 1 teaspoon (5g) in half a glass of warm water and consume 30 minutes before breakfast and dinner.',
    benefits: ['Curbs carbohydrate sugar cravings naturally', 'Supports optimal pancreatic insulin secretion', 'Combats daily fatigue and helps maintain consistent energy levels', 'Pure whole-herb blend with zero added maltodextrin or sugar'],
    rating: 4.8,
    reviewsCount: 153,
    featured: false,
    basePrice: 449,
    baseComparePrice: 599,
    defaultImageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
    galleryImages: [
      '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg'
    ],
    variations: [
      {
        id: 'var-dia-01',
        size: '200g Eco-Canister',
        price: 449,
        comparePrice: 599,
        stock: 42,
        imageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
        sku: 'SP-DIA-200'
      },
      {
        id: 'var-dia-02',
        size: '500g Value Pack',
        price: 849,
        comparePrice: 1199,
        stock: 25,
        imageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
        sku: 'SP-DIA-500'
      }
    ]
  },
  {
    id: 'sp-006',
    name: 'Saatvik Pro-Check Smart Digital Blood Pressure Monitor',
    slug: 'saatvik-pro-check-digital-bp-monitor',
    category: 'Health Devices',
    shortDescription: 'High-precision oscillometric upper arm BP monitor with dual-user memory, large backlit LCD & voice guide.',
    description: 'Approved by clinical cardiology standards, the Saatvik Pro-Check monitor provides rapid, painless blood pressure and pulse detection. Features automatic cuff wrap detection, irregular heartbeat indicator (IHB), and WHO risk classification color grading.',
    keyIngredients: ['Medical-Grade Oscillometric Sensor', 'Latex-Free Wide Range Cuff (22-42cm)', '4x AA Alkaline Batteries Included', 'Type-C USB Power Cable'],
    dosageInstructions: 'Rest seated quietly for 5 minutes. Wrap cuff around upper arm at heart level, press the One-Touch START button, and remain silent during reading.',
    benefits: ['Accuracy within ±3 mmHg blood pressure and ±5% pulse rate', 'Dual-User 2 x 120 memory records with date/time stamps', 'WHO cardiovascular risk color indicator on screen', '2-Year Saatvik Replacement Warranty included'],
    rating: 4.9,
    reviewsCount: 418,
    featured: true,
    basePrice: 1499,
    baseComparePrice: 2299,
    defaultImageUrl: '/src/assets/images/product_vitamin_omega3_1794289671639.jpg',
    galleryImages: [
      '/src/assets/images/product_vitamin_omega3_1794289671639.jpg'
    ],
    variations: [
      {
        id: 'var-dev-01',
        size: 'Standard Wide Cuff (22-42 cm)',
        price: 1499,
        comparePrice: 2299,
        stock: 35,
        imageUrl: '/src/assets/images/product_vitamin_omega3_1794289671639.jpg',
        sku: 'SP-DEV-STD'
      },
      {
        id: 'var-dev-02',
        size: 'Extra-Large Comfort Cuff (22-48 cm)',
        price: 1899,
        comparePrice: 2799,
        stock: 20,
        imageUrl: '/src/assets/images/product_vitamin_omega3_1794289671639.jpg',
        sku: 'SP-DEV-XL'
      }
    ]
  }
];

export const MOCK_ORDERS = [
  {
    id: 'ord-101',
    orderNumber: 'SP-882910',
    createdAt: '2026-11-08T14:32:00Z',
    customer: {
      fullName: 'Rahul Sharma',
      phone: '+91 98765 43210',
      email: 'rahul.sharma@example.com',
      addressLine: 'Flat 402, Green Park Residency, Sector 15',
      locality: 'Indirapuram',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pinCode: '201014'
    },
    items: [
      {
        cartItemId: 'c-101',
        productId: 'sp-001',
        productName: 'Saatvik Organic KSM-66 Ashwagandha Gold',
        imageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
        selectedVariation: {
          id: 'var-ash-02',
          size: '120 Veggie Capsules (Value Pack)',
          price: 999,
          stock: 28,
          imageUrl: '/src/assets/images/product_ashwagandha_gold_1794289670838.jpg',
          sku: 'SP-ASH-120'
        },
        quantity: 1,
        unitPrice: 999
      }
    ],
    subtotal: 999,
    discount: 100,
    shippingFee: 0,
    totalAmount: 899,
    paymentMethod: 'UPI' as const,
    paymentStatus: 'Paid' as const,
    orderStatus: 'Shipped' as const,
    trackingNumber: 'DTDC-IND-778291',
    estimatedDeliveryDate: '12 Nov 2026'
  },
  {
    id: 'ord-102',
    orderNumber: 'SP-882911',
    createdAt: '2026-11-09T09:15:00Z',
    customer: {
      fullName: 'Ananya Deshmukh',
      phone: '+91 99887 76655',
      email: 'ananya.d@example.com',
      addressLine: 'Bunglow 12, Prathamesh Hills, Baner Road',
      locality: 'Baner',
      city: 'Pune',
      state: 'Maharashtra',
      pinCode: '411045'
    },
    items: [
      {
        cartItemId: 'c-102',
        productId: 'sp-003',
        productName: 'Saatvik Kumkumadi Rejuvenating Ayurvedic Miracle Tailam',
        imageUrl: '/src/assets/images/product_ayurvedic_serum_1794289671969.jpg',
        selectedVariation: {
          id: 'var-kum-01',
          size: '15ml Glass Dropper',
          price: 899,
          stock: 50,
          imageUrl: '/src/assets/images/product_ayurvedic_serum_1794289671969.jpg',
          sku: 'SP-KUM-15'
        },
        quantity: 2,
        unitPrice: 899
      }
    ],
    subtotal: 1798,
    discount: 180,
    shippingFee: 0,
    totalAmount: 1618,
    paymentMethod: 'COD' as const,
    paymentStatus: 'Pending' as const,
    orderStatus: 'Confirmed' as const,
    trackingNumber: 'DELHIVERY-PN-4902',
    estimatedDeliveryDate: '13 Nov 2026'
  }
];
