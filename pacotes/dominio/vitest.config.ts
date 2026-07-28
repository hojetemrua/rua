import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Testes moram ao lado do que testam, com sufixo em português.
    include: ["src/**/*.teste.ts"],
    environment: "node",
  },
});
