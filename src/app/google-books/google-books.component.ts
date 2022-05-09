import { Component, Input, OnInit } from '@angular/core';
import { zip } from 'rxjs';
import { GoogleBooksApiService } from 'src/app/services/google-books-api.service';
import { BookData } from '../data/book-data';

import { VolumeInfoData } from '../data/volume-info-data';
import {VolumesData} from '../data/volumes-data';
import { VolumesItemsData } from '../data/volumes-items-data';

@Component({
  selector: 'app-google-books',
  templateUrl: './google-books.component.html',
  styleUrls: ['./google-books.component.scss'],
})
export class GoogleBooksComponent implements OnInit {

  //VolumesData: VolumesData[]=[];
  //VolumesItemsData: VolumesItemsData[] = [];
  //VolumeInfoData: VolumeInfoData[] = [];
  //volumeData: VolumeData;
  //VolumeId: string;

  constructor(private googleBookApiService: GoogleBooksApiService) { }

  //@Input() title:string;
  @Input() bookData: BookData;

  descriptions1: string[];
  descriptions2: string[];
  descriptions3: string[];
  public description1:string;
  public description2:string;
  public description3:string;

  ngOnInit() {
    this.description1 = this.bookData.description1 != null ? this.bookData.description1 : "";
    this.description2 = this.bookData.description2 != null ? this.bookData.description2 : "";
    this.description3 = this.bookData.description3 != null ? this.bookData.description3 : "";

    // come back to it.
    //this.descriptions1 = description1.split(".");
    // check if the first and last letter are capatialized then combine them
    //this.descriptions1 = this.descriptions1.filter(x => x.length > 0 );
    //this.descriptions2 = description2.split(".");
    //this.descriptions3 = description3.split(".");
  }
}
