import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaClientes } from './tabla-clientes';

describe('TablaClientes', () => {
  let component: TablaClientes;
  let fixture: ComponentFixture<TablaClientes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaClientes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaClientes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
