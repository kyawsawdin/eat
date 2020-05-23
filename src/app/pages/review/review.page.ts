import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Service } from './../../api.service';
import { md5 } from './md5';
import { NavParams, ModalController } from '@ionic/angular';
import { Settings } from './../../data/settings';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-review',
    templateUrl: './review.page.html',
    styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {
    id: any;
    reviews: any = [];
    tempReviews: any;
    hasMoreItems: boolean = true;
    filter: any = {};
    showReviews: boolean = false;
    count: any;
    count5: number = 0;
    count4: number = 0;
    count3: number = 0;
    count2: number = 0;
    count1: number = 0;
    count5Percentage: number = 0;
    count4Percentage: number = 0;
    count3Percentage: number = 0;
    count2Percentage: number = 0;
    count1Percentage: number = 0;
    form: any;
    disableSubmit: boolean = false;
    isLoggedIn: boolean = false;
    constructor(public service: Service, public router: Router, public route: ActivatedRoute, public settings: Settings, private fb: FormBuilder, public navParams: NavParams, public modalCtrl: ModalController) {
        if(this.settings.customer && this.settings.customer.id > 0) {
            this.isLoggedIn = true;
        }
    }
    ngOnInit() {

        this.filter.page = 1;
        this.id = this.navParams.data.id;
        this.filter.product_id = this.id;
        
        this.form = this.fb.group({
            rating: [5, Validators.required],
            author: ['', this.isLoggedIn ? '' : Validators.required],
            email: ['', this.isLoggedIn ? '' : Validators.email],
            comment: ['', Validators.required],
            comment_post_ID: [this.id, Validators.required]
        });
      
        this.getReviews()
    }
    async loadData(event) {
        this.filter.page = this.filter.page + 1;
        await this.service.postFlutterItem('product_reviews', this.filter).then(res => {
            this.tempReviews = res;
            this.reviews.push.apply(this.reviews, this.tempReviews);
            event.target.complete();
            if (!res) this.hasMoreItems = false;
            for (let item in this.reviews) {
                this.reviews[item].avatar = md5(this.reviews[item].email);
            }
        }).catch(() => {
            event.target.complete();
        });
    }
    async getReviews() {
        await this.service.postFlutterItem('product_reviews', this.filter).then(res => {
            this.reviews = res;
            for (let item in this.reviews) {
                this.reviews[item].avatar = md5(this.reviews[item].email);
            }

            this.count = this.reviews.length;

            this.reviews.forEach(review => {
                if (parseInt(review.rating) == 5) {
                    this.count5 = this.count5 + 1;
                }
                else if (parseInt(review.rating) >= 4) {
                    this.count4 = this.count4 + 1;
                }
                else if (parseInt(review.rating) >= 3) {
                    this.count3 = this.count3 + 1;
                }
                else if (parseInt(review.rating) >= 2) {
                    this.count2 = this.count2 + 1;
                }
                else if (parseInt(review.rating) == 1) {
                    this.count1 = this.count1 + 1;
                }
            });
            this.showReviews = true;
            this.count5Percentage = ((this.count5 / this.count) * 100);
            this.count4Percentage = ((this.count4 / this.count) * 100);
            this.count3Percentage = ((this.count3 / this.count) * 100);
            this.count2Percentage = ((this.count2 / this.count) * 100);
            this.count1Percentage = ((this.count1 / this.count) * 100);
        }).catch(() => {

        });
    }
    yourRating(rating) {
        this.form.value.rating = rating;
    }
    async onSubmit() {
        this.disableSubmit = true;
        await this.service.ajaxCall('/wp-comments-post.php', this.form.value).then(res => {
            this.disableSubmit = false;
        }, err => {
            this.disableSubmit = false;
        });
    }
    close() {
        this.modalCtrl.dismiss({});
    }
}