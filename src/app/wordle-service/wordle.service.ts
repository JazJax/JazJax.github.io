import { Injectable } from '@angular/core';
import { ValidSolutions } from '../Models/ValidSolutions';
import { ValidWords } from '../Models/ValidWords';
import { CookieService } from 'ngx-cookie-service'
import {LetterStatus, Letter, Attempt, GameState, Alphabet } from '../Models/wordle.model';
import { Complements } from '../Models/Complements';

export interface WordleInterface{
  WordIsValid: (attempt: Attempt) => boolean;
  MakeGuess: (attempt: Attempt) => GameState;
  NewGame: (attempts: number, wordLength: number, dailyMode: boolean) => GameState;
}

@Injectable({
  providedIn: 'root'
})
export class WordleService implements WordleInterface{

  private currentGame: GameState = new GameState();
  private attemptsAllowed: number = 0;
  private wordLength: number = 0;
  private targetWord: string = "PAINT";
  
  constructor(private cookieService: CookieService) { }

  SaveGameState(gameState: GameState){
    let expiryTimeStamp = new Date();
    expiryTimeStamp.setHours(24,0,0,0); //this needs to be a seperate operation, unsure why.
    this.cookieService.set('gamestate', JSON.stringify(gameState),{expires:expiryTimeStamp});
  }

  GetGameState(){
    return JSON.parse(this.cookieService.get('gamestate'));
  }
  
  WordIsValid(attempt: Attempt){
    let guessWord: string = attempt.Letters
      .map(e => e.Letter)
      .join("")
      .toUpperCase();
    return ValidWords.includes(guessWord);
  }

  GetLetterStatus(letter: string){
    return this.currentGame.LetterStates
    .filter(l => {
      return l.Letter == letter;
    })[0].Status;
  }

  SetLetterStatus(letter: string, status: LetterStatus){
    this.currentGame.LetterStates
    .filter(l => {
      return l.Letter == letter;
    })[0].Status = status;
  }

  UpdateLetterStates(attemptToUpdateFrom: Attempt){
    for (let status in LetterStatus) {//loop over statuses
      let currentStatus: LetterStatus = LetterStatus[status as keyof typeof LetterStatus];
      
      attemptToUpdateFrom.Letters.forEach(letter => {
        //update every letter with this status in the word
        if (letter.Status == currentStatus && currentStatus > this.GetLetterStatus(letter.Letter)) {
          this.SetLetterStatus(letter.Letter,currentStatus);
          //alert('set status of '+letter.Letter+' to '+currentStatus+'!');
        }
      });
    }   
  }
  
  MakeGuess(attempt: Attempt){
    let checkedAttempt: Attempt = this.CheckWord(attempt)

    //update letterStates
    this.UpdateLetterStates(checkedAttempt);
    
    //update attempt count, reset currentLetter, update row in GameBoard
    this.currentGame.Attempts[this.currentGame.CurrentAttempt] = checkedAttempt;
    this.currentGame.CurrentAttempt++;
    this.currentGame.CurrentLetter = 0;

    //if word is correct, they won!
    if (checkedAttempt.Letters.every(e => e.Status == LetterStatus.Correct)) {
      this.currentGame.GameComplete = true;      
      this.currentGame.Solution = this.targetWord;

      let randomMessage = Complements[Math.floor(Math.random()*Complements.length)];
      this.currentGame.Message = 'You correctly guessed the word '+this.targetWord+'\n'+randomMessage;
      alert(this.currentGame.Message);
    }
    //if now have run out of attempts, return GameOver.
    else if (this.currentGame.CurrentAttempt >= this.attemptsAllowed) {
      this.currentGame.Message = "Game over!";
      this.currentGame.GameComplete = true;
      this.currentGame.Solution = this.targetWord;
      alert('Better luck next time!\nThe word you missed was '+this.targetWord);
    }    

    if(this.currentGame.DailyMode){
      this.SaveGameState(this.currentGame);
    }    
    return this.currentGame;    
  }

  CheckWord(attempt: Attempt) : Attempt {
    let targetLetters: string[] = this.targetWord.split('');
    let resolvedLetters: number[] = [];

    //Match letters
    let matchedTargetLetters: string[] = [];
    targetLetters.forEach((l,index) => {
      if (attempt.Letters[index].Letter == l) {
        attempt.Letters[index].Status = LetterStatus.Correct;
        resolvedLetters.push(index);
        matchedTargetLetters.push(l);
      }
    });
    matchedTargetLetters.forEach(letter => {
      targetLetters.splice(targetLetters.indexOf(letter),1);
    });

    //is letter in word (but in wrong position)?
    attempt.Letters.forEach((l, index) => {
      //is letter in word, and hasn't been checked before?
      if(targetLetters.includes(l.Letter) && !resolvedLetters.includes(index)){
        attempt.Letters[index].Status = LetterStatus.Misplaced;
        targetLetters.splice(targetLetters.indexOf(l.Letter), 1);
        resolvedLetters.push(index);
      }
    });

    //Others must be incorrect
    attempt.Letters.forEach((l, index) => {
      //is letter in word, and hasn't been checked before?
      if(!resolvedLetters.includes(index)){
        attempt.Letters[index].Status = LetterStatus.Incorrect;
        resolvedLetters.push(index);
      }
    });

    //senseCheck
    if (resolvedLetters.length != this.wordLength) {
      throw new Error("Missed letters!");      
    }

    return attempt;
  }

  GenerateBlankGrid(attempts: number, wordLength: number){
    let grid = new GameState();

    for (let i = 0 ; i < attempts ; i++) {
      let attempt = new Attempt();
      for (let j = 0 ; j < wordLength ; j++) {
        attempt.Letters.push(new Letter());
      }
      grid.Attempts.push(attempt);
    }

    return grid;
  }

  GetDailyWord(){
    let startDate: number = new Date('2022-02-24T00:00:00').getTime();
    let today: number = new Date().getTime();

    let daysBetween = Math.floor((today-startDate)/(24*60*60*1000));
    
    return ValidSolutions[daysBetween % ValidSolutions.length];
  }

  NewGame(attempts: number, wordLength: number, dailyMode: boolean){
    //this.cookieService.delete('gamestate');
    this.attemptsAllowed = attempts;
    this.wordLength = 5; //wordLength;
    this.currentGame = this.GenerateBlankGrid(attempts, wordLength);
    this.currentGame.DailyMode = dailyMode;

    if (dailyMode){
      if (this.cookieService.check('gamestate')){
        this.currentGame = this.GetGameState();
      }      
      this.targetWord = this.GetDailyWord();
    }
    else{
      let randomNumber: number = Math.floor(Math.random() * ValidSolutions.length);
      this.targetWord = ValidSolutions[randomNumber];
    }        

    return this.currentGame;
  }
}
