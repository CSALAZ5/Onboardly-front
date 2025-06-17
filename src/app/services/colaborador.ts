import { Injectable, signal, computed, effect } from '@angular/core';
import { Colaborador } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ColaboradorService {
  private apiUrl = 'http://localhost:8090/api/colaboradores';

  private colaboradoresSignal = signal<Colaborador[]>([]);
  readonly colaboradores = this.colaboradoresSignal.asReadonly();

  private loadingSignal = signal(false);
  readonly loading = this.loadingSignal.asReadonly();

  private errorSignal = signal<string | null>(null);
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.cargarColaboradores();
  }

  async cargarColaboradores() {
    console.log('Cargando colaboradores desde el servicio...');
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      console.log(`Realizando petición a: ${environment.api.calendario}`);
      const res = await fetch(`${environment.api.colaboradores}`);
      console.log('Respuesta recibida:', res.status, res.statusText);
      if (!res.ok) throw new Error('Error al cargar colaboradores');
      const data = await res.json();
      console.log('Colaboradores cargados:', data);
      this.colaboradoresSignal.set(data);
    } catch (err) {
      console.error('Error al cargar colaboradores:', err);
      this.errorSignal.set((err as Error).message);
    } finally {
      console.log('Finalizando carga de colaboradores');
      this.loadingSignal.set(false);
    }
  }

  async obtenerPorId(id: number): Promise<Colaborador | null> {
    try {
      const res = await fetch(`${environment.api.colaboradores}/${id}`);
      if (!res.ok) throw new Error('No encontrado');
      return await res.json();
    } catch {
      return null;
    }
  }

  async crear(colaborador: Colaborador) {
    console.log('Creando colaborador:', colaborador);

    const res = await fetch(`${environment.api.colaboradores}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(colaborador)
    });

    if (res.ok) {
      this.cargarColaboradores();
    } else {
      throw new Error('Error al crear colaborador');
    }
  }

  async actualizar(id: number, colaborador: Colaborador) {
    const res = await fetch(`${environment.api.colaboradores}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(colaborador)
    });

    if (res.ok) {
      this.cargarColaboradores();
    } else {
      throw new Error('Error al actualizar colaborador');
    }
  }

  async eliminar(id: number) {
    const res = await fetch(`${environment.api.colaboradores}/${id}`, { method: 'DELETE' });
    if (res.ok) {
      this.cargarColaboradores();
    } else {
      throw new Error('Error al eliminar colaborador');
    }
  }

  async marcarComoCompletado(id: number, tipo: 'bienvenida' | 'tecnico') {
    const res = await fetch(`${environment.api.colaboradores}/${id}/completar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo })
    });

    if (res.ok) {
      this.cargarColaboradores();
    } else {
      throw new Error('Error al marcar como completado');
    }
  }
}
