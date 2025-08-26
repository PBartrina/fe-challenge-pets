import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {provideHttpClient, withFetch} from "@angular/common/http";
import { PETS_API_BASE_URL } from 'data-access-pets';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
      {provide: PETS_API_BASE_URL, useValue: 'https://my-json-server.typicode.com/Feverup/fever_pets_data'
      }
  ],
};
