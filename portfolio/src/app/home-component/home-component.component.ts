import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { ProductService } from "../services/products.service";

@Component({
  selector: "app-home-component",
  templateUrl: "./home-component.component.html",
  styleUrls: ["./home-component.component.css"],
})
export class HomeComponentComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private productsService: ProductService
  ) {}
  id;
  route;
  table;
  shoppingCart = faShoppingCart;

  ngOnInit() {
    this.productsService.getProducts();

    this.table = this.activatedRoute.snapshot.paramMap.get("table");
    this.activatedRoute.paramMap.subscribe((params) => {
      this.table = params.get("table");
    });
  }
}
