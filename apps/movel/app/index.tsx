import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CORES, FONTES, RAIOS } from "@rua/marca";
import { formatarDistancia, formatarPace, semanasSemParar } from "@rua/dominio";

/**
 * Tela provisória da fase 1.
 *
 * Serve para provar que o app roda e que os pacotes do núcleo resolvem no
 * Metro: os números abaixo saem de `@rua/dominio` e as cores de `@rua/marca`,
 * exatamente como as telas de verdade vão consumir na fase 4.
 */
export default function Inicio() {
  const bordas = useSafeAreaInsets();

  const semanas = semanasSemParar(
    [
      { inicio: "2026-07-28T06:00:00-03:00" },
      { inicio: "2026-07-22T06:00:00-03:00" },
      { inicio: "2026-07-15T06:00:00-03:00" },
    ],
    new Date("2026-07-29T12:00:00-03:00"),
  );

  return (
    <View style={[estilos.tela, { paddingTop: bordas.top + 24 }]}>
      <Text style={estilos.rotulo}>RUA · FASE 1</Text>
      <Text style={estilos.titulo}>Núcleo de pé.</Text>
      <Text style={estilos.texto}>
        Os pacotes compartilhados resolvem no app. As cinco abas entram na
        fase 4.
      </Text>

      <View style={estilos.cartao}>
        <Linha rotulo="DISTÂNCIA" valor={formatarDistancia(8040)} />
        <Linha rotulo="PACE" valor={formatarPace(310)} />
        <Linha rotulo="SEM PARAR" valor={`${semanas} sem`} />
      </View>
    </View>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <View style={estilos.linha}>
      <Text style={estilos.linhaRotulo}>{rotulo}</Text>
      <Text style={estilos.linhaValor}>{valor}</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: CORES.papel,
    paddingHorizontal: 22,
  },
  rotulo: {
    fontFamily: FONTES.ui,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.6,
    color: CORES.tinta3,
  },
  titulo: {
    fontFamily: FONTES.ui,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
    color: CORES.tinta,
    marginTop: 10,
  },
  texto: {
    fontFamily: FONTES.texto,
    fontSize: 15,
    lineHeight: 24,
    color: CORES.tinta2,
    marginTop: 10,
  },
  cartao: {
    marginTop: 22,
    backgroundColor: CORES.branco,
    borderColor: CORES.linha,
    borderWidth: 1,
    borderRadius: RAIOS.cartao,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  linha: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomColor: CORES.linha2,
    borderBottomWidth: 1,
  },
  linhaRotulo: {
    fontFamily: FONTES.ui,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: CORES.tinta3,
  },
  linhaValor: {
    fontFamily: FONTES.numero,
    fontSize: 20,
    fontWeight: "900",
    color: CORES.tinta,
    fontVariant: ["tabular-nums"],
  },
});
