import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-firestore-collection',
  templateUrl: './firestore-collection.component.html',
  styleUrls: ['./firestore-collection.component.scss']
})
export class FirestoreCollectionComponent implements OnInit, OnDestroy {

  private subscriptionListener = new Subscription();
  public shopData;
  public selectedItem = {
    DocumentId: null,
    DocumentValue: {
      id: null,
      name: null
    },
  };
  public createItem = {
    DocumentId: null,
    DocumentValue: {
      id: null,
      name: null
    },
  };
  public shopDataDocument = [];

  constructor(public afs: AngularFirestore) {
    //  this.afs.collection("Shop").doc("Item_1")
    // this.afs.doc('Shop/LPd98WN4vs5o8L970oeW');
    // this.afs.collection("cities").where("state", "==", "CA")
    this.subscriptionListener = this.afs.collection("Shop", ref =>
      // orderBy('id', "desc - asc")
      ref.where('id', '>=', 1)).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const id = a.payload.doc.id;
          const data = a.payload.doc.data();
          return { DocumentId: id, DocumentValue: data };
        }))
      ).subscribe(data => {
        this.shopDataDocument = data;
        console.log(data)
      });

  }
  // , ref => {
  //   return ref.where('name', '==', 'toys');
  // }
  ngOnInit(): void {
    // this.afs.collectionGroup("Shop").valueChanges().subscribe(data => {
    //   this.shopData = data;
    //   console.log(data);
    // });
  }

  selectItem(docId, selectedItem) {
    this.selectedItem = selectedItem;
    this.selectedItem.DocumentId = docId;
  }

  updateItem(action: string): void {
    if (action === 'create') {
      this.selectedItem = this.createItem;
    }
    if (!this.selectedItem.DocumentId && action === 'update') {
      alert('Select Document');
      return;
    }
    if (this.shopDataDocument.filter(i => i.DocumentId === this.selectedItem.DocumentId).length && action === 'create') {
      alert('This Document already exist');
      return;
    }

    if (action === 'update' || action === 'create' && this.selectedItem.DocumentId) {
      this.afs.collection("Shop").doc(this.selectedItem.DocumentId).set(this.selectedItem.DocumentValue).catch(error => console.log(error));
    } else if (action === 'create' && !this.selectedItem.DocumentId) {
      this.afs.collection("Shop").add(this.selectedItem.DocumentValue).catch(error => console.log(error));
    }
    this.selectedItem.DocumentId = null;
    this.selectedItem.DocumentValue = {
      id: null,
      name: null
    };

  }

  removeItem() {
    if (!this.selectedItem.DocumentId) {
      alert('Select Document');
      return;
    }
    this.shopDataDocument = [];
    this.afs.collection("Shop").doc(this.selectedItem.DocumentId).delete().then(() => {
      console.log("Document successfully deleted!");

    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
    // this.Data.list('users').remove(key).catch(error => console.log(error));
    this.selectedItem.DocumentId = null;
    this.selectedItem.DocumentValue = {
      id: null,
      name: null
    };

  }

  ngOnDestroy() {
    this.subscriptionListener.unsubscribe();
  }


}
