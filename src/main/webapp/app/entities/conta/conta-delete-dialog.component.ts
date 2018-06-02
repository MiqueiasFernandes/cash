import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Conta } from './conta.model';
import { ContaPopupService } from './conta-popup.service';
import { ContaService } from './conta.service';

@Component({
    selector: 'jhi-conta-delete-dialog',
    templateUrl: './conta-delete-dialog.component.html'
})
export class ContaDeleteDialogComponent {

    conta: Conta;

    constructor(
        private contaService: ContaService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.contaService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'contaListModification',
                content: 'Deleted an conta'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-conta-delete-popup',
    template: ''
})
export class ContaDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private contaPopupService: ContaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.contaPopupService
                .open(ContaDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
