import React, { useState } from 'react';
import { ChevronRightIcon, UserIcon, BellIcon, MapPinIcon, CreditCardIcon, QuestionMarkCircleIcon, ArrowLeftStartOnRectangleIcon } from '../components/Icons';

const ProfileView: React.FC = () => {
    const [user, setUser] = useState({ name: 'Anna Kowalska', email: 'anna.kowalska@example.com' });
    const [notifications, setNotifications] = useState({
        promotions: true,
        liveEvents: false,
        orders: true
    });
    const [isEditing, setIsEditing] = useState(false);

    const handleNotificationToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser(prev => ({...prev, [name]: value}));
    };

    const menuItems = [
        { label: "Moje zamówienia", icon: <UserIcon className="w-6 h-6 text-primary"/> },
        { label: "Adresy dostawy", icon: <MapPinIcon className="w-6 h-6 text-primary"/> },
        { label: "Metody płatności", icon: <CreditCardIcon className="w-6 h-6 text-primary"/> },
        { label: "Pomoc", icon: <QuestionMarkCircleIcon className="w-6 h-6 text-primary"/> },
        { label: "Wyloguj", icon: <ArrowLeftStartOnRectangleIcon className="w-6 h-6 text-red-500"/>, isDestructive: true },
    ];

    const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void; }> = ({ checked, onChange }) => (
        <button onClick={onChange} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? 'bg-primary' : 'bg-gray-200'}`}>
            <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-4">
                    <UserIcon className="w-12 h-12 text-primary" />
                </div>
                {isEditing ? (
                    <div className="text-center w-full max-w-sm">
                        <input type="text" name="name" value={user.name} onChange={handleUserChange} className="w-full text-center text-xl font-bold border-b-2 border-primary focus:outline-none bg-transparent"/>
                        <input type="email" name="email" value={user.email} onChange={handleUserChange} className="w-full text-center text-gray-500 mt-1 border-b border-primary/50 focus:outline-none bg-transparent"/>
                    </div>
                ) : (
                    <>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-gray-500">{user.email}</p>
                    </>
                )}
                <button onClick={() => setIsEditing(!isEditing)} className="mt-2 text-sm font-semibold text-primary">
                    {isEditing ? 'Zapisz zmiany' : 'Edytuj profil'}
                </button>
            </div>

            <div className="mt-10">
                <h3 className="text-lg font-bold text-dark mb-2">Powiadomienia</h3>
                <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-dark">Promocje i nowości</span>
                        <ToggleSwitch checked={notifications.promotions} onChange={() => handleNotificationToggle('promotions')} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-dark">Wydarzenia Live</span>
                        <ToggleSwitch checked={notifications.liveEvents} onChange={() => handleNotificationToggle('liveEvents')} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-semibold text-dark">Status zamówień</span>
                        <ToggleSwitch checked={notifications.orders} onChange={() => handleNotificationToggle('orders')} />
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-lg font-bold text-dark mb-2">Zarządzanie kontem</h3>
                <div className="bg-white rounded-2xl shadow-sm">
                    <ul className="divide-y divide-gray-100">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <button className="w-full flex items-center justify-between p-4 text-left hover:bg-accent transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-accent rounded-lg">
                                            {item.icon}
                                        </div>
                                        <span className={`font-semibold ${item.isDestructive ? 'text-red-500' : 'text-dark'}`}>{item.label}</span>
                                    </div>
                                    {!item.isDestructive && <ChevronRightIcon className="w-5 h-5 text-gray-400" />}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProfileView;
