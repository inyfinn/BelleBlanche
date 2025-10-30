import React from 'react';

const AboutUsView: React.FC = () => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="relative h-48 bg-accent flex items-center justify-center">
                    <span className="font-serif text-6xl font-bold text-primary/80">B</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
                </div>
                <div className="p-6 md:p-8 prose prose-sm sm:prose-base max-w-none text-dark/90 prose-headings:text-primary prose-headings:font-serif prose-blockquote:border-primary prose-blockquote:text-dark">
                    <h2>Nasza Historia</h2>
                    <p>
                        Witaj w świecie Belle Blanche – przestrzeni stworzonej z miłości do ponadczasowej elegancji i subtelnego piękna. Nasz butik narodził się z marzenia o modzie, która nie krzyczy, lecz szepcze; która dodaje pewności siebie i podkreśla to, co w kobiecie najpiękniejsze – jej naturalną grację.
                    </p>
                    <p>
                        Założony w sercu Częstochowy, Belle Blanche od samego początku miał jasną wizję: oferować starannie wyselekcjonowane kolekcje dla kobiet, które cenią sobie doskonałą jakość, szlachetne tkaniny i przemyślane kroje. Specjalizujemy się w palecie barw inspirowanej naturą – od czystej bieli, przez ciepłe odcienie beżu i ecru, po delikatne szarości. Wierzymy, że to właśnie w tej harmonii tkwi sekret stylu, który nigdy nie wychodzi z mody.
                    </p>

                    <h2>Filozofia Marki</h2>
                    <p>
                        Naszą misją jest tworzenie garderoby, która jest zarówno piękna, jak i funkcjonalna. Chcemy, abyś w naszych ubraniach czuła się swobodnie i wyjątkowo, niezależnie od okazji. Każdy element kolekcji jest wybierany z myślą o tym, by mógł stać się fundamentem Twojej szafy kapsułowej – bazy, którą możesz dowolnie interpretować i uzupełniać, tworząc zestawy idealnie oddające Twój charakter.
                    </p>
                    <blockquote>
                        "Prostota jest kluczem do prawdziwej elegancji."
                    </blockquote>
                    <p>
                        To motto towarzyszy nam na każdym kroku. Zamiast ślepo podążać za chwilowymi trendami, inwestujemy w jakość i wzornictwo, które przetrwają próbę czasu. W Belle Blanche celebrujemy świadomą modę i sztukę ubierania się, a nie przebierania.
                    </p>
                    
                    <h2>Dołącz do Społeczności Belle Blanche</h2>
                    <p>
                        Belle Blanche to więcej niż butik – to społeczność kobiet, które inspirują się nawzajem i dzielą pasją do piękna w codziennym życiu. Zapraszamy Cię do naszego świata. Odkryj ubrania, które opowiadają historie i które staną się częścią Twojej.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUsView;