import { Component, HostListener, OnInit } from '@angular/core';
import { WordleService} from '../wordle-service/wordle.service';
import {LetterStatus, Letter, Attempt, GameState as GameState, Alphabet } from '../Models/wordle.model';

@Component({
  selector: 'app-wordle-game',
  templateUrl: './wordle-game.component.html',
  styleUrls: ['./wordle-game.component.scss']
})
export class WordleGameComponent implements OnInit {
  data: string = '';
  GameBoard: GameState = new GameState();
  AttemptsAllowed: number = 5;
  WordLength: number = 5;
  WordInProgress: Attempt = new Attempt();

  readonly LetterStatus = LetterStatus;

  constructor(private service: WordleService) { }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    this.HandleInput(event.key);
  }

  HandleInput(key: string){
    let alphabetArray = Alphabet.split('');
    let keyType: string = alphabetArray.includes(key.toUpperCase()) 
      ? 'letter' 
      : key;
    key = key.toUpperCase();

    switch (keyType){
      case 'Enter':
        if (this.WordInProgress.Letters.length == this.WordLength){
          
          if (this.service.WordIsValid(this.WordInProgress)){
            this.GameBoard = this.service.MakeGuess(this.WordInProgress);
            this.WordInProgress = new Attempt();
            //alert('Done! Now for guess number '+this.GameBoard.CurrentAttempt+'! Disallowed letters:\n'+this.GameBoard.DisallowedLetters)
          }
          else{
            let guessWord: string = this.WordInProgress.Letters
              .map(e => e.Letter)
              .join("")
              .toUpperCase();
            alert(guessWord + "?!\nThat's not a valid word!");
          }          
        }
        else {
          //this.GameBoard.Message = 'Word incomplete!';
          alert('Word incomplete!');
        }
        break;
      case 'Backspace':
        this.RemoveLetter();
        break;
      case 'letter':
        if(this.GameBoard.CurrentLetter < this.WordLength) {
          if (this.GameBoard.DisallowedLetters.includes(key)) {
            alert('You already tried '+key+', pick another!');
          }
          else {
            this.AddLetter(key);
          }
        }
        break;
      default:
        break;
      }

  }

  AddLetter(letter: string){
    this.GameBoard
        .Attempts[this.GameBoard.CurrentAttempt]
        .Letters[this.GameBoard.CurrentLetter].Letter = letter;
    this.GameBoard.CurrentLetter++;
    this.WordInProgress.Letters.push({Letter: letter, Status: LetterStatus.Pending});
  }

  RemoveLetter(){
    if (this.GameBoard.CurrentLetter > 0) {
      this.GameBoard.CurrentLetter--;
      this.GameBoard
        .Attempts[this.GameBoard.CurrentAttempt]
        .Letters[this.GameBoard.CurrentLetter].Letter = '';
      this.WordInProgress.Letters.pop();
    }    
  }  

  AttemptToText(attempt: Attempt){
    let letters: Array<string> = new Array();
    attempt.Letters.forEach(e => {
      //alert('totext: '+e.Letter);
      letters.push(e.Letter);
    });
    return letters.toString();
  }

  ngOnInit(): void {
    this.GameBoard = this.service.NewGame(this.AttemptsAllowed, this.WordLength);
  }

}
