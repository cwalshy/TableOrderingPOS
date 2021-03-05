import { Component, VERSION, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {CheckoutService} from '../../services/checkout.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Cart} from '../../models/cart';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-item-req',
  templateUrl: './item-req.component.html',
  styleUrls: ['./item-req.component.css'],
})

export class ItemReqComponent implements OnInit  {


  constructor(private checkoutService: CheckoutService,
              private route: ActivatedRoute,
      ) {

  }
  ngOnInit() {
 
    }

}
