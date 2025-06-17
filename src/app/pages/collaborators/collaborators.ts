import { CommonModule } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Signal,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Colaborador } from '../../models';
import { ColaboradorService } from '../../services/colaborador';
import { EventoOnboardingService } from '../../services/evento-onboarding';
import { IOptions } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/types/components';

@Component({
  selector: 'app-collaborators',
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './collaborators.html',
  styleUrl: './collaborators.scss',
})
export class Collaborators {
  @ViewChild('fechaIngreso', { static: true }) fechaIngreso!: ElementRef;
  @ViewChild('CheckBoxOnboardings', { static: true })
  checkBoxOnboardings!: ElementRef;
  @ViewChild('modalCreacionColaborador', { static: true })
  modalCreacionColaborador!: ElementRef;
  @ViewChild('dropDownEv', { static: true }) dropDownEv!: ElementRef;
  modalIcon = signal<'success' | 'error' | 'warning' | 'info'>('success');
  modalTitle = signal<string>('¡Muy bien!');
  modalSubtitle = signal<string>('El colaborador ha sido creado exitosamente.');
  dropdownEventos: Signal<IOptions[]> = signal<IOptions[]>([]);

  // Signal reactivo para el colaborador nuevo
  nuevoColaborador = signal<Colaborador>({
    id: 0,
    nombreCompleto: '',
    correo: '',
    fechaIngreso: '',
    onboardingBienvenida: false,
    onboardingTecnico: false,
    eventoTecnico: undefined,
  });

  constructor(
    private colaboradorService: ColaboradorService,
    private eventoOnboardingService: EventoOnboardingService
  ) {
    console.log('----------Inicializando Collaborators--------------');
    this.eventoOnboardingService.getEventoOptionsSignal();
    console.log('Cargando opciones de eventos...');
    this.dropdownEventos = this.eventoOnboardingService.eventosOptions;
    console.log('Opciones de eventos cargadas:', this.dropdownEventos());
  }

  isFormValid = computed(() => {
    console.log('Validando formulario...');
    console.log('Colaborador actual:', this.nuevoColaborador());

    const c = this.nuevoColaborador();
    return (
      c.nombreCompleto.trim().length > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.correo) &&
      /^\d{4}-\d{2}-\d{2}$/.test(c.fechaIngreso) // fecha en formato YYYY-MM-DD
    );
  });

  dataCheckButton(event: CustomEvent) {
    const checks = event.detail;
    this.nuevoColaborador.update((c) => ({
      ...c,
      onboardingBienvenida: checks[0].isChecked,
      onboardingTecnico: checks[1].isChecked,
    }));
  }

  actualizarCampo(campo: keyof Colaborador, valor: string) {
    console.log(`Actualizando campo: ${campo} con valor: ${valor}`);
    let nuevoValor = valor;
    if (campo === 'fechaIngreso') {
      nuevoValor = valor.replace(/\//g, '-');
    }
    this.nuevoColaborador.update((c) => ({ ...c, [campo]: nuevoValor }));
  }

  async crearColaborador() {
    const fechaStr: string =
      await this.fechaIngreso.nativeElement.getDateValue();
    const [year, month, day] = fechaStr.split('/');

    this.nuevoColaborador.update((c) => ({
      ...c,
      fechaIngreso: `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
    }));

    try {
      await this.colaboradorService.crear(this.nuevoColaborador());

      // Configurar modal de éxito
      this.modalIcon.set('success');
      this.modalTitle.set('¡Muy bien!');
      this.modalSubtitle.set('El colaborador ha sido creado exitosamente.');

      this.modalCreacionColaborador.nativeElement.openAlert();
      this.resetFormulario();
    } catch (error) {
      console.error('Error al crear colaborador:', error);

      // Configurar modal de error
      this.modalIcon.set('error');
      this.modalTitle.set('¡Ups! Algo salió mal');
      this.modalSubtitle.set(
        'No fue posible crear el colaborador. Intenta nuevamente.'
      );

      this.modalCreacionColaborador.nativeElement.openAlert();
    }
  }

  async resetFormulario() {
    this.nuevoColaborador.set({
      id: 0,
      nombreCompleto: '',
      correo: '',
      fechaIngreso: '',
      onboardingBienvenida: false,
      onboardingTecnico: false,
      eventoTecnico: undefined,
    });
    const checkboxes =
      this.checkBoxOnboardings.nativeElement.valuesToCheck || [];
    checkboxes.forEach((_: any, index: number) =>
      this.checkBoxOnboardings.nativeElement.selectCheck('0', index)
    );
    console.log('------------ reseteando ------------');
    try {
      await this.dropDownEv.nativeElement.reset();
    } catch (error) {
      console.error('Error al limpiar formulario:', error);
    }
    this.fechaIngreso.nativeElement.cleanComponent();
  }
}
