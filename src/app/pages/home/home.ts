import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropiedadesService, Propiedad } from '../../core/services/propiedades.service';

interface Category {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Home implements OnInit {

  activeCategory: string = 'all';
  selectedDepartamento: string = 'all';
  filterPrice: number | null = null;

  listings: Propiedad[] = [];

  modalOpen: boolean = false;
  selectedListing: Propiedad | null = null;

  categories: Category[] = [
    { id: 'all', name: 'Todo', icon: '🏠' },
    { id: 'Casa', name: 'Casa', icon: '🏡' },
    { id: 'Depa', name: 'Departamentos', icon: '🏢' },
    { id: 'Cuarto', name: 'Cuarto', icon: '🛏️' }
  ];

  departamentos: string[] = [
    'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
    'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
    'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios',
    'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna',
    'Tumbes', 'Ucayali'
  ];

  constructor(private propiedadesService: PropiedadesService) { }

  ngOnInit() {
    this.propiedadesService.getAllProperties().subscribe({
      next: (response) => {
        this.listings = response.propiedades || [];
      },
      error: (err) => {
        console.error('Error fetching properties', err);
      }
    });
  }

  /** FILTRADO DINÁMICO */
  get filteredListings(): Propiedad[] {
    return this.listings.filter(item => {
      const matchCategory =
        this.activeCategory === 'all' || item.tipo === this.activeCategory;

      const matchDepartamento =
        this.selectedDepartamento === 'all' || item.departamento === this.selectedDepartamento;

      let matchPrice = true;
      if (this.filterPrice !== null && this.filterPrice > 0) {
        const min = this.filterPrice - 50;
        const max = this.filterPrice + 50;
        matchPrice = item.precioMensual >= min && item.precioMensual <= max;
      }

      return matchCategory && matchDepartamento && matchPrice;
    });
  }

  setActiveCategory(id: string) {
    this.activeCategory = id;
  }

  setDepartamento(dep: string) {
    this.selectedDepartamento = dep;
  }


  /** MODAL: ABRIR */
  openModal(listing: Propiedad) {
    this.selectedListing = listing;
    this.modalOpen = true;

    // Evita que el body se mueva detrás del modal
    document.body.style.overflow = 'hidden';
  }

  /** MODAL: CERRAR */
  closeModal() {
    this.modalOpen = false;
    this.selectedListing = null;

    document.body.style.overflow = 'auto';
  }
  getImageUrl(url: string | undefined): string {
    if (!url) return 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600';
    if (url.startsWith('http')) return url;
    return `http://localhost:5105${url}`;
  }

  contactOwner(listing: any) {
    if (listing?.propietarioTelefono) {
      window.open(`https://wa.me/51${listing.propietarioTelefono}`, '_blank');
    } else {
      alert('Este propietario no tiene número de teléfono registrado.');
    }
  }
}
