import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/products.service';
import { StorageService } from '../services/storage-service';

@Component({
  selector: 'qapp-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements AfterViewInit {

  constructor( private activatedRoute: ActivatedRoute, private tableNumber: ProductService, private storageService: StorageService) {
    
  }
  id;
  route;
  table
  stripe;
  datas;

  ngAfterViewInit() {
    //load table number from url
    this.table = this.activatedRoute.snapshot.paramMap.get("table")
    console.log(this.table)
    this.activatedRoute.paramMap.subscribe(params => {
      this.table = params.get("table")
    })
    //load stripe checkout url
    this.stripe = this.activatedRoute.snapshot.paramMap.get("stripe-checkout")
    console.log(this.stripe)
    this.activatedRoute.paramMap.subscribe(params => {
      this.stripe = params.get("stripe-checkout")
    })
    //pass table number into service to store
    this.tableNumber.table=this.table;
    this.storageService.store('table', this.table);

    this.clearCart();
  
  
  }
// clear cart if stripe checjout success
  clearCart() {
    if(this.stripe == 'success') {
      this.storageService.store('data', 0);
      this.storageService.clear('data');
    }
  }

}
