import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, BehaviorSubject, EMPTY } from 'rxjs';
import {CheckoutSession} from '../models/checkout-session.model';
import { Products } from '../models/products';
import { take, map } from 'rxjs/operators';
import { Cart } from '../models/cart';
import {StripeCheckout} from '../models/stripe-cart';

import { ProductService } from './products.service';
import { NgModel } from '@angular/forms';
import { environment } from '../../environments/environment';

declare const Stripe;

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  productList = [];
  private REST_API_SERVER = "http://localhost:9000";


  constructor(private http: HttpClient) {
  
  }

  //redirect to checkout function
  redirectToCheckout(session: CheckoutSession) {
      const stripe = Stripe('pk_test_51HKgd0HqHMic9uWGqiKVrGRtx4CxYll23dUBXGk1ItdY5vfFC66Ikaigis9wnTEseqHpHqJFukNFGcEyAQVqamPH00kze8C442');

      stripe.redirectToCheckout({
        sessionId: session.stripeCheckoutSessionId
    });
  }

  //start checkout session
  startCheckoutSession(data, table): Observable<CheckoutSession> {
    const tableNumber = table;
    console.log(tableNumber, 'this is tabl number');
   this.http.post(this.REST_API_SERVER + 'api/checkout', {
    });
    return this.http.post<CheckoutSession>(`api/checkout`, {
      data,
      callbackUrl: this.buildCallBackUrl(table),
      tableNumber
  })
}



    buildCallBackUrl(table) {
     // tslint:disable-next-line: one-variable-per-declaration
     const protocol = window.location.protocol,
           hostName = window.location.hostname,
           port = window.location.port;
     let callbackUrl = `${protocol}//${hostName}`;
     if (port) {
      callbackUrl += ':' + port;
    }
     callbackUrl += '/stripe-checkout';
     return callbackUrl;
   }

}

