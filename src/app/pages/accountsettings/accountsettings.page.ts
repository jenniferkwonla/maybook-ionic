import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-accountsettings',
  templateUrl: './accountsettings.page.html',
  styleUrls: ['./accountsettings.page.scss'],
})
export class AccountsettingsPage implements OnInit {

  public username:string;
  constructor(private location:Location, public dataService: DataService) { }

  ngOnInit() {
    this.username = this.dataService.userid;
  }

  back():void{
    this.location.back();
  }

}
