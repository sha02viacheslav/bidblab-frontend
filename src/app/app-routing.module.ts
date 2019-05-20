import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
// import { UserGuard } from './shared/guards/user.guard';

const routes: Routes = [
  // {
  //   path: 'gateway',
  //   loadChildren: './gateway/gateway.module#GatewayModule'
  // },
  {
    path: 'questions',
    loadChildren: './questions/questions.module#QuestionsModule',
  },
  // {
  //   path: 'account',
  //   loadChildren: './account/account.module#AccountModule',
  //   canActivate: [UserGuard]
  // },
  // {
  //   path: 'user',
  //   loadChildren: './user/user.module#UserModule',
  //   canActivate: [UserGuard]
  // },
  // {
  //   path: 'sitemanager',
  //   loadChildren: './sitemanager/sitemanager.module#SitemanagerModule',
  // },
  {
    path: 'extra',
    loadChildren: './extra/extra.module#ExtraModule'
  },
  { path: '**', redirectTo: 'questions' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      // useHash: true,
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

