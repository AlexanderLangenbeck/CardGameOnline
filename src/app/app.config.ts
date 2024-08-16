import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => 
    initializeApp({apiKey: "AIzaSyC31gIWMrgWzTBZuk3bZxzed3JEGSUklHA",
      "authDomain": "ringoffire-398bd.firebaseapp.com",
      "projectId": "ringoffire-398bd",
      "storageBucket": "ringoffire-398bd.appspot.com",
      "messagingSenderId": "835032345509",
      "appId": "1:835032345509:web:27dde493a2d0de216d564c"}))), 
    importProvidersFrom(provideFirestore(() => getFirestore())), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"ringoffire-398bd","appId":"1:835032345509:web:27dde493a2d0de216d564c","storageBucket":"ringoffire-398bd.appspot.com","apiKey":"AIzaSyC31gIWMrgWzTBZuk3bZxzed3JEGSUklHA","authDomain":"ringoffire-398bd.firebaseapp.com","messagingSenderId":"835032345509"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]};

 