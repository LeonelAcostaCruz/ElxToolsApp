import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  UtilsSvc = inject(UtilsService);

  // ----------------------------Autentication------------------------------------
  getAuth() {
    return getAuth();
  }

  // ----------------------------Acceder--------------------------------
  sigIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // -------------Crear Usuario---------------
  sigUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  // -------------Actualizar Usuario---------------
  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })
  }

  //====Enviar email para restablecer contraseña----------------

  sendRecoverEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email);
  }

  // ==Cerrar sesion =================================
  singOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.UtilsSvc.routerLink('/auth');
  }


  // =======Base De Datos =================================


  //setear un documento ======

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }

  //==get document==
  async getDocument(path: string) {
    return  (await getDoc(doc(getFirestore(), path))).data();
  }

}
