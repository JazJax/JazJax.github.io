export enum LetterStatus {
    Pending,
    Incorrect,
    Misplaced,
    Correct
  }
  
  export class Letter {
    Letter: string = '';
    Status: LetterStatus = LetterStatus.Pending;
  };
  
  export class Attempt {
    Letters: Letter[] = [];
  };
  
  export class GameState {
    Attempts: Attempt[] = [];
    Message: string = "";
    CurrentAttempt: number = 0;
    CurrentLetter: number = 0;
    GameComplete: boolean = false;
    DisallowedLetters: string[] = [];
    LetterStates: Letter[] = Alphabet.split('').map(e => {
      return {Letter: e.toUpperCase(), Status: LetterStatus.Pending};
    });
  }

export const Alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';