import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io'
import { environment } from '../environments/environment';

export function getUrl(): string {
  if (environment.production) {
    return window.location.hostname + ':' + window.location.port;
  } else {
    return 'localhost:3000';
  }
}

export function getProtocol(): string {
  return window.location.protocol + '//';
}

const config: SocketIoConfig = {url: getUrl(), options: {}};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
