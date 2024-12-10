import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { orderBy } from 'firebase/firestore';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  products: Product[] = [];
  loading: boolean = false;


  ngOnInit() {
  }

  // ===Cerrar Sesion ========
  // signOut() {
  //   this.firebaseSvc.singOut();
  // }

  // obtener datos tools

  user(): User {
    return this.utilSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getProducts();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getProducts();
      event.target.complete();
    }, 1000);
  }
  getProducts() {
    let path = `user/${this.user().uid}/products`;

    this.loading = true;

    let query = (
      orderBy('horaEntrega', 'desc' )
    )

    let sub = this.firebaseSvc.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.products = res;

        this.loading = false;

        sub.unsubscribe();
      }
    });
  }

  // =======Agregar o actualizar producto ========

  async addUpdateProduct(product?: Product) {

    let success = await this.utilSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: { product }

    })

    if (success) this.getProducts();
  }

  async confirmDeleteProduct(product: Product) {
    this.utilSvc.presentAlert({
      header: 'Confirmar Eliminación!',
      message: '¿Está seguro de eliminar este producto?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar'
        }, {
          text: 'Sí, Eliminar',
          handler: () => {
            this.deleteProduct(product);
          }
        }
      ]
    });
  }

  //eliminar Tool
  async deleteProduct(product: Product) {

    let path = `user/${this.user().uid}/products/${product.id}`

    const loading = await this.utilSvc.loading();
    await loading.present();

    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);


    this.firebaseSvc.deleteDocument(path).then(async res => {

      this.products = this.products.filter(p => p.id !== product.id);

      this.utilSvc.presentToast({
        message: 'Producto Eliminado exitosamente',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'check-circle-outline'
      })

    }).catch(error => {
      console.log(error);

      this.utilSvc.presentToast({
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
