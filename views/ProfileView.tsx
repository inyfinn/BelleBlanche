import React from 'react';
import { ChevronLeftIcon } from '../components/Icons'; // Assuming chevron right is needed

const ProfileView: React.FC = () => {

  const menuItems = [
    { label: 'Moje zamówienia' },
    { label: 'Ulubione adresy' },
    { label: 'Metody płatności' },
    { label: 'Notyfikacje' },
    { label: 'Obserwuj nas' },
    { label: 'FAQ / Zwroty' },
    { label: 'Ustawienia' },
    { label: 'Wyloguj się' },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-4 mb-8">
        <img 
            src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="User Avatar"
            className="w-20 h-20 rounded-full object-cover"
        />
        <div>
            <h2 className="text-xl font-bold">Anna Nowak</h2>
            <p className="text-sm text-gray-500">anna.nowak@example.com</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <ul className="divide-y divide-accent">
          {menuItems.map((item, index) => (
            <li key={index}>
              <a href="#" className="flex justify-between items-center py-4 text-dark font-semibold">
                <span>{item.label}</span>
                <ChevronLeftIcon className="w-5 h-5 text-gray-400 transform rotate-180" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProfileView;