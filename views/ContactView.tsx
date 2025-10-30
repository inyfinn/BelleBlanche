import React from 'react';
import { useAppContext } from '../context/AppContext';

const ContactView: React.FC = () => {
    const { showToast } = useAppContext();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        showToast("Wiadomość została wysłana. Dziękujemy!");
        (e.target as HTMLFormElement).reset();
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Contact Info */}
                <div className="bg-white p-6 rounded-2xl shadow-sm prose prose-sm sm:prose-base max-w-none text-dark/90 prose-headings:text-primary prose-headings:font-serif">
                    <h2>Skontaktuj się z nami</h2>
                    <p>
                        Masz pytania dotyczące naszych produktów, zamówienia, a może chcesz po prostu porozmawiać o modzie? Jesteśmy tutaj, aby Ci pomóc!
                    </p>
                    <div className="not-prose space-y-4 text-sm mt-6">
                        <p><strong>Adres Butiku:</strong><br/>ul. Jasnogórska 1, 42-200 Częstochowa</p>
                        <p><strong>Email:</strong><br/><a href="mailto:kontakt@belleblanche.store" className="text-primary hover:underline">kontakt@belleblanche.store</a></p>
                        <p><strong>Telefon:</strong><br/>+48 123 456 789</p>
                        <p><strong>Godziny otwarcia:</strong><br/>Pon. - Pt. 9:00 - 17:00</p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm">
                    <h2 className="text-xl font-bold font-serif text-primary mb-4">Napisz do nas</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="text-sm font-semibold text-dark">Imię</label>
                            <input type="text" id="name" required className="mt-1 w-full p-2 bg-accent/50 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div>
                            <label htmlFor="email" className="text-sm font-semibold text-dark">Email</label>
                            <input type="email" id="email" required className="mt-1 w-full p-2 bg-accent/50 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary" />
                        </div>
                        <div>
                            <label htmlFor="message" className="text-sm font-semibold text-dark">Wiadomość</label>
                            <textarea id="message" rows={5} required className="mt-1 w-full p-2 bg-accent/50 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"></textarea>
                        </div>
                        <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-colors">
                            Wyślij
                        </button>
                    </form>
                </div>
            </div>
             <div className="mt-8 bg-white rounded-2xl shadow-sm overflow-hidden h-64">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2551.92131393627!2d19.10881961572382!3d50.8166949795276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4717278631168a29%3A0x4c1615f8a7a0026e!2sJasnog%C3%B3rska%201%2C%2042-217%20Cz%C4%99stochowa%2C%20Poland!5e0!3m2!1sen!2sus!4v1680000000000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokalizacja Butiku Belle Blanche"
                ></iframe>
            </div>
        </div>
    );
};

export default ContactView;