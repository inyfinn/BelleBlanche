import React from 'react';
import { useAppContext } from '../context/AppContext';

const CheckoutView: React.FC = () => {
    const { cartTotal, showToast } = useAppContext();

    const subtotal = cartTotal;
    const shipping = 15.00; // Example shipping cost
    const total = subtotal + shipping;

    const handlePayment = () => {
        showToast('Zamówienie złożone! Dziękujemy za zakupy.');
        // Here you would typically clear the cart and navigate to a success page
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-md mx-auto">
                {/* Order Summary */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold text-dark mb-4 border-b pb-2">Podsumowanie zamówienia</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Suma częściowa</span>
                            <span className="font-semibold text-dark">{subtotal.toFixed(2)} zł</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Dostawa</span>
                            <span className="font-semibold text-dark">{shipping.toFixed(2)} zł</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-dark pt-2 border-t mt-2">
                            <span>Suma</span>
                            <span>{total.toFixed(2)} zł</span>
                        </div>
                    </div>
                </div>

                {/* Shipping Details Placeholder */}
                <div className="bg-white p-6 rounded-2xl shadow-sm mt-6">
                     <h3 className="text-lg font-bold text-dark mb-4">Dane do wysyłki</h3>
                     <p className="text-sm text-gray-500">Formularz z danymi do wysyłki pojawi się tutaj.</p>
                </div>

                {/* Payment Button */}
                <button
                    onClick={handlePayment}
                    className="mt-8 w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-colors text-lg"
                >
                    Zapłać teraz
                </button>
            </div>
        </div>
    );
};

export default CheckoutView;
