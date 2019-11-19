import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-question-image',
  templateUrl: './question-image.component.html',
  styleUrls: ['./question-image.component.scss']
})
export class QuestionImageComponent implements OnInit {

  @Input() question: any;
  @Input() detailLinkFlag: boolean;
  @Output() saveScrollTarget: EventEmitter<any> = new EventEmitter<any>();
  
  serverUrl = environment.apiUrl;

  constructor() { }

  ngOnInit() {
  }

  public sendData() {
    this.saveScrollTarget.emit();
  }

}

