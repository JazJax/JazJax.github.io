import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Alphabet, LetterStatus, Letter } from '../Models/wordle.model';

@Component({
  selector: 'app-keyboard-ui',
  templateUrl: './keyboard-ui.component.html',
  styleUrls: ['./keyboard-ui.component.scss']
})
export class KeyboardUIComponent implements OnInit {
  @Input() letterStates: Letter[] = [];
  @Output() keyClick: EventEmitter<string> = new EventEmitter();
  
  keyboardRows: string[][] = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
  ];  

  readonly LetterStatus = LetterStatus;

  constructor() { }

  ngOnInit(): void {
    
  }

  LetterHasStatus(letter: string, status: LetterStatus){
    return this.letterStates.filter(e => e.Status == status).map(l => l.Letter).includes(letter);
  }

  SendKey(key: string){
    this.keyClick.emit(key);
  }



}
