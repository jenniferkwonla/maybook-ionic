import { Component, Input, OnInit } from '@angular/core';
import {LibraryComponent} from '../library/library.component';
import {DataService} from '../services/data.service';
import { BookData } from '../data/book-data';
import { LibraryData } from '../data/library-data';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{
  public recent: string[] = [];
  public library: BookData[] = [];
  allRecentlyLovedAndTitlesInLibrary: string[] = [];

  @Input() libraryComponent: LibraryComponent;

  constructor(public dataService: DataService) {
  }

  ngOnInit(){
    this.recent = this.dataService.getRecentlyLovedTitlesInLibrary();
    console.log("recent"+this.recent);

    this.library = [];

    // move from tab3 if needed

    // for testing purposes:
    /*this.recent=["The Big Picture"];
    let bookTitles = ["Zero to One", "The Big Picture", "The Rudest Book Ever", "Lying", "Steve Jobs"];
    if(bookTitles.length>0){
      bookTitles.forEach( bookTitle => {
        this.dataService.getBookDataByBookTitle(bookTitle).then(bookData =>{
          this.library.push(bookData);
        });
      });
    }*/

    //this.dataService.getBookInLibraryByUserId();
    /*let bookTitlesInLibrary = this.dataService.getBookTitlesInLibrary();
    this.allRecentlyLovedAndTitlesInLibrary = bookTitlesInLibrary.concat(this.recent);
  

      // change to google volume id in the future
      this.allRecentlyLovedAndTitlesInLibrary.forEach( bookTitle => {
        this.dataService.getBookDataByBookTitle(bookTitle).then(bookData =>{
          if(bookData.description1 != undefined){
            bookData.description1=bookData.description1.split(".")[0]+".";
            this.library.push(bookData);
          }
        });
      });*/
  }

  ionViewWillEnter(){
    console.log("ionviewwillenter library");
    this.library = []; 

    this.recent = this.dataService.getRecentlyLovedTitlesInLibrary();
    let bookTitlesInLibrary = this.dataService.getBookTitlesInLibrary();
    this.allRecentlyLovedAndTitlesInLibrary = bookTitlesInLibrary.concat(this.recent);

    this.allRecentlyLovedAndTitlesInLibrary = Array.from(new Set(this.allRecentlyLovedAndTitlesInLibrary));

    if(this.allRecentlyLovedAndTitlesInLibrary.length>0){

      // change to google volume id in the future
      this.allRecentlyLovedAndTitlesInLibrary.forEach( bookTitle => {
        this.dataService.getBookDataByBookTitle(bookTitle).then(bookData =>{
          if(bookData.description1 != undefined){
            bookData.description1=bookData.description1.split(".")[0]+".";
            this.library.push(bookData);
          }
        });
      });
    }
  }
}
