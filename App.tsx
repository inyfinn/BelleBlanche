import React, { useCallback } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import type { MainView, ViewState } from './types';

// Import Components
import Header from './components/Header';
import BottomNav from './components/BottomNav';

// Import Views
import HomeView from './views/HomeView';
import ProductListView from './views/ProductListView';
import ProductDetailsView from './views/ProductDetailsView';
import WishlistView from './views/WishlistView';
import CartView from './views/CartView';
import ProfileView from './views/ProfileView';
import SearchView from './views/SearchView';
import LiveView from './views/LiveView';

const isMainView = (view: ViewState['view']): view is MainView => {
    return ['home', 'search', 'wishlist', 'live', 'profile'].includes(view);
};

const AppContent: React.FC = () => {
    const { currentViewState, goBack, navigateTo } = useAppContext();

    const setCurrentView = useCallback((view: MainView) => {
        if (currentViewState.view === view) return;
        navigateTo({ view });
    }, [currentViewState.view, navigateTo]);
    
    const renderView = () => {
        switch (currentViewState.view) {
            case 'home':
                return <HomeView navigateTo={navigateTo} />;
            case 'productList':
                return <ProductListView title={currentViewState.title} categorySlug={currentViewState.categorySlug} navigateTo={navigateTo} />;
            case 'productDetails':
                return <ProductDetailsView productId={currentViewState.productId} />;
            case 'wishlist':
                return <WishlistView navigateTo={navigateTo} />;
            case 'cart':
                return <CartView />;
            case 'profile':
                return <ProfileView />;
            case 'search':
                return <SearchView />;
            case 'live':
                return <LiveView />;
            default:
                // Type safety: should not happen if all views are handled.
                return <HomeView navigateTo={navigateTo} />;
        }
    };

    const showBottomNav = isMainView(currentViewState.view);

    return (
        <div className="bg-light min-h-screen font-sans pb-24">
            <Header viewState={currentViewState} goBack={goBack} />
            <main>
                {renderView()}
            </main>
            {showBottomNav && (
                 <BottomNav 
                    currentView={currentViewState.view as MainView}
                    setCurrentView={setCurrentView}
                 />
            )}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;
