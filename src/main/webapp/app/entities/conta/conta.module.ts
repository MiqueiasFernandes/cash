import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CashSharedModule } from '../../shared';
import {
    ContaService,
    ContaPopupService,
    ContaComponent,
    ContaDetailComponent,
    ContaDialogComponent,
    ContaPopupComponent,
    ContaDeletePopupComponent,
    ContaDeleteDialogComponent,
    contaRoute,
    contaPopupRoute,
    ContaResolvePagingParams,
} from './';

const ENTITY_STATES = [
    ...contaRoute,
    ...contaPopupRoute,
];

@NgModule({
    imports: [
        CashSharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        ContaComponent,
        ContaDetailComponent,
        ContaDialogComponent,
        ContaDeleteDialogComponent,
        ContaPopupComponent,
        ContaDeletePopupComponent,
    ],
    entryComponents: [
        ContaComponent,
        ContaDialogComponent,
        ContaPopupComponent,
        ContaDeleteDialogComponent,
        ContaDeletePopupComponent,
    ],
    providers: [
        ContaService,
        ContaPopupService,
        ContaResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CashContaModule {}
