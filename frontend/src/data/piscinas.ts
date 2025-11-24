import type { Piscina } from '../types/piscina';

const generarPiscina = (
  id: string,
  nombre: string,
  temperatura: number,
  ph: number,
  cloro: number,
  orp: number,
  tieneFlujo: boolean,
  volumen: number,
  online: boolean,
  nivelAcidoBajo: boolean = false,
  nivelCloroBajo: boolean = false
): Piscina => ({
  id,
  nombre,
  temperatura,
  ph,
  cloro,
  orp,
  targetPh: 7.4,
  targetOrp: 750,
  tieneFlujo,
  volumen,
  online,
  nivelAcidoBajo,
  nivelCloroBajo
});

export const piscinas: Piscina[] = [
  generarPiscina('1', 'Piscina Principal', 28, 7.2, 1.5, 720, true, 120000, true, false, false),
  generarPiscina('2', 'Piscina Infantil', 30, 7.4, 1.2, 740, true, 30000, true, true, false), // Ácido bajo
  generarPiscina('3', 'Piscina Olímpica', 26, 7.1, 1.8, 780, false, 150000, false, false, true), // Cloro bajo
  generarPiscina('4', 'Piscina Spa', 35, 7.3, 1.0, 680, true, 25000, true, true, true), // Ambos bajos
  generarPiscina('5', 'Piscina Terapéutica', 32, 7.5, 1.3, 760, true, 45000, true, false, false)
];


