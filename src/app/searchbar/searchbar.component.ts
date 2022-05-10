import { Component, OnInit } from '@angular/core';
import {BookData} from '../data/book-data';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators';
import { GoogleBooksApiService } from 'src/app/services/google-books-api.service';
import { DataService } from '../services/data.service';
import { ViewChild } from '@angular/core';
import {IonSearchbar} from '@ionic/angular';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss'],
})
export class SearchbarComponent implements OnInit {

  //searchField: FormControl;
  searchResults: BookData[] = [];
  searchModel:string="";
  prevSearch: string;

  constructor(public dataService: DataService, public googleBookApiService: GoogleBooksApiService) { 
   // this.searchField = new FormControl('');
  }

  ngOnInit() {
    // init search field -- delete below possibly
		//var searchTerm = this.searchField.valueChanges.pipe(startWith(this.searchField.value));
  }

  ionChange(event){
    if(!event.detail.value.includes(this.prevSearch)){
      this.searchResults = [];
    }
    
    let term = event.detail.value;
    
    if(event.detail.value.length > 0){

      this.prevSearch = term;

      let tempSearchResults: BookData[]=[];
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

      this.dataService.getAllBooks();
    }
  }

  ionViewWillLeave(){
   // this.searchField = new FormControl('');
	}

	ionViewDidLeave(){
    //this.searchField = new FormControl('');
	}
}
