import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';

  loginType: 'admin' | 'owner' = 'owner'; // Default to admin or owner

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  setLoginType(type: 'admin' | 'owner'): void {
    this.loginType = type;
    this.error = ''; // Clear errors when switching
    this.loginForm.reset();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          const isUserAdmin = response.usuario.esAdmin;

          // Validación de Rol según la pestaña seleccionada
          if (this.loginType === 'admin') {
            if (isUserAdmin) {
              this.router.navigate(['/admin/propietarios']);
            } else {
              this.error = 'Esta cuenta no es de administrador';
            }
          } else { // owner
            if (!isUserAdmin) {
              this.router.navigate(['/propietario/dashboard']);
            } else {
              this.error = 'Esta cuenta es de administrador, usa la opción correspondiente.';
            }
          }
        },
        error: (err) => {
          this.error = 'Credenciales inválidas o error en el servidor';
          console.error('Login error:', err);
        }
      });
    }
  }

  loginWithGoogle(): void {
    // Implement Google login
    console.log('Login with Google');
  }

  loginWithFacebook(): void {
    // Implement Facebook login
    console.log('Login with Facebook');
  }
}
