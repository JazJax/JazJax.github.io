import { Component, HostListener, OnInit } from '@angular/core';
import { WordleService} from '../wordle-service/wordle.service';
import {LetterStatus, Letter, Attempt, GameState as GameState, Alphabet } from '../Models/wordle.model';

@Component({
  selector: 'app-wordle-game',
  templateUrl: './wordle-game.component.html',
  styleUrls: ['./wordle-game.component.scss']
})
export class WordleGameComponent implements OnInit {
  
  //#region Props
  GameBoard: GameState = new GameState();
  AttemptsAllowed: number = 5;
  WordLength: number = 5;
  WordInProgress: Attempt = new Attempt();
  //HighlightedLetter: number = 0;

  readonly LetterStatus = LetterStatus;
  //#endregion


  constructor(private service: WordleService) { }  

  ngOnInit(): void {
    this.Reset(this.GameBoard.DailyMode);
  }

  //Keyboard listener
  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    this.HandleInput(event.key);
  }

  //Main input loop
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
            //this.HighlightedLetter = 0;
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
  

  //#region Game Controls
  SwitchMode(event: Event){
    this.GameBoard.DailyMode = !this.GameBoard.DailyMode;
    this.Reset(this.GameBoard.DailyMode);
  }

  Reset(mode: boolean, attemptsAllowed: number = 5, wordLength: number = 5){
    this.GameBoard = this.service.NewGame(attemptsAllowed, wordLength, mode);
  }

  SelectLetter(rowIndex: number, letterIndex: number, letter: Letter){
    if (rowIndex == this.GameBoard.CurrentAttempt){
      this.GameBoard.CurrentLetter = letterIndex;
    }
  }
  //#endregion


  //#region Add and remove methods
  AddLetter(letter: string){
    //set current letter
    this.SetCurrentLetterString(letter);

    //go to the next letter
    if (this.GameBoard.CurrentLetter+1 < this.WordLength){
      this.GameBoard.CurrentLetter++;
    }
  }  

  RemoveLetter(){
    //if current letter is not blank, delete it; else, go back one and delete the previous letter
    if(this.GetCurrentLetterString() != ''){
      this.SetCurrentLetterString('');
    }
    else{
      if(this.GameBoard.CurrentLetter > 0){
        this.GameBoard.CurrentLetter--;
      }
      this.SetCurrentLetterString('');
    }
  } 
  //#endregion


  //#region Utility methods
  AttemptToText(attempt: Attempt){
    let letters: Array<string> = new Array();
    attempt.Letters.forEach(e => {
      //alert('totext: '+e.Letter);
      letters.push(e.Letter);
    });
    return letters.toString();
  }

  GetCurrentLetterString(){
    return this.GameBoard
      .Attempts[this.GameBoard.CurrentAttempt]
      .Letters[this.GameBoard.CurrentLetter]
      .Letter;
  }

  SetCurrentLetterString(letter: string){
    this.GameBoard
      .Attempts[this.GameBoard.CurrentAttempt]
      .Letters[this.GameBoard.CurrentLetter]
      .Letter = letter;
  }
  //#endregion

}
