import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { GameInfoComponent } from '../game-info/game-info.component';
import { Firestore, collection, collectionData, docSnapshots, updateDoc, addDoc, docData } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { onSnapshot, doc } from 'firebase/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, PlayerComponent, MatButtonModule, MatIconModule, GameInfoComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, OnDestroy {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;
  currentGame = [];

  firestore: Firestore = inject(Firestore);
  items$!: Observable<any[]>;
  itemsSubscription!: Subscription;
  game$!: Observable<any>;

  constructor(private route:ActivatedRoute ,public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) =>{
      console.log(params['id']);     
      this.subscribeToItems(params['id']);
    })
  }

  ngOnDestroy(): void {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
  }

  getSingleGameRef(gameId:string){
    return doc(collection(this.firestore, `game`), gameId);
  }

  getGameRef() {
    return collection(this.firestore, 'games');
  }

  async newGame() {
    this.game = new Game();
    // const docRef = await addDoc(this.getGameRef(), this.game.toJson());
    // console.log("Neues Spiel-Dokument erstellt mit ID:", docRef.id);
    // this.subscribeToItems();
  }

  subscribeToItems(gameId:any): void {
      // this.game$ = collectionData(this.getGameRef());
      const gameDocRef = this.getSingleGameRef(gameId);
      console.log(gameDocRef.id);
      
      this.itemsSubscription = docData(gameDocRef).subscribe((currentGame:any) => {
      console.log('sads', currentGame);
      
      if(this.game){
      this.game.currentPlayer = currentGame.currentPlayer;
      this.game.playedCards = currentGame.playedCards;
      this.game.players = currentGame.players;
      this.game.stack = currentGame.stack;
      console.log(this.game);
      }
    
    });
    
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
