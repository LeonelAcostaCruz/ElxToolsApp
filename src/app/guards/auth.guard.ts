import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { getAuth } from 'firebase/auth';




export const authGuard: CanActivateFn = (route, state) => {


  const firebaseSvc = inject(FirebaseService); // Uso correcto de `inject`
  const utilSvc = inject(UtilsService);

  let user = localStorage.getItem('user');

  return new Promise((resolve) => {

    firebaseSvc.getAuth().onAuthStateChanged((auth) => {

      if (auth) {
        if (user) resolve(true);
      }
      else {
        utilSvc.routerLink('/auth');
        resolve(false);
      }
    })
  });
}

