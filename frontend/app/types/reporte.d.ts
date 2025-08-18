export interface TopProductosMasVendidos {
  cambio: string;
  id: number;
  nombre: string;
  unidad_medida: string;
  unidades_vendidas: string;
}

type CambioTipo = "positive" | "negative" | "warning";

interface MetricItem<T = number> {
  value: T;
  change: number;
  changeType: CambioTipo;
}

export interface MetricasDashboard {
  ventasTotales: MetricItem<string | number>;
  valorInventarioTotal: MetricItem<number>;
  prescripciones: MetricItem<number>;
  inventarioActivo: MetricItem<number>;
  pacientes: MetricItem<number>;
  margenGanancia: MetricItem<number>;
  stockBajo: MetricItem<number>;
}
