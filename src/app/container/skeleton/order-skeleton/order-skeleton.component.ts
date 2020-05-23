import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-order-skeleton',
  templateUrl: './order-skeleton.component.html',
  styleUrls: ['./order-skeleton.component.scss'],
})
export class OrderSkeletonComponent implements OnInit {
  @Input() count: string = '10';
  @Input() items: any = [];

  constructor() {
  	
  }

  ngOnInit() {
	console.log(this.count);
  	this.items = new Array(parseInt(this.count));
  }

}
