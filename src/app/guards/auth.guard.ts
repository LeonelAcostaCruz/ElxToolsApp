import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';
import { getAuth } from 'firebase/auth';




export const authGuard: CanActivateFn = (route, state) => {


  const firebaseSvc = inject(FirebaseService); // Uso correcto de `inject`
  const utilSvc = inject(UtilsService);



  return new Promise((resolve) => {

    firebaseSvc.getAuth().onAuthStateChanged((auth) => {

      if (!auth) resolve(true); // por si no esta log
      else {
        utilSvc.routerLink('/auth');
        resolve(false);
      }
    })

  });
}

