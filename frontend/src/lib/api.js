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
  getAll: (params = {}) => api.get("/productos", { params }),
  getById: (id) => api.get(`/productos/${id}`),
  getLowStock: (params = {}) => api.get("/productos/bajo-stock", { params }),
  getExpiringSoon: (dias, params = {}) => api.get(`/productos/por-vencer?dias=${dias}`, { params }),
  create: (data) => api.post("/productos", data),
  update: (id, data) => api.put(`/productos/${id}`, data),
  delete: (id) => api.delete(`/productos/${id}`),
  getLotes: (id) => api.get(`/productos/${id}/lotes`),
  createLote: (data) => api.post("/productos/lotes", data),
  getAllLotes: (params = {}) => api.get("/productos/lotes", { params }),
  checkStock: (data) => api.post("/productos/verificar-stock", data),
};

export const ventasService = {
  getAll: (params = {}) => api.get("/ventas", { params }),
  getById: (id) => api.get(`/ventas/${id}`),
  create: (data) => api.post("/ventas", data),
  getByDateRange: (fecha_inicio, fecha_fin, params = {}) =>
    api.get(
      `/ventas/by-date?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`,
      { params },
    ),
  getEstadisticas: (fecha_inicio, fecha_fin) =>
    api.get(
      `/ventas/estadisticas?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`,
    ),
  cancel: (id, data) => api.post(`/ventas/${id}/cancel`, data),
  getVentaConProductos: (id) => api.get(`/ventas/venta/${id}/productos`),
  getVentasPorCliente: (clienteId, params = {}) => api.get(`/ventas/cliente/${clienteId}`, { params }),
  generarTicket: (id) =>
    api.get(`/ventas/${id}/generar-ticket`, { responseType: "blob" }),
};

export const cajaService = {
  abrir: (data) => api.post("/cajas/abrir", data),
  cerrar: (data) => api.post("/cajas/cerrar", data),
  getAbierta: (usuario_id) => api.get(`/cajas/abierta/${usuario_id}`),
  getAll: (params = {}) => api.get("/cajas", { params }),
  getById: (id) => api.get(`/cajas/${id}`),
  getResumenDiario: (fecha) => api.get(`/cajas/resumen-diario?fecha=${fecha}`),
  getCerradas: (params = {}) => api.get("/cajas/cerradas", { params }),
};

export const clientesService = {
  getAll: (params = {}) => api.get("/clientes", { params }),
  getById: (id) => api.get(`/clientes/${id}`),
  create: (data) => api.post("/clientes", data),
  update: (id, data) => api.put(`/clientes/${id}`, data),
  delete: (id) => api.delete(`/clientes/${id}`),
};

export const proveedoresService = {
  getAll: (params = {}) => api.get("/proveedores", { params }),
  getById: (id) => api.get(`/proveedores/${id}`),
  create: (data) => api.post("/proveedores", data),
  update: (id, data) => api.put(`/proveedores/${id}`, data),
  delete: (id) => api.delete(`/proveedores/${id}`),
};

export const categoriasService = {
  getAll: (params = {}) => api.get("/categorias", { params }),
  getById: (id) => api.get(`/categorias/${id}`),
  create: (data) => api.post("/categorias", data),
  update: (id, data) => api.put(`/categorias/${id}`, data),
  delete: (id) => api.delete(`/categorias/${id}`),
};

export const comprasService = {
  getAll: (params = {}) => api.get("/compras", { params }),
  getById: (id) => api.get(`/compras/${id}`),
  create: (data) => api.post("/compras", data),
};

export const inventarioService = {
  getAll: (params = {}) => api.get("/inventario", { params }),
  getById: (id) => api.get(`/inventario/${id}`),
  registrar: (data) => api.post("/inventario/registrar", data),
  verificarStock: (data) => api.post("/inventario/verificar-stock", data),
};

export const reportesService = {
  getMetricasDashboard: () => api.get("/reportes/metricas-dashboard"),
  getTopProductos: (limit) => api.get(`/reportes/top-productos?limit=${limit}`),
  getVentasMensuales: () => api.get("/reportes/ventas-mensuales"),
};

export const usuariosService = {
  getAll: (params = {}) => api.get("/usuarios", { params }),
  getById: (id) => api.get(`/usuarios/${id}`),
  create: (data) => api.post("/usuarios", data),
  update: (id, data) => api.put(`/usuarios/${id}`, data),
  delete: (id) => api.delete(`/usuarios/${id}`),
};

export default api;
