import React, { useState, useEffect } from 'react';
import { ChevronRightIcon, UserIcon, ArrowLeftStartOnRectangleIcon, MapPinIcon, CreditCardIcon, QuestionMarkCircleIcon, ShoppingBagIcon } from '../components/Icons';
import { useAppContext } from '../context/AppContext';
import type { UserProfile, FavoriteColor, BodyType } from '../types';

const ProfileView: React.FC = () => {
    const { userProfile, updateUserProfile, showToast, navigateTo } = useAppContext();
    const [editableProfile, setEditableProfile] = useState<UserProfile>(userProfile);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        setEditableProfile(userProfile);
    }, [userProfile]);

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditableProfile(prev => ({ ...prev, [name]: value }));
    };

     const handleNumericProfileChange = (name: keyof UserProfile, value: string) => {
        const numericValue = value === '' ? undefined : Number(value);
        if (value === '' || (numericValue !== undefined && !isNaN(numericValue))) {
            setEditableProfile(prev => ({ ...prev, [name]: numericValue }));
        }
    };

    const handleBodyTypeChange = (value: BodyType) => {
        setEditableProfile(prev => ({ ...prev, bodyType: value }));
    };

    const handleColorChange = (color: FavoriteColor) => {
        setEditableProfile(prev => {
            const currentColors = prev.favoriteColor || [];
            const isSelected = currentColors.includes(color);

            if (isSelected) {
                return { ...prev, favoriteColor: currentColors.filter(c => c !== color) };
            } else {
                if (currentColors.length < 2) {
                    return { ...prev, favoriteColor: [...currentColors, color] };
                } else {
                    showToast("Możesz wybrać maksymalnie dwa kolory.");
                    return prev;
                }
            }
        });
    };

    const handleSave = () => {
        updateUserProfile(editableProfile);
        setIsEditing(false);
    };
    
    const favoriteColorOptions: FavoriteColor[] = ['Biały', 'Beżowy', 'Lekko szary', 'Ecru'];
    const bodyTypeOptions: BodyType[] = ['Szczupła', 'Atletyczna', 'Normalna', 'Troszkę większa', 'Dość duża', 'Bardzo duża'];

    const menuItems = [
        { label: "Moje zamówienia", icon: <ShoppingBagIcon className="w-6 h-6 text-primary"/>, action: () => navigateTo({ view: 'orderHistory'}) },
        { label: "Adresy dostawy", icon: <MapPinIcon className="w-6 h-6 text-primary"/>, action: () => navigateTo({ view: 'addressManagement'}) },
        { label: "Metody płatności", icon: <CreditCardIcon className="w-6 h-6 text-primary"/>, action: () => navigateTo({ view: 'paymentMethods'}) },
        { label: "Pomoc", icon: <QuestionMarkCircleIcon className="w-6 h-6 text-primary"/>, action: () => navigateTo({ view: 'helpCenter'}) },
    ];
    
    const infoItems = [
        { label: "O nas", action: () => navigateTo({ view: 'aboutUs' }) },
        { label: "Kontakt", action: () => navigateTo({ view: 'contact' }) },
        { label: "Regulamin", action: () => navigateTo({ view: 'terms' }) },
        { label: "Polityka prywatności", action: () => navigateTo({ view: 'privacy' }) },
        { label: "Zwroty i reklamacje", action: () => navigateTo({ view: 'returns' }) },
    ];

    const MeasurementInput: React.FC<{ label: string; name: keyof UserProfile; value?: number; onChange: (name: keyof UserProfile, value: string) => void; disabled: boolean; unit: string; }> = ({ label, name, value, onChange, disabled, unit }) => {
        const [inputValue, setInputValue] = useState(value === undefined ? '' : String(value));
        useEffect(() => { setInputValue(value === undefined ? '' : String(value)); }, [value]);
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInputValue(e.target.value); onChange(name, e.target.value); };
        return (
            <div>
                <label className="text-sm text-gray-500">{label}</label>
                <div className="relative mt-1">
                    <input type="text" inputMode="numeric" pattern="[0-9]*" name={name} value={inputValue} onChange={handleChange} placeholder="-" disabled={disabled} className="w-full p-3 bg-white text-dark placeholder-gray-400 rounded-lg border-2 border-accent focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:bg-gray-100 disabled:cursor-not-allowed" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{unit}</span>
                </div>
            </div>
        );
    };

    const ColorSelector: React.FC<{ disabled: boolean; }> = ({ disabled }) => (
        <div className="col-span-2">
            <h4 className="text-sm font-semibold text-dark mb-2">Ulubiony kolor (max. 2)</h4>
            <div className="flex flex-wrap gap-2">
                {favoriteColorOptions.map(option => {
                    const isSelected = editableProfile.favoriteColor?.includes(option);
                    return ( <button key={option} onClick={() => handleColorChange(option)} disabled={disabled} className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isSelected ? 'bg-primary text-white border-primary' : 'bg-white text-dark border-gray-200'}`} >{option}</button> );
                })}
            </div>
        </div>
    );

     const BodyTypeSelector: React.FC<{ disabled: boolean; }> = ({ disabled }) => (
        <div className="col-span-2">
            <h4 className="text-sm font-semibold text-dark mb-2">Typ sylwetki</h4>
            <div className="flex flex-wrap gap-2">
                {bodyTypeOptions.map(option => ( <button key={option} onClick={() => handleBodyTypeChange(option)} disabled={disabled} className={`px-3 py-1.5 text-sm rounded-lg border-2 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${editableProfile.bodyType === option ? 'bg-primary text-white border-primary' : 'bg-white text-dark border-gray-200'}`} >{option}</button> ))}
            </div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center mb-4"><UserIcon className="w-12 h-12 text-primary" /></div>
                {isEditing ? (
                    <div className="text-center w-full max-w-sm">
                        <input type="text" name="name" value={editableProfile.name} onChange={handleProfileChange} className="w-full text-center text-xl font-bold text-dark border-b-2 border-primary focus:outline-none bg-transparent"/>
                        <input type="email" name="email" value={editableProfile.email} onChange={handleProfileChange} className="w-full text-center text-dark/70 mt-1 border-b border-primary/50 focus:outline-none bg-transparent"/>
                    </div>
                ) : ( <> <h2 className="text-xl font-bold text-dark">{userProfile.name}</h2><p className="text-gray-500">{userProfile.email}</p> </> )}
                <button onClick={() => { if(isEditing) handleSave(); else setIsEditing(true); }} className="mt-2 text-sm font-semibold text-primary"> {isEditing ? 'Zapisz zmiany' : 'Edytuj profil'} </button>
            </div>
            
            <div className="mt-10"><h3 className="text-lg font-bold text-dark mb-2">Moje wymiary</h3><div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-2 gap-4"><MeasurementInput label="Wzrost" name="height" value={editableProfile.height} onChange={handleNumericProfileChange} disabled={!isEditing} unit="cm" /><MeasurementInput label="Biust" name="bust" value={editableProfile.bust} onChange={handleNumericProfileChange} disabled={!isEditing} unit="cm" /><MeasurementInput label="Talia" name="waist" value={editableProfile.waist} onChange={handleNumericProfileChange} disabled={!isEditing} unit="cm" /><MeasurementInput label="Biodra" name="hips" value={editableProfile.hips} onChange={handleNumericProfileChange} disabled={!isEditing} unit="cm" /></div></div>
            <div className="mt-8"><h3 className="text-lg font-bold text-dark mb-2">Wymiary Obuwia</h3><div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-2 gap-4"><MeasurementInput label="Rozmiar buta" name="shoeSize" value={editableProfile.shoeSize} onChange={handleNumericProfileChange} disabled={!isEditing} unit="EU" /><MeasurementInput label="Obwód łydki" name="calfCircumference" value={editableProfile.calfCircumference} onChange={handleNumericProfileChange} disabled={!isEditing} unit="cm" /></div></div>
            <div className="mt-8"><h3 className="text-lg font-bold text-dark mb-2">Preferencje Stylu</h3><div className="bg-white rounded-2xl shadow-sm p-4 grid grid-cols-1 gap-6"><ColorSelector disabled={!isEditing} /><BodyTypeSelector disabled={!isEditing} /></div></div>

            <div className="mt-8">
                <div className="bg-white rounded-2xl shadow-sm">
                    <ul className="divide-y divide-gray-100">
                        {menuItems.map((item, index) => ( <li key={index}><button onClick={item.action} className="w-full flex items-center justify-between p-4 text-left hover:bg-accent transition-colors"><div className="flex items-center gap-4"><div className="p-2 bg-accent rounded-lg">{item.icon}</div><span className="font-semibold text-dark">{item.label}</span></div><ChevronRightIcon className="w-5 h-5 text-gray-400" /></button></li> ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8">
                <div className="bg-white rounded-2xl shadow-sm">
                    <ul className="divide-y divide-gray-100">
                        {infoItems.map((item, index) => ( <li key={index}><button onClick={item.action} className="w-full flex items-center justify-between p-4 text-left hover:bg-accent transition-colors"><span className="font-semibold text-dark text-[11px]">{item.label}</span><ChevronRightIcon className="w-5 h-5 text-gray-400" /></button></li> ))}
                    </ul>
                </div>
            </div>

            <div className="mt-8">
                <button className="w-full flex items-center gap-4 p-4 text-left bg-white rounded-2xl shadow-sm hover:bg-accent transition-colors">
                    <div className="p-2 bg-red-100 rounded-lg"><ArrowLeftStartOnRectangleIcon className="w-6 h-6 text-red-500"/></div>
                    <span className="font-semibold text-red-500">Wyloguj</span>
                </button>
            </div>
            <div className="text-center mt-6 text-xs text-gray-400">
                <p>Belle Blanche Boutique</p>
                <p>ul. Jasnogórska 1, 42-200 Częstochowa</p>
                <p>kontakt@belleblanche.store</p>
            </div>
        </div>
    );
};

export default ProfileView;