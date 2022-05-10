import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BookData } from '../data/book-data';
import { AccountData } from '../data/account-data';
import { LibraryData } from '../data/library-data';
import { StackData } from '../data/stack-data';
import { Http } from '@capacitor-community/http';
import { BookstackData } from '../data/bookstack-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  baseUrl = 'http://127.0.0.1:3000/api';
  //baseUrl = 'http://9ac1-2600-1700-5a60-a110-2856-5a0a-fb5e-63d1.ngrok.io/api';
  //baseUrl = 'https://dffc-2600-1700-5a60-a110-2856-5a0a-fb5e-63d1.ngrok.io/api';
  //baseUrl = 'https://immense-wave-76077.herokuapp.com/api';
  public username:string;
  public userid: string;
  AllBooksData: BookData[] = [];
  BookTitles: string[] = [];
  BookTitlesInLibrary:string[]=[];
  GoogleVolumeIds: string[] = [];
  RecentlyLoved: string[] = [];
  RecentlyLovedTitlesInLibrary: string[] = [];
  httpOptions = {
    headers: new HttpHeaders(),
    parameters: new HttpParams()
  };

  constructor(private http: HttpClient) { 
    this.httpOptions.headers.set('Content-Type', 'application/json')
                            .set('Access-Control-Allow-Origin', '*');
  }

  deleteAccount(){
    console.log(this.userid);
    this.sendAccountPostDeleteAccountRequestToExpress(this.baseUrl + "/" + "account"+"/"+this.userid);
  }

  getAllBooksData(): BookData[]{
    return this.AllBooksData;
  }

  getAllBooksGoogleVolumeId(): Promise<string[]>{
    return this.sendBookGetAllBooksGoogleVolumeIdRequestToExpress(this.baseUrl + "/" + "book"+"/"+"all"+"/"+"googlevolumeids"+"/").then((data)=>{
      return data;
    });
  }

  getBookById(id:string): Promise<BookData[]>{
    return this.sendBookGetBookByIdRequestToExpress(this.baseUrl+"/"+"book"+"/"+id+"/", id).then((data)=>{
      return data;
    });
  }

  getBookTitles(): string[]
  {
    return this.BookTitles;
  }

  getGoogleVolumeIds(): string[]{
    return this.GoogleVolumeIds;
  }

  getAllBooks(): Promise<BookData[]> {
    this.AllBooksData=[];
		return this.sendBookGetAllBooksRequestToExpress(this.baseUrl + "/" + "book"+"/").then((data)=>{
      let allBooksData:BookData[] = data;
      allBooksData = allBooksData.filter(x=> x.image.length>0);
      const key="googlevolumeid";
      let uniqueResult = [...new Map(allBooksData.map(item => [item[key], item])).values()];
      let uniqueAllBooks = Array.from(new Set(uniqueResult));
      uniqueAllBooks.forEach(x=>{
        let bookData = new BookData(x);
        this.AllBooksData.push(bookData);
      });
     // this.setAllBooksToBookTitles();
      this.GoogleVolumeIds = [];
      this.setAllGoogleVolumeIds();
      return uniqueAllBooks;
		});
	}

  private toTitleCase(text:string){
    return text.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  getBookStack(): Promise<StackData[]>{
    // get only 10 of created
    // change descriptions to replace chars then get first description 
    // create new bookdata and return data.

    let maxBooksToProcess = 10;
    let result: StackData[] = [];

    return this.sendBookstackGetBookstackRequestToExpress(this.baseUrl+"/"+"bookstack"+"/"+maxBooksToProcess+"/", maxBooksToProcess).then((data) => {
      /*let bookStackData = data;
      
      bookStackData.forEach(book => {
        let bookData = new BookData(book);
        let bookStackData = new BookStackData();
        bookStackData.description = this.toTitleCase(bookData.description1);
        if(bookData.description1.length > 285){
          bookStackData.description = bookData.description1.slice(0,265) + "...";
        }
        bookStackData.title = bookData.title;
        bookStackData.image = bookData.image;

        result.push(bookStackData);
      });*/

      // parse books
      let bookStacksData: BookstackData[] = data;
      let bookstackid;
      let userids;
      if(bookStacksData.length > 0 ){
        
        let bookStackData = new BookstackData(bookStacksData[0]);
        bookstackid = bookStackData.id;
        let userIds = JSON.stringify(bookStackData.userids);
        let usersTemp  = userIds.replace(/["'\\]/g, "");
        usersTemp = usersTemp.replace(/[\[\]]/g, "");
        let userIdsArray = usersTemp.split(",");
        userIdsArray.push(this.userid);
        userids = userIdsArray;
        let index= userIdsArray.indexOf(this.userid);

        if(index != -1){
          let bookIds = JSON.stringify(bookStackData.books);
          let booksTemp  = bookIds.replace(/["'\\]/g, "");
          booksTemp = booksTemp.replace(/[\[\]]/g, "");
          let bookIdsArray = booksTemp.split(",");
          console.log(bookIdsArray);

          bookIdsArray.forEach( bookId => {
            let bookDataArray = this.AllBooksData.filter(bookData => bookData.id == bookId);
            if(bookDataArray.length > 0 ){
              let bookData = bookDataArray[0];
              console.log(bookData);
              let stackData = new StackData();
              stackData.description = this.toTitleCase(bookData.description1);
              if(bookData.description1.length > 285){
                stackData.description = bookData.description1.slice(0,265) + "...";
              }
              stackData.title = bookData.title;
              stackData.image = bookData.image;
      
              result.push(stackData);
            }
          });

          // add userid to db
          
          this.sendBookstackPostUserIdRequestToExpress(this.baseUrl + "/" + "bookstack" + "/"+bookstackid+"/", JSON.stringify(userids));
        }
      }

      const key="googlevolumeid";
      let uniqueResult = [...new Map(result.map(item => [item[key], item])).values()];
      let uniqueBookStack = Array.from(new Set(uniqueResult));
      console.log("unique book stack");
      console.log(uniqueBookStack);
      return uniqueBookStack;
    });
  }

  getBookDataByBookTitle(bookTitle:string): Promise<BookData>{
    return this.sendBookGetBookByTitleRequestToExpress(this.baseUrl + "/" + "book"+ "/"+"title"+ "/" + bookTitle+"/", bookTitle).then((data)=>{
      let bookData = new BookData(data[0]);
      return bookData;
    });
  }

  getBookTitlesInLibrary(): string[]{
    return this.BookTitlesInLibrary;
  }

  getBookDataByTitle(booksArray:string[]): BookData[]{
    let result: BookData[] = [];

    booksArray.forEach( bookTitle => {
      this.sendBookGetBookByTitleRequestToExpress(this.baseUrl + "/" + "book" + "/" + bookTitle+"/", bookTitle).then((data) => {
        let bookData = new BookData(data);
        result.push(bookData);
      });
    });

    return result;
  }

  getCategoriesByBookTitle(bookTitle:string): Promise<string>{
    return this.sendBookGetBookByTitleRequestToExpress(this.baseUrl + "/" + "book"+ "/"+"title"+ "/" + bookTitle+"/", bookTitle).then((data)=>{
      let bookData = new BookData(data[0]);
      return bookData.category1;
    });
  }

  getBookInLibraryByUserId(): Promise<string[]>{
    let result: string[]=[];


    return this.sendLibraryGetLibraryByUserIdToExpress(this.baseUrl + "/"+"library"+ "/"+this.username+"/").then((data) => {
      let libraryResults: LibraryData[]  = data;

      libraryResults.forEach(library =>{
        let libraryData = new LibraryData(library);
        let bookTitles = JSON.stringify(libraryData.books);
        let temp  = bookTitles.replace(/["'\\]/g, "");
        temp = temp.replace(/[\[\]]/g, "");
        let booksArray = temp.split(",");
        result = result.concat(booksArray);
      });

      result = result.filter(x =>  x);
      let uniqueResult = Array.from(new Set(result));
      this.BookTitlesInLibrary = uniqueResult;
      return uniqueResult;

    });
  }

  getLogin(username: string, password: string): Promise<AccountData[]>{
    this.username = username;
    return this.sendAccountGetLoginRequestToExpress(this.baseUrl + "/" + "account" + "/" + username + "/"+ password +"/", username, password).then((data) => {
      if(data.length > 0){
        let accountData = new AccountData(data[0]);
        
        this.userid = accountData.id.toString();
        console.log(this.userid);
        return data;
      }
    });
  }

  getRecentlyLovedTitlesInLibrary(){
    this.RecentlyLovedTitlesInLibrary = Array.from(new Set(this.RecentlyLovedTitlesInLibrary));
    return this.RecentlyLovedTitlesInLibrary;
  }

  getRecentlyLoved(){
    return this.RecentlyLoved;
  }

  registerAccount(userid: string, password: string): Promise<AccountData>{
    return this.sendAccountPostRegisterAccountRequestToExpress(this.baseUrl + "/" + "account"+"/", userid, password).then((data) => {
      console.log(data);
      let accountData = new AccountData(data);
      this.userid = accountData.id.toString();
      this.username = accountData.userid;
      return data;
    });
  }

  saveBook(bookData: BookData):Promise<BookData>{
    return this.sendBookPostBookRequestToExpress(this.baseUrl+"/"+"book"+"/", bookData).then((data)=>{
      return data;
    });
  }

  checkBookTitlesInLibrary(bookTitles: string[]): boolean {
    let uniqueBookTitlesInLibrary = this.BookTitlesInLibrary.filter( x => bookTitles.indexOf(x) >= 0);
    if(uniqueBookTitlesInLibrary.length > 0){
      return true;
    }

    let uniqueRecentlyLovedTitlesInLibrary = this.RecentlyLovedTitlesInLibrary.filter( x => bookTitles.indexOf(x) >= 0);
    if(uniqueRecentlyLovedTitlesInLibrary.length > 0){
      return true;
    }

    return false;
  } 

  saveLovedBooks(books: string[]) {
    this.RecentlyLovedTitlesInLibrary = this.RecentlyLovedTitlesInLibrary.concat(books);
    let uniqueBookTitlesToSave: string[] = this.RecentlyLovedTitlesInLibrary.filter(x => books.indexOf(x) >= 0);

    if(uniqueBookTitlesToSave.length == 0 ){
      this.RecentlyLovedTitlesInLibrary = this.RecentlyLovedTitlesInLibrary.concat(uniqueBookTitlesToSave);
    }
    
    return this.sendLibraryPostLovedBooksRequestToExpress(this.baseUrl+"/"+ "library"+"/", books).then((data) => {
      return data;
    });
  }

  searchBookDataByTitle(bookTitle:string): BookData[] {
    let result: BookData[] = [];
    this.AllBooksData.forEach(x =>{
      let bookData = new BookData(x);
      if(bookData.title.toLowerCase().includes(bookTitle.toLowerCase())){
        result.push(bookData);
      }
    });
    return result;

    /*return this.sendBookGetBookByTitleRequestToExpress(this.baseUrl+"/"+"book"+"/"+bookTitle, bookTitle).then((data) =>{
      return data;
    });*/
  }

  searchBookDataByAuthor(author:string) : BookData[]{
    let result: BookData[] = [];
    this.AllBooksData.forEach(x =>{
      let bookData = new BookData(x);
      if(bookData.author.toLowerCase().includes(author.toLowerCase())){
        result.push(bookData);
      }
    });

    return result;

    /*return this.sendBookGetBookByAuthorRequestToExpress(this.baseUrl+"/book"+"/"+"author"+"/"+author,author).then((data)=>{
      return data;
    });*/
  }

  setRecentlyLoved(bookTitle:string): void{
    this.RecentlyLoved.push(bookTitle);
    this.RecentlyLovedTitlesInLibrary.push(bookTitle);
  }

  validAccount(userid: string){
    return this.sendAccountGetValidAccountRequestToExpress(this.baseUrl + "/" + "account"+ "/" + userid+"/", userid).then((data) => {
      return data;
    });
  }

  private setAllBooksToBookTitles(): void {
    this.BookTitles = [];
    for(let index = 0;  index < this.AllBooksData.length; ++index){
      this.BookTitles.push(this.AllBooksData[index].title);
    }
  }

  private setAllGoogleVolumeIds(): void{
    this.GoogleVolumeIds = [];
    for(let index = 0;  index < this.AllBooksData.length; ++index){
      this.GoogleVolumeIds.push(this.AllBooksData[index].googlevolumeid);
    }
  }

  private sendLibraryGetLibraryByUserIdToExpress(endpoint:string):Promise<any>{
    this.httpOptions.parameters = new HttpParams();
    this.httpOptions.parameters.append("userid", this.username);
    return this.http.get(endpoint, this.httpOptions).toPromise();
   
    /*let data;
    let options= {
      url: endpoint,
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'GET'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })*/
  }

  private sendLibraryPostLovedBooksRequestToExpress(endpoint:string, books: string[]):Promise<any>{
    let booksString = JSON.stringify(books);
    //return this.http.post(endpoint, {"love": {"userid": this.userid,"books": booksString}}, this.httpOptions).toPromise();
    let jsonData = {"love": {"userid": this.username,"books": booksString}};
    let data;
    let options= {
      url: endpoint,
      data: jsonData,
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'POST'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })
  }

  private sendAccountPostRegisterAccountRequestToExpress(endpoint: string, userid: string, password:string):Promise<any>{
    //return this.http.post(endpoint, {"account": {"userid": userid, "password": password}}, this.httpOptions).toPromise();
    let jsonData = {"account":{"userid": userid, "password": password}};
    let data;
    let options= {
      url: endpoint,
      data: jsonData,
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'POST'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })
  }

  private sendAccountPostDeleteAccountRequestToExpress(endpoint: string){
    let data;
    let options= {
      url: endpoint,
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'POST'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })
  }

	private sendAccountGetLoginRequestToExpress(endpoint:string, userid: string, password: string):Promise<any> {
    this.httpOptions.parameters = new HttpParams();
    this.httpOptions.parameters.append("userid", userid);
    this.httpOptions.parameters.append("password", password);
		return this.http.get(endpoint, this.httpOptions).toPromise();
    /*let data;
    let options= {
      url: endpoint,
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'GET'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })*/
  }

  private sendAccountGetValidAccountRequestToExpress(endpoint:string, userid: string): Promise<any>{
    this.httpOptions.parameters = new HttpParams();
    this.httpOptions.parameters.append("userid", userid);
    return this.http.get(endpoint, this.httpOptions).toPromise();
    /*let jsonData = {"userid": userid};
    let data;
    let options= {
      url: endpoint,
      data: jsonData, 
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'GET'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })*/
  }

  private sendBookGetAllBooksGoogleVolumeIdRequestToExpress(endpoint:string):Promise<any>{
    return this.http.get(endpoint, this.httpOptions).toPromise();
    /*let data;
    let options= {
      url: endpoint,
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'GET'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })*/
  }

  private sendBookGetBookByIdRequestToExpress(endpoint:string, id:string): Promise<any> {
    this.httpOptions.parameters = new HttpParams();
    this.httpOptions.parameters.append("id", id);
		return this.http.get(endpoint, this.httpOptions).toPromise();
    /*let jsonData = {"id": id};
    let data;
    let options= {
      url: endpoint,
      data: jsonData, 
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'GET'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })*/ 
  }

  private sendBookGetBookByTitleRequestToExpress(endpoint:string, bookTitle:string): Promise<any>{
    this.httpOptions.parameters = new HttpParams();
    this.httpOptions.parameters.append("title", bookTitle);
    return this.http.get(endpoint, this.httpOptions).toPromise();
    /*let jsonData = {"title": bookTitle};
    let data;
    let options= {
      url: endpoint,
      data: jsonData, 
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'GET'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })*/
  }

  private sendBookGetAllBooksRequestToExpress(endpoint:string):Promise<any> {
		return this.http.get(endpoint, this.httpOptions).toPromise();

    /*let data;
    let options= {
      url: endpoint,
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'GET'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })*/
	}

  private sendBookPostBookRequestToExpress(endpoint:string, bookData: BookData):Promise<any> {
		//double check bookData object is accepted.
    //this.httpOptions.parameters = new HttpParams();
    //this.httpOptions.parameters.append("googlevolumeid", bookData.googlevolumeid);

    let jsonData = {"book": bookData};
    let data;
    let options= {
      url: endpoint,
      data: jsonData, 
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'POST'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })
    //return this.http.post(endpoint, JSON.stringify(data),this.httpOptions).toPromise();
	}

  private sendBookstackPostUserIdRequestToExpress(endpoint:string, userids:string): Promise<any>{
    let jsonData = {"userids": userids};
    let data;
    let options={
      url: endpoint,
      data:jsonData,
      headers: { 'Content-Type': 'application/json' }
    }

    return Http.request({...options, method: 'POST'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    })
  }

  private sendBookstackGetBookstackRequestToExpress(endpoint: string, maxBooksToProcess: number):Promise<any>{
    this.httpOptions.parameters = new HttpParams();
    this.httpOptions.parameters.append("maxbookstoprocess", maxBooksToProcess);
    return this.http.get(endpoint, this.httpOptions).toPromise();

    /*let jsonData = {"maxbookstoprocess": maxBooksToProcess};
    let data;
    let options= {
      url: endpoint,
      data: jsonData, 
      headers: { 'Content-Type': 'application/json' }
    };

    return Http.request({...options, method: 'GET'})
    .then(async response => {
      if(response.status===200){
        data = await response.data;
        return data;
      }
    })
    .catch(e => {
      console.log(e)
      return e;
    })*/
  }
}
