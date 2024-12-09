import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class UtilsService {

  // loadingCtrl = Inject (LoadingController);
  // toastCtrl = Inject (ToastController);
  // router = Inject (Router);

  constructor(
    private loadingCtrl: LoadingController, //metodo correcto. usando en constructor
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  // ====================Loading===========================

  loading() {
    return this.loadingCtrl.create({ spinner: 'crescent' })
  }

  // =======Toast=============
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts)

    toast.present();
  }

  //========================Enruta a cualquier ruta disponible===========================
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //========================Guarda un elemento en localstorage===========================

  saveLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //========================Obtiene un elemento del localstorage===========================
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key))
  }
}
