import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CheckoutService } from "../services/checkout.service";
import { ProductService } from "../services/products.service";
import { StorageService } from "../services/storage-service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  table;
  datas;
  totalPrice;

  constructor(
    private storageService: StorageService,
    private checkout: CheckoutService,
    private tableNumber: ProductService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    //load table number from url

    //watch cart for changes
    //load table number from url
    this.table = this.activatedRoute.snapshot.paramMap.get("table");
    this.activatedRoute.paramMap.subscribe((params) => {
      this.table = params.get("table");
    });

    this.storageService.watchStorage().subscribe((data: string) => {
      // this will call whenever your localStorage data changes
      // use localStorage code here and set your data here for ngFor
      this.totalPrice = this.storageService.getStorage("cart");
      this.datas = this.storageService.getStorage("data");
    });

    // get table number from service
    this.tableNumber.table = this.table;
    console.log(this.tableNumber.table);
    //retrieve data from cart
    this.totalPrice = this.storageService.getStorage("cart");
  }
}
