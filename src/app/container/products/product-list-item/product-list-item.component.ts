import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-product-list-item',
  templateUrl: './product-list-item.component.html',
  styleUrls: ['./product-list-item.component.scss'],
})
export class ProductListItemComponent implements OnInit {
  @Input() name: string;
  @Input() description: string;
  @Input() price: string;
  @Input() salesPrice: string;

  constructor() {
  	
  }

  ngOnInit() {

  	
  }

}
