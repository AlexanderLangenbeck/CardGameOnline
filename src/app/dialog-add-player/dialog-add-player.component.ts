import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialog-add-player',
  standalone: true,
  imports: [CommonModule, MatButtonModule,MatFormFieldModule, MatInputModule, MatDialogModule, FormsModule ],
  templateUrl: './dialog-add-player.component.html',
  styleUrl: './dialog-add-player.component.scss'
})
export class DialogAddPlayerComponent {
  name: string = '';

  constructor(public dialogRef: MatDialogRef<DialogAddPlayerComponent>){

  }

  onNoClick(){
    this.dialogRef.close();
  }
}
