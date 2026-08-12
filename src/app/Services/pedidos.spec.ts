import { TestBed } from '@angular/core/testing';

import { PedidosService } from './pedidosService';

describe('Pedidos', () => {
  let service: PedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
