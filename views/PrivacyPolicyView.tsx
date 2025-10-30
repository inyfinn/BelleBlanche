import React from 'react';

const PrivacyPolicyView: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm prose prose-sm sm:prose-base max-w-none text-dark/90 prose-headings:text-primary prose-headings:font-serif">
                <h2>Polityka Prywatności i Plików Cookies</h2>
                <p className="text-xs text-gray-500">Ostatnia aktualizacja: 24 maja 2024 r.</p>
                <p>
                    W Belle Blanche szanujemy Twoją prywatność. Niniejszy dokument wyjaśnia, jakie dane zbieramy i w jaki sposób je wykorzystujemy, aby zapewnić Ci najlepsze możliwe doświadczenie zakupowe.
                </p>

                <h4>1. Kto jest administratorem Twoich danych?</h4>
                <p>
                    Administratorem Twoich danych osobowych jest [Nazwa Firmy], z siedzibą w Częstochowie przy ul. Jasnogórskiej 1 ("Administrator", "my", "nas"). W razie pytań dotyczących przetwarzania Twoich danych, skontaktuj się z nami pod adresem: <a href="mailto:kontakt@belleblanche.store">kontakt@belleblanche.store</a>.
                </p>

                <h4>2. Jakie dane zbieramy i dlaczego?</h4>
                <p>
                    Gromadzimy dane, które są niezbędne do świadczenia naszych usług.
                </p>
                <ul>
                    <li><strong>Realizacja zamówień:</strong> Imię, nazwisko, adres dostawy, adres e-mail i numer telefonu są nam potrzebne, aby przetworzyć i dostarczyć Twoje zamówienie oraz informować Cię o jego statusie.</li>
                    <li><strong>Konto użytkownika:</strong> Jeśli zdecydujesz się założyć konto, przechowujemy Twoje dane, aby ułatwić przyszłe zakupy i umożliwić Ci przeglądanie historii zamówień.</li>
                    <li><strong>Personalizacja:</strong> Dane, które dobrowolnie podajesz w swoim profilu (np. wymiary, preferencje), pomagają naszej asystentce AI tworzyć dla Ciebie spersonalizowane rekomendacje.</li>
                    <li><strong>Newsletter:</strong> Jeśli wyrazisz na to zgodę, będziemy używać Twojego adresu e-mail do wysyłania informacji o nowościach, promocjach i inspiracjach.</li>
                    <li><strong>Kontakt:</strong> Gdy kontaktujesz się z nami, przechowujemy korespondencję, aby móc efektywnie rozwiązać Twoją sprawę.</li>
                </ul>
                
                <h4>3. Komu udostępniamy Twoje dane?</h4>
                <p>
                    Twoje dane są u nas bezpieczne. Udostępniamy je podmiotom trzecim tylko wtedy, gdy jest to absolutnie konieczne do realizacji usług – np. firmom kurierskim w celu dostarczenia przesyłki oraz operatorom płatności w celu przetworzenia transakcji. Wszystkie te podmioty zobowiązane są do ochrony Twoich danych na równi z nami.
                </p>
                
                <h4>4. Jakie masz prawa?</h4>
                <p>
                    Pamiętaj, że masz pełną kontrolę nad swoimi danymi. W każdej chwili masz prawo do:
                </p>
                <ul>
                    <li>Dostępu do swoich danych i otrzymania ich kopii.</li>
                    <li>Sprostowania (poprawienia) swoich danych.</li>
                    <li>Usunięcia danych (prawo do bycia zapomnianym).</li>
                    <li>Ograniczenia przetwarzania danych.</li>
                    <li>Wniesienia sprzeciwu wobec przetwarzania danych.</li>
                    <li>Przenoszenia danych.</li>
                    <li>Wycofania zgody na przetwarzanie danych w dowolnym momencie.</li>
                </ul>
                <p>
                    Jeśli uważasz, że Twoje dane są przetwarzane niezgodnie z prawem, masz prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (UODO).
                </p>

                <h4>5. Czym są pliki cookies?</h4>
                <p>
                    Nasz sklep używa plików cookies (ciasteczek), aby zapewnić jego prawidłowe funkcjonowanie i jak najlepsze wrażenia z użytkowania. Są to małe pliki tekstowe, które pomagają nam m.in. pamiętać zawartość Twojego koszyka, analizować ruch na stronie i personalizować treści marketingowe. Korzystając z naszego sklepu, zgadzasz się na ich używanie. Możesz zarządzać ustawieniami cookies w swojej przeglądarce internetowej.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicyView;