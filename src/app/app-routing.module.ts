import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { UserGuard } from './shared/guards/user.guard';
import { PagesComponent } from './pages/pages.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
	{
		path: '',
		component: PagesComponent, children: [
			{
				path: '',
				loadChildren: './pages/questions/questions.module#QuestionsModule'
			},
			{
				path: 'account',
				loadChildren: './pages/account/account.module#AccountModule',
				canActivate: [UserGuard]
			},
			{
				path: 'user',
				loadChildren: './pages/user/user.module#UserModule',
				canActivate: [UserGuard]
			},
			{
				path: 'sitemanager',
				loadChildren: './pages/sitemanager/sitemanager.module#SitemanagerModule',
			},
			{
				path: 'extra',
				loadChildren: './pages/extra/extra.module#ExtraModule'
			},
		]
	},
	{
		path: 'gateway',
		loadChildren: './gateway/gateway.module#GatewayModule'
	},
	{ path: '**', component: NotFoundComponent }
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

