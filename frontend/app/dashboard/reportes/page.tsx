import ProtectedRoute from "@/app/components/ProtectedRoute";
function ReportesPage() {
  return (
    <div>
      <h1>Reportes</h1>
    </div>
  );
}

export default function Reportes() {
  return (
    <ProtectedRoute>
      <ReportesPage />
    </ProtectedRoute>
  );
}
