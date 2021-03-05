import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr'; 
import { NgModule } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ItemReqComponent } from './product-list/item-req/item-req.component';
import {MatButtonModule} from '@angular/material/button';
import {MatAutocompleteModule} from '@angular/material/autocomplete'
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ProductListComponent} from './product-list/item-req/product-list.component';
import {ShoppingCartComponent} from './product-list/item-req/shoping-cart.component';
import {ProductComponent} from './product-list/item-req/product.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  FacebookLoginProvider,
} from 'angularx-social-login';
import { AngularFireModule } from '@angular/fire';
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { MatTableModule } from '@angular/material/table' ;
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSortModule} from '@angular/material/sort';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {ActivatedRoute} from '@angular/router';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductCartComponent } from './product-cart/product-cart.component';
import { OrdersComponent } from './orders/orders.component';
import { StorageService } from './services/storage-service';
import { HomeComponentComponent } from './home-component/home-component.component';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LoginComponent } from './admin/login/login.component';
import {UpdateMenuComponent} from './orders/update-menu/update-menu.component';
import { AddItemComponent } from './orders/update-menu/add-item/add-item.component';
import { SuccessComponent } from './product-cart/success/success.component';


const config = {
  apiKey: 'AIzaSyB6pf44F08q11QqCVYnZp4nlt7yjH4PaAs',
  authDomain: 'coffeeapp-118b2.firebaseapp.com',
  databaseURL: 'https://coffeeapp-118b2.firebaseio.com',
  projectId: 'coffeeapp-118b2',
  storageBucket: 'coffeeapp-118b2.appspot.com',
  messagingSenderId: '296435086287'
};

@NgModule({
  declarations: [
    AppComponent,
    ItemReqComponent,
    ProductComponent,
    ProductListComponent,
    ProductCartComponent,
    OrdersComponent,
    ShoppingCartComponent,
    HomeComponentComponent,
    CustomerOrderComponent,
    NavbarComponent,
    LoginComponent,
    UpdateMenuComponent,
    AddItemComponent,
    SuccessComponent
    
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    ToastrModule.forRoot(
      {  
        timeOut: 1000,
        positionClass: 'toast-bottom-center',
        preventDuplicates: true,          
      }  
    ),
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatInputModule,
    AngularFireFunctionsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatCheckboxModule,
    MatTabsModule,
    FormsModule,
    SocialLoginModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    AngularFireDatabaseModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatSelectModule,

  ],
  providers: [
    StorageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
