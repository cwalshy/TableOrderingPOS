import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from 'src/app/services/storage-service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements AfterViewInit {
  stripe;

  constructor(private storageService: StorageService, private activatedRoute: ActivatedRoute) { }

  ngAfterViewInit(): void {
    this.stripe = this.activatedRoute.snapshot.paramMap.get("stripe-checkout")
    console.log(this.stripe)
    this.activatedRoute.paramMap.subscribe(params => {
      this.stripe = params.get("stripe-checkout")
    })
   this.clearCart();
  }

  clearCart() {
    if(this.stripe == 'success') {
      this.storageService.store('data', 0);
      this.storageService.clear('data');
      this.storageService.store('cart', 0);
    }

}
}
