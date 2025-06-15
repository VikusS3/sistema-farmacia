"use client";

import ProtectedRoute from "../components/ProtectedRoute";

function DashboardContent() {
  return <div></div>;
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
