import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Conta } from './conta.model';
import { ContaService } from './conta.service';

@Component({
    selector: 'jhi-conta-detail',
    templateUrl: './conta-detail.component.html'
})
export class ContaDetailComponent implements OnInit, OnDestroy {

    conta: Conta;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private contaService: ContaService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInContas();
    }

    load(id) {
        this.contaService.find(id)
            .subscribe((contaResponse: HttpResponse<Conta>) => {
                this.conta = contaResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInContas() {
        this.eventSubscriber = this.eventManager.subscribe(
            'contaListModification',
            (response) => this.load(this.conta.id)
        );
    }
}
