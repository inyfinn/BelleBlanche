import React, { useCallback } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import type { MainView, ViewState } from './types';

// Import Components
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import SideMenu from './components/SideMenu';
import VideoPlayerModal from './components/VideoPlayerModal';


// Import Views
import HomeView from './views/HomeView';
import ProductListView from './views/ProductListView';
import ProductDetailsView from './views/ProductDetailsView';
import WishlistView from './views/WishlistView';
import CartView from './views/CartView';
import ProfileView from './views/ProfileView';
import SearchView from './views/SearchView';
import LiveView from './views/LiveView';
import CheckoutView from './views/CheckoutView';
import OrderHistoryView from './views/OrderHistoryView';
import AddressManagementView from './views/AddressManagementView';
import PaymentMethodsView from './views/PaymentMethodsView';
import HelpCenterView from './views/HelpCenterView';


const isMainView = (view: ViewState['view']): view is MainView => {
    return ['home', 'search', 'wishlist', 'live', 'profile'].includes(view);
};

const AppContent: React.FC = () => {
    const { currentViewState, goBack, navigateTo, isMenuOpen } = useAppContext();

    const setCurrentView = useCallback((view: MainView) => {
        // Prevent navigating to the same main view from a sub-view, instead go to root
        if (currentViewState.view !== view && history.length > 1) {
            navigateTo({ view });
        } else if (currentViewState.view !== view) {
             navigateTo({ view });
        }
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
            case 'checkout':
                return <CheckoutView />;
            case 'orderHistory':
                return <OrderHistoryView />;
            case 'addressManagement':
                return <AddressManagementView />;
            case 'paymentMethods':
                return <PaymentMethodsView />;
            case 'helpCenter':
                return <HelpCenterView />;
            default:
                return <HomeView navigateTo={navigateTo} />;
        }
    };
    
    // Determine the active main view for the bottom nav highlight
    let activeMainView: MainView | undefined;
    if (isMainView(currentViewState.view)) {
        activeMainView = currentViewState.view;
    }


    return (
        <div className="bg-light min-h-screen font-sans pb-24">
            <Header viewState={currentViewState} goBack={goBack} />
            <SideMenu isOpen={isMenuOpen} />
            <VideoPlayerModal />
            <main>
                {renderView()}
            </main>
            <BottomNav 
                currentView={activeMainView}
                setCurrentView={setCurrentView}
            />
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