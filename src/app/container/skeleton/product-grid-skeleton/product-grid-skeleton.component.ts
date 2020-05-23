import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-grid-skeleton',
  templateUrl: './product-grid-skeleton.component.html',
  styleUrls: ['./product-grid-skeleton.component.scss'],
})
export class ProductGridSkeletonComponent implements OnInit {
  @Input() count: string = '10';
  @Input() items: any = [];

  constructor() {
  	
  }

  ngOnInit() {
	console.log(this.count);
  	this.items = new Array(parseInt(this.count));
  }

}
