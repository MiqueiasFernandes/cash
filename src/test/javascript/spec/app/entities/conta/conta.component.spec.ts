/* tslint:disable max-line-length */
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { CashTestModule } from '../../../test.module';
import { ContaComponent } from '../../../../../../main/webapp/app/entities/conta/conta.component';
import { ContaService } from '../../../../../../main/webapp/app/entities/conta/conta.service';
import { Conta } from '../../../../../../main/webapp/app/entities/conta/conta.model';

describe('Component Tests', () => {

    describe('Conta Management Component', () => {
        let comp: ContaComponent;
        let fixture: ComponentFixture<ContaComponent>;
        let service: ContaService;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                imports: [CashTestModule],
                declarations: [ContaComponent],
                providers: [
                    ContaService
                ]
            })
            .overrideTemplate(ContaComponent, '')
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ContaComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(ContaService);
        });

        describe('OnInit', () => {
            it('Should call load all on init', () => {
                // GIVEN
                const headers = new HttpHeaders().append('link', 'link;link');
                spyOn(service, 'query').and.returnValue(Observable.of(new HttpResponse({
                    body: [new Conta(123)],
                    headers
                })));

                // WHEN
                comp.ngOnInit();

                // THEN
                expect(service.query).toHaveBeenCalled();
                expect(comp.contas[0]).toEqual(jasmine.objectContaining({id: 123}));
            });
        });
    });

});
