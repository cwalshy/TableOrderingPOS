
import { Component, OnInit, ViewChild } from '@angular/core';
import {OrdersService} from '../services/orders.service';
import {Orders} from '../models/orders';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { Observable, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';



class MyDataSource<T> extends DataSource<T> {
  filter: any;
  paginator: any;
  sort: MatSort;
  connect() {
    return this.observable;
}
  disconnect(collectionViewer: CollectionViewer): void {

  }

  constructor(private observable: Observable<T[]>) {
    super();
  }

}



@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})


export class OrdersComponent  implements OnInit
{



  mobileQuery: MediaQueryList;

  private _mobileQueryListener: () => void;


  columnsToDisplay = ['timestamp','tableNumber','totalCost','orderCompleted' ];

  orders;
  dataSource: MyDataSource<any>;
  expandedElement: MyDataSource<any> | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private db: AngularFirestore, private ordersService: OrdersService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }
//retrieve orders from database
  ngOnInit() {
    this.dataSource = new MyDataSource(this.ordersService.getOrders().valueChanges());
    // return this.db.collection('orders', ref => ref.orderBy('timestamp', 'desc')).snapshotChanges();

   this.ordersService.getOrders().snapshotChanges().subscribe(data => {
        this.orders = data.map(e => {
          return {
            id: e.payload.doc.id,
            ...e.payload.doc.data() as {}
          } as Orders;
        });
      });
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  completeOrder(id) {
  this.db.collection('orders').doc(id).update({orderCompleted: true});
  }
}

