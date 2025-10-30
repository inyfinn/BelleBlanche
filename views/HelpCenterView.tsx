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
    {
        question: "Jak mogę śledzić swoje zamówienie?",
        answer: "Po wysłaniu zamówienia otrzymasz wiadomość e-mail z numerem przesyłki i linkiem do jej śledzenia na stronie firmy kurierskiej."
    },
    {
        question: "Jak dobrać odpowiedni rozmiar?",
        answer: "Przy każdym produkcie znajduje się tabela rozmiarów z dokładnymi wymiarami. Zachęcamy również do uzupełnienia swoich wymiarów w profilu, co pozwoli naszej asystentce AI na jeszcze trafniejsze rekomendacje."
    },
    {
        question: "Czy mogę zmodyfikować lub anulować zamówienie?",
        answer: "Staramy się realizować zamówienia jak najszybciej. Jeśli chcesz dokonać zmian, prosimy o niezwłoczny kontakt z naszym biurem obsługi. Po wysłaniu paczki modyfikacje nie są już możliwe."
    },
    {
        question: "Czy kolory produktów na zdjęciach są dokładne?",
        answer: "Dokładamy wszelkich starań, aby kolory na zdjęciach jak najwierniej oddawały rzeczywisty wygląd produktów. Mogą jednak wystąpić niewielkie różnice, wynikające z ustawień monitora lub oświetlenia."
    },
    {
        question: "Czy oferujecie pakowanie na prezent?",
        answer: "Oczywiście! Każde zamówienie pakujemy z najwyższą starannością w nasze firmowe, eleganckie opakowania, które idealnie nadają się na prezent. Nie oferujemy dodatkowej, oddzielnej usługi pakowania prezentowego."
    },
    {
        question: "Jak skontaktować się z obsługą klienta?",
        answer: "Nasz zespół jest do Twojej dyspozycji od poniedziałku do piątku w godzinach 9:00 - 17:00. Możesz skontaktować się z nami mailowo, telefonicznie lub za pośrednictwem formularza w zakładce 'Kontakt'."
    },
    {
        question: "Czy muszę zakładać konto, aby dokonać zakupu?",
        answer: "Nie, możesz dokonać zakupu jako gość. Jednak założenie konta pozwala na śledzenie historii zamówień, zapisywanie adresów i szybsze zakupy w przyszłości."
    },
    {
        question: "Jak działają rekomendacje AI?",
        answer: "Nasza asystentka AI analizuje Twoje wymiary i preferencje podane w profilu, aby zaproponować produkty idealnie dopasowane do Twojej sylwetki i stylu. Im więcej informacji podasz, tym trafniejsze będą rekomendacje."
    },
    {
        question: "Czy moje dane są bezpieczne?",
        answer: "Tak, bezpieczeństwo Twoich danych jest dla nas priorytetem. Stosujemy najnowsze standardy szyfrowania i ochrony danych. Więcej informacji znajdziesz w naszej polityce prywatności."
    },
     {
        question: "Jak skorzystać z kodu rabatowego?",
        answer: "Kod rabatowy możesz wpisać w odpowiednim polu w koszyku, przed przejściem do finalizacji zamówienia. Rabat zostanie automatycznie naliczony."
    }
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