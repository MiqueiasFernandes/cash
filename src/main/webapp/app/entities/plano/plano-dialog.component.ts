import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Plano } from './plano.model';
import { PlanoPopupService } from './plano-popup.service';
import { PlanoService } from './plano.service';
import { Conta, ContaService } from '../conta';

@Component({
    selector: 'jhi-plano-dialog',
    templateUrl: './plano-dialog.component.html'
})
export class PlanoDialogComponent implements OnInit {

    plano: Plano;
    isSaving: boolean;

    orcamentos: Conta[];
    dataDp: any;

    constructor(
        public activeModal: NgbActiveModal,
        private jhiAlertService: JhiAlertService,
        private planoService: PlanoService,
        private contaService: ContaService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        this.isSaving = false;
        this.contaService
            .query({filter: 'plano-is-null'})
            .subscribe((res: HttpResponse<Conta[]>) => {
                if (!this.plano.orcamento || !this.plano.orcamento.id) {
                    this.orcamentos = res.body;
                } else {
                    this.contaService
                        .find(this.plano.orcamento.id)
                        .subscribe((subRes: HttpResponse<Conta>) => {
                            this.orcamentos = [subRes.body].concat(res.body);
                        }, (subRes: HttpErrorResponse) => this.onError(subRes.message));
                }
            }, (res: HttpErrorResponse) => this.onError(res.message));
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.isSaving = true;
        if (this.plano.id !== undefined) {
            this.subscribeToSaveResponse(
                this.planoService.update(this.plano));
        } else {
            this.subscribeToSaveResponse(
                this.planoService.create(this.plano));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<Plano>>) {
        result.subscribe((res: HttpResponse<Plano>) =>
            this.onSaveSuccess(res.body), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess(result: Plano) {
        this.eventManager.broadcast({ name: 'planoListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(error: any) {
        this.jhiAlertService.error(error.message, null, null);
    }

    trackContaById(index: number, item: Conta) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-plano-popup',
    template: ''
})
export class PlanoPopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private planoPopupService: PlanoPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['id'] ) {
                this.planoPopupService
                    .open(PlanoDialogComponent as Component, params['id']);
            } else {
                this.planoPopupService
                    .open(PlanoDialogComponent as Component);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
