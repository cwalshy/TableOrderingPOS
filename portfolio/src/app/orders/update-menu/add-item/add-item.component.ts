import { componentFactoryName } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { ProductService } from 'src/app/services/products.service';
import {Products} from '../../../models/products';

export interface newItem {
  name: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
}

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})

export class AddItemComponent implements OnInit {

  myControl = new FormControl();
  itemForm: FormGroup;
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  itemName;
  itemCategory;
  itemSubCategory;
  itemDesc;
  itemPrice;



  constructor(private db: AngularFirestore,public dialog: MatDialog) { }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  } s
  onSubmit() {
    Number(this.itemPrice);
    console.log(this.itemName, this.itemCategory, this.itemSubCategory, this.itemDesc, this.itemPrice)
  let newerItem: newItem = {
      name: this.itemName,
      category: this.itemCategory,
      subcategory: this.itemSubCategory,
      description: this.itemDesc,
      price: this.itemPrice,
  
    }
    this.db.collection('products').add(newerItem).catch((err: any) => console.log(err))
    console.log(newerItem);
    this.dialog.closeAll();

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
