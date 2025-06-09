import { Product } from '../types';

export const mockProducts: Product[] = [
  // Electronics
  {
    id: '1',
    name: 'Samsung 65" 4K Smart TV',
    price: 89999,
    originalPrice: 99999,
    rating: 4.5,
    reviews: 234,
    image: 'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg',
    images: [
      'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg',
      'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg'
    ],
    category: 'Electronics',
    brand: 'Samsung',
    description: 'Experience stunning 4K picture quality with this Samsung Smart TV featuring HDR10+ and built-in streaming apps.',
    features: ['4K UHD Resolution', 'HDR10+ Support', 'Smart TV Platform', 'Voice Control'],
    inStock: true,
    discount: 10,
    coinReward: 900,
    hasAR: true,
    hasVR: true,
    model3D: 'https://threejs.org/examples/models/gltf/DamagedHelmet/DamagedHelmet.gltf',
    arType: 'electronics'
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    price: 134900,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    images: [
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
      'https://images.pexels.com/photos/1275229/pexels-photo-1275229.jpeg'
    ],
    category: 'Electronics',
    brand: 'Apple',
    description: 'The most powerful iPhone ever with titanium design, A17 Pro chip, and pro camera system.',
    features: ['A17 Pro Chip', 'Titanium Design', 'Pro Camera System', 'USB-C'],
    inStock: true,
    coinReward: 1349,
    hasAR: true,
    hasVR: false,
    model3D: 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
    arType: 'electronics'
  },

  // Furniture
  {
    id: '3',
    name: 'Modern L-Shaped Sofa',
    price: 75000,
    originalPrice: 85000,
    rating: 4.3,
    reviews: 89,
    image: 'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg',
    images: [
      'https://images.pexels.com/photos/1148955/pexels-photo-1148955.jpeg',
      'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg'
    ],
    category: 'Furniture',
    brand: 'HomeTrend',
    description: 'Comfortable L-shaped sofa perfect for modern living rooms. Made with high-quality fabric and sturdy frame.',
    features: ['L-Shaped Design', 'Premium Fabric', 'Sturdy Frame', 'Easy Assembly'],
    inStock: true,
    discount: 12,
    coinReward: 750,
    hasAR: true,
    hasVR: true,
    model3D: 'https://threejs.org/examples/models/gltf/Soldier.glb',
    arType: 'furniture'
  },
  {
    id: '4',
    name: 'Dining Table Set (6 Seater)',
    price: 45000,
    rating: 4.6,
    reviews: 67,
    image: 'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg',
    images: [
      'https://images.pexels.com/photos/1395964/pexels-photo-1395964.jpeg',
      'https://images.pexels.com/photos/1395966/pexels-photo-1395966.jpeg'
    ],
    category: 'Furniture',
    brand: 'WoodCraft',
    description: 'Elegant 6-seater dining table set made from solid wood with comfortable upholstered chairs.',
    features: ['Solid Wood Construction', 'Upholstered Chairs', '6 Seater Capacity', 'Scratch Resistant'],
    inStock: true,
    coinReward: 450,
    hasAR: true,
    hasVR: false,
    model3D: 'https://threejs.org/examples/models/gltf/DamagedHelmet/DamagedHelmet.gltf',
    arType: 'furniture'
  },

  // Apparel
  {
    id: '5',
    name: 'Designer Kurta Set',
    price: 2999,
    originalPrice: 3999,
    rating: 4.4,
    reviews: 123,
    image: 'https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg',
    images: [
      'https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg',
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg'
    ],
    category: 'Apparel',
    brand: 'EthnicWear',
    description: 'Traditional designer kurta set with intricate embroidery work. Perfect for festivals and special occasions.',
    features: ['Pure Cotton', 'Hand Embroidery', 'Comfortable Fit', 'Machine Washable'],
    inStock: true,
    discount: 25,
    coinReward: 30,
    hasAR: true,
    hasVR: true,
    model3D: 'https://threejs.org/examples/models/gltf/Soldier.glb',
    arType: 'apparel'
  },
  {
    id: '6',
    name: 'Casual Denim Jacket',
    price: 1999,
    rating: 4.2,
    reviews: 78,
    image: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg',
    images: [
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg',
      'https://images.pexels.com/photos/1656685/pexels-photo-1656685.jpeg'
    ],
    category: 'Apparel',
    brand: 'DenimStyle',
    description: 'Classic denim jacket with a modern fit. Perfect for casual outings and layering.',
    features: ['100% Cotton Denim', 'Classic Fit', 'Multiple Pockets', 'Durable Construction'],
    inStock: true,
    coinReward: 20,
    hasAR: true,
    hasVR: false,
    model3D: 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
    arType: 'apparel'
  },

  // Beauty
  {
    id: '7',
    name: 'Luxury Skincare Set',
    price: 4999,
    originalPrice: 6999,
    rating: 4.7,
    reviews: 234,
    image: 'https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg',
    images: [
      'https://images.pexels.com/photos/3018845/pexels-photo-3018845.jpeg',
      'https://images.pexels.com/photos/3018848/pexels-photo-3018848.jpeg'
    ],
    category: 'Beauty',
    brand: 'GlowUp',
    description: 'Complete luxury skincare routine with cleanser, serum, moisturizer, and sunscreen.',
    features: ['All Skin Types', 'Paraben Free', 'Dermatologically Tested', 'Anti-Aging Formula'],
    inStock: true,
    discount: 29,
    coinReward: 50,
    hasAR: false,
    hasVR: false
  },

  // Grocery
  {
    id: '8',
    name: 'Organic Grocery Combo',
    price: 1299,
    rating: 4.5,
    reviews: 156,
    image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
    images: [
      'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
      'https://images.pexels.com/photos/1300973/pexels-photo-1300973.jpeg'
    ],
    category: 'Grocery',
    brand: 'OrganicFresh',
    description: 'Fresh organic grocery combo including rice, pulses, oil, and spices for a healthy lifestyle.',
    features: ['100% Organic', 'Pesticide Free', 'Fresh Packaging', 'Nutritious'],
    inStock: true,
    coinReward: 13,
    hasAR: false,
    hasVR: false
  },

  // Additional AR/VR Products
  {
    id: '9',
    name: 'Gaming Chair Pro',
    price: 25000,
    originalPrice: 30000,
    rating: 4.6,
    reviews: 89,
    image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg',
    images: [
      'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg'
    ],
    category: 'Furniture',
    brand: 'GameZone',
    description: 'Professional gaming chair with ergonomic design and RGB lighting.',
    features: ['Ergonomic Design', 'RGB Lighting', 'Adjustable Height', 'Premium Materials'],
    inStock: true,
    discount: 17,
    coinReward: 250,
    hasAR: true,
    hasVR: true,
    model3D: 'https://threejs.org/examples/models/gltf/DamagedHelmet/DamagedHelmet.gltf',
    arType: 'furniture'
  },
  {
    id: '10',
    name: 'Wireless Headphones',
    price: 15999,
    originalPrice: 19999,
    rating: 4.4,
    reviews: 156,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    images: [
      'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'
    ],
    category: 'Electronics',
    brand: 'AudioTech',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.',
    features: ['Noise Cancellation', '30-Hour Battery', 'Wireless Charging', 'Premium Sound'],
    inStock: true,
    discount: 20,
    coinReward: 160,
    hasAR: true,
    hasVR: false,
    model3D: 'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
    arType: 'electronics'
  }
];

export const categories = [
  { id: 'all', name: 'All Categories', icon: '🛍️' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'furniture', name: 'Furniture', icon: '🛋️' },
  { id: 'apparel', name: 'Apparel', icon: '👕' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'grocery', name: 'Grocery', icon: '🥬' }
];