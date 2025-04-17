import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query,updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL,deleteObject } from 'firebase/storage';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  UtilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);

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
  singOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.UtilsSvc.routerLink('/auth');
  }


  // =======Base De Datos =================================

  // =======Base De Datos ==============
  getCollectionData(paht: string, collectionQuery?: any) {
    const ref= collection(getFirestore(),paht);
    return collectionData(query(ref, collectionQuery), {idField:'id'});
  }


  //setear un documento ======

  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data);
  }


  //actualizar un documento ======

  updateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data);
  }

  //==borrar un documento==

  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path));
  }

  //==get document==
  async getDocument(path: string) {
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  // Aggregar un doc
  addDocument(path: string, data: any) { // productos = tools
    return addDoc(collection(getFirestore(), path), data);
  }

  // almacenamiento de Fire storage

  async upLoadImage(path: string, data_url: string) { //ikmagen especificamente
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  //obtener ruta de la imagen con su url

  async getFilePath(url: string){
    return ref(getStorage(), url).fullPath
    }//getFilePath

    deleteFile(path: string){
      return deleteObject(ref(getStorage(), path));
    }
}
