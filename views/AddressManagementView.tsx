import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Address } from '../types';
import { XMarkIcon, PlusIcon } from '../components/Icons';

const AddressForm: React.FC<{
    address?: Omit<Address, 'id' | 'isDefault'> & { id?: string };
    onSave: (address: Omit<Address, 'id' | 'isDefault'> & { id?: string }) => void;
    onCancel: () => void;
}> = ({ address: initialAddress, onSave, onCancel }) => {
    const [address, setAddress] = useState(initialAddress || { name: '', street: '', city: '', postalCode: '', country: 'Polska' });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(address);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-accent/50 p-4 rounded-xl space-y-3">
            <input name="name" value={address.name} onChange={handleChange} placeholder="Nazwa (np. Dom, Praca)" className="w-full p-2 rounded-lg" required />
            <input name="street" value={address.street} onChange={handleChange} placeholder="Ulica i numer" className="w-full p-2 rounded-lg" required />
            <input name="city" value={address.city} onChange={handleChange} placeholder="Miasto" className="w-full p-2 rounded-lg" required />
            <input name="postalCode" value={address.postalCode} onChange={handleChange} placeholder="Kod pocztowy" className="w-full p-2 rounded-lg" required />
            <div className="flex gap-2">
                <button type="submit" className="flex-grow bg-primary text-white py-2 rounded-lg font-semibold">Zapisz</button>
                <button type="button" onClick={onCancel} className="flex-grow bg-gray-200 py-2 rounded-lg font-semibold">Anuluj</button>
            </div>
        </form>
    );
};

const AddressManagementView: React.FC = () => {
    const { addresses, addOrUpdateAddress, deleteAddress } = useAppContext();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | undefined>(undefined);

    const handleSave = (address: Omit<Address, 'id' | 'isDefault'> & { id?: string }) => {
        addOrUpdateAddress(address);
        setIsFormVisible(false);
        setEditingAddress(undefined);
    };
    
    const handleEdit = (address: Address) => {
        setEditingAddress(address);
        setIsFormVisible(true);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-4">
                {addresses.map(address => (
                    <div key={address.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-start">
                        <div>
                            <p className="font-bold text-dark">{address.name}</p>
                            <p className="text-sm text-gray-600">{address.street}, {address.postalCode} {address.city}</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(address)} className="text-sm font-semibold text-primary">Edytuj</button>
                            <button onClick={() => deleteAddress(address.id)} className="text-red-500"><XMarkIcon className="w-5 h-5"/></button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-6">
                {isFormVisible ? (
                    <AddressForm 
                        address={editingAddress}
                        onSave={handleSave} 
                        onCancel={() => { setIsFormVisible(false); setEditingAddress(undefined); }} 
                    />
                ) : (
                    <button onClick={() => setIsFormVisible(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-primary/10 transition-colors">
                        <PlusIcon className="w-5 h-5"/>
                        <span>Dodaj nowy adres</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddressManagementView;