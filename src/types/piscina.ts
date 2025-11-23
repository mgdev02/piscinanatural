export interface Piscina {
  id: string;
  nombre: string;
  temperatura: number;
  ph: number;
  cloro: number;
  orp: number; // mV
  targetPh?: number;
  targetOrp?: number;
  tieneFlujo: boolean;
  volumen: number; // Volumen en litros
  online: boolean; // Estado de conexión
  nivelAcidoBajo: boolean; // true = Nivel Bajo, false = Nivel OK
  nivelCloroBajo: boolean; // true = Nivel Bajo, false = Nivel OK
}
