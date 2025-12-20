'use client';

import { useDebug } from "@/presentation/hooks/useDebug";

const DebugPage = () => {
  const { runDebug, loading, result, error } = useDebug();

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Debug</h1>
      <p>
        Este flujo conecta Presentation → UseCase → Repository → Service para
        validar el wiring de la arquitectura.
      </p>

      <button
        onClick={runDebug}
        disabled={loading}
        style={{
          padding: "0.75rem 1.25rem",
          borderRadius: "0.5rem",
          border: "1px solid #111827",
          background: loading ? "#e5e7eb" : "#111827",
          color: loading ? "#111827" : "#f9fafb",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "1rem",
        }}
      >
        {loading ? "Running..." : "Run debug"}
      </button>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Resultado</h2>
        {result && (
          <p
            style={{
              padding: "0.75rem",
              backgroundColor: "#f3f4f6",
              borderRadius: "0.5rem",
            }}
          >
            {result}
          </p>
        )}
        {error && (
          <p style={{ color: "#b91c1c" }}>
            Error al ejecutar debug: {error}
          </p>
        )}
        {!result && !error && <p>Aún no se ejecuta el debug.</p>}
      </section>
    </main>
  );
};

export default DebugPage;
