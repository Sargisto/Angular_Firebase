import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  private subscriptionListener = new Subscription();
  itemsValue: Array<any> = [];
  itemsKey: Array<any> = [];
  myItems: Array<any> = [];
  Data;
  New_key: string;
  New_value: string;
  selectedItem = {
    key: null,
    value: null
  };

  constructor(public db: AngularFireDatabase) {
    this.Data = db;
  }

  ngOnInit() {
    this.getValues();
    this.subscriptionListener = this.Data.object('users').valueChanges().subscribe(val => {
      this.myItems = val;
      console.log(val);
    });

  }

  getValues() {
    this.Data.list('users').valueChanges().subscribe(val => {
      this.itemsValue = val;
      this.getKeys();
    });
  }

  getKeys() {
    this.Data.list('users').snapshotChanges().subscribe(keyObj => {
      this.itemsKey = keyObj.map(x => x.key);
    });
  }

  selectItem(selectedItem) {
    this.selectedItem = selectedItem;
    console.log(selectedItem);
  }

  createItem(newValue) {
    this.Data.list('users').push(newValue);
  }

  updateItem(key: string, value: string | object, action: string): void {
    if (this.selectedItem.value === null && action === 'update') {
      alert('Select User');
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
    this.Data.list('users').set(key, value).catch(error => console.log(error));

    // only updates the specified values
    //  this.Data.list('items').update(key,  {day: 'Sep 7'}).catch(error => console.log(error));
  }

  removeItem(key: string) {
    if (this.selectedItem.value === null) {
      alert('Select User');
      return
    }
    this.Data.list('users').remove(key).catch(error => console.log(error));
    this.selectedItem.key = null;
    this.selectedItem.value = null;
  }

  removeAll() {
    if (confirm("Are you sure you want to delete all data ?")) {
      this.Data.list('users').remove().catch(error => console.log(error));
    }
  }

  ngOnDestroy() {
    this.subscriptionListener.unsubscribe();
  }

}
