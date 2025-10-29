import type { Product, Category } from '../types';

const sampleProducts: Product[] = [
  {
    id: 1,
    name: 'Elegancka Sukienka Wieczorowa',
    price: '349.99',
    permalink: '#',
    images: [{ id: 101, src: 'https://images.pexels.com/photos/2043590/pexels-photo-2043590.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Sukienka wieczorowa' }],
    description: 'Oszałamiająca sukienka wieczorowa, idealna na specjalne okazje. Wykonana z najwyższej jakości materiałów, zapewnia komfort i elegancję.',
    rating: 4.8,
    reviewCount: 125,
  },
  {
    id: 2,
    name: 'Klasyczna Biała Koszula',
    price: '189.99',
    permalink: '#',
    images: [{ id: 102, src: 'https://images.pexels.com/photos/769733/pexels-photo-769733.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Biała koszula' }],
    description: 'Niezbędny element każdej garderoby. Nasza klasyczna biała koszula pasuje zarówno do stylizacji formalnych, jak i casualowych.',
    rating: 4.9,
    reviewCount: 230,
  },
  {
    id: 3,
    name: 'Spodnie z Wysokim Stanem',
    price: '229.00',
    permalink: '#',
    images: [{ id: 103, src: 'https://images.pexels.com/photos/1597579/pexels-photo-1597579.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Spodnie' }],
    description: 'Stylowe i wygodne spodnie z wysokim stanem, które doskonale podkreślają sylwetkę. Idealne na co dzień i do pracy.',
    rating: 4.7,
    reviewCount: 98,
  },
  {
    id: 4,
    name: 'Jedwabny Szal w Kwiaty',
    price: '129.50',
    permalink: '#',
    images: [{ id: 104, src: 'https://images.pexels.com/photos/1078973/pexels-photo-1078973.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Szal' }],
    description: 'Dodaj odrobinę luksusu do swojej stylizacji dzięki temu pięknemu jedwabnemu szalowi w delikatny, kwiatowy wzór.',
    rating: 4.9,
    reviewCount: 75,
  },
    {
    id: 5,
    name: 'Skórzana Torebka Shopperka',
    price: '499.00',
    permalink: '#',
    images: [{ id: 105, src: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Torebka' }],
    description: 'Pojemna i elegancka torebka typu shopper, wykonana z wysokiej jakości skóry naturalnej. Pomieści wszystkie Twoje niezbędne rzeczy.',
    rating: 5.0,
    reviewCount: 150,
  },
  {
    id: 6,
    name: 'Wełniany Płaszcz Zimowy',
    price: '799.00',
    permalink: '#',
    images: [{ id: 106, src: 'https://images.pexels.com/photos/1484807/pexels-photo-1484807.jpeg?auto=compress&cs=tinysrgb&w=600', alt: 'Płaszcz' }],
    description: 'Ciepły i stylowy płaszcz zimowy wykonany z mieszanki wełny. Idealny na mroźne dni, zapewniający komfort i modny wygląd.',
    rating: 4.8,
    reviewCount: 88,
  },
];

const sampleCategories: Category[] = [
    { id: 1, name: 'Sukienki', slug: 'sukienki' },
    { id: 2, name: 'Koszule', slug: 'koszule' },
    { id: 3, name: 'Spodnie', slug: 'spodnie' },
    { id: 4, name: 'Akcesoria', slug: 'akcesoria' },
    { id: 5, name: 'Okrycia', slug: 'okrycia' },
    { id: 6, name: 'Nowości', slug: 'nowosci' },
];

export const getProducts = (): Promise<Product[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(sampleProducts);
        }, 500);
    });
};

export const getProductById = (id: number): Promise<Product | undefined> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(sampleProducts.find(p => p.id === id));
        }, 300);
    });
};

export const getCategories = (): Promise<Category[]> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(sampleCategories);
        }, 500);
    });
};