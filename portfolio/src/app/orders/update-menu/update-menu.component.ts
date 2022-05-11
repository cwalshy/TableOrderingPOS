import { Component, OnInit, ViewChild } from "@angular/core";
import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { MatSort } from "@angular/material/sort";
import { Observable } from "rxjs";
import { ProductService } from "src/app/services/products.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { Products } from "../../models/products";
import { AngularFirestore } from "@angular/fire/firestore";
import { ChangeDetectorRef } from "@angular/core";
import { MediaMatcher } from "@angular/cdk/layout";
import { OrdersService } from "src/app/services/orders.service";
import { MatDialog } from "@angular/material/dialog";
import { AddItemComponent } from "./add-item/add-item.component";

class MyDataSource<T> extends DataSource<T> {
  filter: any;
  paginator: any;
  sort: MatSort;
  connect() {
    return this.observable;
  }
  disconnect(collectionViewer: CollectionViewer): void {}

  constructor(private observable: Observable<T[]>) {
    super();
  }
}

@Component({
  selector: "app-update-menu",
  templateUrl: "./update-menu.component.html",
  styleUrls: ["./update-menu.component.css", "../orders.component.css"],
})
export class UpdateMenuComponent implements OnInit {
  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;

  products: Products;

  editButton = true;

  product: any;

  editSave = "Edit";

  dataSource: MatTableDataSource<Products>;

  displayedColumns: string[] = [
    "costOfSales",
    "name",
    "category",
    "subcategory",
    "price",
    "percent",
    "available",
    "edit",
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public dialog: MatDialog,
    private db: AngularFirestore,
    private productService: ProductService,
  ) {
    this.mobileQuery = media.matchMedia("(max-width: 600px)");
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  addItem(): void {
    const dialogRef = this.dialog.open(AddItemComponent, {
      width: "250px",
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
    });
  }

  async ngOnInit(): Promise<void> {
    this.productService
      .getProducts()
      .snapshotChanges()
      .subscribe((data) => {
        this.product = data.map((e) => {
          return {
            id: e.payload.doc.id,
            ...(e.payload.doc.data() as {}),
          } as Products;
        });
        this.editable();
      });
  }
  async editable() {
    this.product.forEach(function (element) {
      element.editable = false;
      element.availablePlaceholder = false;
      element.editSave = "Edit";
    });
    this.dataSource = new MatTableDataSource(this.product);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  onChange(e, row) {
    this.db.collection("products").doc(row.id).update({
      available: e.checked,
    });
  }

  edit(e: any) {
    if (e.editable == false) {
      e.editSave = "Save";

      e.editable = true;
    } else {
      if (e.category == "Spirits") {
        e.percent = "";
      }
      this.db.collection("products").doc(e.id).update({
        name: e.name,
        costOfSales: e.costOfSales,
        category: e.category,
        subcategory: e.subcategory,
        price: e.price,
        percent: e?.percent,
        available: e.available,
      });
      e.editSave = "Edit";

      e.editable = false;
    }
  }
}
