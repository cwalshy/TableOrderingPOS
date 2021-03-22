import { Component, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {StorageService} from '../../services/storage-service';
import {ProductService} from '../../services/products.service';
// import {ProductPopupComponent} from '../../product-popup/product-popup.component';
import {Products} from '../../models/products';
import { ActivatedRoute } from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import { ToastrService } from 'ngx-toastr';      

import { AngularFirestore } from '@angular/fire/firestore';
import { async } from '@angular/core/testing';

interface Mixer {
  value: string;
  viewValue: string;
}

  @Component({
  selector: 'product',
  templateUrl: './product.component.html',
  styleUrls: ['./products.css','./product.component.css'],

})



export class ProductComponent implements AfterViewInit  {
  cart = {};
  totalPrice = 0;
  cartProductList = [];
  productExistInCart;
  datas;
  productId;
  itemCollection;
  item;
  products: Products;
  quantity = 1;
  buttonContent = 'Add To Cart'
  table;
  mixer;
  selectedMixer: string;


  mixers: Mixer[] = [
    {value: 'lemonade', viewValue: 'Lemonade'},
    {value: 'pepsi', viewValue: 'Pepsi'},
    {value: 'pepsiMax', viewValue: 'Pepsi Max'},
    {value: 'solo', viewValue: 'Solo'},
    {value: 'Soda', viewValue: 'Soda'},
    {value: 'tonic', viewValue: 'Tonic'},
  ];  


  constructor(private toastr: ToastrService, private db: AngularFirestore, private activatedRoute: ActivatedRoute, private productService: ProductService, public dialog: MatDialog, private storageService: StorageService
    )  {

    }

  
  
  ngAfterViewInit() {
    this.table = this.productService.table;
    this.productId = this.activatedRoute.snapshot.paramMap.get("id")
    console.log(this.productId)
    this.activatedRoute.paramMap.subscribe(params => {
      this.productId = params.get("id")
    this.productId.toLocaleString();
    })

    this.loadProducts();
  }
  
   loadProducts() {
    this.productService.getProductsBy(this.productId).subscribe(res => {
      this.products= { id: res.payload.id, ...res.payload.data() as Products };
    },
    err => {
      console.debug(err);
    }
  )
}
  

 
   successmsg(item, quantity){  
    this.toastr.success( `${quantity} x ${item}  added to cart`, 'Success')  
}  
alertmsg(item){  
  this.toastr.error( `${item}  removed from cart`, 'Success')  
}  
errorNoMixer() {
  this.toastr.error('Please select a mixer');
}

   add() {
    this.buttonContent = 'Add To Cart'
    this.quantity ++;

   }
   minus() {

    if(this.quantity > 0) {

        this.quantity --;
  
      } else {

  }
  if (this.quantity < 1) {

    this.buttonContent = 'Remove From Cart';

  }
}

  // add to cart
  addToCart(itemName, price, id, quantity) {
    
    if (this.products.category == 'Spirits') {
      if(this.selectedMixer == undefined) {
        this.errorNoMixer();
        return;
      }
      else 

      itemName = itemName + ' & ' + this.selectedMixer;

    }

    if(this.quantity == 0) {

      let name = itemName;
      
      this.datas = this.storageService.getStorage('data');

      this.productExistInCart = this.datas.findIndex(({itemName}) => itemName === name); 

      console.log(this.productExistInCart);

      if (this.productExistInCart > -1) {
        this.datas.splice(this.productExistInCart, 1);
        this.storageService.store('data', this.datas);
        this.alertmsg(itemName);
      }
    } else {


    //store local storage in datas variable
    
    this.datas = this.storageService.getStorage('data');

    //if datas is not empty search data for item
    if (this.datas != null) {
  
      let name = itemName;

//    index of item in cart 
      this.productExistInCart = this.datas.findIndex(({itemName}) => itemName === name); 

      if(this.productExistInCart !< 0) {
  
        this.datas.push({itemName, price, id, quantity}); 


        this.storageService.store('data', this.datas);
        } else {
          console.log(this.quantity);

        this.datas[this.productExistInCart].quantity = this.quantity;
        this.storageService.store('data', this.datas);
        this.storageService.calculateTotal();
        this.successmsg(itemName, quantity);

        // localStorage.setItem('data', JSON.stringify(this.datas));
      return;
      }
      this.storageService.calculateTotal();
      this.successmsg(itemName, quantity);

    }
    else {


  
      this.cartProductList.push({itemName, price, id, quantity}); // enhance "product" object with "num" property)
  
  
      // localStorage.setItem('data', JSON.stringify(this.cartProductList));
      this.storageService.store('data', this.cartProductList);
      // const name = itemName;
      
      // this.productExistInCart = this.datas.findIndex(({itemName}) => itemName === name); // find product by name
    
      // console.log(this.productExistInCart);
     
      this.successmsg(itemName, quantity);


      
      this.storageService.calculateInitial(quantity, price);


      return;
      }
      this.storageService.calculateTotal();
    }

  }
}


