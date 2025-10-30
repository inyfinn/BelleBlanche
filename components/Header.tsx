import React from 'react';
import type { ViewState } from '../types';
import { ChevronLeftIcon, SearchIcon, FilterIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
    viewState: ViewState;
    goBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ viewState, goBack }) => {
    const { navigateTo, openMenu } = useAppContext();

    const getTitle = () => {
        switch(viewState.view) {
            case 'productDetails': return 'Szczegóły produktu';
            case 'productList': return viewState.title;
            case 'wishlist': return 'Ulubione';
            case 'cart': return 'Koszyk';
            case 'profile': return 'Mój profil';
            case 'search': return 'Wyszukiwanie';
            case 'live': return 'Wydarzenia Live';
            case 'checkout': return 'Podsumowanie';
            case 'orderHistory': return 'Moje zamówienia';
            case 'addressManagement': return 'Adresy dostawy';
            case 'paymentMethods': return 'Metody płatności';
            case 'helpCenter': return 'Centrum pomocy';
            case 'aboutUs': return 'O nas';
            case 'contact': return 'Kontakt';
            case 'terms': return 'Regulamin';
            case 'privacy': return 'Polityka Prywatności';
            case 'returns': return 'Zwroty i Reklamacje';
            default: return '';
        }
    }

    if (viewState.view === 'home') {
        return (
            <header className="sticky top-0 bg-light/80 backdrop-blur-lg z-20 pt-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div>
                            <label htmlFor="location" className="text-xs text-gray-500">Lokalizacja</label>
                            <h2 className="font-bold text-dark">Częstochowa, PL</h2>
                        </div>
                        <button onClick={openMenu} className="font-serif text-4xl font-bold text-primary p-2 -mr-2" aria-label="Otwórz menu">
                            B
                        </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="relative flex-grow" onClick={() => navigateTo({ view: 'search' })}>
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Czego szukasz?"
                                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                                readOnly
                            />
                        </div>
                        <button className="p-3 bg-primary text-white rounded-xl" aria-label="Filtry">
                            <FilterIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </header>
        );
    }
    
    // Header for all other views
    return (
        <header className="sticky top-0 bg-light/80 backdrop-blur-lg z-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <button onClick={goBack} className="p-2 -ml-2 text-dark" aria-label="Wróć">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <h1 className="text-lg font-bold text-dark ml-4">{getTitle()}</h1>
                    </div>
                    <button onClick={openMenu} className="font-serif text-4xl font-bold text-primary p-2 -mr-2" aria-label="Otwórz menu">
                        B
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;