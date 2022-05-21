import {Component, Input, ViewChild} from '@angular/core';
import {BookData} from '../data/book-data';
import {HttpClient} from '@angular/common/http';
import {NavController} from '@ionic/angular';
import { FormControl } from '@angular/forms';
import {DataService} from '../services/data.service';
import { GoogleBooksApiService } from 'src/app/services/google-books-api.service';
import { VolumesItemsData } from '../data/volumes-items-data';

import { SearchbarComponent } from '../searchbar/searchbar.component';

// save book image to database
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
	VolumesItemsData: VolumesItemsData[] = [];
	AllBookResult: BookData[] = [];
	BookTitles: string[] = [];
	JustAddedBooks: BookData[] = [];
	ArtBooks: BookData[] = [];
	EngineeringBooks: BookData[] = [];
	ScienceBooks: BookData[] = [];
	BusinessBooks: BookData[] = [];
	FictionBooks:  BookData[] = [];
	NonFictionBooks: BookData[] = [];
	AllBookData: BookData[] = [];
	Categories: string[] = ['Design', 'Engineering', 'Science', 'Business', 'Fiction', 'NonFiction'];
	
	@Input() searchBar: SearchbarComponent;

	@ViewChild('SearchBarComponent') searchbarcomponent: SearchbarComponent;

    constructor(public http:HttpClient, public dataService: DataService, public googleBookApiService: GoogleBooksApiService){
	}

	ngOnInit(){
		
		// get all books

		this.getAllBooks();
		this.dataService.getBookInLibraryByUserId();
		
	}

	private getAllBooks(){
		this.dataService.getAllBooks().then((result) => {
			this.AllBookResult = result;
			//this.BookTitles = this.dataService.getBookTitles();
			let googlevolumeids = this.dataService.getGoogleVolumeIds();
			
			
			// get categories & images
			googlevolumeids.forEach(volumeId => {

				var bookData = this.AllBookResult.filter(x => x.googlevolumeid == volumeId)[0];
				var copyBookData = new BookData(bookData);
				copyBookData.viewTitle = copyBookData.title.slice(0, 36);
				if(copyBookData.viewTitle.length < copyBookData.title.length){
					copyBookData.viewTitle =copyBookData.viewTitle + "...";
				}
				copyBookData.viewAuthor = copyBookData.author.slice(0, 15);
				let category = copyBookData.category1;
				this.AllBookData.push(copyBookData);				

				//this.dataService.getCategoriesByBookTitle(volumeId).then(category => {
					if(category != undefined && category.length > 0){
						if (category.includes("Design") || category.includes("Art") || category.includes("Architecture")  ){
							if(!this.ArtBooks.some(x => x.googlevolumeid == volumeId)){
								this.ArtBooks.push(copyBookData);
							}
						}
						else if (category.includes("Engineer") || category.includes("Computer")){
							if(!this.EngineeringBooks.some(x => x.googlevolumeid == volumeId)){
								this.EngineeringBooks.push(copyBookData);
							}
						}
						else if (category.includes("Science") || category.includes("Biology")){
							if(!this.ScienceBooks.some(x => x.googlevolumeid == volumeId)){
								this.ScienceBooks.push(copyBookData);
							}
						}
						else if(category.includes("Biography")){
							if(!this.NonFictionBooks.some(x => x.googlevolumeid == volumeId)){
								this.NonFictionBooks.push(copyBookData);
							}
						}
						else if(category.includes("Business")){
							if(!this.BusinessBooks.some(x => x.googlevolumeid == volumeId)){
								this.BusinessBooks.push(copyBookData);
							}
						}
						else if(category.includes("Fiction")){
							if(!this.FictionBooks.some(x => x.googlevolumeid == volumeId)){
								this.FictionBooks.push(copyBookData);
							}
						}
					}
				//});
			});
			
		});
		
	}

	private getRecentSearchedBooks(){
		this.dataService.getAllBooks().then((result) => {

			let recentAllBookData = this.dataService.getAllBooksData(); 

			this.AllBookData = [];
			recentAllBookData.forEach(bookData=> {
				var copyBookData = new BookData(bookData);
				copyBookData.viewTitle = copyBookData.title.slice(0,36);
				if(copyBookData.viewTitle.length < copyBookData.title.length){
					copyBookData.viewTitle =copyBookData.viewTitle + "...";
				}
				copyBookData.viewAuthor = copyBookData.author.slice(0, 15);
				let googlevolumeid = bookData.googlevolumeid;
				let category = bookData.category1;
				this.AllBookData.push(copyBookData);
				//console.log(copyBookData);

				if(category != undefined && category.length > 0){
					if (category.includes("Design") || category.includes("Art") || category.includes("Architecture")  ){
						if(!this.ArtBooks.some(x => x.googlevolumeid == googlevolumeid)){
							this.ArtBooks.push(copyBookData);
						}
					}
					else if (category.includes("Engineer") || category.includes("Computer")){
						if(!this.EngineeringBooks.some(x => x.googlevolumeid == googlevolumeid)){
							this.EngineeringBooks.push(copyBookData);
						}
					}
					else if (category.includes("Science") || category.includes("Biology")){
						if(!this.ScienceBooks.some(x => x.googlevolumeid == googlevolumeid)){
							this.ScienceBooks.push(copyBookData);
						}
					}
					else if(category.includes("Biography")){
						if(!this.NonFictionBooks.some(x => x.googlevolumeid == googlevolumeid)){
							this.NonFictionBooks.push(copyBookData);
						}
					}
					else if(category.includes("Business")){
						if(!this.BusinessBooks.some(x => x.googlevolumeid == googlevolumeid)){
							this.BusinessBooks.push(copyBookData);
						}
					}
					else if(category.includes("Fiction")){
						if(!this.FictionBooks.some(x => x.googlevolumeid == googlevolumeid)){
							this.FictionBooks.push(copyBookData);
						}
					}
				}
			});
		});
	}


	ionViewWillEnter(){
		this.searchModel="";
		this.getRecentSearchedBooks();
	}

	ionViewDidEnter(){
		this.searchModel="";
	}

	ionViewWillLeave(){
		this.searchModel="";
		//this.searchBar.searchbar.value ="";
		//this.searchBar.searchbar.clearInput(null);
	}

	ionViewDidLeave(){
		this.searchModel="";
		//this.searchBar.searchbar.value ="";
		//this.searchBar.searchbar.clearInput(null);
	}

	searchResults: BookData[] = [];
	prevSearch: string;
	searchModel:string="";
	

	ionChange(event){
		//check here
		if(!event.detail.value.includes(this.prevSearch)){
		  this.searchResults = [];
		}
		
		let term = event.detail.value;
		
		if(event.detail.value.length > 0){
	
		  this.prevSearch = term;
	
		  let tempSearchResults: BookData[]=[];

		  //search allbooks
		  let booksWithTitles = this.AllBookData.filter(bookData => bookData.title.toLowerCase().includes(term.toLowerCase()));
		  let booksWithAuthors = this.AllBookData.filter(bookData => bookData.author.toLowerCase().includes(term.toLowerCase()));
		  this.searchResults = this.searchResults.concat(booksWithTitles);
		  this.searchResults = this.searchResults.concat(booksWithAuthors);

		  //search googlebookapi
		  this.googleBookApiService.searchGoogleVolumes(term).then((data) =>{
			let googleBooksApiResults = data;
	
			let googlevolumeids = this.dataService.getGoogleVolumeIds();
	
			let newBooksToSave = googleBooksApiResults.filter(x => googlevolumeids.indexOf(x.googlevolumeid) < 0);
	
			newBooksToSave.forEach(bookData =>{
			  this.dataService.saveBook(bookData).then(result =>{
				bookData.id = result.id;
			  });
			  this.searchResults.push(bookData);
			});
		  });

		  let uniqueSearchResults = this.searchResults.map(item => item).filter((value,index,self) => self.indexOf(value)===index);
		  this.searchResults = uniqueSearchResults;
		  console.log(this.searchResults);

		}
	  }
}
