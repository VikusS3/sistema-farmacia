export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
  search: string;
  sort: string;
  order: "ASC" | "DESC";
}

export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export function parsePagination(query: any): PaginationParams {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const search = (query.search || "").trim();
  const sort = query.sort || "id";
  const order =
    (query.order || "ASC").toUpperCase() === "DESC" ? "DESC" : "ASC";
  const offset = (page - 1) * limit;
  return { page, limit, offset, search, sort, order };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number
): PaginationMeta {
  const totalPages = Math.ceil(total / limit) || 1;
  return {
    total,
    totalPages,
    currentPage: page,
    pageSize: limit,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

// ponytail: basic column whitelist for ORDER BY — extend per model as needed
const SAFE_COLUMNS = new Set([
  "id",
  "nombre",
  "email",
  "rol",
  "estado",
  "creado_en",
  "actualizado_en",
  "fecha",
  "total",
  "stock",
  "stock_minimo",
  "precio_unidad",
  "fecha_apertura",
  "fecha_cierre",
  "fecha_vencimiento",
  "cantidad_disponible",
  "created_at",
  "movimiento",
  "fecha_movimiento",
]);

export function safeSortColumn(column: string): string {
  // ponytail: injection guard — only known column names pass through
  return SAFE_COLUMNS.has(column) ? column : "id";
}
