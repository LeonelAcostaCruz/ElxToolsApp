import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource} from '@capacitor/camera';

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
    private router: Router,
    private modalCtrl: ModalController
  ) { }


  async takePicture () {
  return await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.DataUrl,
    source: CameraSource.Prompt,
    promptLabelPhoto: 'Seleccione una imagen',
    promptLabelPicture: 'Toma una foto'
  });
};

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
  //========================modal===========================

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtrl.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }
  dismissModal(data?: any) {
    return this.modalCtrl.dismiss(data);
  }
}
