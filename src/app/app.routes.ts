import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { LoginComponent } from './features/auth/login/login';
import { RegisterComponent } from './features/auth/register/register';
import { AdminPropietarios } from './features/admin-dashboard/propietarios/propietarios';
import { PropietarioDashboard } from './features/propietario-dashboard/dashboard/dashboard';

export const routes: Routes = [
    { path: '', component: Home },

    //Auth
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    //Admin
    { path: 'admin/propietarios', component: AdminPropietarios },

    //Propietario
    { path: 'propietario/dashboard', component: PropietarioDashboard },

];
