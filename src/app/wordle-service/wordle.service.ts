import { Injectable } from '@angular/core';
import { ValidSolutions } from '../Models/ValidSolutions';
import { ValidWords } from '../Models/ValidWords';
import {LetterStatus, Letter, Attempt, GameState, Alphabet } from '../Models/wordle.model';

export interface WordleInterface{
  WordIsValid: (attempt: Attempt) => boolean;
  MakeGuess: (attempt: Attempt) => GameState;
  NewGame: (attempts: number, wordLength: number) => GameState;
}

export function GetRandomStatus(): LetterStatus {
  switch (Math.floor(Math.random() * 4)){
    case 1: {return LetterStatus.Pending}
    case 2: {return LetterStatus.Incorrect}
    case 3: {return LetterStatus.Misplaced}
    default: {return LetterStatus.Correct}
  };
}

export let GetRandomLetter = (): string  => Alphabet.charAt(Math.floor(Math.random() * Alphabet.length));

@Injectable({
  providedIn: 'root'
})
export class WordleService implements WordleInterface{

  private currentGame: GameState = new GameState();
  private attemptsAllowed: number = 0;
  private wordLength: number = 0;
  private targetWord: string = "PAINT";
  
  constructor() { }

  WordIsValid(attempt: Attempt){
    let guessWord: string = attempt.Letters
      .map(e => e.Letter)
      .join("")
      .toUpperCase();
    return ValidWords.includes(guessWord);
  }
  
  MakeGuess(attempt: Attempt){
    let checkedAttempt: Attempt = this.CheckWord(attempt)

    //update letterStates
    for (let status in LetterStatus) {//loop over statuses
      let currentStatus: LetterStatus = LetterStatus[status as keyof typeof LetterStatus];
      //alert('doing status: '+status+' ('+currentStatus);
      checkedAttempt.Letters.forEach(letter => {
        //update every letter with this status in the word
        if (letter.Status == currentStatus) {
          this.currentGame.LetterStates
            .filter(l => {
              return l.Letter == letter.Letter;
            })[0]
            .Status = currentStatus;
            //alert('set status of '+letter.Letter+' to '+currentStatus+'!');
        }
      });
    }
    
    checkedAttempt.Letters.forEach(letter => {
      if (letter.Status == LetterStatus.Incorrect && !this.currentGame.DisallowedLetters.includes(letter.Letter)) {
        this.currentGame.DisallowedLetters.push(letter.Letter);
      }
    });

    
    
    this.currentGame.Attempts[this.currentGame.CurrentAttempt] = checkedAttempt;
    this.currentGame.CurrentAttempt++;
    this.currentGame.CurrentLetter = 0;

    //if word is correct, they won!
    if (checkedAttempt.Letters.every(e => e.Status == LetterStatus.Correct)) {
      this.currentGame.Message = "You won!";
      this.currentGame.GameComplete = true;
      alert('Congrats! U da best!')
    }
    //if now have run out of attempts, return GameOver.
    else if (this.currentGame.CurrentAttempt >= this.attemptsAllowed) {
      this.currentGame.Message = "Game over!";
      this.currentGame.GameComplete = true;
      alert('Better luck next time!\nThe word you missed was'+this.targetWord);
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

  NewGame(attempts: number, wordLength: number){
    this.attemptsAllowed = attempts;
    this.wordLength = wordLength;
    this.currentGame = this.GenerateBlankGrid(attempts, wordLength);

    let randomNumber: number = Math.floor(Math.random() * ValidSolutions.length);
    this.targetWord = ValidSolutions[randomNumber];

    return this.currentGame;
  }

  FakeGame(attempts: number, wordLength: number){
    this.attemptsAllowed = attempts;
    this.wordLength = wordLength;
    this.currentGame = new GameState();

    for (let i = 0 ; i < attempts ; i++) {
      let attempt = new Attempt();
      for (let j = 0 ; j < wordLength ; j++) {
        attempt.Letters[j] = {Letter: GetRandomLetter(), Status: GetRandomStatus()};
      }
      this.currentGame.Attempts[i] = attempt;
    }

    return this.currentGame;
  }
}
