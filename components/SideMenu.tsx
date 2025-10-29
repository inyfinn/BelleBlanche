import React from 'react';
import { useAppContext } from '../context/AppContext';
import { XMarkIcon, UserIcon, MapPinIcon, CreditCardIcon, QuestionMarkCircleIcon, ArrowLeftStartOnRectangleIcon, ShoppingBagIcon } from './Icons';
import type { ViewState } from '../types';

interface SideMenuProps {
  isOpen: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen }) => {
  const { closeMenu, navigateTo, userProfile } = useAppContext();

  const handleNavigation = (view: ViewState) => {
      navigateTo(view);
      closeMenu();
  };
  
  const menuItems = [
      { label: "Mój profil", icon: <UserIcon className="w-6 h-6 text-primary"/>, action: () => handleNavigation({ view: 'profile' }) },
      { label: "Moje zamówienia", icon: <ShoppingBagIcon className="w-6 h-6 text-primary"/>, action: () => handleNavigation({ view: 'orderHistory' }) },
      { label: "Adresy dostawy", icon: <MapPinIcon className="w-6 h-6 text-primary"/>, action: () => handleNavigation({ view: 'addressManagement' }) },
      { label: "Metody płatności", icon: <CreditCardIcon className="w-6 h-6 text-primary"/>, action: () => handleNavigation({ view: 'paymentMethods' }) },
      { label: "Pomoc", icon: <QuestionMarkCircleIcon className="w-6 h-6 text-primary"/>, action: () => handleNavigation({ view: 'helpCenter' }) },
      { label: "Wyloguj", icon: <ArrowLeftStartOnRectangleIcon className="w-6 h-6 text-red-500"/>, isDestructive: true, action: () => {} },
  ];

  return (
    <>
      <div 
        onClick={closeMenu}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-sm bg-light z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <p className="font-bold text-dark">{userProfile.name}</p>
                    <p className="text-xs text-gray-500">{userProfile.email}</p>
                </div>
            </div>
            <button onClick={closeMenu} className="p-2 text-dark" aria-label="Zamknij menu">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-grow p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button 
                    onClick={item.action}
                    className="w-full flex items-center gap-4 p-3 text-left rounded-lg hover:bg-accent transition-colors"
                  >
                    {item.icon}
                    <span className={`font-semibold ${item.isDestructive ? 'text-red-500' : 'text-dark'}`}>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default SideMenu;