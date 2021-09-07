import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit, OnDestroy {

  private subscriptionListener = new Subscription();
  itemsValue: Array<any> = [];
  itemsKey: Array<any> = [];
  myItems: any;
  Data;
  New_key: string;
  New_value: string;
  selectedItem = {
    key: null,
    value: null
  };

  constructor(public db: AngularFireDatabase, db2: AngularFirestore) {
    this.Data = db;
  }

  ngOnInit() {
    this.getValues();
    this.subscriptionListener = this.Data.object('items').valueChanges().subscribe(val => {
      this.myItems = val
      console.log(val);
    });

  }

  getValues() {
    this.Data.list('items').valueChanges().subscribe(val => {
      this.itemsValue = val;
      console.log('values', this.itemsValue);
      this.getKeys();
    });
  }

  getKeys() {
    this.Data.list('items').snapshotChanges().subscribe(keyObj => {
      this.itemsKey = keyObj.map(x => x.key);
      console.log('keys', this.itemsKey);
    });
  }

  selectItem(selectedItem) {
    this.selectedItem = selectedItem;
    console.log(selectedItem);
  }

  createItem(newValue) {
    this.Data.list('items').push(newValue);
  }

  updateItem(key: string, value: string, action: string): void {
    if (this.selectedItem.value === null && action === 'update') {
      alert('Select item');
      return;
    }
    if (this.itemsKey.includes(key) && action === 'create') {
      alert('This key already exist');
      return;
    }
    if (!key) {
      this.createItem(value);
      return;
    }
    this.Data.list('items').set(key, value).catch(error => console.log(error));

    // only updates the specified values
    //  this.Data.list('items').update(key,  {day: 'Sep 7'}).catch(error => console.log(error));
  }

  removeItem(key: string) {
    if (this.selectedItem.value === null) {
      alert('Select item');
      return
    }
    this.Data.list('items').remove(key).catch(error => console.log(error));
    this.selectedItem.key = null;
    this.selectedItem.value = null;
  }

  removeAll() {
    if (confirm("Are you sure you want to delete all data ?")) {
      this.Data.list('items').remove().catch(error => console.log(error));
    }
  }

  ngOnDestroy() {
    this.subscriptionListener.unsubscribe();
  }

}
