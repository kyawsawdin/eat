import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-home-skeleton',
  templateUrl: './home-skeleton.component.html',
  styleUrls: ['./home-skeleton.component.scss'],
})
export class HomeSkeletonComponent implements OnInit {
  @Input() count: string = '10';
  @Input() items: any = [];
  categories: any = new Array(10);

  constructor() {
  	
  }

  ngOnInit() {
  	this.items = new Array(parseInt(this.count));
  }

}
