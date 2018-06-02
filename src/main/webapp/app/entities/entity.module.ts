import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { CashContaModule } from './conta/conta.module';
import { CashPlanoModule } from './plano/plano.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    imports: [
        CashContaModule,
        CashPlanoModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CashEntityModule {}
