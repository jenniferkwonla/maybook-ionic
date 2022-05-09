import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { NavController, AlertController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  ionicForm: FormGroup;
  accountFound: boolean = false;

  constructor(private navCtrl: NavController, 
              public dataService: DataService,
              public formBuilder: FormBuilder, 
              public alertCtrl: AlertController) { }

  ngOnInit() {
    this.ionicForm= this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['']
    });
  }

  async submitLoginForm(){

    if(this.ionicForm.value.userid.length == 0 || 
      this.ionicForm.value.password.length == 0) {
        const alert = await this.alertCtrl.create({
          cssClass: 'AlertClass',
          header: 'Login Error',
          subHeader: '',
          message: 'Please enter valid username and password',
          buttons: ['OK']
        });

        await alert.present();
        const { role } = await alert.onDidDismiss();
        
        this.accountFound = false;
        this.resetLoginForm();
        return;
      }

      //this.dataService.getLogin(this.ionicForm.value.userid, this.ionicForm.value.password);
      this.dataService.getLogin(this.ionicForm.value.userid, this.ionicForm.value.password).then(async result => {
      if(result.length > 0){
        this.accountFound = true;
      }

      if (!this.accountFound){
        //redirect to registration
        const alert = await this.alertCtrl.create({
          cssClass: 'AlertClass',
          header: 'Login Error',
          subHeader: '',
          message: 'Invalid login.',
          buttons: [
            {
              text: 'OK',
              role: 'ok',
              cssClass:'SecondaryAlertClass',
              id: 'OkButton',
              handler: (text) => {
                console.log('Confirm Ok: text');
              } 
            },
            {
              text: 'Sign Up',
              role: 'register',
              cssClass:'SecondaryAlertClass',
              id: 'RegisterButton',
              handler: (text) => {
                this.navCtrl.navigateBack('/registration');
                //console.log('Confirm Register: text');
              } 
            }
          ]
        });
    
        await alert.present();
        const { role } = await alert.onDidDismiss();
        
        this.accountFound = false;
        this.resetLoginForm();
        //this.navCtrl.navigateBack('/registration');
      }
      else{
        this.accountFound = false;
        this.resetLoginForm();
        // redirect to home
        this.navCtrl.navigateForward('/home');
        
      }

    });
  }

  resetLoginForm(){
    this.ionicForm= this.formBuilder.group({
      userid: ['', Validators.required],
      password: ['']
    });
  }

}
