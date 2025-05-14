"use client";

import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { useAuth } from "./hooks/auth/useAuth";

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
          <div className="mx-auto w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mb-4 transition-colors duration-200">
            <LockKeyhole className="w-8 h-8 text-blue-300" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Bienvenido a Sistema Farmacia
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
              placeholder="name@example.com"
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

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="remember"
                className="ml-2 text-gray-300 cursor-pointer"
              >
                Remember me
              </label>
            </div>
            <a href="#" className="text-blue-400 hover:underline">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? "Loading..." : "Login"}
          </button>

          <p className="text-center text-gray-300">
            No tienes una cuenta?{" "}
            <a href="#" className="text-blue-400 hover:underline font-medium">
              Regístrate aquí
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
