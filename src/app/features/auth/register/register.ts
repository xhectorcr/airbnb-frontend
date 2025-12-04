import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  loading: boolean = false;
  successMessage: string = '';
  showPassword: boolean = false;
  showPasswordStrength: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      telefono: ['', [Validators.pattern('^[0-9]{9,15}$')]],
      direccion: ['', [Validators.maxLength(200)]],
      terms: [false, [Validators.requiredTrue]]
    });

    // Mostrar fortaleza de contraseña cuando se empieza a escribir
    this.password?.valueChanges.subscribe(value => {
      this.showPasswordStrength = value && value.length > 0;
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.error = 'Por favor, completa todos los campos requeridos correctamente';
      return;
    }

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    const userData = {
      nombre: this.registerForm.get('nombre')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      telefono: this.registerForm.get('telefono')?.value || '',
      direccion: this.registerForm.get('direccion')?.value || ''
    };

    this.http.post(`${environment.apiUrl}/auth/register`, userData)
      .pipe(
        tap((response: any) => {
          this.loading = false;
          this.successMessage = '¡Registro exitoso! Redirigiendo al login...';
          
          // Mostrar mensaje de éxito por 3 segundos y redirigir
          setTimeout(() => {
            this.router.navigate(['/login'], { 
              queryParams: { registered: 'true', email: userData.email } 
            });
          }, 2000);
        }),
        catchError((error) => {
          this.loading = false;
          
          if (error.status === 400) {
            if (error.error?.errors) {
              // Manejar errores de validación del backend
              const validationErrors = error.error.errors;
              const firstError = Object.values(validationErrors)[0];
              this.error = Array.isArray(firstError) ? firstError[0] : 'Error de validación';
            } else {
              this.error = error.error?.error || 'Error en el registro. Verifica los datos.';
            }
          } else if (error.status === 409) {
            this.error = 'El email ya está registrado. ¿Ya tienes cuenta?';
          } else if (error.status === 0) {
            this.error = 'No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.';
          } else {
            this.error = 'Error del servidor. Intenta nuevamente más tarde.';
          }
          
          // Scroll al error
          setTimeout(() => {
            const errorElement = document.querySelector('.error-message-global');
            if (errorElement) {
              errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 100);
          
          return of(null);
        })
      )
      .subscribe();
  }

  // Método para registro rápido con Google (placeholder)
  loginWithGoogle(): void {
    this.error = 'Registro con Google disponible próximamente 🚀';
  }

  // Método para registro rápido con Facebook (placeholder)
  loginWithFacebook(): void {
    this.error = 'Registro con Facebook disponible próximamente 🚀';
  }

  // Método para calcular fortaleza de contraseña
  getPasswordStrength(): string {
    const password = this.registerForm.get('password')?.value || '';
    if (password.length < 6) return 'weak';
    
    const hasLetters = /[a-zA-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    
    let score = 0;
    if (hasLetters) score++;
    if (hasNumbers) score++;
    if (hasSpecial) score++;
    if (hasUpper) score++;
    if (hasLower) score++;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    if (score >= 6) return 'strong';
    if (score >= 4) return 'medium';
    return 'weak';
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch(strength) {
      case 'weak': return 'Contraseña débil';
      case 'medium': return 'Contraseña media';
      case 'strong': return 'Contraseña fuerte';
      default: return '';
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Getters para acceder fácilmente a los controles
  get nombre(): AbstractControl | null { 
    return this.registerForm.get('nombre'); 
  }
  
  get email(): AbstractControl | null { 
    return this.registerForm.get('email'); 
  }
  
  get password(): AbstractControl | null { 
    return this.registerForm.get('password'); 
  }
  
  get telefono(): AbstractControl | null { 
    return this.registerForm.get('telefono'); 
  }
  
  get direccion(): AbstractControl | null { 
    return this.registerForm.get('direccion'); 
  }
  
  get terms(): AbstractControl | null { 
    return this.registerForm.get('terms'); 
  }
}