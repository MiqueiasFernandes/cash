import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ChartsModule } from 'ng2-charts';

import { CashSharedModule } from '../shared';

import { HOME_ROUTE, HomeComponent } from './';
import {ContaService} from '../entities/conta';

@NgModule({
    imports: [
        CashSharedModule,
        ChartsModule,
        RouterModule.forChild([ HOME_ROUTE ])
    ],
    declarations: [
        HomeComponent,
    ],
    entryComponents: [
    ],
    providers: [
        ContaService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CashHomeModule {}
