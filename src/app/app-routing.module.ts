import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ViewBookPage } from './pages/view-book/view-book.page';
import { TabsPage } from './tabs/tabs.page';

const routes: Routes = [
  
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { 
    path: 'home', 
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  { 
    path: 'tabs', 
    component: TabsPage,
    children: [
      {
        path: 'tab1', 
        loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule)
      },
      { 
        path: 'tab2', 
        loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2PageModule)
      },
      { 
        path: 'tab3', 
        loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule)
      }
    ]
  },
  {
    path: 'tab1', 
    loadChildren: () => import('./tab1/tab1.module').then(m => m.Tab1PageModule)
  },
  { 
    path: 'tab2', 
    loadChildren: () => import('./tab2/tab2.module').then(m => m.Tab2PageModule)
  },
  { 
    path: 'tab3', 
    loadChildren: () => import('./tab3/tab3.module').then(m => m.Tab3PageModule)
  },
  {
    path: 'tabs/tab1/view-book',
    loadChildren: () => import('./pages/view-book/view-book.module').then( m => m.ViewBookPageModule)
  },
  {
    path: 'view-book/:id',
    loadChildren: () => import('./pages/view-book/view-book.module').then( m => m.ViewBookPageModule)
  },
  {
    path: 'tabs/tab3/view-book/:id',
    loadChildren: () => import('./pages/view-book/view-book.module').then( m => m.ViewBookPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./pages/registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'accountsettings',
    loadChildren: () => import('./pages/accountsettings/accountsettings.module').then( m => m.AccountsettingsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./pages/about/about.module').then( m => m.AboutPageModule)
  },
  { path: 'logout', redirectTo: '/login', pathMatch: 'full'},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
