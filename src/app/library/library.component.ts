import { Component, Input, OnInit } from '@angular/core';
import { BookData } from '../data/book-data';
import { LibraryData } from '../data/library-data';
import {DataService} from '../services/data.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {

  public recent: string[] = [];
  public library: BookData[] = [];
  allRecentlyLovedAndTitlesInLibrary: string[] = [];


  constructor(public dataService: DataService) { }

  ngOnInit() {

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
    let bookTitlesInLibrary = this.dataService.getBookTitlesInLibrary();
    this.allRecentlyLovedAndTitlesInLibrary = bookTitlesInLibrary.concat(this.recent);
  

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

  ionViewWillEnter(){   
    console.log("ionviewwillenter library");
    this.library = []; 

    //this.dataService.getBookInLibraryByUserId();
    this.recent = this.dataService.getRecentlyLovedTitlesInLibrary();
    let bookTitlesInLibrary = this.dataService.getBookTitlesInLibrary();
    this.allRecentlyLovedAndTitlesInLibrary = bookTitlesInLibrary.concat(this.recent);
    console.log("this.allRecentlyLovedAndTitlesInLibrary"+ this.allRecentlyLovedAndTitlesInLibrary);
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
