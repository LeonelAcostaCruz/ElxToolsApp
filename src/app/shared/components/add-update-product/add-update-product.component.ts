
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent implements OnInit {

  @Input() product: Product;

  form = new FormGroup({
    image: new FormControl('', [Validators.required]),
    id: new FormControl(''),

    tool: new FormControl(null, [Validators.required, Validators.min(3)]),
    press: new FormControl(null, [Validators.required, Validators.min(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(20)]),
    breakDownDate: new FormControl(null, [Validators.required]),
    breakDownTurn: new FormControl(null, [Validators.required]),
    status: new FormControl('', [Validators.required, Validators.minLength(4)]),
    requiredDate: new FormControl(null, [Validators.required]), 
    coments: new FormControl('', [Validators.required, Validators.minLength(4)]),
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;


  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }

  //Tomar foto
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture()).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {

      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }


  // conversor de  String  a number

    // setNumberInputs(){
    //   let {horaEntrega} = this.form.controls;
    //   if(horaEntrega.value){
    //     horaEntrega.setValue(parseInt(horaEntrega.value));
    //   }
    // }

  // create product

  async createProduct() {

    let path = `user/${this.user.uid}/products`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    // Subir imagen y obtener url
    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.upLoadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id

    this.firebaseSvc.addDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Tool creado exitosamente',
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

  }// fin crear tool


  //update Tool
  async updateProduct() {

    let path = `user/${this.user.uid}/products/${this.product.id}`

    const loading = await this.utilsSvc.loading();
    await loading.present();

    // si cambio la imagen, subir nueva y obtiene url

    if (this.form.value.image !== this.product.image) {
    let dataUrl = this.form.value.image;
    let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
    let imageUrl = await this.firebaseSvc.upLoadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);
    }//fin if image por usuario
    delete this.form.value.id

    this.firebaseSvc.updateDocument(path, this.form.value).then(async res => {

      this.utilsSvc.dismissModal({ success: true });

      this.utilsSvc.presentToast({
        message: 'Producto Actualizado exitosamente',
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
  }//fin editar


}

