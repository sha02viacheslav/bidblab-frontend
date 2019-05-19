import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlockUIService {
  private block: BehaviorSubject<boolean>;

  constructor() {
    this.block = new BehaviorSubject(false);
  }

  setBlockStatus(status) {
    this.block.next(status);
  }

  getBlockStatus() {
    return this.block.asObservable();
  }

  isBlocking() {
    return this.block.getValue();
  }
}
