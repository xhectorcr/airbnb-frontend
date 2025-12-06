import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

interface Landlord {
  id: number;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  properties: number;
  city: string;
  phone: string;
  email: string;
  verified: boolean;
  joinDate: string;
  response: string;
  propertyTypes: string[];
}

@Component({
  selector: 'app-landlord-dashboard',
  standalone: true, // Make sure it's standalone if imports are used
  imports: [
    CommonModule,
    FormsModule   // ← necesario para usar ngModel
  ],
  templateUrl: './propietarios.html',
  styleUrls: ['./propietarios.scss']
})
export class AdminPropietarios implements OnInit {
  searchTerm: string = '';
  filterCity: string = 'all';
  selectedLandlord: Landlord | null = null;
  landlords: Landlord[] = [];
  cities: string[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.loadLandlords();
    this.loadCities();
  }

  loadLandlords(): void {
    this.landlords = [
      {
        id: 1,
        name: 'María González',
        photo: '👩',
        rating: 4.8,
        reviews: 24,
        properties: 3,
        city: 'Ciudad de México',
        phone: '+52 55 1234 5678',
        email: 'maria.gonzalez@email.com',
        verified: true,
        joinDate: 'Marzo 2023',
        response: '2 horas',
        propertyTypes: ['Departamento', 'Cuarto']
      },
      {
        id: 2,
        name: 'Carlos Rodríguez',
        photo: '👨',
        rating: 4.9,
        reviews: 42,
        properties: 5,
        city: 'Guadalajara',
        phone: '+52 33 9876 5432',
        email: 'carlos.rod@email.com',
        verified: true,
        joinDate: 'Enero 2023',
        response: '1 hora',
        propertyTypes: ['Casa', 'Departamento']
      },
      {
        id: 3,
        name: 'Ana Martínez',
        photo: '👩‍🦰',
        rating: 4.7,
        reviews: 18,
        properties: 2,
        city: 'Monterrey',
        phone: '+52 81 5555 4444',
        email: 'ana.martinez@email.com',
        verified: true,
        joinDate: 'Mayo 2023',
        response: '3 horas',
        propertyTypes: ['Cuarto']
      },
      {
        id: 4,
        name: 'Jorge López',
        photo: '👨‍💼',
        rating: 4.6,
        reviews: 31,
        properties: 4,
        city: 'Puebla',
        phone: '+52 22 3333 2222',
        email: 'jorge.lopez@email.com',
        verified: false,
        joinDate: 'Julio 2023',
        response: '4 horas',
        propertyTypes: ['Departamento', 'Casa']
      },
      {
        id: 5,
        name: 'Laura Sánchez',
        photo: '👩‍💻',
        rating: 5.0,
        reviews: 15,
        properties: 2,
        city: 'Ciudad de México',
        phone: '+52 55 7777 8888',
        email: 'laura.sanchez@email.com',
        verified: true,
        joinDate: 'Febrero 2023',
        response: '30 min',
        propertyTypes: ['Cuarto']
      },
      {
        id: 6,
        name: 'Roberto Fernández',
        photo: '👨‍🏫',
        rating: 4.5,
        reviews: 27,
        properties: 6,
        city: 'Guadalajara',
        phone: '+52 33 4444 3333',
        email: 'roberto.f@email.com',
        verified: true,
        joinDate: 'Abril 2023',
        response: '2 horas',
        propertyTypes: ['Casa', 'Departamento', 'Cuarto']
      }
    ];
  }

  loadCities(): void {
    this.cities = [...new Set(this.landlords.map(l => l.city))];
  }

  get filteredLandlords(): Landlord[] {
    return this.landlords.filter(landlord => {
      const matchesSearch = landlord.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        landlord.city.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCity = this.filterCity === 'all' || landlord.city === this.filterCity;
      return matchesSearch && matchesCity;
    });
  }

  openModal(landlord: Landlord): void {
    this.selectedLandlord = landlord;
  }

  closeModal(): void {
    this.selectedLandlord = null;
  }

  sendMessage(landlord: Landlord): void {
    console.log('Enviando mensaje a:', landlord.name);
    // Implementar lógica de envío de mensaje
  }

  viewProperties(landlord: Landlord): void {
    console.log('Ver propiedades de:', landlord.name);
    // Implementar navegación a propiedades
  }

  logout(): void {
    this.authService.logout();
  }
}