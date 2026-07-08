import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { AgricultoresService } from './agricultores.service';
import { CatalogosService } from './catalogos.service';
import { CultivosService } from './cultivos.service';
import { InsumosService } from './insumos.service';
import { TareasService } from './tareas.service';
import { UsuariosService } from './usuarios.service';

describe('domain HTTP services', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AgricultoresService,
        CatalogosService,
        CultivosService,
        InsumosService,
        TareasService,
        UsuariosService,
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('uses the agricultores API contract', () => {
    const service = TestBed.inject(AgricultoresService);

    service.getAgricultores().subscribe();
    expectRequest('GET', '/agricultores').flush([]);

    service.createAgricultor({ nombre: 'Ada', telefono: '099', correo: 'ada@example.com' } as never).subscribe();
    expectRequest('POST', '/agricultores').flush({});

    service.updateAgricultor('a1', { nombre: 'Ada Lovelace' } as never).subscribe();
    expectRequest('PUT', '/agricultores/a1').flush({});

    service.deleteAgricultor('a1').subscribe();
    expectRequest('DELETE', '/agricultores/a1').flush(null);
  });

  it('uses the cultivos API contract', () => {
    const service = TestBed.inject(CultivosService);

    service.getCultivos().subscribe();
    expectRequest('GET', '/cultivos').flush([]);

    service.createCultivo({ nombre: 'Maiz' } as never).subscribe();
    expectRequest('POST', '/cultivos').flush({});

    service.updateCultivo('c1', { nombre: 'Cacao' } as never).subscribe();
    expectRequest('PUT', '/cultivos/c1').flush({});

    service.updateCultivoEstado('c1', { estado: 'Activo' } as never).subscribe();
    expectRequest('PUT', '/cultivos/c1/estado').flush({});

    service.deleteCultivo('c1').subscribe();
    expectRequest('DELETE', '/cultivos/c1').flush(null);
  });

  it('uses the insumos API contract', () => {
    const service = TestBed.inject(InsumosService);

    service.getInsumos().subscribe();
    expectRequest('GET', '/insumos').flush([]);

    service.createInsumo({ nombre: 'Fertilizante' } as never).subscribe();
    expectRequest('POST', '/insumos').flush({});

    service.updateInsumo('i1', { nombre: 'Abono' } as never).subscribe();
    expectRequest('PUT', '/insumos/i1').flush({});

    service.deleteInsumo('i1').subscribe();
    expectRequest('DELETE', '/insumos/i1').flush(null);
  });

  it('uses the tareas API contract', () => {
    const service = TestBed.inject(TareasService);

    service.getTareas().subscribe();
    expectRequest('GET', '/tareas').flush([]);

    service.createTarea({ nombre: 'Riego' } as never).subscribe();
    expectRequest('POST', '/tareas').flush({});

    service.updateTarea('t1', { nombre: 'Poda' } as never).subscribe();
    expectRequest('PUT', '/tareas/t1').flush({});

    service.updateTareaEstado('t1', { estado: 'Completada' } as never).subscribe();
    expectRequest('PUT', '/tareas/t1/estado').flush(null);

    service.deleteTarea('t1').subscribe();
    expectRequest('DELETE', '/tareas/t1').flush(null);
  });

  it('uses the usuarios API contract', () => {
    const service = TestBed.inject(UsuariosService);

    service.getUsuarios(' ada ').subscribe();
    const listRequest = expectRequest('GET', '/usuarios?q=ada');
    expect(listRequest.request.params.get('q')).toBe('ada');
    listRequest.flush([]);

    service.getUsuarioById('u1').subscribe();
    expectRequest('GET', '/usuarios/u1').flush({});

    service.updateRol('u1', { rol: 'Administrador' }).subscribe();
    expectRequest('PATCH', '/usuarios/u1/rol').flush({});

    service.updateEstado('u1', { estado: 'Inactivo' }).subscribe();
    expectRequest('PATCH', '/usuarios/u1/estado').flush({});
  });

  it('uses the catalogos API contract', () => {
    const service = TestBed.inject(CatalogosService);

    service.obtenerPorTipo('categorias-cultivo').subscribe();
    expectRequest('GET', '/catalogos/categorias-cultivo').flush([]);

    service.crearCatalogo('tipos-insumo', { nombre: 'Semilla', estado: true }).subscribe();
    expectRequest('POST', '/catalogos/tipos-insumo').flush({});

    service.actualizarCatalogo('tipos-tarea', 'ct1', { nombre: 'Riego' }).subscribe();
    expectRequest('PUT', '/catalogos/tipos-tarea/ct1').flush({});

    service.eliminarCatalogo('ubicaciones', 'u1').subscribe();
    expectRequest('DELETE', '/catalogos/ubicaciones/u1').flush(null);
  });

  function expectRequest(method: string, path: string) {
    const request = httpMock.expectOne(`${environment.apiUrl}${path}`);
    expect(request.request.method).toBe(method);
    return request;
  }
});
