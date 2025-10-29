import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product, CartItem, ViewState } from '../types';
import Toast from '../components/Toast';

// Define the shape of the context
interface AppContextType {
  // Navigation
  history: ViewState[];
  currentViewState: ViewState;
  navigateTo: (viewState: ViewState) => void;
  goBack: () => void;
  
  // Wishlist
  wishlist: Product[];
  wishlistCount: number;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  
  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: Product, quantity: number, selectedAttributes?: Record<string, string>) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQuantity: number) => void;
  
  // Toast notifications
  showToast: (message: string) => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper to generate a unique ID for a cart item based on product and attributes
const getCartItemId = (productId: number, attributes?: Record<string, string>): string => {
  if (!attributes || Object.keys(attributes).length === 0) {
    return String(productId);
  }
  const attributeString = Object.keys(attributes).sort().map(key => `${key}:${attributes[key]}`).join('-');
  return `${productId}-${attributeString}`;
};


// Create the Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE MANAGEMENT ---

  // Navigation State
  const [history, setHistory] = useState<ViewState[]>([{ view: 'home' }]);
  const currentViewState = history[history.length - 1];

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>([]);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);

  // Toast State
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });

  // --- DERIVED STATE ---

  const wishlistCount = wishlist.length;
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

  // --- EFFECTS ---

  // Load state from localStorage on initial render
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('belle-wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
      
      const storedCart = localStorage.getItem('belle-cart');
      if (storedCart) setCart(JSON.parse(storedCart));
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('belle-wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to localStorage", error);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('belle-cart', JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);

  // --- ACTIONS ---

  const showToast = (message: string) => {
    setToast({ message, show: true });
  };

  const navigateTo = useCallback((viewState: ViewState) => {
    setHistory(prev => [...prev, viewState]);
    window.scrollTo(0, 0);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history.length]);
  
  const toggleWishlist = useCallback((product: Product) => {
    setWishlist(prev => {
      const isOnWishlist = prev.some(item => item.id === product.id);
      if (isOnWishlist) {
        showToast(`${product.name} usunięto z listy życzeń`);
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast(`${product.name} dodano do listy życzeń`);
        return [...prev, product];
      }
    });
  }, []);

  const isInWishlist = useCallback((productId: number) => {
    return wishlist.some(item => item.id === productId);
  }, [wishlist]);
  
  const addToCart = useCallback((product: Product, quantity: number, selectedAttributes?: Record<string, string>) => {
    const cartItemId = getCartItemId(product.id, selectedAttributes);
    setCart(prev => {
      const existingItem = prev.find(item => getCartItemId(item.id, item.selectedAttributes) === cartItemId);
      if (existingItem) {
        return prev.map(item => 
          getCartItemId(item.id, item.selectedAttributes) === cartItemId
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { ...product, quantity, selectedAttributes }];
    });
    showToast(`${product.name} dodano do koszyka`);
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart(prev => prev.filter(item => getCartItemId(item.id, item.selectedAttributes) !== cartItemId));
    showToast('Produkt usunięto z koszyka');
  }, []);

  const updateQuantity = useCallback((cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        getCartItemId(item.id, item.selectedAttributes) === cartItemId
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  }, [removeFromCart]);

  // --- CONTEXT VALUE ---
  
  const value: AppContextType = {
    history,
    currentViewState,
    navigateTo,
    goBack,
    wishlist,
    wishlistCount,
    toggleWishlist,
    isInWishlist,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    showToast
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <Toast 
        message={toast.message} 
        show={toast.show} 
        onClose={() => setToast(prev => ({ ...prev, show: false }))} 
      />
    </AppContext.Provider>
  );
};

// Create a hook for easy consumption
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
