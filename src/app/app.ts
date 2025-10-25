import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Header } from "./components/header/header";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
   standalone: true,
  imports: [CommonModule, RouterOutlet ,Header],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
}
