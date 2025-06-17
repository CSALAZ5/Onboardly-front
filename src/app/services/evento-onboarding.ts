import { Injectable, computed, signal } from '@angular/core';
import { EventoOnboarding } from '../models';
import { IOptions } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/types/components';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EventoOnboardingService {
  private eventosSignal = signal<EventoOnboarding[]>([]);
  private loadingSignal = signal<boolean>(false);

  public readonly eventos = computed(() => this.eventosSignal());
  public readonly loading = computed(() => this.loadingSignal());
  private eventoOptionsSignal = signal<IOptions[]>([]);
  readonly eventosOptions = this.eventoOptionsSignal.asReadonly();

  constructor() {
    this.cargarEventos();
  }

  async cargarEventos(): Promise<void> {
    this.loadingSignal.set(true);
    try {
      const res = await fetch(`${environment.api.calendario}`);
      console.log('Cargando eventos desde:', `${environment.api.calendario}`);
      console.log('Respuesta del servidor:', res.status, res.statusText);
      const data: EventoOnboarding[] = await res.json();
      console.log('Datos recibidos:', data);
      const options = data.map((evento) => ({
        text: `${evento.nombre}`,
        value: evento.id.toString(),
      }));
      console.log('Opciones generadas:', options);
      this.eventosSignal.set(data);
      this.eventoOptionsSignal.set(options);
      console.log('Eventos cargados:', data);
    } catch (err) {
      console.error('Error al cargar eventos', err);
      this.eventosSignal.set([]);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  getEventoOptionsSignal() {
    console.log('--------------', this.eventoOptionsSignal);
    return this.eventoOptionsSignal.asReadonly(); // opcionalmente lo haces readonly
  }

  async crearEvento(evento: Partial<EventoOnboarding>): Promise<void> {
    try {
      console.log('Creando evento:', evento);
      console.log('Evento stringify:', JSON.stringify(evento));

      const res = await fetch(`${environment.api.calendario}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento),
      });

      if (!res.ok) throw new Error('Error al crear evento');

      const nuevo = await res.json();
      this.eventosSignal.update((evts) => [...evts, nuevo]);
    } catch (err) {
      console.error(err);
    }
  }

  async actualizarEvento(
    id: number,
    evento: Partial<EventoOnboarding>
  ): Promise<void> {
    try {
      const res = await fetch(`${environment.api.calendario}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evento),
      });

      if (!res.ok) throw new Error('Error al actualizar evento');

      const actualizado = await res.json();
      this.eventosSignal.update((evts) =>
        evts.map((ev) => (ev.id === actualizado.id ? actualizado : ev))
      );
    } catch (err) {
      console.error(err);
    }
  }

  async eliminarEvento(id: number): Promise<void> {
    try {
      const res = await fetch(`${environment.api.calendario}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar evento');

      this.eventosSignal.update((evts) => evts.filter((ev) => ev.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  async enviarRecordatorio() {
    try {
      const res = await fetch(`${environment.api.mail}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'christiansalazar1129@gmail.com',
          subject: 'Journey to Cloud está por empezar',
          content:
            'Este es un recordatorio para el inicio del Onboarding: Journey to Cloud',
        }),
      });

      if (!res.ok) throw new Error('Error al enviar recordatorio');

      const resultado = await res.json();
      console.log('Recordatorio enviado:', resultado);
    } catch (err) {
      console.error(err);
    }
  }
}
