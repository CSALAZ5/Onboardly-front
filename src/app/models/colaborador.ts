import { EventoOnboarding } from './evento-onboarding';

export interface Colaborador {
  id: number;
  nombreCompleto: string;
  correo: string;
  fechaIngreso: string;
  onboardingBienvenida: boolean;
  onboardingTecnico: boolean;
  eventoTecnico?: EventoOnboarding;
}
