import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { userReducer } from '@user-mgmt/data-access';
import { UserEffects } from '@user-mgmt/data-access';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideStore({ users: userReducer }),
    provideEffects([UserEffects]),
    provideStoreDevtools({ maxAge: 25, logOnly: false }),
    provideAnimationsAsync(),
  ],
};
