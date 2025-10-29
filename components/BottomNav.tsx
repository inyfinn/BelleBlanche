import React from 'react';
import type { MainView } from '../App';
import { HomeIcon, HeartIcon, SearchIcon, UserIcon, VideoCameraIcon } from './Icons';
import { useAppContext } from '../context/AppContext';

interface BottomNavProps {
    currentView: MainView;
    setCurrentView: (view: MainView) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setCurrentView }) => {
    const { wishlistCount } = useAppContext();

    const navItems = [
        { view: 'home', icon: HomeIcon, label: 'Główna' },
        { view: 'search', icon: SearchIcon, label: 'Szukaj' },
        { view: 'wishlist', icon: HeartIcon, label: 'Ulubione', count: wishlistCount },
        { view: 'live', icon: VideoCameraIcon, label: 'Live' },
        { view: 'profile', icon: UserIcon, label: 'Profil' },
    ] as const;

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-30 rounded-t-2xl">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-around h-20">
                    {navItems.map(item => {
                        const isActive = currentView === item.view;
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.view}
                                onClick={() => setCurrentView(item.view)}
                                className={`flex flex-col items-center justify-center w-full transition-colors duration-200 relative ${isActive ? 'text-secondary' : 'text-gray-400 hover:text-secondary'}`}
                                aria-label={item.label}
                            >
                                <div className="relative">
                                    <Icon className="w-7 h-7" />
                                    {'count' in item && item.count > 0 && (
                                        <span className="absolute -top-1 -right-2 block h-4 w-4 rounded-full text-xs font-medium text-white bg-secondary flex items-center justify-center">
                                            {item.count}
                                        </span>
                                    )}
                                </div>
                                <span className={`text-xs mt-1 font-semibold ${isActive ? 'text-secondary' : 'text-gray-400'}`}>{item.label}</span>
                                {isActive && <div className="absolute bottom-2 h-1 w-6 bg-secondary rounded-full"></div>}
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;