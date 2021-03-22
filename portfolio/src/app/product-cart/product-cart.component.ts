import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { storage } from 'firebase';
import { Products } from '../models/products';
import { CheckoutService } from '../services/checkout.service';
import { StorageService } from '../services/storage-service';
// import { AuthService } from '../auth.service';
import {EventEmitter, Output, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {AngularFireAuth} from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { ProductService } from '../services/products.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-cart',
  templateUrl: './product-cart.component.html',
  styleUrls: ['../product-list/item-req/item-req.component.css','./product-cart.component.css']
})
export class ProductCartComponent implements OnInit {

  datas;
  test;
  cart = 0;
  purchaseStarted = false;
  confirmation: any;
  loading = false;
  producta: Products[];
  stripe;
  table;
  total;
  products
  constructor(private productService: ProductService, private storageService: StorageService, private checkout: CheckoutService, private tableNumber: ProductService, private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
      this.productService.getProducts().snapshotChanges().subscribe(data => {
        this.products = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as {}
          } as Products;
        });
      });
    // get table number from service
    this.table = this.tableNumber.table;
    console.log(this.table);
    //retrieve data from cart
    this.datas = this.storageService.getStorage('data');
    this.total = this.storageService.getStorage('cart');

    //watch cart for changes
    this.storageService.watchStorage().subscribe((data:string) => {
    // this will call whenever your localStorage data changes
    // use localStorage code here and set your data here for ngFor
    this.total = this.storageService.getStorage('cart');

    this.datas = this.storageService.getStorage('data');

    }) 
  } 
  
// clear cart if stripe checjout success
clearCart() {
    this.datas = [];
    this.storageService.clear('data');
    let cart;
    let totalPrice = 0;
    let cartLength = 0  
    cart = {totalPrice, cartLength};
    this.storageService.store('cart', cart);


}
deleteItem(itemName) {
  this.datas = this.storageService.getStorage('data');
    const res = this.datas.filter(obj => obj.itemName !== itemName);
    this.storageService.store('data', res);
    this.storageService.calculateTotal();
}
  //stripe redirect to checkout function using checkout service 
  purchaseCourse() {
    this.datas = this.storageService.getStorage('data');
    let notAvailable = [];

    this.products.forEach(element => {

      if (element.available == false) {

        this.datas.forEach(data => {
          if(data.id == element.id)
          notAvailable.push(element.name + " is no longer available");

        });
      }
    });
    if(notAvailable.length > 0 ) {
    
      notAvailable.forEach(element => {
        alert(notAvailable);
});      
    }
    else {
    this.purchaseStarted = true;
    console.log(this.checkout.productList);
    
    if(this.table === null ) 
     {
       console.log('error');
      window.alert('error occured');
      return;
    }
    else
    {
    this.checkout.startCheckoutSession(this.datas, this.table)
    .subscribe(
      session => {
        this.checkout.redirectToCheckout(session);
              },
        err => {
            console.log('Error creating checkout session..', err);
            this.purchaseStarted = false;
          });
    }}


  }
  

}
