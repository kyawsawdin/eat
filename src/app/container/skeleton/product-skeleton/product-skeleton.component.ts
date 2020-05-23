import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-skeleton',
  templateUrl: './product-skeleton.component.html',
  styleUrls: ['./product-skeleton.component.scss'],
})
export class ProductSkeletonComponent implements OnInit {
  @Input() count: string = '10';
  @Input() items: any = [];

  constructor() {
  	
  }

  ngOnInit() {
	console.log(this.count);
  	this.items = new Array(parseInt(this.count));
  }

}
