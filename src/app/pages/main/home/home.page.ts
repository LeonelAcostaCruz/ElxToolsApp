import { Component, inject, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  products: Product [] = [];


  ngOnInit() {
  }

  // ===Cerrar Sesion ========
  // signOut() {
  //   this.firebaseSvc.singOut();
  // }

  // obtener datos

  user (){
    return this.utilSvc.getFromLocalStorage('user');
  }

  ionViewWillEnter(){
    this.getProducts();
  }
  getProducts() {
    let path =  `user/${this.user().uid}/products`;

    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next : (res:any)=>{
        console.log(res);
        this.products = res;
        sub.unsubscribe();
      }
    });
  }

  // =======Agregar o actualizar producto ========

  async addUpdateProduct(product?:Product) {

   let success = await this.utilSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal',
      componentProps: {product}

    })

    if (success) this.getProducts();
  }

}
