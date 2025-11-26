import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { Header } from './shared/components/header/header';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('airbnb-frontend');

  constructor(public router: Router) { }

  get showFooter(): boolean {
    const currentUrl = this.router.url;
    return !currentUrl.includes('/login') && !currentUrl.includes('/register');
  }
}
