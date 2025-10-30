import React from 'react';

const TermsView: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm prose prose-sm sm:prose-base max-w-none text-dark/90 prose-headings:text-primary prose-headings:font-serif">
                <h2>Regulamin Sklepu Internetowego Belle Blanche</h2>
                <p className="text-xs text-gray-500">Ostatnia aktualizacja: 24 maja 2024 r.</p>

                <h4>§ 1. Definicje</h4>
                <ol>
                    <li><strong>Sklep</strong> – sklep internetowy działający pod adresem belleblanche.store, prowadzony przez [Nazwa Firmy] z siedzibą w Częstochowie.</li>
                    <li><strong>Klient</strong> – osoba fizyczna, osoba prawna lub jednostka organizacyjna nieposiadająca osobowości prawnej, dokonująca zakupów w Sklepie.</li>
                    <li><strong>Regulamin</strong> – niniejszy dokument określający zasady funkcjonowania Sklepu.</li>
                    <li><strong>Towar</strong> – produkty oferowane do sprzedaży w Sklepie.</li>
                </ol>

                <h4>§ 2. Postanowienia ogólne</h4>
                <ol>
                    <li>Niniejszy regulamin określa zasady i warunki korzystania ze Sklepu, w tym składania zamówień, dostawy towarów, płatności, a także procedury reklamacyjne i zwroty.</li>
                    <li>Klient jest zobowiązany do zapoznania się z treścią Regulaminu i jego akceptacji przed złożeniem zamówienia. Akceptacja Regulaminu jest dobrowolna, ale niezbędna do dokonania zakupu.</li>
                </ol>

                <h4>§ 3. Składanie i realizacja zamówień</h4>
                <ol>
                    <li>Zamówienia można składać 24 godziny na dobę za pośrednictwem strony internetowej Sklepu.</li>
                    <li>Warunkiem realizacji zamówienia jest prawidłowe wypełnienie formularza, podanie prawdziwych danych oraz akceptacja Regulaminu.</li>
                    <li>Po złożeniu zamówienia Klient otrzymuje automatyczne potwierdzenie jego przyjęcia. Umowa sprzedaży zostaje zawarta z chwilą potwierdzenia przez Sklep dostępności Towaru i przyjęcia zamówienia do realizacji, o czym Klient zostanie poinformowany w oddzielnej wiadomości e-mail.</li>
                    <li>Sklep zastrzega sobie prawo do weryfikacji zamówienia oraz do jego anulowania w przypadku braku możliwości jego realizacji lub podejrzenia o podanie nieprawdziwych danych.</li>
                </ol>
                
                <h4>§ 4. Ceny i metody płatności</h4>
                <ol>
                    <li>Wszystkie ceny podane w Sklepie są cenami brutto (zawierają podatek VAT) i wyrażone są w złotych polskich (PLN). Cena nie zawiera kosztów dostawy.</li>
                    <li>Informacja o całkowitej wartości zamówienia, obejmująca cenę Towaru oraz koszty dostawy, jest przedstawiana Klientowi przed ostatecznym zatwierdzeniem zamówienia.</li>
                    <li>Sklep umożliwia następujące metody płatności: płatność kartą kredytową/debetową (Visa, Mastercard) oraz szybkie przelewy online za pośrednictwem operatora płatności.</li>
                </ol>

                <h4>§ 5. Dostawa</h4>
                <ol>
                    <li>Dostawa realizowana jest na terytorium Rzeczypospolitej Polskiej.</li>
                    <li>Czas realizacji zamówienia (przygotowanie do wysyłki) wynosi zazwyczaj 1-2 dni robocze. Czas dostawy przez kuriera wynosi dodatkowo 1-3 dni robocze. Sklep nie ponosi odpowiedzialności za opóźnienia wynikające z winy przewoźnika.</li>
                </ol>

                <h4>§ 6. Prawo odstąpienia od umowy i reklamacje</h4>
                <ol>
                    <li>Klient będący konsumentem ma prawo odstąpić od umowy sprzedaży bez podania przyczyny w terminie 14 dni od dnia otrzymania towaru.</li>
                    <li>W przypadku wadliwego Towaru, Klientowi przysługuje prawo do złożenia reklamacji na zasadach określonych w przepisach Kodeksu Cywilnego.</li>
                    <li>Szczegółowe informacje dotyczące procedury zwrotów i reklamacji znajdują się w zakładce "Zwroty i Reklamacje".</li>
                </ol>
                
                 <h4>§ 7. Ochrona danych osobowych</h4>
                 <ol>
                    <li>Administratorem danych osobowych jest Sklep. Dane przetwarzane są zgodnie z obowiązującymi przepisami prawa oraz Polityką Prywatności dostępną na stronie Sklepu.</li>
                 </ol>
                
                 <h4>§ 8. Postanowienia końcowe</h4>
                <ol>
                    <li>W sprawach nieuregulowanych niniejszym Regulaminem mają zastosowanie przepisy prawa polskiego.</li>
                    <li>Sklep zastrzega sobie prawo do wprowadzania zmian w Regulaminie. Zmiany wchodzą w życie w terminie wskazanym przez Sklep, nie krótszym niż 7 dni od momentu udostępnienia ich na stronie Sklepu. Zamówienia złożone przed datą wejścia w życie zmian są realizowane na podstawie dotychczasowych postanowień.</li>
                </ol>
            </div>
        </div>
    );
};

export default TermsView;