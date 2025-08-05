// "use client";
// import { useCategoria } from "@/app/hooks/categorias/useCategoria";
// import Modal from "@/app/components/Modal";
// import CategoriaForm from "@/app/components/categorias/CategoriasForm";
// import { useCrudForm } from "@/app/hooks/useCrudForm";
// import CategoriaList from "@/app/components/categorias/CategoriaList";
// import ProtectedRoute from "@/app/components/ProtectedRoute";

// function CategoriasPage() {
//   const {
//     loading,
//     error,
//     categorias,
//     actualizarCategoria,
//     addCategoria,
//     borrarCategoria,
//     fetchCategoria,
//   } = useCategoria();

//   const form = useCrudForm({
//     initialValues: {
//       nombre: "",
//       descripcion: "",
//     },
//     add: addCategoria,
//     update: actualizarCategoria,
//     fetchById: fetchCategoria,
//   });

//   return (
//     <div className="p-6 bg-background-100 text-text-100 rounded-lg shadow-lg">
//       {/* Título */}
//       <h1 className="text-2xl font-bold mb-4 text-primary-200">Categorías</h1>

//       {/* Mensajes de carga y error */}
//       {loading && <p className="text-primary-300">Cargando...</p>}
//       {error && <p className="text-accent-100">{error}</p>}

//       {/* Botón para agregar categoría */}
//       <div className="mb-4">
//         <button
//           onClick={form.openModalForCreate}
//           className="bg-primary-100 text-text-100 py-2 px-4 rounded-md hover:bg-primary-200 transition-all focus:outline-none focus:ring-2 focus:ring-primary-300"
//         >
//           + Agregar Categoría
//         </button>
//       </div>

//       {/* Modal para agregar o editar categoría */}
//       <Modal
//         title={form.editingId ? "Editar Categoría" : "Agregar Categoría"}
//         isOpen={form.modalOpen}
//         onClose={form.closeModal}
//       >
//         <CategoriaForm
//           values={form.values}
//           handleChange={form.handleChange}
//           handleSubmit={form.handleSubmit}
//           loading={loading}
//           editingCategoriaId={form.editingId}
//           closeModal={form.closeModal}
//         />
//       </Modal>

//       {/* Lista de categorías */}
//       <CategoriaList
//         categorias={categorias}
//         handleEdit={form.handleEdit}
//         borrarCategoria={borrarCategoria}
//       />
//     </div>
//   );
// }

// export default function Page() {
//   return (
//     <ProtectedRoute>
//       <CategoriasPage />
//     </ProtectedRoute>
//   );
// }
