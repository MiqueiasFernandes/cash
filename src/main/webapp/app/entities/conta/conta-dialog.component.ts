import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Conta } from './conta.model';
import { ContaPopupService } from './conta-popup.service';
import { ContaService } from './conta.service';

@Component({
    selector: 'jhi-conta-dialog',
    templateUrl: './conta-dialog.component.html'
})
export class ContaDialogComponent implements OnInit {

    conta: Conta;
    isSaving: boolean;
    dataDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private contaService: ContaService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.conta.id !== undefined) {
            this.subscribeToSaveResponse(
                this.contaService.update(this.conta));
        } else {
            this.subscribeToSaveResponse(
                this.contaService.create(this.conta));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Conta>>) {
        result.subscribe((res: HttpResponse<Conta>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Conta) {
        this.eventManager.broadcast({ name: 'contaListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }
    getDate() {
        if (this.conta && this.conta.parcelas < 1) {
            this.conta.parcelas = 1;
        }
        if (this.conta.data) {
            const data = this.conta.data;
            const dt = new Date(data.year, data.month - 1, data.day);
            dt.setMonth(dt.getMonth() + this.conta.parcelas - 1);
            return dt;
        }
    }
}

@Component({
    selector: 'jhi-conta-popup',
    template: ''
})
export class ContaPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private contaPopupService: ContaPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.contaPopupService
                    .open(ContaDialogComponent as Component, params['id']);
            } else {
                this.contaPopupService
                    .open(ContaDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
