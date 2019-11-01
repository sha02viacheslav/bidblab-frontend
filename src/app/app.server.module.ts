import { NgModule } from '@angular/core';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';

import { FlexLayoutServerModule } from '@angular/flex-layout/server';

import { ɵangular_packages_platform_server_platform_server_c as ServerStylesHost } from '@angular/platform-server';

export class NoRenderServerStylesHost extends ServerStylesHost {

  onStylesAdded(additions: Set<string>): void {
      // super.onStylesAdded(additions);
      // additions.forEach((s) => console.log(s));
      // ignore styles added
  }
}

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    ModuleMapLoaderModule,
    ServerTransferStateModule,
    // FlexLayoutServerModule
  ],
  bootstrap: [AppComponent],
  providers: [{
    provide: ServerStylesHost,
    useClass: NoRenderServerStylesHost
  }]
})
export class AppServerModule {}
