import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { PropiedadesService } from '../../../core/services/propiedades.service';

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
    FormsModule,
    RouterModule
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

  // Properties Modal
  showOwnerProperties: boolean = false;
  ownerProperties: any[] = [];
  allProperties: any[] = []; // Store all properties to filter locally

  constructor(
    private authService: AuthService,
    private propiedadesService: PropiedadesService, // Injected
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadLandlords();
    this.loadAllProperties(); // Pre-load properties for quick filtering
    this.initialMockData();
  }

  loadLandlords(): void {
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        // Filter only non-admin users (owners/regular users)
        const owners = users.filter(u => !u.esAdmin);

        this.landlords = owners.map(u => ({
          id: u.id,
          name: u.nombre,
          email: u.email,
          phone: u.telefono || '', // Use real phone
          city: 'Desconocido',
          photo: '👤',
          rating: 0,
          reviews: 0,
          properties: u.propiedadesCount || 0, // Use real count
          verified: false,
          joinDate: '2023',
          response: 'N/A',
          propertyTypes: []
        }));
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando usuarios', err);
      }
    });
  }

  loadAllProperties() {
    this.propiedadesService.getAdminAllProperties().subscribe(props => {
      this.allProperties = props;
    });
  }

  initialMockData(): void {
  }

  loadCities(): void {
    // Removed as per request
  }

  get filteredLandlords(): Landlord[] {
    return this.landlords.filter(landlord => {
      const matchesSearch = landlord.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        landlord.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesSearch;
    });
  }

  // selectedLandlord: Landlord | null = null; // Removed
  // openModal removed
  // closeModal removed

  sendMessage(landlord: Landlord): void {
    if (landlord.phone) {
      window.open(`https://wa.me/51${landlord.phone}`, '_blank');
    } else {
      alert('Este usuario no tiene número de teléfono registrado');
    }
  }

  viewProperties(landlord: Landlord): void {
    console.log('Viewing properties for landlord:', landlord.id, landlord.name);
    console.log('Total properties loaded:', this.allProperties.length);

    this.ownerProperties = this.allProperties.filter(p => {
      // Check for both cases just to be safe with C# serialization
      const pUserId = p.usuarioId !== undefined ? p.usuarioId : p.UsuarioId;
      return pUserId === landlord.id;
    });

    console.log('Filtered properties:', this.ownerProperties.length);
    this.showOwnerProperties = true;
  }

  closeOwnerProperties() {
    this.showOwnerProperties = false;
    this.ownerProperties = [];
  }

  getImageUrl(url: string | undefined): string {
    if (!url) return 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600';
    if (url.startsWith('http')) return url;
    return `http://localhost:5105${url}`;
  }

  deleteOwner(landlord: Landlord): void {
    if (confirm(`¿Estás seguro de que deseas eliminar al propietario ${landlord.name}? Esto eliminará también TODAS sus propiedades, reservas y reseñas asociadas.`)) {
      this.authService.deleteUser(landlord.id).subscribe({
        next: () => {
          this.landlords = this.landlords.filter(l => l.id !== landlord.id);
          this.loadCities();
          // this.closeModal(); // Removed since modal is gone
          this.cd.detectChanges(); // Force update
          alert('Propietario eliminado correctamente');
        },
        error: (err) => {
          console.error('Error al eliminar propietario', err);
          alert('Error al eliminar propietario: ' + (err.error?.error || 'Error desconocido'));
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
  }

  toggleRentStatus(prop: any, event: Event): void {
    event.stopPropagation(); // Prevent opening something else if card is clickable
    const newStatus = !prop.alquilado;
    this.propiedadesService.toggleRentStatus(prop.id, newStatus).subscribe({
      next: () => {
        prop.alquilado = newStatus;
        alert(`Propiedad marcada como ${newStatus ? 'Alquilada' : 'Disponible'}`);
      },
      error: (err) => console.error('Error updating status', err)
    });
  }

  deleteProperty(prop: any, event: Event): void {
    event.stopPropagation();
    if (confirm(`¿Estás seguro de que deseas eliminar la propiedad "${prop.titulo}"? Esta acción no se puede deshacer.`)) {
      this.propiedadesService.deleteProperty(prop.id).subscribe({
        next: () => {
          this.ownerProperties = this.ownerProperties.filter(p => p.id !== prop.id);
          this.allProperties = this.allProperties.filter(p => p.id !== prop.id); // Update global list too

          // Update owner stats locally if possible
          const owner = this.landlords.find(l => l.id === (prop.usuarioId || prop.UsuarioId));
          if (owner) {
            owner.properties = Math.max(0, owner.properties - 1);
          }

          alert('Propiedad eliminada correctamente');
        },
        error: (err) => {
          console.error('Error deleting property', err);
          alert('Error al eliminar propiedad: ' + (err.error?.error || 'Error desconocido'));
        }
      });
    }
  }
}
