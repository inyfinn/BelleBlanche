import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '../components/Icons';

const FAQ_DATA = [
    {
        question: "Jak mogę złożyć zamówienie?",
        answer: "Aby złożyć zamówienie, dodaj wybrane produkty do koszyka, a następnie przejdź do kasy. Wypełnij swoje dane dostawy i wybierz metodę płatności. Po zatwierdzeniu otrzymasz potwierdzenie na adres e-mail."
    },
    {
        question: "Jakie są dostępne metody płatności?",
        answer: "Akceptujemy płatności kartami Visa i Mastercard, a także szybkie przelewy online za pośrednictwem bezpiecznych bramek płatniczych."
    },
    {
        question: "Jaki jest czas dostawy?",
        answer: "Standardowy czas dostawy wynosi od 2 do 5 dni roboczych na terenie Polski. Otrzymasz powiadomienie e-mail, gdy Twoje zamówienie zostanie wysłane."
    },
    {
        question: "Czy mogę zwrócić produkt?",
        answer: "Tak, masz 14 dni na zwrot produktu bez podania przyczyny. Produkt musi być w nienaruszonym stanie, z oryginalnymi metkami. Więcej informacji znajdziesz w naszej polityce zwrotów."
    },
];

const FaqItem: React.FC<{ item: typeof FAQ_DATA[0]; isOpen: boolean; onClick: () => void; }> = ({ item, isOpen, onClick }) => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button
            onClick={onClick}
            className="w-full flex justify-between items-center p-4 text-left font-semibold text-dark"
        >
            <span>{item.question}</span>
            {isOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
        </button>
        {isOpen && (
            <div className="p-4 border-t border-gray-100 text-sm text-gray-600 bg-accent/30">
                <p>{item.answer}</p>
            </div>
        )}
    </div>
);


const HelpCenterView: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const handleToggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="space-y-3">
                {FAQ_DATA.map((item, index) => (
                    <FaqItem 
                        key={index}
                        item={item}
                        isOpen={openIndex === index}
                        onClick={() => handleToggle(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default HelpCenterView;