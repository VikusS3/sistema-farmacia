import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/usuarios/login", { email, password });
    return response.data;
  },
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
  getCurrentUser: () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },
};

export const productosService = {
  getAll: () => api.get("/productos"),
  getById: (id) => api.get(`/productos/${id}`),
  getLowStock: () => api.get("/productos/bajo-stock"),
  getExpiringSoon: (dias) => api.get(`/productos/por-vencer?dias=${dias}`),
  create: (data) => api.post("/productos", data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
  getLotes: (id) => api.get(`/productos/${id}/lotes`),
  createLote: (data) => api.post("/productos/lotes", data),
  getAllLotes: () => api.get("/productos/lotes"),
  checkStock: (data) => api.post("/productos/verificar-stock", data),
};

export const ventasService = {
  getAll: () => api.get("/ventas"),
  getById: (id) => api.get(`/ventas/${id}`),
  create: (data) => api.post("/ventas", data),
  getByDateRange: (fecha_inicio, fecha_fin) =>
    api.get(
      `/ventas/by-date?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`,
    ),
  getEstadisticas: (fecha_inicio, fecha_fin) =>
    api.get(
      `/ventas/estadisticas?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`,
    ),
  cancel: (id, data) => api.post(`/ventas/${id}/cancel`, data),
  getVentaConProductos: (id) => api.get(`/ventas/venta/${id}/productos`),
  getVentasPorCliente: (clienteId) => api.get(`/ventas/cliente/${clienteId}`),
  generarTicket: (id) =>
    api.get(`/ventas/${id}/generar-ticket`, { responseType: "blob" }),
};

export const cajaService = {
  abrir: (data) => api.post("/cajas/abrir", data),
  cerrar: (data) => api.post("/cajas/cerrar", data),
  getAbierta: (usuario_id) => api.get(`/cajas/abierta/${usuario_id}`),
  getAll: () => api.get("/cajas"),
  getById: (id) => api.get(`/cajas/${id}`),
  getResumenDiario: (fecha) => api.get(`/cajas/resumen-diario?fecha=${fecha}`),
  getCerradas: (limit) => api.get(`/cajas/cerradas?limit=${limit}`),
};

export const clientesService = {
  getAll: () => api.get("/clientes"),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post("/clientes", data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  delete: (id) => api.delete(`/clientes/${id}`),
};

export const proveedoresService = {
  getAll: () => api.get("/proveedores"),
  getById: (id) => api.get(`/proveedores/${id}`),
  create: (data) => api.post("/proveedores", data),
  update: (id, data) => api.put(`/proveedores/${id}`, data),
  delete: (id) => api.delete(`/proveedores/${id}`),
};

export const categoriasService = {
  getAll: () => api.get("/categorias"),
  getById: (id) => api.get(`/categorias/${id}`),
  create: (data) => api.post("/categorias", data),
  update: (id, data) => api.put(`/categorias/${id}`, data),
  delete: (id) => api.delete(`/categorias/${id}`),
};

export const comprasService = {
  getAll: () => api.get("/compras"),
  getById: (id) => api.get(`/compras/${id}`),
  create: (data) => api.post("/compras", data),
};

export const alertasService = {
  getAll: (leida) =>
    api.get(`/alertas${leida !== undefined ? `?leida=${leida}` : ""}`),
  getContador: () => api.get("/alertas/contador"),
  marcarLeida: (id) => api.put(`/alertas/${id}/leida`),
  marcarTodasLeidas: () => api.put("/alertas/leer-todas"),
  delete: (id) => api.delete(`/alertas/${id}`),
};

export const reportesService = {
  getMetricasDashboard: () => api.get("/reportes/metricas-dashboard"),
  getTopProductos: (limit) => api.get(`/reportes/top-productos?limit=${limit}`),
  getVentasMensuales: () => api.get("/reportes/ventas-mensuales"),
};

export const usuariosService = {
  getAll: () => api.get("/usuarios"),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post("/usuarios", data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

export default api;
