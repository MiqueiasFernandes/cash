/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { CashTestModule } from '../../../test.module';
import { PlanoDetailComponent } from '../../../../../../main/webapp/app/entities/plano/plano-detail.component';
import { PlanoService } from '../../../../../../main/webapp/app/entities/plano/plano.service';
import { Plano } from '../../../../../../main/webapp/app/entities/plano/plano.model';

describe('Component Tests', () => {

    describe('Plano Management Detail Component', () => {
        let comp: PlanoDetailComponent;
        let fixture: ComponentFixture<PlanoDetailComponent>;
        let service: PlanoService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CashTestModule],
                declarations: [PlanoDetailComponent],
                providers: [
                    PlanoService
                ]
            })
            .overrideTemplate(PlanoDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(PlanoDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(PlanoService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Plano(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.plano).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
