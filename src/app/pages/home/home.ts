import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Listing {
  id: number;
  image: string;
  category: string;
  location: string;
  host: string;
  dates: string;
  price: number;
  rating: number;
  reviews: number;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  standalone: true,
  imports: [CommonModule, Header, Footer]
})
export class Home {
  activeCategory: string = 'all';

  categories: Category[] = [
    { id: 'all', name: 'Todo', icon: '🏠' },
    { id: 'beach', name: 'Playa', icon: '🏖️' },
    { id: 'mountain', name: 'Montaña', icon: '🏔️' },
    { id: 'trending', name: 'Tendencia', icon: '🔥' },
    { id: 'pools', name: 'Piscinas', icon: '🏊' },
    { id: 'cabins', name: 'Cabañas', icon: '🛖' },
    { id: 'city', name: 'Ciudad', icon: '🌆' },
    { id: 'countryside', name: 'Campo', icon: '🌾' },
    { id: 'luxe', name: 'Luxe', icon: '💎' }
  ];

  listings: Listing[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600',
      category: 'beach',
      location: 'Máncora, Perú',
      host: 'Anfitrión profesional',
      dates: '15 - 20 dic',
      price: 145,
      rating: 4.9,
      reviews: 127
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=600',
      category: 'mountain',
      location: 'Cusco, Perú',
      host: 'Superanfitrión',
      dates: '10 - 15 dic',
      price: 189,
      rating: 4.95,
      reviews: 234
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600',
      category: 'pools',
      location: 'Arequipa, Perú',
      host: 'Anfitrión experimentado',
      dates: '5 - 10 ene',
      price: 210,
      rating: 4.87,
      reviews: 89
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600',
      category: 'beach',
      location: 'Paracas, Perú',
      host: 'Superanfitrión',
      dates: '20 - 25 dic',
      price: 165,
      rating: 4.92,
      reviews: 156
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600',
      category: 'city',
      location: 'Lima, Perú',
      host: 'Anfitrión profesional',
      dates: '1 - 6 ene',
      price: 198,
      rating: 4.88,
      reviews: 203
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600',
      category: 'mountain',
      location: 'Huaraz, Perú',
      host: 'Superanfitrión',
      dates: '12 - 17 dic',
      price: 135,
      rating: 4.96,
      reviews: 178
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
      category: 'cabins',
      location: 'Oxapampa, Perú',
      host: 'Superanfitrión',
      dates: '2 - 6 ene',
      price: 160,
      rating: 4.91,
      reviews: 142
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=600',
      category: 'luxe',
      location: 'Miraflores, Lima',
      host: 'Anfitrión profesional',
      dates: '8 - 14 ene',
      price: 320,
      rating: 4.98,
      reviews: 312
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
      category: 'countryside',
      location: 'Cajamarca, Perú',
      host: 'Superanfitrión',
      dates: '10 - 15 feb',
      price: 110,
      rating: 4.85,
      reviews: 98
    }
  ];

  get filteredListings(): Listing[] {
    if (this.activeCategory === 'all') return this.listings;
    return this.listings.filter(l => l.category === this.activeCategory);
  }

  setActiveCategory(id: string) {
    this.activeCategory = id;
  }
}
