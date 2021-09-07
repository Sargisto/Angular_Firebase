import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.scss']
})
export class TradeComponent implements OnInit {

  private usersSubscriptionListener = new Subscription();
  private itemsSubscriptionListener = new Subscription();
  private tradeSubscriptionListener = new Subscription();
  public dropUser = false;
  public dropItems = false;
  public selectedUser = {
    DocumentId: null,
    DocumentValue: {
      id: null,
      name: null
    },
  };
  public selectedItem = {
    DocumentId: null,
    DocumentValue: {
      id: null,
      name: null
    },
  };
  public usersDataDocument = [];
  public itemsDataDocument = [];
  public tradeDataDocument = [];

  constructor(public afs: AngularFirestore) { }

  ngOnInit(): void {
    this.usersSubscriptionListener = this.afs.collection("Users").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data();
        return { DocumentId: id, DocumentValue: data };
      }))
    ).subscribe(data => {
      this.usersDataDocument = data;
      console.log(data)
    });
    this.itemsSubscriptionListener = this.afs.collection("Items").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data();
        return { DocumentId: id, DocumentValue: data };
      }))
    ).subscribe(data => {
      this.itemsDataDocument = data;
      console.log(data)
    });
    this.tradeSubscriptionListener = this.afs.collection("Trade").snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const id = a.payload.doc.id;
        const data = a.payload.doc.data();
        return { DocumentId: id, DocumentValue: data };
      }))
    ).subscribe(data => {
      this.tradeDataDocument = data;
      console.log(data)
    });
  }

  selectUser(user) {
    this.selectedUser = user;
  }

  selectItem(item) {
    this.selectedItem = item;
  }

  bind() {
    let newData = {
      user_id: null,
      user_name: null,
      item_id: null,
      item_name: null,
    };
    if (this.selectedUser.DocumentValue.id && this.selectedUser.DocumentValue.name && this.selectedItem.DocumentValue.id && this.selectedItem.DocumentValue.name) {
      newData['user_id'] = this.selectedUser.DocumentValue.id;
      newData['user_name'] = this.selectedUser.DocumentValue.name;
      newData['item_id'] = this.selectedItem.DocumentValue.id;
      newData['item_name'] = this.selectedItem.DocumentValue.name;
      this.afs.collection("Trade").add(newData).catch(error => console.log(error));
    } else {
      alert('Select dropdown first');
    }
  }

  removeItem(id) {

    if (!confirm('Are you sure you want delete?')) {
      return;
    }
    this.afs.collection("Trade").doc(id).delete().then(() => {
      console.log("Document successfully deleted!");
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });

  }

  ngOnDestroy() {
    this.usersSubscriptionListener.unsubscribe();
    this.itemsSubscriptionListener.unsubscribe();
    this.tradeSubscriptionListener.unsubscribe();
  }

}
