/** Tipos compartilhados do domínio. Nenhuma dependência de UI ou de banco. */

export type NumeroDeZona = 1 | 2 | 3 | 4 | 5;

/** Ponto cru do GPS, como o dispositivo entrega. */
export type PontoGps = {
  lat: number;
  lng: number;
  /** Epoch em milissegundos. */
  t: number;
  /** Precisão horizontal em metros. */
  precisao_m?: number;
  altitude_m?: number;
};

/** Zona de privacidade: círculo onde o traçado não pode ser persistido. */
export type ZonaDePrivacidade = {
  lat: number;
  lng: number;
  raio_m: number;
};

export type Split = {
  km: number;
  tempo_s: number;
  ganho_m?: number;
  fc?: number;
};

export type TempoPorZona = Record<`z${NumeroDeZona}`, number>;

export type AtividadeParaConstancia = {
  /** Início da atividade. */
  inicio: Date | string;
};

export type PrescritoParaAderencia = {
  data: string;
  distancia_m?: number;
};

export type RealizadoParaAderencia = {
  inicio: Date | string;
  distancia_m: number;
  treino_prescrito_id?: string | null;
};
