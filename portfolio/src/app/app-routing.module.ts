import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./admin/login/login.component";
import { HomeComponentComponent } from "./home-component/home-component.component";
import { OrdersComponent } from "./orders/orders.component";
import { ShiftReportsComponent } from "./orders/shift-reports/shift-reports.component";
import { UpdateMenuComponent } from "./orders/update-menu/update-menu.component";
import { ProductCartComponent } from "./product-cart/product-cart.component";
import { SuccessComponent } from "./product-cart/success/success.component";
import { ProductListComponent } from "./product-list/item-req/product-list.component";
import { ProductComponent } from "./product-list/item-req/product.component";
import { AuthGuard } from "./shared/guard/auth.guard";

const routes: Routes = [
  { path: "products", component: ProductListComponent },
  { path: "table/:table/products", component: ProductListComponent },
  // { path: 'products/table/:table', component: ProductListComponent },
  {
    path: "stripe-checkout/:stripe-checkout",
    component: SuccessComponent,
    pathMatch: "full",
  },
  { path: "cart", pathMatch: "full", component: ProductCartComponent },
  {
    path: "orders",
    pathMatch: "full",
    component: OrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "table/:table/products/addToCart/:id",
    pathMatch: "full",
    component: ProductComponent,
  },
  { path: "login", pathMatch: "full", component: LoginComponent },
  {
    path: "orders/shift-reports",
    pathMatch: "full",
    component: ShiftReportsComponent,
  },
  {
    path: "orders/update-menu",
    pathMatch: "full",
    component: UpdateMenuComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
