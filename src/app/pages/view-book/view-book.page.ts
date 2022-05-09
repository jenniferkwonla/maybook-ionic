import { Component, Input, NgModule, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient, HttpParams} from '@angular/common/http'; 
import {BookData} from '../../data/book-data';
import {GoogleBooksComponent} from 'src/app/google-books/google-books.component';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-view-book',
  templateUrl: './view-book.page.html',
  styleUrls: ['./view-book.page.scss'],
})

export class ViewBookPage implements OnInit{

	@Input() googlebooks: GoogleBooksComponent;

	bookData: BookData[]=[];
	title: string = "";
	id: string = "";

	constructor(public alertCtrl: AlertController, public http: HttpClient, private route:ActivatedRoute, public dataService: DataService, private location:Location) { 
	}

	ngOnInit() {
		this.id = this.route.snapshot.paramMap.get('id');
		this.dataService.getBookById(this.id).then((result) => {this.bookData = result;});
		// break down descriptions into bullet points
	}

  	async addToLibrary(){
		let bookTitles:string[]= [];
		bookTitles.push(this.bookData['title']);

		let isInLibrary = this.dataService.checkBookTitlesInLibrary(bookTitles);

		if(!isInLibrary){
			this.dataService.saveLovedBooks(bookTitles).then(async result =>{

				if(result != undefined){
					const alert = await this.alertCtrl.create({
						cssClass: 'AlertClass',
						header: "Added to library",
						subHeader: '',
						message: this.bookData['title'] + " has been added to your library",
						buttons: ["OK"]
						  
					  });
				  
					  await alert.present();
					  const { role } = await alert.onDidDismiss();
				}
			});
		}
		else{
			const alert = await this.alertCtrl.create({
				cssClass: 'AlertClass',
				header: "In library",
				subHeader: '',
				message: this.bookData['title'] + " is already in your library",
				buttons: ["OK"]
				  
			  });
		  
			  await alert.present();
			  const { role } = await alert.onDidDismiss();
		}
		
	}

	back():void{
	this.location.back();
	}

	ionViewWillEnter(){
		console.log("ionview will enter viewbook");
	}

	ionViewDidEnter(){
		console.log("ionview did enter viewbook");
	}

	ionViewWillLeave(){
		console.log("ionview will leave viewbook");
	}

	ionViewDidLeave(){
		console.log("ionview did leave viewbook");
	}

}
