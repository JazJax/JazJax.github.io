import { Component, HostListener, OnInit } from '@angular/core';
import { WordleService} from '../wordle-service/wordle.service';
import {LetterStatus, Letter, Attempt, GameState as GameState, Alphabet } from '../Models/wordle.model';

@Component({
  selector: 'app-wordle-game',
  templateUrl: './wordle-game.component.html',
  styleUrls: ['./wordle-game.component.scss']
})
export class WordleGameComponent implements OnInit {
  GameBoard: GameState = new GameState();
  AttemptsAllowed: number = 5;
  WordLength: number = 5;
  WordInProgress: Attempt = new Attempt();
  HighlightedLetter: number = 0;

  readonly LetterStatus = LetterStatus;

  constructor(private service: WordleService) { }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    this.HandleInput(event.key);
  }

  SwitchMode(event: Event){
    this.GameBoard.DailyMode = !this.GameBoard.DailyMode;
    this.Reset(this.GameBoard.DailyMode);
  }

  Reset(mode: boolean, attemptsAllowed: number = 5, wordLength: number = 5){
    //this.WordInProgress = new Attempt();
    this.GameBoard = this.service.NewGame(attemptsAllowed, wordLength, mode);
    this.HighlightedLetter = this.GameBoard.CurrentLetter;//hack for letter display
  }

  SelectLetter(rowIndex: number, letterIndex: number, letter: Letter){
    //alert('selected letter '+letter.Letter+' with index '+letterIndex+' on row '+rowIndex);
    if (rowIndex == this.GameBoard.CurrentAttempt
      && this.GameBoard.Attempts[rowIndex].Letters[letterIndex].Letter != ''){
      this.GameBoard.CurrentLetter = letterIndex;
      this.HighlightedLetter = letterIndex; 
    }
  }

  HandleInput(key: string){
    let alphabetArray = Alphabet.split('');
    let keyType: string = alphabetArray.includes(key.toUpperCase()) 
      ? 'letter' 
      : key;
    key = key.toUpperCase();
    
    if(this.GameBoard.GameComplete){
      alert('You already finished this game!');
      return;
    }

    let currentWord: Attempt = this.GameBoard.Attempts[this.GameBoard.CurrentAttempt];

    switch (keyType){
      case 'Enter':
        if (currentWord.Letters.every(e => e.Letter != '')){

          let currentWord: Attempt = this.GameBoard.Attempts[this.GameBoard.CurrentAttempt];
          
          if (this.service.WordIsValid(currentWord)){
            this.GameBoard = this.service.MakeGuess(currentWord);
            this.HighlightedLetter = 0;
            //alert('Done! Now for guess number '+this.GameBoard.CurrentAttempt+'! Disallowed letters:\n'+this.GameBoard.DisallowedLetters)
          }
          else{
            let guessWord: string = currentWord.Letters
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
          let letterIsIncorrect = this.GameBoard.LetterStates
            .filter(e => e.Status == LetterStatus.Incorrect)
            .map(e => e.Letter)
            .includes(key);
          
          if (letterIsIncorrect) {
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
    this.HighlightedLetter = this.GameBoard.CurrentLetter;//hack for letter display
    if (this.GameBoard.CurrentLetter == this.WordLength){
      this.HighlightedLetter--;
    }

    //this.WordInProgress.Letters.push({Letter: letter, Status: LetterStatus.Pending});
  }

  RemoveLetter(){
    if (this.GameBoard.CurrentLetter > 0) {
      this.GameBoard.CurrentLetter--;
      this.HighlightedLetter = this.GameBoard.CurrentLetter;//hack for letter display
      this.GameBoard
        .Attempts[this.GameBoard.CurrentAttempt]
        .Letters[this.GameBoard.CurrentLetter].Letter = '';
      //this.WordInProgress.Letters.pop();
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
    this.Reset(this.GameBoard.DailyMode);
  }

}
