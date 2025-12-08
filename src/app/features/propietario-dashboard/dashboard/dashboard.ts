import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { PropiedadesService, Propiedad, PropiedadCreateDto } from '../../../core/services/propiedades.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'propietario-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class PropietarioDashboard implements OnInit {

  propertyForm: FormGroup;
  properties: Propiedad[] = [];
  editingIndex: number | null = null; // We might need editingId instead
  selectedFiles: File[] = [];


  // Departamentos del Perú
  departamentos: string[] = [
    'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
    'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín',
    'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios',
    'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna',
    'Tumbes', 'Ucayali'
  ];

  // Distritos de Ica (Ejemplo) - Idealmente esto debería filtrarse por departamento
  distritos: string[] = [
    'Ica', 'La Tinguiña', 'Parcona', 'Subtanjalla', 'Los Aquijes', 'Guadalupe', 'Pueblo Nuevo'
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private propiedadesService: PropiedadesService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.propertyForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      tipo: ['', Validators.required], // Add validation
      precioMensual: [0, [Validators.required, Validators.min(1)]],
      habitaciones: [1, [Validators.required, Validators.min(1)]],
      banos: [1, [Validators.required, Validators.min(1)]],
      departamento: ['', Validators.required],
      // distrito: ['', Validators.required],
      direccion: ['', Validators.required],
      amoblado: [false],
      aceptaMascotas: [false]
    });

    // Initialize empty profile form or minimal
    this.profileForm = this.fb.group({
      nombre: [''],
      email: [''],
      telefono: [''],
      direccion: ['']
    });
  }

  ngOnInit(): void {
    this.loadProperties();
    // Check if we need to open the profile modal
    this.route.queryParams.subscribe(params => {
      if (params['editProfile'] === 'true') {
        this.openProfileModal();
      }
    });
  }

  loadProperties() {
    this.propiedadesService.getMyProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading properties', err);
        this.cd.detectChanges();
      }
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.selectedFiles = [];

    if (files.length > 3) {
      alert('Solo puedes subir un máximo de 3 fotos.');
      // Clear the input
      event.target.value = '';
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'image/png') {
        alert(`El archivo "${file.name}" no es PNG. Solo se permiten archivos PNG.`);
        // Clear input and selection
        this.selectedFiles = [];
        event.target.value = '';
        return;
      }
      this.selectedFiles.push(file);
    }
  }

  getImageUrl(url: string | undefined): string {
    if (!url) return 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600';
    if (url.startsWith('http')) return url;
    return `http://localhost:5105${url}`;
  }

  submitProperty() {
    if (this.propertyForm.invalid) return;

    const formValue = this.propertyForm.value;
    const propertyData: PropiedadCreateDto = {
      titulo: formValue.titulo,
      descripcion: formValue.descripcion,
      tipo: formValue.tipo,
      precioMensual: formValue.precioMensual,
      habitaciones: formValue.habitaciones,
      banos: formValue.banos,
      departamento: formValue.departamento,
      direccion: formValue.direccion,
      referencia: '',
      latitud: 0,
      longitud: 0,
      serviciosIncluidos: false,
      internetIncluido: false,
      aguaIncluida: false,
      luzIncluida: false,
      amoblado: formValue.amoblado,
      aceptaMascotas: formValue.aceptaMascotas,
      soloEstudiantes: false,
      fotos: []
    };

    if (this.editingIndex !== null) {
      // ACTUALIZAR PROPIEDAD
      const propId = this.properties[this.editingIndex].id;

      this.propiedadesService.updateProperty(propId, propertyData).subscribe({
        next: (updatedProp) => {
          if (this.selectedFiles.length > 0) {
            this.propiedadesService.uploadPhotos(propId, this.selectedFiles).subscribe({
              next: () => {
                this.finalizeAction('Propiedad actualizada correctamente');
              },
              error: () => {
                this.finalizeAction('Propiedad actualizada, pero error subiendo fotos');
              }
            });
          } else {
            this.finalizeAction('Propiedad actualizada correctamente');
          }
        },
        error: (err) => {
          console.error(err);
          alert('Error al actualizar propiedad');
        }
      });

    } else {
      // CREAR PROPIEDAD
      this.propiedadesService.createProperty(propertyData).subscribe({
        next: (prop) => {
          if (this.selectedFiles.length > 0) {
            this.propiedadesService.uploadPhotos(prop.id, this.selectedFiles).subscribe({
              next: () => this.finalizeAction('¡Propiedad creada exitosamente!'),
              error: () => this.finalizeAction('Propiedad creada, pero error al subir las fotos.')
            });
          } else {
            this.finalizeAction('¡Propiedad creada exitosamente!');
          }
        },
        error: (err) => {
          console.error(err);
          alert('Error al crear la propiedad.');
        }
      });
    }
  }

  finalizeAction(message: string) {
    alert(message);
    this.editingIndex = null;
    this.propertyForm.reset({
      habitaciones: 1,
      banos: 1,
      departamento: '',
      precioMensual: 0,
      amoblado: false,
      aceptaMascotas: false
    });
    this.selectedFiles = [];
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';

    this.loadProperties();
  }

  editProperty(index: number) {
    this.editingIndex = index;
    const prop = this.properties[index];

    // Llenar datos en el formulario
    this.propertyForm.patchValue({
      titulo: prop.titulo,
      descripcion: prop.descripcion,
      tipo: prop.tipo,
      precioMensual: prop.precioMensual,
      habitaciones: prop.habitaciones,
      banos: prop.banos,
      departamento: prop.departamento,
      direccion: prop.direccion,
      amoblado: prop.amoblado,
      aceptaMascotas: prop.aceptaMascotas
    });

    // Scroll hacia arriba para ver el form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProperty(id: number) {
    if (!confirm('¿Estás seguro de eliminar esta propiedad?')) return;

    this.propiedadesService.deleteProperty(id).subscribe({
      next: () => {
        alert('Propiedad eliminada');
        this.loadProperties();
      },
      error: (err) => {
        console.error(err);
        alert('Error al eliminar propiedad');
      }
    });
  }

  cancelEdit() {
    this.editingIndex = null;
    this.propertyForm.reset();
  }

  // Helper method for template if needed (though we use Propiedad interface now)
  getBadgeClass(status: boolean): string {
    return status ? 'disponible' : 'alquilado'; // 'aprobada' is in Propiedad, not status string
  }

  toggleStatus(index: number) {
    // pending implementation
  }

  toggleRentStatus(prop: Propiedad) {
    const action = prop.alquilado ? 'marcar como DISPONIBLE' : 'marcar como ALQUILADO';
    if (!confirm(`¿Estás seguro de que deseas ${action} esta propiedad?`)) {
      return;
    }

    const newStatus = !prop.alquilado;
    this.propiedadesService.toggleRentStatus(prop.id, newStatus).subscribe({
      next: () => {
        prop.alquilado = newStatus;
        this.cd.detectChanges(); // Force UI update
      },
      error: (err) => {
        console.error('Error updating status', err);
        alert('Error al actualizar el estado.');
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  // Profile Logic
  isProfileModalOpen = false;
  profileForm: FormGroup;

  initProfileForm() {
    const user = this.authService.currentUser;
    this.profileForm = this.fb.group({
      nombre: [user?.nombre || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      telefono: [user?.telefono || ''],
      direccion: [user?.direccion || ''] // Assuming direccion exists on User type now
    });
  }

  openProfileModal() {
    this.initProfileForm();
    this.isProfileModalOpen = true;
  }

  closeProfileModal() {
    this.isProfileModalOpen = false;
  }

  updateProfile() {
    if (this.profileForm.invalid) return;

    this.authService.updateProfile(this.profileForm.value).subscribe({
      next: (updatedUser) => {
        alert('Perfil actualizado correctamente');
        this.closeProfileModal();
        // Update local user state if needed, authService should handle subject update usually
      },
      error: (err) => {
        console.error('Error updating profile', err);
        alert('Error al actualizar perfil');
      }
    });
  }
}

