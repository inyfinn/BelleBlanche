import React from 'react';
import { InstagramIcon, FacebookIcon, TikTokIcon } from './Icons';

const PaymentIcons = () => (
    <div className="flex items-center justify-center md:justify-start space-x-2 grayscale opacity-60">
        <img src="https://img.icons8.com/color/48/000000/visa.png" alt="Visa" className="h-6"/>
        <img src="https://img.icons8.com/color/48/000000/mastercard.png" alt="Mastercard" className="h-6"/>
        <img src="https://img.icons8.com/color/48/000000/paypal.png" alt="PayPal" className="h-6"/>
        <img src="https://img.icons8.com/fluency/48/000000/google-pay.png" alt="Google Pay" className="h-6"/>
        <img src="https://img.icons8.com/ios-filled/50/000000/apple-pay.png" alt="Apple Pay" className="h-6"/>
    </div>
);


const Footer: React.FC = () => {
  const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Dziękujemy za zapisanie się do newslettera!');
    (e.target as HTMLFormElement).reset();
  };
    
  return (
    <footer className="bg-white text-brand-dark border-t border-brand-gray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
            <h3 className="text-2xl font-serif tracking-wider mb-2">Dołącz do klubu Belle Blanche</h3>
            <p className="text-brand-dark/80 mb-6">Zapisz się do newslettera i otrzymaj 10% rabatu na pierwsze zakupy.</p>
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                    <input type="email" placeholder="Twój adres email" className="w-full px-4 py-2 bg-brand-beige border border-brand-taupe rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-dark" required/>
                    <button type="submit" className="px-6 py-2 bg-brand-dark text-white rounded-sm hover:bg-opacity-80 transition-colors uppercase text-sm tracking-wider">Zapisz się</button>
                </div>
            </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm text-center md:text-left">
          <div>
            <h4 className="font-semibold uppercase tracking-wider mb-4">O Nas</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Historia Marki</a></li>
              <li><a href="#" className="hover:underline">Kontakt</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold uppercase tracking-wider mb-4">Informacje</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Regulamin</a></li>
              <li><a href="#" className="hover:underline">Polityka Prywatności</a></li>
              <li><a href="#" className="hover:underline">Polityka Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold uppercase tracking-wider mb-4">Obsługa Klienta</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:underline">Dostawa i Płatności</a></li>
              <li><a href="#" className="hover:underline">Zwroty i Reklamacje</a></li>
              <li><a href="#" className="hover:underline">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold uppercase tracking-wider mb-4">Obserwuj nas</h4>
            <div className="flex gap-4 justify-center md:justify-start">
                <a href="#" aria-label="Instagram" className="hover:text-opacity-70 transition-colors"><InstagramIcon className="w-6 h-6"/></a>
                <a href="#" aria-label="Facebook" className="hover:text-opacity-70 transition-colors"><FacebookIcon className="w-6 h-6"/></a>
                <a href="#" aria-label="TikTok" className="hover:text-opacity-70 transition-colors"><TikTokIcon className="w-6 h-6"/></a>
             </div>
          </div>
        </div>
      </div>
      
      <div className="bg-brand-beige">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center text-xs">
          <p className="text-brand-dark/70 mb-2 md:mb-0">&copy; {new Date().getFullYear()} Belle Blanche. Wszelkie prawa zastrzeżone.</p>
          <PaymentIcons />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
