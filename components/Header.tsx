import React from 'react';
import type { ViewState } from '../App';
import { ChevronLeftIcon, SearchIcon, BellIcon, FilterIcon } from './Icons';

interface HeaderProps {
    viewState: ViewState;
    goBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ viewState, goBack }) => {

    const getTitle = () => {
        switch(viewState.view) {
            case 'productDetails': return 'Szczegóły produktu';
            case 'wishlist': return 'Lista życzeń';
            case 'cart': return 'Koszyk';
            case 'profile': return 'Mój profil';
            case 'search': return 'Wyszukiwanie';
            case 'live': return 'Wydarzenia Live';
            default: return '';
        }
    }

    if (viewState.view !== 'home') {
        return (
            <header className="sticky top-0 bg-light/80 backdrop-blur-lg z-20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20 relative">
                        <button onClick={goBack} className="p-2 text-dark" aria-label="Wróć">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                        <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">{getTitle()}</h1>
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="sticky top-0 bg-light/80 backdrop-blur-lg z-20 pt-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="flex items-center justify-between h-16">
                    <div>
                        <label htmlFor="location" className="text-xs text-gray-500">Lokalizacja</label>
                        <h2 className="font-bold text-dark">Warszawa, PL</h2>
                    </div>
                    <button className="p-2" aria-label="Powiadomienia">
                        <BellIcon className="w-7 h-7" />
                    </button>
                </div>
                <div className="flex items-center gap-3 mt-2">
                    <div className="relative flex-grow">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Czego szukasz?"
                            className="w-full pl-11 pr-4 py-3 bg-accent border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary"
                        />
                    </div>
                    <button className="p-3 bg-secondary text-white rounded-xl" aria-label="Filtry">
                        <FilterIcon className="w-6 h-6"/>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;