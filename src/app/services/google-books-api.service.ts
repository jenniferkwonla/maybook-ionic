import { Injectable, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { VolumesData } from '../data/volumes-data';
import { VolumeInfoData } from '../data/volume-info-data';
import { VolumeData } from '../data/volume-data';
import { VolumesItemsData } from '../data/volumes-items-data';
import { BookData } from '../data/book-data';

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksApiService {

  // If the request doesn't require authorization 
  // (such as a request for public data), 
  // then the application must provide either the API key or an OAuth 2.0 token, or both—whatever option is most convenient for you.

  apiUrl: string ="https://www.googleapis.com/books/v1/volumes?q=";
  apiKey: string ="AIzaSyCV_ojvAyrST7aIZhP0msX7kqwSdMne5OI";
  selfLink: string;
  volumeId: string;
  volumeIdData: VolumesData[] = [];

  constructor(private http: HttpClient) { }

  public search(searchTerm: string): Promise<VolumeInfoData[]>{
    let result: VolumeInfoData[] = [];

    return this.sendRequestToExpressBySearchTerm(searchTerm).then((data) => {
      data.items.map(item => {
        var itemsData = new VolumesItemsData(item);
        var infoData = new VolumeInfoData(itemsData.volumeInfo);
        result.push(infoData);
      });
      
      return result;
      });
  }

  public searchGoogleVolumes(searchTerm:string): Promise<BookData[]>{
    let result: BookData[]=[];

    return this.sendRequestToExpressBySearchTerm(searchTerm).then((data) => {
      

      data.items.map(item => {
        let bookData= new BookData();
        let itemsData = new VolumesItemsData(item);
        let infoData = new VolumeInfoData(itemsData.volumeInfo);
        if(infoData.language =="en"){
          if(infoData.title.toLowerCase().includes(searchTerm.toLowerCase())){
          
            bookData.title = infoData.title;
            if(infoData.authors != undefined){
              bookData.author = infoData.authors[0];
              if (infoData.categories != undefined && infoData.categories.length ==3){
                bookData.category1 = infoData.categories[0];
                bookData.category2 = infoData.categories[1];
                bookData.category3 = infoData.categories[2];
              }
  
              if (infoData.categories != undefined && infoData.categories.length ==2){
                bookData.category1 = infoData.categories[0];
                bookData.category2 = infoData.categories[1];
              }
  
              if(infoData.categories != undefined && infoData.categories.length ==1){
                bookData.category1 = infoData.categories[0];
              }
    
              if(infoData.description != undefined){
                if(bookData.description1 == undefined){
                  bookData.description1 = infoData.description;
                }
                else if(bookData.description2 == undefined){
                  bookData.description2 = infoData.description;
                }
                else if(bookData.description3 == undefined){
                  bookData.description3 = infoData.description;
                }
              }
  
              if(infoData.imageLinks != undefined && infoData.imageLinks['smallThumbnail'].length > 0){
                bookData.image = infoData.imageLinks['smallThumbnail'];
              }
  
              bookData.googlevolumeid=itemsData.id;
              result.push(bookData); 
            }  
          } 
        }
      });

      const key="googlevolumeid";
      let uniqueResult=[...new Map(result.map(item => [item[key], item])).values()];
      let uniqueSearchResults=Array.from(new Set(uniqueResult));
      return uniqueSearchResults;
    });
  }

  public getVolumesItemsByTitle(title: string): Promise<VolumesItemsData[]>{

    let result: VolumesItemsData[]=[];

    return this.sendRequestToExpressByTitle(title).then((data) => {
      data.items.map(item => {
        var itemsData = new VolumesItemsData(item);
        var infoData =  new VolumeInfoData(itemsData.volumeInfo);
        
        if(infoData.title == title){
          result.push(itemsData);
        }
      });

      return result;
    });
  }

  public getVolumeCategoriesByTitle(title:string): Promise<string[]>{
    let result: string[]=[];

    return this.sendRequestToExpressByTitle(title).then((data) => {
      data.items.map(item => {
        var itemsData = new VolumesItemsData(item);
        var infoData =  new VolumeInfoData(itemsData.volumeInfo);
        
        if(infoData.title == title){
          result = result.concat(infoData.categories);
        }
      });

      return result;
    });
  }

  public getVolumeImageByTitle(title: string): Promise<string>{
    let result: string; 
    
    return this.sendRequestToExpressByTitle(title).then((data) => {

      data.items.map(item => {
        var itemsData = new VolumesItemsData(item);
        var infoData = new VolumeInfoData(itemsData.volumeInfo);

        if(infoData.title == title){
          result = infoData.imageLinks['smallThumbnail'];
        }
      });

      return result;
    });
  }

  public getVolumeInfoByTitle(title: string): Promise<VolumeInfoData[]>{
    
    let result: VolumeInfoData[]=[];
    
    return this.sendRequestToExpressByTitle(title).then((data) => {
      //do not delete 

      data.items.map(item => {
        var itemsData = new VolumesItemsData(item);
        var infoData =  new VolumeInfoData(itemsData.volumeInfo);
        
        if(infoData.title == title){
          result.push(new VolumeInfoData(infoData));
        }
      });

      return result;
    });
  }
  public getVolumeByVolumeId(volumeId: string): Promise<VolumeData>{
    return this.sendRequestToExpressByVolumeId(volumeId).then((data) => {
      return data;
    });
  }

  private sendRequestToExpressBySearchTerm(searchTerm: string): Promise<any> {
    return this.http.get(this.apiUrl + searchTerm + "&key=" + this.apiKey).toPromise();
  }

  private sendRequestToExpressByTitle(title: string): Promise<any> {
		  return this.http.get(this.apiUrl + "intitle:" + title + "&key=" + this.apiKey).toPromise();
  }

  private sendRequestToExpressByVolumeId(volumeId: string): Promise<any> {
    return this.http.get(this.selfLink + "/" + volumeId + "?key=" + this.apiKey).toPromise();
  }
}
