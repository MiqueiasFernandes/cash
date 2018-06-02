import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';

import { Plano } from './plano.model';
import { PlanoService } from './plano.service';

@Component({
    selector: 'jhi-plano-detail',
    templateUrl: './plano-detail.component.html'
})
export class PlanoDetailComponent implements OnInit, OnDestroy {

    plano: Plano;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private planoService: PlanoService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInPlanos();
    }

    load(id) {
        this.planoService.find(id)
            .subscribe((planoResponse: HttpResponse<Plano>) => {
                this.plano = planoResponse.body;
            });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInPlanos() {
        this.eventSubscriber = this.eventManager.subscribe(
            'planoListModification',
            (response) => this.load(this.plano.id)
        );
    }
}
