import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, collectionData, docSnapshots, updateDoc, addDoc } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { onSnapshot, doc } from 'firebase/firestore';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;
  currentGame = [];

  firestore: Firestore = inject(Firestore);
  items$!: Observable<any[]>;
  itemsSubscription!: Subscription;

  constructor(public dialog: MatDialog) {

  }

  ngOnInit(): void {
    console.log("init");
    this.newGame();

  }

  ngOnDestroy(): void {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
  }

  getGameRef() {
    return collection(this.firestore, 'games');
  }

  async newGame() {
    console.log("new game");
    this.game = new Game();
    setTimeout(async () => {
      const docRef = await addDoc(this.getGameRef(), this.game.toJson());
      console.log("Neues Spiel-Dokument erstellt mit ID:", docRef.id);
      this.subscribeToItems();
      console.log("test");
    }, 1000);

  }

  subscribeToItems() {
    this.items$ = collectionData(this.getGameRef());
    this.itemsSubscription = this.items$.subscribe(item => {
      console.log('Daten aus Firebase:', item);
    });
    console.log("testS");

  }

  takeCard() {
    if (!this.pickCardAnimation) {
      const card = this.game.stack.pop();
      if (card !== undefined) {
        this.currentCard = card;
        console.log(this.currentCard);
        this.pickCardAnimation = true;
        console.log('New card' + this.currentCard);
        console.log('Game is', this.game);
      }
    }

    this.game.currentPlayer++;
    this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;

    setTimeout(() => {
      this.game.playedCards.push(this.currentCard);
      this.pickCardAnimation = false;
    }, 1000);

  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}
