import { Injectable, OnDestroy } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { share } from "rxjs/operators";

@Injectable()
export class StorageService implements OnDestroy {
  private onSubject = new Subject<{ key: string; value: any }>();
  public changes = this.onSubject.asObservable().pipe(share());
  private storageSub = new Subject<String>();
  private datas;
  private cart;

  constructor() {
    this.start();
  }

  ngOnDestroy() {
    this.stop();
  }

  watchStorage(): Observable<any> {
    return this.storageSub.asObservable();
  }

  calculateTotal() {
    this.datas = this.getStorage("data");
    let currentPrice = 0;
    let totalPrice = 0;
    this.datas.forEach((element) => {
      currentPrice = element.price * element.quantity;
      totalPrice = currentPrice + totalPrice;
    });

    let cartLength;
    cartLength = this.datas.length;
    this.cart = { totalPrice, cartLength };
    this.store("cart", this.cart);
  }

  calculateInitial(quantity, price) {
    let totalPrice = quantity * price;
    let cartLength = 1;
    let cart;
    cart = { totalPrice, cartLength };
    this.store("cart", cart);
  }

  public getStorage(data) {
    let storage = JSON.parse(localStorage.getItem(data));
    return storage;
  }

  public store(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
    // the local application doesn't seem to catch changes to localStorage...
    // this.onSubject.next({key: key, value: data})
    this.storageSub.next("changed");
  }

  public clear(key) {
    localStorage.removeItem(key);
    // the local application doesn't seem to catch changes to localStorage...
    this.onSubject.next({ key: key, value: null });
  }

  private start(): void {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  private storageEventListener(event: StorageEvent) {
    if (event.storageArea == localStorage) {
      let storageValue;
      try {
        storageValue = JSON.parse(event.newValue);
      } catch (e) {
        storageValue = event.newValue;
      }
      this.onSubject.next({ key: event.key, value: storageValue });
    }
  }

  private stop(): void {
    window.removeEventListener("storage", this.storageEventListener.bind(this));
    this.onSubject.complete();
  }
}
