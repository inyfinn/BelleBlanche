import React, { useState, useCallback } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import HomeView from './views/HomeView';
import CartView from './views/CartView';
import WishlistView from './views/WishlistView';
import ProfileView from './views/ProfileView';
import ProductDetailsView from './views/ProductDetailsView';
import SearchView from './views/SearchView';
import LiveView from './views/LiveView';

export type MainView = 'home' | 'search' | 'wishlist' | 'live' | 'profile' | 'cart';
export type ViewState = { view: MainView } | { view: 'productDetails'; productId: number };

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>({ view: 'home' });

  const navigateTo = useCallback((newViewState: ViewState) => {
    setViewState(newViewState);
  }, []);
  
  const goBack = useCallback(() => {
    // Simple back logic, for a real app, a navigation stack would be better
    if (viewState.view === 'productDetails') {
      navigateTo({ view: 'home' });
    }
  }, [viewState, navigateTo]);

  const renderView = () => {
    switch (viewState.view) {
      case 'home':
        return <HomeView navigateTo={navigateTo} />;
      case 'productDetails':
        return <ProductDetailsView productId={viewState.productId} navigateTo={navigateTo} />;
      case 'cart':
        return <CartView />;
      case 'wishlist':
        return <WishlistView navigateTo={navigateTo} />;
      case 'profile':
        return <ProfileView />;
      case 'search':
        return <SearchView />;
      case 'live':
        return <LiveView />;
      default:
        return <HomeView navigateTo={navigateTo} />;
    }
  };

  const currentMainView = viewState.view === 'productDetails' ? 'home' : viewState.view;

  return (
    <AppProvider navigateTo={navigateTo}>
      <div className="flex flex-col min-h-screen bg-light font-sans text-dark">
        <Header viewState={viewState} goBack={goBack} />
        <main className="flex-grow pb-24">
          {renderView()}
        </main>
        <BottomNav currentView={currentMainView} setCurrentView={(view) => navigateTo({ view })} />
      </div>
    </AppProvider>
  );
};

export default App;