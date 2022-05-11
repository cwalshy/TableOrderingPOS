import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, EMPTY } from "rxjs";
import { CheckoutSession } from "../models/checkout-session.model";

declare const Stripe;

@Injectable({
  providedIn: "root",
})
export class CheckoutService {
  productList = [];
  private REST_API_SERVER = "http://localhost:9000";

  constructor(private http: HttpClient) {}

  //redirect to checkout function
  redirectToCheckout(session: CheckoutSession) {
    const stripe = Stripe(
      "pk_test_51IKylfLsDdRK7iG56iX0GtrZZpdNNc1kh6LUK1IVhPoxgdM8HF0Cjy8ORLFfwYKFN02f5Mn1Xm8lJOY6G8s50X7R00lZ3ttZGh"
    );

    stripe.redirectToCheckout({
      sessionId: session.stripeCheckoutSessionId,
    });
  }

  //start checkout session
  startCheckoutSession(data, table): Observable<CheckoutSession> {
    const tableNumber = table;
    this.http.post(this.REST_API_SERVER + "api/checkout", {});
    return this.http.post<CheckoutSession>(`api/checkout`, {
      data,
      callbackUrl: this.buildCallBackUrl(table),
      tableNumber,
    });
  }

  buildCallBackUrl(table) {
    // tslint:disable-next-line: one-variable-per-declaration
    const protocol = window.location.protocol,
      hostName = window.location.hostname,
      port = window.location.port;
    let callbackUrl = `${protocol}//${hostName}`;
    if (port) {
      callbackUrl += ":" + port;
    }
    callbackUrl += "/stripe-checkout";
    return callbackUrl;
  }
}
