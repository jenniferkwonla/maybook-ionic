import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GoogleBooksApiService } from './services/google-books-api.service';
import { VolumeInfoData } from './data/volume-info-data';
import { DataService } from './services/data.service';
import { BookData } from './data/book-data';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, HammerModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {

  constructor(public googleBooksApiService: GoogleBooksApiService, public dataService: DataService){
    // comment startupengine when debugging

    //this.StartupEngine();
  }

  StartupEngine(){

    // add new book titles - find out maximum titles
    let bookTitles: string[] = [];

    let bookDataToSave: BookData[] = [];
    let googleVolumeIds: string[] = [];

    if(bookTitles.length > 0){
      bookTitles.forEach(bookTitle => {

        this.googleBooksApiService.getVolumesItemsByTitle(bookTitle).then((data) => {
  
          let googlevolumeid = "";
          let title = bookTitle;
          let author = "";
          let category1 = "";
          let category2 = "";
          let category3 = "";
          let description1 = "";
          let description2 = "";
          let description3 = "";
          let image:string="";
  
          if(data[0].volumeInfo.imageLinks != undefined){
            // check that small is not undefined
            image = data[0].volumeInfo.imageLinks['thumbnail'];
          }
  
          data.forEach( volumeItem => {
            googlevolumeid = volumeItem.id;
            let volumeInfo = new VolumeInfoData(volumeItem.volumeInfo);
            if(volumeInfo.authors != undefined){
              author=volumeInfo.authors[0];
            }
            if(volumeInfo?.categories != undefined){
              category1 = volumeInfo.categories[0] ?? "";
              category2 = volumeInfo.categories[1] ?? "";
              category3 = volumeInfo.categories[2] ?? "";
            }
            if(volumeInfo?.description != undefined){
              if(description1.length == 0){
                description1 = volumeInfo.description;
              }
              else if (description2.length == 0){
                description2 = volumeInfo.description;
              }
              else if(description3.length == 0){
                description3 = volumeInfo.description;
              }
            }
          });
  
          var bookData = new BookData();
          bookData.googlevolumeid=googlevolumeid;
          bookData.title=title;
          bookData.author=author;
          bookData.category1=category1;
          bookData.category2=category2;
          bookData.category3=category3;
          bookData.description1=description1;
          bookData.description2=description2;
          bookData.description3=description3;
          bookData.image=image;
  
          bookDataToSave.push(bookData);
          
        });
  
        // filter by googlevolumeid
        this.dataService.getAllBooksGoogleVolumeId().then(data => {
          googleVolumeIds = data;
          let uniqueBookDataToSave:BookData[] = bookDataToSave.filter(x => googleVolumeIds.indexOf(x.googlevolumeid) < 0);

          uniqueBookDataToSave.forEach(bookData =>{
            this.dataService.saveBook(bookData).then(result =>{
              bookData.id = result.id;
            })
          });
        });


        //save to db
        //this.dataService.saveBook(bookData);

        //this.dataService.bulkUpdateBooks()
      });
    }
  }
}
