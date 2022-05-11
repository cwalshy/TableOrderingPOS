import {
  Component,
  AfterViewInit,
  ElementRef,
} from "@angular/core";
import { Products } from "../../models/products";
import { ProductService } from "../../services/products.service";
import { ActivatedRoute } from "@angular/router";
import { StorageService } from "src/app/services/storage-service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./products.css"],
  styles: [``],
})
export class ProductListComponent implements AfterViewInit {
  processingOngoing = false;
  products: Products[];
  newProductList = {};
  id;
  route;
  table: any;
  stripe;
  datas;
  cartProductList = [];
  productExistInCart;
  wineGlass: boolean = false;
  wineBottle: boolean = false;
  vodka: boolean = false;
  bottled: boolean = false;
  tapBeer: boolean = false;
  spirits: boolean = false;
  whiskey: boolean = false;
  gin: boolean = false;
  rum: boolean = false;
  drinks: boolean = false;
  cocktails: boolean = false;
  food: boolean = false;
  tequila: boolean = false;
  beers: boolean = false;
  wines: boolean = false;
  redWine: boolean = false;
  whiteWine: boolean = false;
  sparklingWine: boolean = false;
  nonAlcoholic: boolean = false;
  mocktails: boolean = false;
  softDrinks: boolean = false;
  starters: boolean = false;
  main: boolean = false;
  side: boolean = false;
  deserts: boolean = false;
  hidden = "+";

  constructor(
    private elementRef: ElementRef,
    private activatedRoute: ActivatedRoute,
    private tableNumber: ProductService,
    private storageService: StorageService,
    private productService: ProductService
  ) {}
  ngAfterViewInit() {

      // load products from firestore via service
    this.loadProducts();
    // set table number
    this.table = this.tableNumber.table;
    // load stripe checkout url
    this.stripe = this.activatedRoute.snapshot.paramMap.get("stripe-checkout");
    this.activatedRoute.paramMap.subscribe((params) => {
      this.stripe = params.get("stripe-checkout");
    });
    this.clearCart();
  }
  // clear cart if stripe checkout success
  clearCart() {
    if (this.stripe == "success") {
      this.storageService.store("data", 0);
      this.storageService.clear("data");
      this.storageService.store("cart", 0);
    }
  }
  loadProducts() {
    this.productService
    .getProducts()
    .snapshotChanges()
    .subscribe((data) => {
      this.products = data.map((e) => {
        return {
          id: e.payload.doc.id,
          ...(e.payload.doc.data() as {}),
        } as Products;
      });
      return this.groupByType(this.products);
    })
  }
  groupByType(array){
    return array.reduce((r, a) => {
          r[a.subcategory] = r[a.subcategory] || [];
          r[a.subcategory].push(a);
          return r;
      }, Object.create(null));
  }
  showCat(item) {
    // Handle the event
    switch (item) {
      case "vodka":
        this.vodka = !this.vodka;
        break;
      case "rum":
        this.rum = !this.rum;
        break;
      case "whiskey":
        this.whiskey = !this.whiskey;
        break;
      case "drinks":
        this.drinks = !this.drinks;
        break;
      case "tequila":
        this.tequila = !this.tequila;
        break;
      case "çocktails":
        this.cocktails = !this.cocktails;
        break;
      case "food":
        this.food = !this.food;
        break;
      case "beers":
        this.beers = !this.beers;
        break;
      case "tapBeer":
        this.tapBeer = !this.tapBeer;
        break;
      case "bottled":
        this.bottled = !this.bottled;
        break;
      case "spirits":
        this.spirits = !this.spirits;
        break;
      case "wines":
        this.wines = !this.wines;
        break;
      case "redWine":
        this.redWine = !this.redWine;
        break;
      case "whiteWine":
        this.whiteWine = !this.whiteWine;
        break;
      case "sparklingWine":
        this.sparklingWine = !this.sparklingWine;
        break;
      case "nonAlcoholic":
        this.nonAlcoholic = !this.nonAlcoholic;
        break;
      case "mocktails":
        this.mocktails = !this.mocktails;
        break;
      case "softDrinks":
        this.softDrinks = !this.softDrinks;
        break;
      case "starters":
        this.starters = !this.starters;
        break;
      case "main":
        this.main = !this.main;
        break;
      case "deserts":
        this.deserts = !this.deserts;
        break;
      case "gin":
        this.gin = !this.gin;
        break;
    }
  }
}
