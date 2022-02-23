"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.WordleGameComponent = void 0;
var core_1 = require("@angular/core");
var wordle_model_1 = require("../Models/wordle.model");
var WordleGameComponent = /** @class */ (function () {
    function WordleGameComponent(service) {
        this.service = service;
        this.data = '';
        this.GameBoard = new wordle_model_1.GameState();
        this.AttemptsAllowed = 5;
        this.WordLength = 5;
        this.WordInProgress = new wordle_model_1.Attempt();
        this.CurrentLetter = 0;
    }
    WordleGameComponent.prototype.keyboardInput = function (event) {
        alert(event.key);
        this.HandleInput(event.key);
    };
    WordleGameComponent.prototype.HandleInput = function (key) {
        var alphabetArray = wordle_model_1.Alphabet.split('');
        var keyType = alphabetArray.includes(key) ? 'letter' : key;
        switch (keyType) {
            case 'Enter':
                if (this.WordInProgress.Letters.length == this.WordLength) {
                    this.service.MakeGuess(this.WordInProgress);
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
                this.AddLetter(key);
                break;
            default:
                break;
        }
    };
    WordleGameComponent.prototype.AddLetter = function (letter) {
        this.GameBoard
            .Attempts[this.GameBoard.CurrentAttempt]
            .Letters[this.CurrentLetter].Letter = letter;
        this.CurrentLetter++;
        this.WordInProgress.Letters.push({ Letter: letter, Status: wordle_model_1.LetterStatus.Pending });
    };
    WordleGameComponent.prototype.RemoveLetter = function () {
        this.GameBoard
            .Attempts[this.GameBoard.CurrentAttempt]
            .Letters[this.CurrentLetter].Letter = '';
        this.CurrentLetter--;
        this.WordInProgress.Letters.pop();
    };
    WordleGameComponent.prototype.ngOnInit = function () {
        this.data = this.service.GetData();
        this.GameBoard = this.service.NewGame(this.AttemptsAllowed, this.WordLength);
    };
    __decorate([
        core_1.HostListener('document.keydown', ['$event'])
    ], WordleGameComponent.prototype, "keyboardInput");
    WordleGameComponent = __decorate([
        core_1.Component({
            selector: 'app-wordle-game',
            templateUrl: './wordle-game.component.html',
            styleUrls: ['./wordle-game.component.scss']
        })
    ], WordleGameComponent);
    return WordleGameComponent;
}());
exports.WordleGameComponent = WordleGameComponent;
