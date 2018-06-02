/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CashTestModule } from '../../../test.module';
import { PlanoComponent } from '../../../../../../main/webapp/app/entities/plano/plano.component';
import { PlanoService } from '../../../../../../main/webapp/app/entities/plano/plano.service';
import { Plano } from '../../../../../../main/webapp/app/entities/plano/plano.model';

describe('Component Tests', () => {

    describe('Plano Management Component', () => {
        let comp: PlanoComponent;
        let fixture: ComponentFixture<PlanoComponent>;
        let service: PlanoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CashTestModule],
                declarations: [PlanoComponent],
                providers: [
                    PlanoService
                ]
            })
            .overrideTemplate(PlanoComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PlanoComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PlanoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Plano(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.planos[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
