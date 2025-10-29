import React from 'react';
import { useAppContext } from '../context/AppContext';
import type { Order } from '../types';

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
    const statusClasses = {
        'Dostarczone': 'bg-green-100 text-green-800',
        'W trakcie': 'bg-yellow-100 text-yellow-800',
        'Wysłane': 'bg-blue-100 text-blue-800',
        'Anulowane': 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-dark">Zamówienie #{order.id}</h3>
                    <p className="text-xs text-gray-400">Data: {order.date}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[order.status]}`}>
                    {order.status}
                </span>
            </div>
            <div className="mt-4 border-t pt-2">
                <p className="text-sm font-semibold text-dark">Produkty:</p>
                <ul className="text-sm text-gray-600 list-disc pl-5 mt-1">
                    {order.items.map((item, index) => (
                        <li key={index}>{item.name} (x{item.quantity})</li>
                    ))}
                </ul>
            </div>
            <p className="text-right font-bold text-primary mt-2">Suma: {order.total.toFixed(2)} zł</p>
        </div>
    );
};


const OrderHistoryView: React.FC = () => {
    const { orders } = useAppContext();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map(order => <OrderCard key={order.id} order={order} />)}
                </div>
            ) : (
                <div className="text-center py-20">
                    <h2 className="text-xl font-bold text-dark">Brak historii zamówień</h2>
                    <p className="text-gray-500 mt-2">Nie złożyłaś jeszcze żadnego zamówienia.</p>
                </div>
            )}
        </div>
    );
};

export default OrderHistoryView;