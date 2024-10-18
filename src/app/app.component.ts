import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RatesComponent } from './components/rates/rates.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RatesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {}
