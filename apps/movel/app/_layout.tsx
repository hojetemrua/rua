import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { CORES } from "@rua/marca";

/**
 * Raiz do app do corredor.
 *
 * As cinco abas (Hoje · Plano · Correr · Comunidade · Perfil) entram na fase 4.
 * Aqui só a casca: fundo de papel, barra de status escura sobre claro, e sem
 * modo escuro — o projeto não tem.
 */
export default function LayoutRaiz() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor={CORES.papel} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: CORES.papel },
        }}
      />
    </SafeAreaProvider>
  );
}
