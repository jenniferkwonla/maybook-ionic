import { Component, Input } from '@angular/core';
import { BookStackComponent } from '../book-stack/book-stack.component';
import {DataService} from '../services/data.service';
import {BookData} from '../data/book-data';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public cards;
  public allBooks: BookData[] = [];
  public lovedBooks: string[] = [];
  
  @Input() bookStack: BookStackComponent;

  constructor(public dataService: DataService) {

    this.dataService.getAllBooks().then((result) => {
      // get only 10 in the future
      this.allBooks = result;
    });

    // create a bookstack table with
    // id, all user ids, and text, which are a list of book ids that will be released.
    // or have a column for user where it says if they saw the most recent bookstack, and it changes 
    // using the last login date
    this.dataService.getBookStack().then((result) => {
      console.log("book stack");
      console.log(result);
      this.cards = result;
    });
  }

  logChoice(event){
    let card = event.payload;
    let loved = event.choice;
    if(loved){
      let book = this.allBooks.filter(x => x.title == card.title)[0];
      this.lovedBooks.push(book.title);
      this.dataService.setRecentlyLoved(book.title);
    }
  }

  logSelectedChoice(event){
    this.dataService.saveLovedBooks(this.lovedBooks);
  }

}
