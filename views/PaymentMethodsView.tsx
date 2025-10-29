import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import type { PaymentMethod } from '../types';
import { XMarkIcon, PlusIcon, CreditCardIcon } from '../components/Icons';

const PaymentMethodCard: React.FC<{ method: PaymentMethod; onDelete: () => void; }> = ({ method, onDelete }) => (
    <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-4 rounded-xl shadow-lg text-white relative">
        <div className="flex justify-between items-center">
            <CreditCardIcon className="w-8 h-8 opacity-70"/>
            <p className="font-semibold">{method.cardType}</p>
        </div>
        <p className="text-center font-mono tracking-widest text-lg my-6">**** **** **** {method.last4}</p>
        <div className="flex justify-between items-end text-sm">
            <span>Anna Kowalska</span>
            <span>Wygasa: {method.expiryDate}</span>
        </div>
         <button onClick={onDelete} className="absolute top-2 right-2 text-white/50 hover:text-white"><XMarkIcon className="w-5 h-5"/></button>
    </div>
);

const PaymentMethodForm: React.FC<{
    onSave: (method: Omit<PaymentMethod, 'id' | 'isDefault'>) => void;
    onCancel: () => void;
}> = ({ onSave, onCancel }) => {
    const [cardType, setCardType] = useState<'Visa' | 'Mastercard'>('Visa');
    const [last4, setLast4] = useState('');
    const [expiryDate, setExpiryDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ cardType, last4, expiryDate });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-accent/50 p-4 rounded-xl space-y-3">
            <select value={cardType} onChange={(e) => setCardType(e.target.value as any)} className="w-full p-2 rounded-lg">
                <option>Visa</option>
                <option>Mastercard</option>
            </select>
            <input value={last4} onChange={(e) => setLast4(e.target.value)} placeholder="Ostatnie 4 cyfry" maxLength={4} className="w-full p-2 rounded-lg" required />
            <input value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} placeholder="Data ważności (MM/RR)" className="w-full p-2 rounded-lg" required />
            <div className="flex gap-2">
                <button type="submit" className="flex-grow bg-primary text-white py-2 rounded-lg font-semibold">Zapisz kartę</button>
                <button type="button" onClick={onCancel} className="flex-grow bg-gray-200 py-2 rounded-lg font-semibold">Anuluj</button>
            </div>
        </form>
    );
};


const PaymentMethodsView: React.FC = () => {
    const { paymentMethods, addPaymentMethod, deletePaymentMethod } = useAppContext();
    const [isFormVisible, setIsFormVisible] = useState(false);
    
    const handleSave = (method: Omit<PaymentMethod, 'id' | 'isDefault'>) => {
        addPaymentMethod(method);
        setIsFormVisible(false);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-4">
                {paymentMethods.map(method => (
                    <PaymentMethodCard key={method.id} method={method} onDelete={() => deletePaymentMethod(method.id)} />
                ))}
            </div>
            <div className="mt-6">
                {isFormVisible ? (
                    <PaymentMethodForm onSave={handleSave} onCancel={() => setIsFormVisible(false)} />
                ) : (
                    <button onClick={() => setIsFormVisible(true)} className="w-full flex items-center justify-center gap-2 py-3 bg-accent text-primary font-bold rounded-xl hover:bg-primary/10 transition-colors">
                        <PlusIcon className="w-5 h-5"/>
                        <span>Dodaj nową metodę płatności</span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default PaymentMethodsView;