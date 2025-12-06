import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

interface Property {
  name: string;
  description: string;
  phone: string;
  type: string;
  department: string;
  status: 'disponible' | 'alquilado';
}

@Component({
  selector: 'propietario-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class PropietarioDashboard {

  propertyForm: FormGroup;

  departments: string[] = [
    'Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca',
    'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad',
    'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco',
    'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'
  ];

  properties: Property[] = [
    {
      name: 'Casa de Playa',
      description: 'Hermosa casa frente al mar con 3 habitaciones.',
      phone: '+52 999 123 4567',
      type: 'casa',
      department: 'Lima',
      status: 'disponible'
    },
    {
      name: 'Departamento Centro',
      description: 'Departamento moderno en el corazón de la ciudad.',
      phone: '+52 555 987 6543',
      type: 'departamento',
      department: 'Cusco',
      status: 'alquilado'
    }
  ];

  editingIndex: number | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.propertyForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      phone: ['', Validators.required],
      type: ['casa', Validators.required],
      department: ['', Validators.required]
    });
  }

  submitProperty() {
    if (this.propertyForm.invalid) return;

    if (this.editingIndex !== null) {
      // Update existing
      const updatedProp = {
        ...this.properties[this.editingIndex],
        ...this.propertyForm.value
      };
      this.properties[this.editingIndex] = updatedProp;
      this.cancelEdit();
    } else {
      // Create new
      const newProperty: Property = {
        ...this.propertyForm.value,
        status: 'disponible'
      };
      this.properties.push(newProperty);
      this.propertyForm.reset({ type: 'casa' });
    }
  }

  editProperty(index: number) {
    this.editingIndex = index;
    const prop = this.properties[index];
    this.propertyForm.patchValue({
      name: prop.name,
      description: prop.description,
      phone: prop.phone,
      type: prop.type,
      department: prop.department
    });
  }

  cancelEdit() {
    this.editingIndex = null;
    this.propertyForm.reset({ type: 'casa' });
  }

  toggleStatus(index: number) {
    const prop = this.properties[index];
    prop.status = prop.status === 'disponible' ? 'alquilado' : 'disponible';
  }

  logout() {
    this.authService.logout();
  }
}
