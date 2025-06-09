import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem, User, RewardActivity, AnalyticsEvent } from '../types';
import { mockProducts } from '../data/mockData';

interface Store {
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Products
  products: Product[];
  selectedCategory: string;
  searchQuery: string;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  getFilteredProducts: () => Product[];

  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;

  // User & Authentication
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  updateShopCoins: (amount: number, activity: string) => void;

  // Rewards
  rewardActivities: RewardActivity[];
  addRewardActivity: (activity: RewardActivity) => void;
  getCoinsToNextTier: () => number;

  // AR/VR
  arMode: boolean;
  vrMode: boolean;
  setARMode: (enabled: boolean) => void;
  setVRMode: (enabled: boolean) => void;

  // Analytics
  analyticsData: AnalyticsEvent[];
  addAnalyticsEvent: (type: string, data: any) => void;
  getAnalyticsStats: () => {
    totalInteractions: number;
    arViews: number;
    vrViews: number;
    customizations: number;
    cartAdditions: number;
  };
}

// Safe storage implementation for mobile
const createSafeStorage = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return createJSONStorage(() => localStorage);
    }
  } catch (error) {
    console.warn('localStorage not available, using memory storage');
  }
  
  // Fallback to memory storage
  let memoryStorage: Record<string, string> = {};
  return createJSONStorage(() => ({
    getItem: (key: string) => memoryStorage[key] || null,
    setItem: (key: string, value: string) => {
      memoryStorage[key] = value;
    },
    removeItem: (key: string) => {
      delete memoryStorage[key];
    },
  }));
};

// Default user for demo purposes
const defaultUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  shopCoins: 1250,
  tier: 'Gold',
  totalSpent: 45000,
  orders: []
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Products
      products: mockProducts,
      selectedCategory: 'all',
      searchQuery: '',
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      getFilteredProducts: () => {
        const state = get();
        if (!state) return [];
        
        const { products, selectedCategory, searchQuery } = state;
        return products.filter((product) => {
          const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
          const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               product.brand.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCategory && matchesSearch;
        });
      },

      // Cart
      cartItems: [],
      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.cartItems.find(item => item.product.id === product.id);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              )
            };
          }
          return {
            cartItems: [...state.cartItems, { product, quantity }]
          };
        });
      },
      removeFromCart: (productId) => {
        set((state) => ({
          cartItems: state.cartItems.filter(item => item.product.id !== productId)
        }));
      },
      updateQuantity: (productId, quantity) => {
        set((state) => ({
          cartItems: state.cartItems.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        }));
      },
      clearCart: () => set({ cartItems: [] }),
      getCartTotal: () => {
        const state = get();
        if (!state) return 0;
        
        const { cartItems } = state;
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      },
      getCartItemsCount: () => {
        const state = get();
        if (!state) return 0;
        
        const { cartItems } = state;
        return cartItems.reduce((count, item) => count + item.quantity, 0);
      },

      // User & Authentication
      user: defaultUser,
      isAuthenticated: true,
      login: (email, password) => {
        // Mock login
        set({
          isAuthenticated: true,
          user: {
            id: '1',
            name: 'John Doe',
            email,
            shopCoins: 1250,
            tier: 'Gold',
            totalSpent: 45000,
            orders: []
          }
        });
      },
      logout: () => set({ isAuthenticated: false, user: null }),
      updateShopCoins: (amount, activity) => {
        set((state) => {
          if (!state.user) return state;
          
          const newUser = {
            ...state.user,
            shopCoins: state.user.shopCoins + amount
          };

          // Add reward activity
          const newActivity: RewardActivity = {
            id: Date.now().toString(),
            type: amount > 0 ? 'earned' : 'redeemed',
            amount: Math.abs(amount),
            description: activity,
            date: new Date()
          };

          return {
            user: newUser,
            rewardActivities: [newActivity, ...state.rewardActivities].slice(0, 50) // Keep last 50 activities
          };
        });
      },

      // Rewards
      rewardActivities: [],
      addRewardActivity: (activity) => {
        set((state) => ({
          rewardActivities: [activity, ...state.rewardActivities].slice(0, 50)
        }));
      },
      getCoinsToNextTier: () => {
        const state = get();
        if (!state || !state.user) return 0;
        
        const { user } = state;
        const tierThresholds = {
          Bronze: 0,
          Silver: 1000,
          Gold: 2500,
          Platinum: 5000
        };

        const currentTierIndex = Object.keys(tierThresholds).indexOf(user.tier);
        const nextTier = Object.keys(tierThresholds)[currentTierIndex + 1];
        
        if (!nextTier) return 0;
        
        return tierThresholds[nextTier as keyof typeof tierThresholds] - user.shopCoins;
      },

      // AR/VR
      arMode: false,
      vrMode: false,
      setARMode: (enabled) => set({ arMode: enabled }),
      setVRMode: (enabled) => set({ vrMode: enabled }),

      // Analytics
      analyticsData: [],
      addAnalyticsEvent: (type, data) => {
        try {
          const event: AnalyticsEvent = {
            id: Date.now().toString(),
            type,
            data,
            timestamp: Date.now()
          };
          
          set((state) => ({
            analyticsData: [event, ...state.analyticsData].slice(0, 1000) // Keep last 1000 events
          }));
        } catch (error) {
          console.warn('Failed to add analytics event:', error);
        }
      },
      getAnalyticsStats: () => {
        const state = get();
        if (!state) return {
          totalInteractions: 0,
          arViews: 0,
          vrViews: 0,
          customizations: 0,
          cartAdditions: 0
        };
        
        const { analyticsData } = state;
        
        const arViews = analyticsData.filter(e => e.type.includes('ar')).length;
        const vrViews = analyticsData.filter(e => e.type.includes('vr')).length;
        const customizations = analyticsData.filter(e => e.type.includes('customization')).length;
        const cartAdditions = analyticsData.filter(e => e.type === 'add_to_cart').length;
        
        return {
          totalInteractions: analyticsData.length,
          arViews,
          vrViews,
          customizations,
          cartAdditions
        };
      },
    }),
    {
      name: 'walmart-store',
      storage: createSafeStorage(),
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        cartItems: state.cartItems,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        rewardActivities: state.rewardActivities,
        analyticsData: state.analyticsData,
      }),
      onRehydrateStorage: () => (state) => {
        // Ensure we have a valid state after rehydration
        if (!state) {
          console.warn('Failed to rehydrate store, using defaults');
          return;
        }
        
        // Ensure user exists
        if (!state.user && state.isAuthenticated) {
          state.user = defaultUser;
        }
        
        // Ensure arrays exist
        if (!state.rewardActivities) {
          state.rewardActivities = [];
        }
        
        if (!state.analyticsData) {
          state.analyticsData = [];
        }
        
        if (!state.cartItems) {
          state.cartItems = [];
        }
      },
      version: 1,
      migrate: (persistedState: any, version: number) => {
        // Handle migration if needed
        if (version === 0) {
          // Migration logic for version 0 to 1
          return {
            ...persistedState,
            analyticsData: persistedState.analyticsData || [],
            rewardActivities: persistedState.rewardActivities || [],
          };
        }
        return persistedState;
      },
    }
  )
);

// Export a hook that safely handles store access
export const useSafeStore = () => {
  try {
    return useStore();
  } catch (error) {
    console.error('Store access error:', error);
    // Return a minimal safe state
    return {
      isDarkMode: false,
      products: mockProducts,
      selectedCategory: 'all',
      searchQuery: '',
      cartItems: [],
      user: defaultUser,
      isAuthenticated: true,
      rewardActivities: [],
      analyticsData: [],
      arMode: false,
      vrMode: false,
      // Add safe default functions
      toggleDarkMode: () => {},
      setSelectedCategory: () => {},
      setSearchQuery: () => {},
      getFilteredProducts: () => mockProducts,
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      getCartTotal: () => 0,
      getCartItemsCount: () => 0,
      login: () => {},
      logout: () => {},
      updateShopCoins: () => {},
      addRewardActivity: () => {},
      getCoinsToNextTier: () => 0,
      setARMode: () => {},
      setVRMode: () => {},
      addAnalyticsEvent: () => {},
      getAnalyticsStats: () => ({
        totalInteractions: 0,
        arViews: 0,
        vrViews: 0,
        customizations: 0,
        cartAdditions: 0
      }),
    };
  }
};