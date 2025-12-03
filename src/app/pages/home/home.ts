import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


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
  imports: [CommonModule]
})
export class Home {
  activeCategory: string = 'all';

  categories: Category[] = [
    { id: 'all', name: 'Todo', icon: '🏠' },
    { id: 'houses', name: 'Casas', icon: '🏡' },
    { id: 'apartments', name: 'Departamento', icon: '🏢' },
    { id: 'rooms', name: 'Cuarto', icon: '🛏️' }
  ];

  listings: Listing[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600',
      category: 'houses',
      location: 'San Isidro, Lima',
      host: 'Familia Rodriguez',
      dates: 'Disponible todo el año',
      price: 1200,
      rating: 4.8,
      reviews: 45
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600',
      category: 'apartments',
      location: 'Miraflores, Lima',
      host: 'Jorge Perez',
      dates: 'Contrato mínimo 6 meses',
      price: 1500,
      rating: 4.9,
      reviews: 82
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=600',
      category: 'rooms',
      location: 'Barranco, Lima',
      host: 'Ana Maria',
      dates: 'Disponible ahora',
      price: 500,
      rating: 4.7,
      reviews: 23
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600',
      category: 'houses',
      location: 'La Molina, Lima',
      host: 'Carlos Ruiz',
      dates: 'Alquiler mensual',
      price: 1800,
      rating: 4.95,
      reviews: 15
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600',
      category: 'apartments',
      location: 'Surco, Lima',
      host: 'Maria Lopez',
      dates: 'Estudiantes preferible',
      price: 1100,
      rating: 4.85,
      reviews: 67
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
      category: 'rooms',
      location: 'Lince, Lima',
      host: 'Sra. Carmen',
      dates: 'Servicios incluidos',
      price: 450,
      rating: 4.6,
      reviews: 34
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600',
      category: 'houses',
      location: 'San Borja, Lima',
      host: 'Roberto Gomez',
      dates: 'Cerca a universidades',
      price: 1400,
      rating: 4.88,
      reviews: 56
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=600',
      category: 'apartments',
      location: 'Magdalena, Lima',
      host: 'Inmobiliaria Joven',
      dates: 'Amoblado completo',
      price: 1300,
      rating: 4.92,
      reviews: 89
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
