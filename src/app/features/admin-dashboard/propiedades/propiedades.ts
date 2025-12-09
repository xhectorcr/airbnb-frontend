import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropiedadesService, Propiedad } from '../../../core/services/propiedades.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Category {
    id: string;
    name: string;
    icon: string;
}

@Component({
    selector: 'app-admin-propiedades',
    templateUrl: './propiedades.html',
    styleUrls: ['./propiedades.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule]
})
export class AdminPropiedades implements OnInit {

    activeCategory: string = 'all';
    selectedDepartamento: string = 'all';

    listings: any[] = []; // Changed to any[] to accommodate admin extra fields if needed

    modalOpen: boolean = false;
    selectedListing: any | null = null;

    categories: Category[] = [
        { id: 'all', name: 'Todo', icon: '🏠' },
        { id: 'Casa', name: 'Casa', icon: '🏡' },
        { id: 'Depa', name: 'Departamentos', icon: '🏢' },
        { id: 'Cuarto', name: 'Cuarto', icon: '🛏️' },
        { id: 'disponible', name: 'Disponible', icon: '🟢' },
        { id: 'alquilado', name: 'Alquilado', icon: '🔴' }
    ];

    departamentos: string[] = [
        'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
        'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
        'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios',
        'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna',
        'Tumbes', 'Ucayali'
    ];

    constructor(
        private propiedadesService: PropiedadesService,
        private cd: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.propiedadesService.getAdminAllProperties().subscribe({
            next: (response) => {
                console.log('Admin Properties loaded:', response);
                this.listings = response || [];
                // Force change detection manually to ensure view updates
                this.cd.detectChanges();
            },
            error: (err) => {
                console.error('Error fetching admin properties', err);
            }
        });
    }

    /** FILTRADO DINÁMICO */
    get filteredListings(): any[] {
        return this.listings.filter(item => {
            let matchCategory = true;

            if (this.activeCategory === 'all') {
                matchCategory = true;
            } else if (this.activeCategory === 'disponible') {
                matchCategory = !item.alquilado;
            } else if (this.activeCategory === 'alquilado') {
                matchCategory = item.alquilado;
            } else {
                matchCategory = item.tipo === this.activeCategory;
            }

            const matchDepartamento =
                this.selectedDepartamento === 'all' || item.departamento === this.selectedDepartamento;

            return matchCategory && matchDepartamento;
        });
    }

    setActiveCategory(id: string) {
        this.activeCategory = id;
    }

    setDepartamento(dep: string) {
        this.selectedDepartamento = dep;
    }

    /** MODAL: ABRIR */
    openModal(listing: any) {
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

    // Admin Actions
    sendMessage(prop: any) {
        if (prop.propietarioTelefono) {
            window.open(`https://wa.me/51${prop.propietarioTelefono}`, '_blank');
        } else {
            alert('El propietario de esta propiedad no tiene número de teléfono registrado.');
        }
    }

    toggleApproval(prop: any) {
        const newState = !prop.aprobada;
        const action = newState ? 'activar' : 'desactivar';

        if (confirm(`¿Estás seguro de que deseas ${action} esta propiedad?`)) {
            this.propiedadesService.approveProperty(prop.id, newState).subscribe({
                next: () => {
                    prop.aprobada = newState;
                    // alert(`Propiedad ${newState ? 'activada' : 'desactivada'} correctamente`);
                },
                error: (err) => {
                    console.error('Error toggling approval', err);
                    alert('Error al cambiar el estado de la propiedad');
                }
            });
        }
    }

    deleteProperty(prop: any) {
        if (confirm(`¿Estás seguro de que deseas eliminar la propiedad "${prop.titulo}"?`)) {
            this.propiedadesService.deleteProperty(prop.id).subscribe({
                next: () => {
                    this.listings = this.listings.filter(p => p.id !== prop.id);
                    this.closeModal();
                    alert('Propiedad eliminada correctamente');
                },
                error: (err) => {
                    console.error('Error deleting property', err);
                    alert('Error al eliminar propiedad');
                }
            });
        }
    }
}
