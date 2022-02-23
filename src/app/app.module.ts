import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WordleGameComponent } from './wordle-game/wordle-game.component';
import { KeyboardUIComponent } from './keyboard-ui/keyboard-ui.component';

@NgModule({
  declarations: [
    AppComponent,
    WordleGameComponent,
    KeyboardUIComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
