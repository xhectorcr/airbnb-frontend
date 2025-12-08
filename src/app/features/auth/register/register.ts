import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  error: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      birthdate: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.error = '';
      this.successMessage = '';
      const { firstName, lastName, email, phone, password } = this.registerForm.value;
      const userData = {
        nombre: `${firstName} ${lastName}`,
        email,
        password,
        telefono: phone
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.error = 'Error al registrar el usuario. Intenta con otro correo.';
          console.error('Register error:', err);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  loginWithGoogle(): void {
    console.log('Register with Google');
  }

  loginWithFacebook(): void {
    console.log('Register with Facebook');
  }
}
