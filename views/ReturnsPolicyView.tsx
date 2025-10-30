import React from 'react';

const ReturnsPolicyView: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm prose prose-sm sm:prose-base max-w-none text-dark/90 prose-headings:text-primary prose-headings:font-serif">
                <h2>Zwroty i Reklamacje</h2>
                
                <h3>Prawo do odstąpienia od umowy (Zwroty)</h3>
                <p>
                    Twoja satysfakcja jest dla nas priorytetem. Jeśli zakupiony produkt nie spełnia Twoich oczekiwań, masz pełne prawo do odstąpienia od umowy w ciągu <strong>14 dni</strong> od daty otrzymania przesyłki, bez podawania przyczyny.
                </p>
                
                <h4>Jak dokonać zwrotu? To proste:</h4>
                <ol>
                    <li>
                        <strong>Poinformuj nas.</strong> Wypełnij formularz zwrotu, który znajdziesz w swoim panelu klienta, lub po prostu napisz do nas e-mail na adres <a href="mailto:kontakt@belleblanche.store">kontakt@belleblanche.store</a>. Wystarczy, że podasz numer zamówienia i informację o chęci zwrotu.
                    </li>
                    <li>
                        <strong>Przygotuj paczkę.</strong> Upewnij się, że zwracany produkt jest w nienaruszonym stanie – nie nosi śladów użytkowania i posiada wszystkie oryginalne metki. Starannie zapakuj produkt, aby nie uległ uszkodzeniu w transporcie. Dołącz dowód zakupu (paragon lub fakturę) lub jego kopię.
                    </li>
                    <li>
                        <strong>Odeślij produkt.</strong> Wyślij paczkę na adres naszego butiku:
                        <br/>
                        <address className="not-prose border-l-2 border-primary pl-4 my-4">
                            <strong>Belle Blanche Boutique</strong><br/>
                            ul. Jasnogórska 1<br/>
                            42-200 Częstochowa
                        </address>
                        Pamiętaj, że koszt odesłania produktu ponosi Klient. Nie przyjmujemy przesyłek za pobraniem.
                    </li>
                    <li>
                        <strong>Oczekuj zwrotu środków.</strong> Po otrzymaniu i weryfikacji przesyłki, zwrócimy Ci pełną kwotę za produkt w ciągu 7 dni roboczych. Zwrot nastąpi tą samą metodą płatności, która została użyta w pierwotnej transakcji, chyba że uzgodnimy inaczej.
                    </li>
                </ol>

                <h3>Reklamacje</h3>
                <p>
                    W Belle Blanche dbamy o najwyższą jakość. Każdy produkt przechodzi staranną kontrolę. Jeśli jednak okaże się, że otrzymany towar posiada wadę fabryczną lub jest niezgodny z zamówieniem, masz pełne prawo do złożenia reklamacji.
                </p>
                <h4>Jak złożyć reklamację?</h4>
                <ol>
                    <li>
                        <strong>Skontaktuj się z nami.</strong> Jak najszybciej opisz problem, wysyłając e-mail na adres <a href="mailto:kontakt@belleblanche.store">kontakt@belleblanche.store</a>. Dołącz zdjęcia wady – pozwoli nam to na szybszą weryfikację. W odpowiedzi otrzymasz od nas dalsze instrukcje.
                    </li>
                    <li>
                        <strong>Odeślij reklamowany produkt.</strong> Po wstępnej akceptacji, poprosimy Cię o odesłanie produktu na nasz adres. W przypadku uzasadnionej reklamacji, zwrócimy Ci poniesione koszty wysyłki.
                    </li>
                    <li>
                        <strong>Poczekaj na decyzję.</strong> Twoją reklamację rozpatrzymy w terminie do 14 dni od otrzymania produktu. W zależności od charakteru wady, zaproponujemy naprawę, wymianę na nowy, wolny od wad produkt lub zwrot pieniędzy.
                    </li>
                </ol>
            </div>
        </div>
    );
};

export default ReturnsPolicyView;