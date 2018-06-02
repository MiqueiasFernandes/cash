/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { CashTestModule } from '../../../test.module';
import { ContaDetailComponent } from '../../../../../../main/webapp/app/entities/conta/conta-detail.component';
import { ContaService } from '../../../../../../main/webapp/app/entities/conta/conta.service';
import { Conta } from '../../../../../../main/webapp/app/entities/conta/conta.model';

describe('Component Tests', () => {

    describe('Conta Management Detail Component', () => {
        let comp: ContaDetailComponent;
        let fixture: ComponentFixture<ContaDetailComponent>;
        let service: ContaService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CashTestModule],
                declarations: [ContaDetailComponent],
                providers: [
                    ContaService
                ]
            })
            .overrideTemplate(ContaDetailComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ContaDetailComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ContaService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN

                spyOn(service, 'find').and.returnValue(Observable.of(new HttpResponse({
                    body: new Conta(123)
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.find).toHaveBeenCalledWith(123);
                expect(comp.conta).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
