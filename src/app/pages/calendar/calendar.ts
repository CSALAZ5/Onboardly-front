import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  inject,
  signal,
  ViewChild,
  effect,
} from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { EventoOnboardingService } from '../../services/evento-onboarding';
import { EventoOnboarding } from '../../models';
import { FormsModule } from '@angular/forms';
import { addSeconds, endOfDay, parse, parseISO, startOfDay } from 'date-fns';

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, FullCalendarModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar {
  @ViewChild('modalDrawer', { static: true }) modalDrawer!: ElementRef;
  @ViewChild('inputFechaInicio', { static: true })
  inputFechaInicio!: ElementRef;
  @ViewChild('inputFechaFin', { static: true }) inputFechaFin!: ElementRef;

  private eventoService = inject(EventoOnboardingService);

  // Signals reactivos
  readonly eventos = this.eventoService.eventos;
  readonly loading = this.eventoService.loading;

  // Evento seleccionado real
  eventoSeleccionado = signal<EventoOnboarding | null>(null);

  readonly calendarOptions = computed<CalendarOptions>(() => ({
    initialView: 'dayGridMonth',
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    weekends: false,
    selectable: true,
    editable: true,
    events: this.eventos().map((e) => ({
      id: e.id.toString(),
      title: e.nombre,
      start: e.fechaInicio,
      end: e.fechaFin,
    })),
    select: this.onFechaSeleccionada.bind(this),
    eventClick: this.onEventoClick.bind(this),
    locale: esLocale,
    timeZone: 'UTC-5',
  }));

  get formEvento(): EventoOnboarding {
    return (
      this.eventoSeleccionado() ?? {
        id: 0,
        nombre: '',
        fechaInicio: new Date(),
        fechaFin: new Date(),
      }
    );
  }

  get isEditando(): boolean {
    return this.formEvento.id !== 0;
  }

  get fechaInicioAsDateArray(): Date[] {
    return this.formEvento.fechaInicio
      ? [new Date(this.formEvento.fechaInicio)]
      : [];
  }

  async onFechaSeleccionada(selectInfo: DateSelectArg) {
    console.log('----selectInfo:', selectInfo);
    const fechaInicio = parse(selectInfo.startStr,'yyyy-mm-dd', new Date());
    const fechaFin = endOfDay(selectInfo.end);
    console.log('------- selectInfo ----- fechaInicio:', fechaInicio);
    console.log('------- selectInfo ----- fechaFin:', fechaFin);


    this.eventoSeleccionado.set({
      id: 0,
      nombre: '',
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
    });
    console.log(
      'onFechaSeleccionada eventoseleccionado:',
      this.eventoSeleccionado()
    );
    this.inputFechaInicio.nativeElement.setDate([fechaInicio]);
    this.inputFechaFin.nativeElement.setDate([fechaFin]);
    this.modalDrawer.nativeElement.openDrawer();
  }

  onEventoClick(clickInfo: EventClickArg) {
    const id = Number(clickInfo.event.id);
    const evento = this.eventos().find((e) => e.id === id);
    console.log('Consultando evento', evento);
    if (evento) {
      console.log('Consultando evento222222', evento);
      const fechaInicio = startOfDay(parseISO(evento.fechaInicio.toString()));
      console.log('*****fecha inicio', fechaInicio);
      const fechaFin = endOfDay(parseISO(evento.fechaFin.toString()));
      console.log('*****fecha fin', fechaFin);
      this.eventoSeleccionado.set({ ...evento });
      this.inputFechaInicio.nativeElement.setDate([fechaInicio]);
      this.inputFechaFin.nativeElement.setDate([fechaFin]);
      this.modalDrawer.nativeElement.openDrawer();
    }
  }

  cerrarModal() {
    this.modalDrawer.nativeElement.closeDrawer();
    this.eventoSeleccionado.set(null);
  }

  async guardarEvento() {
    const evento = this.formEvento;
    if (!evento.nombre || !evento.fechaInicio || !evento.fechaFin) return;

    if (this.isEditando) {
      await this.eventoService.actualizarEvento(evento.id, evento);
    } else {
      await this.eventoService.crearEvento(evento);
    }
    this.cerrarModal();
  }

  async eliminarEvento() {
    const evento = this.formEvento;
    if (evento.id) {
      await this.eventoService.eliminarEvento(evento.id);
    }
    this.cerrarModal();
  }

  cambioFechaInicio(fechas: Date[]) {
    if (this.eventoSeleccionado()) {
      this.eventoSeleccionado.update((e) => ({
        ...e!,
        fechaInicio: fechas[0] ?? e!.fechaInicio,
      }));
    }
  }

  cambioFechaFin(fechas: Date[]) {
    if (this.eventoSeleccionado()) {
      this.eventoSeleccionado.update((e) => ({
        ...e!,
        fechaFin: fechas[0] ?? e!.fechaFin,
      }));
    }
  }

  actualizarNombre(nombre: string) {
    if (this.eventoSeleccionado()) {
      this.eventoSeleccionado.update((e) => ({ ...e!, nombre }));
    }
  }

  enviarRecordatorio(){
    this.eventoService.enviarRecordatorio();
  }
}
