import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache por componente (PPR). A casca da página é estática e só o que
  // depende de dado fresco entra em <Suspense> ou em `use cache`.
  // Ver node_modules/next/dist/docs/01-app/01-getting-started/08-caching.md
  cacheComponents: true,

  // Os pacotes do workspace são TypeScript cru, sem build: o Next compila.
  transpilePackages: ["@rua/dominio", "@rua/marca", "@rua/dados"],

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
