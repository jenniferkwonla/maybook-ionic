import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from "@angular/forms";
import { NavController, AlertController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  ionicForm: FormGroup;
  accountFound: boolean = false;
  accountRegistered: boolean = false;

  constructor(private navCtrl: NavController, 
              public formBuilder: FormBuilder, 
              public alertCtrl: AlertController,
              public dataService: DataService,
              private location:Location) { }

  ngOnInit() {
    this.ionicForm= this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['']
    });
  }

  async submitRegistrationForm(){

    this.dataService.validAccount(this.ionicForm.value.userid).then(async result => {
      
      //TODO check result when no data is found.
      if(result.length > 0){
        this.accountFound = true;
      }

      if (this.accountFound){
        //redirect to registration
        const alert = await this.alertCtrl.create({
          cssClass: 'AlertClass',
          header: 'Register Error',
          subHeader: '',
          message: 'The account is already registered',
          buttons: ['OK']
        });
    
        await alert.present();
        const { role } = await alert.onDidDismiss();
        
        this.navCtrl.navigateBack('/registration');

      }
      else{
          this.dataService.registerAccount(this.ionicForm.value.userid, this.ionicForm.value.password).then(async result => {

            this.resetRegisterForm();
            this.navCtrl.navigateForward('/home');

            /*if(result.length > 0){
              console.log("account registered");
              this.accountRegistered = true;
            }

            if(this.accountRegistered){
              // successful registration
              this.accountFound = false;
              this.accountRegistered = false;
              this.resetRegisterForm();

              this.navCtrl.navigateBack('/home');
            }
            else{
              // unsuccessful registration
              const alert = await this.alertCtrl.create({
                cssClass: 'AlertClass',
                header: 'Register Error',
                subHeader: '',
                message: 'Unable to register account. Username is aleady in the system. Create new account or contact MayBook.',
                buttons: ['OK']
              });
          
              await alert.present();
              const { role } = await alert.onDidDismiss()

              this.accountFound = false;
              this.accountRegistered = false;
              this.resetRegisterForm();
              
            }*/
          
        });
      }
    });
  }


  resetRegisterForm(){
    this.ionicForm= this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['']
    });
  }

  back():void{
    this.location.back();
  }

}
