/**
 * Teste de RLS com três usuários — obrigatório pela especificação (§2.1).
 *
 * "Teste obrigatório: script que autentica corredor A, corredor B e assessor e
 *  verifica leitura/escrita cruzada. Nenhuma fase é pronta sem ele."
 *
 * O que este script protege, em uma frase: policy errada não dá erro, dá dado
 * vazando em silêncio. `select` que devolve a linha de outra pessoa parece
 * sucesso. Só um teste que ESPERA o vazio pega isso.
 *
 * Roda contra o Supabase local:
 *   pnpm --filter @rua/dados teste-policies
 */

import { createClient } from "@supabase/supabase-js";

const API = process.env.SUPABASE_URL ?? "http://127.0.0.1:54421";
const ANON =
  process.env.SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
const SERVICE =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

const admin = createClient(API, SERVICE, { auth: { persistSession: false } });
const anonimo = createClient(API, ANON, { auth: { persistSession: false } });

let passou = 0;
const falhas = [];

function ok(nome, condicao, detalhe = "") {
  if (condicao) {
    passou++;
    console.log(`  ok    ${nome}`);
  } else {
    falhas.push(`${nome}${detalhe ? ` — ${detalhe}` : ""}`);
    console.log(`  FALHA ${nome}${detalhe ? ` — ${detalhe}` : ""}`);
  }
}

/**
 * Sufixo por execução. Apagar e recriar o mesmo e-mail não funciona: o
 * `deleteUser` não é imediato e o `createUser` seguinte responde "already been
 * registered". Cada rodada usa e-mails próprios e limpa os seus no fim.
 */
const RODADA = `${Date.now().toString(36)}`;
const criados = [];

/** Cria um usuário confirmado e devolve um cliente já autenticado. */
async function criarUsuario(prefixo, senha) {
  const email = `${prefixo}.${RODADA}@exemplo.rua.run`;
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  });
  if (error) throw new Error(`criar ${email}: ${error.message}`);

  const cliente = createClient(API, ANON, { auth: { persistSession: false } });
  const { error: erroLogin } = await cliente.auth.signInWithPassword({
    email,
    password: senha,
  });
  if (erroLogin) throw new Error(`login ${email}: ${erroLogin.message}`);
  criados.push(data.user.id);
  return { id: data.user.id, cliente };
}

async function limpar() {
  for (const id of criados) await admin.auth.admin.deleteUser(id);
}

const SENHA = "rua-teste-de-policy-2026";

/**
 * Montagem não pode falhar em silêncio. Sem isto, um insert recusado deixa a
 * variável nula e o teste morre dez linhas depois, apontando para o lugar
 * errado — foi exatamente o que aconteceu na primeira execução.
 */
function deve(resposta, o_que) {
  if (resposta.error) throw new Error(`montagem · ${o_que}: ${resposta.error.message}`);
  return resposta.data;
}

console.log("\nRLS · três usuários\n");

// ───────────────────────────────────────────────────────── montagem

const a = await criarUsuario("corredor.a", SENHA);
const b = await criarUsuario("corredor.b", SENHA);
const c = await criarUsuario("assessor.c", SENHA);

// Perfis: A privado (o padrão), B público.
deve(await admin.from("perfis").insert([
  { id: a.id, apelido: `corredor_a_${RODADA}`, nome: "Corredor A", perfil_publico: false },
  { id: b.id, apelido: `corredor_b_${RODADA}`, nome: "Corredor B", perfil_publico: true },
  { id: c.id, apelido: `assessor_c_${RODADA}`, nome: "Assessor C", perfil_publico: true },
]), "perfis");

const grupo = deve(
  await admin
    .from("grupos")
    .insert({ nome: "Assessoria Exemplo", slug: `assessoria-${RODADA}`, tipo: "assessoria", criado_por: c.id })
    .select()
    .single(),
  "grupos",
);

// A e C no mesmo grupo. B fora — é o controle do teste.
deve(await admin.from("grupo_membros").insert([
  { grupo_id: grupo.id, user_id: c.id, papel: "assessor", status: "ativo" },
  { grupo_id: grupo.id, user_id: a.id, papel: "corredor", status: "ativo" },
]), "grupo_membros");

const turma = deve(
  await admin.from("turmas").insert({ grupo_id: grupo.id, nome: "Turma da manhã" }).select().single(),
  "turmas",
);
deve(await admin.from("turma_membros").insert({ turma_id: turma.id, user_id: a.id }), "turma_membros");

const prescrito = deve(
  await admin
  .from("treinos_prescritos")
  .insert({
    grupo_id: grupo.id,
    user_id: a.id,
    turma_id: turma.id,
    data: "2026-08-03",
    estrutura: { blocos: [{ tipo: "aquecimento", duracao_s: 900 }] },
    criado_por: c.id,
  })
  .select()
  .single(),
  "treinos_prescritos",
);

const base = {
  user_id: a.id,
  inicio: "2026-08-03T09:00:00Z",
  duracao_s: 1800,
  distancia_m: 5000,
  fonte: "gps",
};
const ativs = deve(
  await admin
  .from("atividades")
  .insert([
    { ...base, id_local: "a-privada", privacidade: "privado" },
    { ...base, id_local: "a-grupo", privacidade: "grupo" },
    { ...base, id_local: "a-publica", privacidade: "publico" },
    { ...base, id_local: "a-do-treino", privacidade: "privado", treino_prescrito_id: prescrito.id },
  ])
  .select(),
  "atividades",
);
const porLocal = Object.fromEntries(ativs.map((x) => [x.id_local, x.id]));

deve(await admin.from("zonas_privacidade").insert({ user_id: a.id, lat: -23.55, lng: -46.63, raio_m: 300 }), "zonas");

deve(await admin.from("treinos_modelo").insert([
  { grupo_id: grupo.id, autor_id: c.id, nome: "Intervalado do grupo", tipo: "intervalado", estrutura: {}, publico: false },
  { grupo_id: null, autor_id: c.id, nome: "Leve da biblioteca", tipo: "leve", estrutura: {}, publico: true },
]), "treinos_modelo");

deve(await admin.from("convites").insert({
  grupo_id: grupo.id,
  token: `token-secreto-${RODADA}`,
  papel: "corredor",
  expira_em: "2026-12-31T00:00:00Z",
}), "convites");

// ───────────────────────────────────────────────────────── atividades

const lidasPorA = await a.cliente.from("atividades").select("id_local");
ok("A lê as próprias quatro atividades", lidasPorA.data?.length === 4, `leu ${lidasPorA.data?.length}`);

const lidasPorB = await b.cliente.from("atividades").select("id_local");
ok(
  "B, de fora do grupo, lê só a pública",
  lidasPorB.data?.length === 1 && lidasPorB.data[0].id_local === "a-publica",
  `leu ${JSON.stringify(lidasPorB.data?.map((x) => x.id_local))}`,
);

const lidasPorC = await c.cliente.from("atividades").select("id_local");
const vistasPorC = new Set((lidasPorC.data ?? []).map((x) => x.id_local));
ok("Assessor lê a de privacidade grupo", vistasPorC.has("a-grupo"));
ok("Assessor lê a pública", vistasPorC.has("a-publica"));
ok(
  "Assessor lê a privada VINCULADA ao treino que prescreveu",
  vistasPorC.has("a-do-treino"),
);
ok(
  "Assessor NÃO lê a privada sem vínculo com treino",
  !vistasPorC.has("a-privada"),
  "privada do corredor apareceu para o assessor",
);

// ───────────────────────────────────────────────────────── escrita cruzada

const escritaFalsa = await b.cliente
  .from("atividades")
  .insert({ ...base, id_local: "b-tentando-como-a" });
ok("B não grava atividade no nome de A", escritaFalsa.error !== null, "insert com user_id de A passou");

const updateAlheio = await b.cliente
  .from("atividades")
  .update({ comentario: "invadido" })
  .eq("id", porLocal["a-publica"])
  .select();
ok(
  "B não altera atividade de A, nem a pública",
  (updateAlheio.data ?? []).length === 0,
  `alterou ${updateAlheio.data?.length} linha(s)`,
);

const apagaAlheio = await b.cliente
  .from("atividades")
  .delete()
  .eq("id", porLocal["a-publica"])
  .select();
ok("B não apaga atividade de A", (apagaAlheio.data ?? []).length === 0);

// ───────────────────────────────────────────── zonas de privacidade
// É o dado mais sensível do app: diz onde a pessoa mora. Nem o assessor vê.

const zonasPorB = await b.cliente.from("zonas_privacidade").select("*");
ok("B não lê zona de privacidade de A", (zonasPorB.data ?? []).length === 0);

const zonasPorC = await c.cliente.from("zonas_privacidade").select("*");
ok("Assessor não lê zona de privacidade do aluno", (zonasPorC.data ?? []).length === 0);

const zonasPorA = await a.cliente.from("zonas_privacidade").select("*");
ok("A lê a própria zona", (zonasPorA.data ?? []).length === 1);

// ───────────────────────────────────────────────────────── perfis

const perfisAnon = await anonimo.from("perfis").select("apelido");
const apelidosAnon = new Set((perfisAnon.data ?? []).map((x) => x.apelido));
ok("Anônimo lê perfil público", apelidosAnon.has(`corredor_b_${RODADA}`));
ok("Anônimo NÃO lê perfil privado", !apelidosAnon.has(`corredor_a_${RODADA}`), "perfil privado exposto");

const ativsAnon = await anonimo.from("atividades").select("id");
ok("Anônimo não lê atividade nenhuma", (ativsAnon.data ?? []).length === 0);

// A é privado, mas divide grupo com C: o assessor precisa ver quem é o aluno.
const perfilPorC = await c.cliente.from("perfis").select("apelido").eq("id", a.id);
ok("Assessor lê o perfil privado do próprio aluno", (perfilPorC.data ?? []).length === 1);

const perfilPorB = await b.cliente.from("perfis").select("apelido").eq("id", a.id);
ok("B não lê o perfil privado de A", (perfilPorB.data ?? []).length === 0);

// ───────────────────────────────────────────────────────── grupo

const convitesPorB = await b.cliente.from("convites").select("token");
ok("B não lê o token de convite do grupo", (convitesPorB.data ?? []).length === 0);

const convitesPorA = await a.cliente.from("convites").select("token");
ok("Corredor do grupo também não lê o token", (convitesPorA.data ?? []).length === 0);

const convitesPorC = await c.cliente.from("convites").select("token");
ok("Assessor lê o token do próprio grupo", (convitesPorC.data ?? []).length === 1);

const saida = await a.cliente
  .from("grupo_membros")
  .update({ status: "inativo" })
  .eq("user_id", a.id)
  .select();
ok("Corredor sai do grupo sozinho", (saida.data ?? []).length === 1);
// desfaz, para os testes seguintes verem A dentro do grupo
await admin.from("grupo_membros").update({ status: "ativo" }).eq("user_id", a.id);

const promoveSe = await a.cliente
  .from("grupo_membros")
  .update({ papel: "assessor" })
  .eq("user_id", c.id)
  .select();
ok("Corredor não mexe na linha de outro membro", (promoveSe.data ?? []).length === 0);

// ───────────────────────────────────────────────────────── treinos

const modelosPorB = await b.cliente.from("treinos_modelo").select("nome");
const nomesB = new Set((modelosPorB.data ?? []).map((x) => x.nome));
ok("B lê a biblioteca pública", nomesB.has("Leve da biblioteca"));
ok("B não lê modelo de grupo alheio", !nomesB.has("Intervalado do grupo"));

const prescritosPorB = await b.cliente.from("treinos_prescritos").select("id");
ok("B não lê treino prescrito de A", (prescritosPorB.data ?? []).length === 0);

const prescritosPorA = await a.cliente.from("treinos_prescritos").select("id");
ok("A lê o próprio treino prescrito", (prescritosPorA.data ?? []).length === 1);

const prescreveB = await b.cliente.from("treinos_prescritos").insert({
  grupo_id: grupo.id,
  user_id: a.id,
  data: "2026-08-04",
  estrutura: {},
  criado_por: b.id,
});
ok("B não prescreve treino em grupo que não é dele", prescreveB.error !== null);

// ───────────────────────────────────────────── funções de pertencimento

const eMembroAnon = await anonimo.rpc("e_membro", { p_grupo: grupo.id });
ok("Anônimo não executa e_membro", eMembroAnon.error !== null);

const eMembroA = await a.cliente.rpc("e_membro", { p_grupo: grupo.id });
ok("e_membro devolve verdadeiro para membro ativo", eMembroA.data === true);

const eMembroB = await b.cliente.rpc("e_membro", { p_grupo: grupo.id });
ok("e_membro devolve falso para quem está fora", eMembroB.data === false);

// ───────────────────────────────────────────── deduplicação por id_local

const duplicata = await a.cliente.from("atividades").insert({
  user_id: a.id,
  inicio: "2026-08-03T09:00:00Z",
  duracao_s: 1800,
  distancia_m: 5000,
  fonte: "saude",
  id_local: "a-privada",
});
ok(
  "Reenviar o mesmo id_local é conflito, não linha nova",
  duplicata.error?.code === "23505",
  `código ${duplicata.error?.code ?? "nenhum erro"}`,
);

// ───────────────────────────────────────────────────────── fecho

await limpar();

console.log(`\n  ${passou} passaram · ${falhas.length} falharam\n`);
if (falhas.length) {
  for (const f of falhas) console.log(`  · ${f}`);
  process.exit(1);
}
