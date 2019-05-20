import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

import * as io from 'socket.io-client';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketsService {
  private socket: SocketIOClient.Socket;
  private socketEvents: Observable<any>;

  constructor() {
    this.socket = io.connect(environment.apiUrl);
    this.listenToSocket();
  }

  getSocketEvents() {
    return this.socketEvents;
  }

  notify(event, data) {
    this.socket.emit(event, data);
  }

  private listenToSocket() {
    this.socketEvents = Observable.create(observer => {
      this.socket.on('createdData', payload => {
        observer.next({ name: 'createdData', payload });
      });
      this.socket.on('updatedData', payload => {
        observer.next({ name: 'updatedData', payload });
      });
      this.socket.on('deletedData', payload => {
        observer.next({ name: 'deletedData', payload });
      });
    });
  }
}
