// src/app/shared/not-found/not-found.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-not-found',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center">
      <h1 class="text-3xl font-bold mb-4">Page not found</h1>
      <a routerLink="/" class="text-blue-600 underline">Go home</a>
    </div>
  `,
})
export class NotFoundComponent {}
