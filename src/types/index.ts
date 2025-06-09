export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  category: string;
  brand: string;
  description: string;
  features: string[];
  inStock: boolean;
  discount?: number;
  coinReward: number;
  hasAR: boolean;
  hasVR: boolean;
  model3D?: string;
  arType?: 'furniture' | 'electronics' | 'apparel';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  shopCoins: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
  orders: Order[];
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  coinsEarned: number;
  coinsUsed: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: Date;
}

export interface RewardActivity {
  id: string;
  type: 'earned' | 'redeemed';
  amount: number;
  description: string;
  date: Date;
}

export interface AnalyticsEvent {
  id: string;
  type: string;
  data: any;
  timestamp: number;
}