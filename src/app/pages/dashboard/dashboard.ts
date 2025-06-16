import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import { IColumnAttributes } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/types/components';

@Component({
  selector: 'app-dashboard',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  @ViewChild("buscadorTabla") buscadorTabla!: ElementRef;

  acciones = [
    { icon: 'ico-transfer', label: 'Editar Colaborador', value: 'edit' },
    { icon: 'ico-check-ok', label: 'Check Bienvenida', value: 'checkWelcome' },
    { icon: 'ico-check-ok', label: 'Check Técnico', value: 'checkTechnical' },
  ];

  columnas: IColumnAttributes[] = [
    { colName: '', control: 'id' },
    { colName: 'Nombre Completo', control: 'text' },
    { colName: 'Email', control: 'text' },
    { colName: 'Fecha Ingreso', control: 'date' },
    { colName: 'Onboarding Bienvenida', control: 'tag' },
    { colName: 'Onboarding técnico', control: 'tag' },
    { colName: 'Acciones', control: 'menu' },
  ];

  datos = [
    {
      id: '0',
      Simple0: 'Maria Eugenia',
      Email: 'maria.eugenia@bdb.com',
      Fecha: '21/01/2025',
      Estado2: {
        type: 'success',
        text: 'terminado',
      },
      Estado3: {
        type: 'success',
        text: 'terminado',
      },
      menu4: this.acciones,
    },
    {
      id: '1',
      Simple0: 'Norberto Gonzalez',
      Email: 'norberto.gonzalez@bdb.com',
      Fecha: '16/01/2023',
      Estado2: {
        type: 'success',
        text: 'terminado',
      },
      Estado3: {
        type: 'success',
        text: 'terminado',
      },
      menu4: this.acciones,
    },
    {
      id: '2',
      Simple0: 'Paquita Fernandez',
      Email: 'paquita.fernandez@bdb.com',
      Fecha: '26/01/2023',
      Estado2: {
        type: 'success',
        text: 'terminado',
      },
      Estado3: {
        type: 'success',
        text: 'terminado',
      },
      menu4: this.acciones,
    },
  ];

  datosFiltrados: any[] = this.datos;

  search(): void {
    console.log(this.buscadorTabla.nativeElement.value);
    const valor: string = this.buscadorTabla.nativeElement.value
      .toString()
      .toLowerCase();
    const escenariosFiltrados = this.datos.filter((objeto) => {
      const nombre = objeto.Simple0?.toString().toLowerCase() || '';
      const correo = objeto.Email?.toString().toLowerCase() || '';
      return nombre.includes(valor) || correo.includes(valor);});

    //this.sinResultados = escenariosFiltrados.length === 0;
    this.datosFiltrados = escenariosFiltrados;
  }

  
}
