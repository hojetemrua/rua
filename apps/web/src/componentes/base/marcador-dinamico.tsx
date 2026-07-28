import { Suspense } from "react";
import { connection } from "next/server";

async function Conexao() {
  await connection();
  return null;
}

/**
 * Declara que a rota é dinâmica sem tirar o conteúdo estático da casca.
 *
 * Serve para rota com segmento dinâmico (`/atividade/[id]`,
 * `/assessor/atleta/[id]`): resolver metadados nessas rotas conta como leitura
 * de `params`, ou seja, dado de requisição. Se a página em volta fosse
 * inteiramente estática, o Cache Components recusaria o build por
 * inconsistência — metadados dinâmicos numa página que não é.
 *
 * Como não se pode envolver `generateMetadata` em <Suspense>, o caminho é este:
 * um marcador que adia só a si mesmo, deixando o resto prerenderizar.
 * Ver node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md
 */
export function MarcadorDinamico() {
  return (
    <Suspense>
      <Conexao />
    </Suspense>
  );
}
