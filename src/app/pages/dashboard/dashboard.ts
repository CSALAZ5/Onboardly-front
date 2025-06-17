import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  signal,
  ViewChild,
  Signal,
} from '@angular/core';
import {
  IColumnAttributes,
  IOptions,
} from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/types/components';
import { ColaboradorService } from '../../services/colaborador';
import { Colaborador } from '../../models';
import { EventoOnboardingService } from '../../services/evento-onboarding';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard {
  @ViewChild('buscadorTabla', { static: true }) buscadorTabla!: ElementRef;
  @ViewChild('modalEditarColaborador', { static: true }) modalEditarColaborador!: ElementRef;
  @ViewChild('inputNombreCompleto', { static: true }) inputNombreCompleto!: ElementRef;
  @ViewChild('inputCorreo', { static: true }) inputCorreo!: ElementRef;
  @ViewChild('fechaIngreso', { static: true }) fechaIngreso!: ElementRef;
  @ViewChild('modalConfirmacion', { static: true }) modalConfirmacion!: ElementRef;

  // Acciones del menú contextual
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
    { colName: 'Onboarding asignado', control: 'text' },
    { colName: 'Acciones', control: 'menu' },
  ];

  // signals para filtrado reactivo
  private textoBusquedaSignal = signal('');
  private estadoBusquedaSignal = signal('');
  dropdownEventos: Signal<IOptions[]>;

  editarColaboradorForm: FormGroup = new FormGroup({
    nombreCompleto: new FormControl('', [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    fechaIngreso: new FormControl('', [Validators.required]),
  });

  get f() {
    return this.editarColaboradorForm.controls;
  }

  setInputValue(formName: string, key: string, event: any): void {
    console.log(event);
    if (formName === 'editarColaboradorForm') {
      this.editarColaboradorForm.patchValue({ [key]: event.detail.value });
    }
  }

  // Colaboradores cargados desde el servicio (también es signal)
  colaboradores: Signal<Colaborador[]>;

  // Filtrado automático y reactivo
  colaboradoresFiltrados = computed(() => {
    const filtroTexto = this.textoBusquedaSignal();
    const filtroEstado = this.estadoBusquedaSignal();

    return this.colaboradores()
      .map((col: Colaborador) => {
        return {
          id: col.id.toString(),
          Simple0: col.nombreCompleto,
          Email: col.correo,
          Fecha: col.fechaIngreso,
          Estado2: {
            type: col.onboardingBienvenida ? 'success' : 'warning',
            text: col.onboardingBienvenida ? 'terminado' : 'pendiente',
          },
          Estado3: {
            type: col.eventoTecnico ? col.onboardingTecnico ? 'success' : 'warning' : 'info',
            text: col.eventoTecnico ? col.onboardingTecnico ? 'terminado' : 'pendiente' : 'sin onboarding',
          },
          Simple1: col.eventoTecnico?.nombre || 'No asignado',
          menu4: [
            {
              icon: 'ico-transfer',
              label: 'Editar Colaborador',
              value: `edit_${col.id}`,
            },
            ...(!col.onboardingBienvenida
              ? [
                  {
                    icon: 'ico-check-ok',
                    label: 'Check Bienvenida',
                    value: `bienvenida_${col.id}`,
                  },
                ]
              : []),
            ...(col.eventoTecnico && !col.onboardingTecnico
              ? [
                  {
                    icon: 'ico-check-ok',
                    label: 'Check Técnico',
                    value: `tecnico_${col.id}`,
                  },
                ]
              : []),
          ],
        };
      })
      .filter((row) => {
        const cumpleTexto =
          row.Simple0.toLowerCase().includes(filtroTexto) ||
          row.Email.toLowerCase().includes(filtroTexto);

        const cumpleEstado = filtroEstado
          ? row.Estado2.text.toLowerCase().includes(filtroEstado) ||
            row.Estado3.text.toLowerCase().includes(filtroEstado)
          : true;

        return cumpleTexto && cumpleEstado;
      });
  });

  colaboradorSeleccionado = signal<Colaborador | null>(null);

  constructor(
    private colaboradorService: ColaboradorService,
    private eventoOnboardingService: EventoOnboardingService
  ) {
    this.colaboradorService.cargarColaboradores(); // Carga inicial al constructor
    this.eventoOnboardingService.getEventoOptionsSignal();
    this.dropdownEventos = this.eventoOnboardingService.eventosOptions;
    this.colaboradores = this.colaboradorService.colaboradores;
  }

  // Captura del input de búsqueda
  search() {
    const valor = this.buscadorTabla?.nativeElement?.value || '';
    this.textoBusquedaSignal.set(valor.trim().toLowerCase());
  }

  searchState(event?: CustomEvent) {
    console.log('Evento de búsqueda de estado:', event);
    const detail = event?.detail || {};
    const valor = detail.value || '';
    const text = detail.text || '';

    if (!valor || valor === 0 || text === 'Todos') {
      this.estadoBusquedaSignal.set(''); // Reinicia el filtro
    } else {
      this.estadoBusquedaSignal.set(String(text).trim().toLowerCase());
    }
  }

  async onItemClicked(event: any) {
    console.log('Elemento clicado:', event.detail.value);
    const valor = event.detail?.value;
    if (!valor || !valor.includes('_')) return;

    const [accion, idStr] = valor.split('_');
    const id = Number(idStr);

    if (isNaN(id)) {
      console.error('ID inválido:', idStr);
      return;
    }

    if (accion === 'bienvenida' || accion === 'tecnico') {
      try {
        await this.colaboradorService.marcarComoCompletado(id, accion);
        this.colaboradorService.cargarColaboradores();
      } catch (err) {
        console.error(`Error al marcar ${accion}:`, err);
      }
    } else if (accion === 'edit') {
      console.log('Editando colaborador con ID:', id);
      try {
        const colaborador = await this.colaboradorService.obtenerPorId(id);
        if (colaborador) {
          console.log('Colaborador encontrado:', colaborador);
          this.colaboradorSeleccionado.set(colaborador);
          const [year, month, day] = colaborador.fechaIngreso.split('-');
          this.fechaIngreso.nativeElement.setDatevalue(day, month, year);
          this.modalEditarColaborador.nativeElement.openDrawer();
        } else {
          console.warn('Colaborador no encontrado');
        }
      } catch (err) {
        console.error('Error al cargar colaborador:', err);
      }
    } else {
      console.warn('Acción desconocida:', accion);
    }
  }

  actualizarCampo<K extends keyof Colaborador>(
    campo: K,
    valor: Colaborador[K]
  ) {
    console.log(`Actualizando campo ${campo} con valor:`, valor);
    const colaborador = this.colaboradorSeleccionado();
    if (!colaborador) return;

    this.editarColaboradorForm.patchValue({ [campo]: valor });
    colaborador[campo] = valor;
    this.colaboradorSeleccionado.set({ ...colaborador });
  }

  async guardarColaborador() {
    console.log('Guardando colaborador...');
    const colaborador = this.colaboradorSeleccionado();
    if (!colaborador) return;

    const fechaStr: string =
      await this.fechaIngreso.nativeElement.getDateValue();
    const [year, month, day] = fechaStr.split('/');
    const fechaIngreso = `${year}-${month.padStart(2, '0')}-${day.padStart(
      2,
      '0'
    )}`;

    console.log('colaborador a guardar:', colaborador);
    colaborador.fechaIngreso = fechaIngreso;
    console.log('colaborador con fecha formateada:', colaborador);

    try {
      await this.colaboradorService.actualizar(colaborador.id, {
        ...colaborador,
        fechaIngreso,
      });
      this.modalEditarColaborador.nativeElement.closeDrawer();
      this.colaboradorService.cargarColaboradores();
    } catch (error) {
      console.error('Error al guardar la edición:', error);
    }
  }

  cancelarEdicion() {
    this.modalEditarColaborador.nativeElement.closeDrawer();
    this.colaboradorSeleccionado.set(null);
  }

  async eliminarColaborador() {
    const colaborador = this.colaboradorSeleccionado();
    if (!colaborador) return;

    try {
      await this.colaboradorService.eliminar(colaborador.id);
      this.modalEditarColaborador.nativeElement.closeDrawer();
      this.colaboradorSeleccionado.set(null);
      this.colaboradorService.cargarColaboradores();
      this.cerrarModalEliminacion();
    } catch (error) {
      console.error('Error al eliminar colaborador:', error);
    }
  }

  abrirModalEliminacion() {
    this.modalConfirmacion.nativeElement.openModal();
  }

  cerrarModalEliminacion() {
    this.modalConfirmacion.nativeElement.closeModal();
  }
}
