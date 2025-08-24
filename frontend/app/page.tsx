"use client";

import { useState } from "react";
import { useAuth } from "./hooks/auth/useAuth";
import { ShieldPlus } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(email, password);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl p-8 transition-all duration-200">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4 transition-colors duration-200">
            <ShieldPlus className="w-12 h-12 text-gray-200" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Bienvenido a DanyFarma
          </h1>
          <p className="text-gray-300">
            Ingresa tus credenciales para continuar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="admin@admin.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white transition-colors duration-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-600 focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-gray-700 text-white transition-colors duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>

          <p className="text-center text-gray-300">
            Cualquier fallo contacta al administrador
          </p>
        </form>
      </div>
    </main>
  );
}
