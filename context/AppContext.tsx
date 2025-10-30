import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Product, CartItem, ViewState, UserProfile, Order, Address, PaymentMethod } from '../types';
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

  // User Profile & Data
  userProfile: UserProfile;
  updateUserProfile: (profile: UserProfile) => void;
  orders: Order[];
  addresses: Address[];
  addOrUpdateAddress: (address: Omit<Address, 'id' | 'isDefault'> & { id?: string }) => void;
  deleteAddress: (addressId: string) => void;
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, 'id' | 'isDefault'>) => void;
  deletePaymentMethod: (methodId: string) => void;


  // Side Menu
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;

  // Video Player
  videoModalUrl: string | null;
  openVideoPlayer: (url: string) => void;
  closeVideoPlayer: () => void;
}

// Create the context
const AppContext = createContext<AppContextType | undefined>(undefined);

const getCartItemId = (productId: number, attributes?: Record<string, string>): string => {
  if (!attributes || Object.keys(attributes).length === 0) return String(productId);
  const attributeString = Object.keys(attributes).sort().map(key => `${key}:${attributes[key]}`).join('-');
  return `${productId}-${attributeString}`;
};

// MOCK DATA for new features
const MOCK_ORDERS: Order[] = [
    { id: 'BB-1002', date: '2024-05-15', status: 'Dostarczone', total: 480.00, items: [{ name: 'Elegancka Sukienka Lilia', quantity: 1 }] },
    { id: 'BB-1001', date: '2024-04-20', status: 'Dostarczone', total: 250.00, items: [{ name: 'Beżowy Trencz Klasyczny', quantity: 1 }] },
];
const MOCK_ADDRESSES: Address[] = [
    { id: 'addr-1', name: 'Dom', street: 'Kwiatowa 12/3', city: 'Częstochowa', postalCode: '42-200', country: 'Polska', isDefault: true }
];
const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'pm-1', cardType: 'Visa', last4: '1234', expiryDate: '12/26', isDefault: true }
];


// Create the Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- STATE MANAGEMENT ---
  const [history, setHistory] = useState<ViewState[]>([{ view: 'home' }]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: 'Klaudia Woźniak', email: 'klaudia.wozniak@example.com', favoriteColor: [] });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [videoModalUrl, setVideoModalUrl] = useState<string | null>(null);
  
  // New profile-related states
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(MOCK_PAYMENT_METHODS);


  // --- DERIVED STATE ---
  const currentViewState = history[history.length - 1];
  const wishlistCount = wishlist.length;
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);

  // --- EFFECTS ---
  useEffect(() => {
    try {
      const storedData = {
          wishlist: localStorage.getItem('belle-wishlist'),
          cart: localStorage.getItem('belle-cart'),
          profile: localStorage.getItem('belle-profile'),
          addresses: localStorage.getItem('belle-addresses'),
          paymentMethods: localStorage.getItem('belle-paymentMethods'),
      };
      if (storedData.wishlist) setWishlist(JSON.parse(storedData.wishlist));
      if (storedData.cart) setCart(JSON.parse(storedData.cart));
      if (storedData.profile) setUserProfile(JSON.parse(storedData.profile));
      if (storedData.addresses) setAddresses(JSON.parse(storedData.addresses));
      if (storedData.paymentMethods) setPaymentMethods(JSON.parse(storedData.paymentMethods));
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);

  const saveDataToStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key} to localStorage`, error);
    }
  }, []);
  
  useEffect(() => { saveDataToStorage('belle-wishlist', wishlist); }, [wishlist, saveDataToStorage]);
  useEffect(() => { saveDataToStorage('belle-cart', cart); }, [cart, saveDataToStorage]);
  useEffect(() => { saveDataToStorage('belle-profile', userProfile); }, [userProfile, saveDataToStorage]);
  useEffect(() => { saveDataToStorage('belle-addresses', addresses); }, [addresses, saveDataToStorage]);
  useEffect(() => { saveDataToStorage('belle-paymentMethods', paymentMethods); }, [paymentMethods, saveDataToStorage]);


  // --- ACTIONS ---
  const showToast = (message: string) => setToast({ message, show: true });
  const navigateTo = useCallback((viewState: ViewState) => { setHistory(prev => [...prev, viewState]); window.scrollTo(0, 0); }, []);
  const goBack = useCallback(() => { if (history.length > 1) { setHistory(prev => prev.slice(0, -1)); } }, [history.length]);
  const toggleWishlist = useCallback((product: Product) => { setWishlist(prev => { const isOn = prev.some(p => p.id === product.id); showToast(isOn ? `${product.name} usunięto z listy życzeń` : `${product.name} dodano do listy życzeń`); return isOn ? prev.filter(p => p.id !== product.id) : [...prev, product]; }); }, []);
  const isInWishlist = useCallback((productId: number) => wishlist.some(p => p.id === productId), [wishlist]);
  const addToCart = useCallback((product: Product, quantity: number, selectedAttributes?: Record<string, string>) => { const id = getCartItemId(product.id, selectedAttributes); setCart(prev => { const existing = prev.find(i => getCartItemId(i.id, i.selectedAttributes) === id); return existing ? prev.map(i => getCartItemId(i.id, i.selectedAttributes) === id ? { ...i, quantity: i.quantity + quantity } : i) : [...prev, { ...product, quantity, selectedAttributes }]; }); showToast(`${product.name} dodano do koszyka`); }, []);
  const removeFromCart = useCallback((cartItemId: string) => { setCart(prev => prev.filter(i => getCartItemId(i.id, i.selectedAttributes) !== cartItemId)); showToast('Produkt usunięto z koszyka'); }, []);
  const updateQuantity = useCallback((cartItemId: string, newQuantity: number) => { if (newQuantity < 1) { removeFromCart(cartItemId); return; } setCart(prev => prev.map(i => getCartItemId(i.id, i.selectedAttributes) === cartItemId ? { ...i, quantity: newQuantity } : i)); }, [removeFromCart]);
  const updateUserProfile = useCallback((profile: UserProfile) => { setUserProfile(profile); showToast("Profil został zaktualizowany!"); }, []);
  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const openVideoPlayer = useCallback((url: string) => setVideoModalUrl(url), []);
  const closeVideoPlayer = useCallback(() => setVideoModalUrl(null), []);

  // New profile data actions
  const addOrUpdateAddress = useCallback((address: Omit<Address, 'id' | 'isDefault'> & { id?: string }) => { setAddresses(prev => { const existing = prev.find(a => a.id === address.id); if (existing) { return prev.map(a => a.id === address.id ? { ...existing, ...address } : a); } else { const newAddress: Address = { ...address, id: `addr-${Date.now()}`, isDefault: prev.length === 0 }; return [...prev, newAddress]; } }); showToast(address.id ? 'Adres zaktualizowany' : 'Adres dodany'); }, []);
  const deleteAddress = useCallback((addressId: string) => { setAddresses(prev => prev.filter(a => a.id !== addressId)); showToast('Adres usunięty'); }, []);
  const addPaymentMethod = useCallback((method: Omit<PaymentMethod, 'id' | 'isDefault'>) => { setPaymentMethods(prev => { const newMethod: PaymentMethod = { ...method, id: `pm-${Date.now()}`, isDefault: prev.length === 0 }; return [...prev, newMethod]; }); showToast('Metoda płatności dodana'); }, []);
  const deletePaymentMethod = useCallback((methodId: string) => { setPaymentMethods(prev => prev.filter(pm => pm.id !== methodId)); showToast('Metoda płatności usunięta'); }, []);
  

  const value: AppContextType = {
    history, currentViewState, navigateTo, goBack,
    wishlist, wishlistCount, toggleWishlist, isInWishlist,
    cart, cartCount, cartTotal, addToCart, removeFromCart, updateQuantity,
    showToast, userProfile, updateUserProfile, orders, addresses, addOrUpdateAddress, deleteAddress, paymentMethods, addPaymentMethod, deletePaymentMethod,
    isMenuOpen, openMenu, closeMenu, videoModalUrl, openVideoPlayer, closeVideoPlayer,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
      <Toast message={toast.message} show={toast.show} onClose={() => setToast(prev => ({ ...prev, show: false }))} />
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};