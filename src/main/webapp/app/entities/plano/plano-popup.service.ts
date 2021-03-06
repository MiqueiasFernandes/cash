import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { Plano } from './plano.model';
import { PlanoService } from './plano.service';

@Injectable()
export class PlanoPopupService {
    private ngbModalRef: NgbModalRef;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private planoService: PlanoService

    ) {
        this.ngbModalRef = null;
    }

    open(component: Component, id?: number | any): Promise<NgbModalRef> {
        return new Promise<NgbModalRef>((resolve, reject) => {
            const isOpen = this.ngbModalRef !== null;
            if (isOpen) {
                resolve(this.ngbModalRef);
            }

            if (id) {
                this.planoService.find(id)
                    .subscribe((planoResponse: HttpResponse<Plano>) => {
                        const plano: Plano = planoResponse.body;
                        if (plano.data) {
                            plano.data = {
                                year: plano.data.getFullYear(),
                                month: plano.data.getMonth() + 1,
                                day: plano.data.getDate()
                            };
                        }
                        this.ngbModalRef = this.planoModalRef(component, plano);
                        resolve(this.ngbModalRef);
                    });
            } else {
                // setTimeout used as a workaround for getting ExpressionChangedAfterItHasBeenCheckedError
                setTimeout(() => {
                    this.ngbModalRef = this.planoModalRef(component, new Plano());
                    resolve(this.ngbModalRef);
                }, 0);
            }
        });
    }

    planoModalRef(component: Component, plano: Plano): NgbModalRef {
        const modalRef = this.modalService.open(component, { size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.plano = plano;
        modalRef.result.then((result) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        }, (reason) => {
            this.router.navigate([{ outlets: { popup: null }}], { replaceUrl: true, queryParamsHandling: 'merge' });
            this.ngbModalRef = null;
        });
        return modalRef;
    }
}
