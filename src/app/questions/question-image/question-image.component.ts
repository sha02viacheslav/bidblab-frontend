import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-question-image',
  templateUrl: './question-image.component.html',
  styleUrls: ['./question-image.component.scss']
})
export class QuestionImageComponent implements OnInit {

  @Input() question: any;
  
  serverUrl = environment.apiUrl;

  constructor() { }

  ngOnInit() {
  }

}

