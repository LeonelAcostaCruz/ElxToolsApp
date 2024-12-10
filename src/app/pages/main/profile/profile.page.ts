import { User } from './../../../models/user.model';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {


  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  user(): User {
    return this.utilsSvc.getFromLocalStorage('user');
  }

  //Tomar foto
  async takeImage() {

    let user = this.user();
    let path = `user/${user.uid}`

    const dataUrl = (await this.utilsSvc.takePicture()).dataUrl;

    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = `${user.uid}/profile`;
    user.image = await this.firebaseSvc.upLoadImage(imagePath, dataUrl);

    this.firebaseSvc.updateDocument(path, {image: user.image}).then(async res => {

      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Imagen Actualizada exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'check-circle-outline'
      })

    }).catch(error => {
      console.log(error);

      this.utilsSvc.presentToast({
        message: error.message,
        duration: 2500,
        color: 'primary',
        position: 'middle',
        icon: 'alert-circle-outline'
      })

    }).finally(() => {
      loading.dismiss();
    });
  }
}
