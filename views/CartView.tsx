import React from 'react';
import { useAppContext } from '../context/AppContext';
import { MinusIcon, PlusIcon, XMarkIcon } from '../components/Icons';
import type { CartItem } from '../types';

const getCartItemId = (item: CartItem): string => {
    const { id, selectedAttributes } = item;
    if (!selectedAttributes || Object.keys(selectedAttributes).length === 0) {
      return String(id);
    }
    const attributeString = Object.keys(selectedAttributes).sort().map(key => `${key}:${selectedAttributes[key]}`).join('-');
    return `${id}-${attributeString}`;
};

const CartItemRow: React.FC<{ item: CartItem }> = ({ item }) => {
    const { updateQuantity, removeFromCart } = useAppContext();
    const cartItemId = getCartItemId(item);
    
    return (
        <div className="flex items-center py-5">
            <div className="flex-shrink-0 w-24 h-28">
                <img src={item.images[0].src} alt={item.name} className="w-full h-full object-cover rounded-xl" />
            </div>
            <div className="ml-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-base font-semibold text-dark">{item.name}</h3>
                    {item.selectedAttributes && Object.keys(item.selectedAttributes).length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                            {Object.entries(item.selectedAttributes).map(([key, value]) => (
                                <span key={key} className="mr-2">{key}: {value}</span>
                            ))}
                        </div>
                    )}
                    <p className="text-sm text-primary font-bold mt-1">{parseFloat(item.price).toFixed(2)} zł</p>
                </div>
                <div className="flex items-center mt-3">
                    <div className="flex items-center bg-accent rounded-full">
                        <button onClick={() => updateQuantity(cartItemId, item.quantity - 1)} className="p-2 text-dark"><MinusIcon className="w-4 h-4" /></button>
                        <span className="px-3 text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(cartItemId, item.quantity + 1)} className="p-2 text-dark"><PlusIcon className="w-4 h-4" /></button>
                    </div>
                </div>
            </div>
             <div className="pl-4">
                <button onClick={() => removeFromCart(cartItemId)} className="text-gray-400 hover:text-red-500"><XMarkIcon className="w-6 h-6"/></button>
            </div>
        </div>
    )
}

const CartView: React.FC = () => {
  const { cart, cartTotal, navigateTo } = useAppContext();

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold">Twój koszyk jest pusty</h1>
        <p className="mt-2 text-gray-500">Dodaj produkty, aby kontynuować zakupy.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <div className="divide-y divide-accent">
          {cart.map(item => <CartItemRow key={getCartItemId(item)} item={item} />)}
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center text-lg">
            <span className="text-gray-500">Suma</span>
            <span className="font-bold text-dark">{cartTotal.toFixed(2)} zł</span>
        </div>
         <p className="text-xs text-gray-400 mt-1">Dostawa zostanie obliczona przy kasie.</p>
        <button 
            onClick={() => navigateTo({ view: 'checkout' })}
            className="mt-6 w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-opacity-90 transition-colors text-lg"
        >
            Do kasy
        </button>
      </div>
    </div>
  );
};

export default CartView;