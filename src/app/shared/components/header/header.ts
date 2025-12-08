import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {
  isMenuOpen = false;

  constructor(private authService: AuthService, private router: Router) { }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  get isLoggedIn(): boolean {
    return this.authService.isAuthenticated;
  }

  logout() {
    this.authService.logout();
    this.toggleMenu();
  }

  editProfile() {
    // If we are already on owner dashboard, we might want to trigger the modal.
    // For simplicity, let's navigate to the dashboard where the modal lives but handling cross-component events is tricky without a shared service.
    // A better approach: The Header is shared, but the "Edit Profile" logic we built is inside `PropietarioDashboard`.

    // OPTION 1: Use a query param to signal the dashboard to open the modal
    const user = this.authService.currentUser;
    if (user?.esAdmin) {
      // Admins might not have this feature yet or it's different.
      // Assuming user wants this mainly for Owners as requested context was about owners.
      alert('La edición de perfil desde aquí está habilitada solo en el Panel de Propietario por ahora.');
    } else {
      // Navigate to owner dashboard with a flag
      this.router.navigate(['/propietario/dashboard'], { queryParams: { editProfile: 'true' } });
    }
    this.toggleMenu();
  }
}
