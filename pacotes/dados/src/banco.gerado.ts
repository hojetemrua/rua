export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      apoios: {
        Row: {
          anonimo: boolean
          ativo: boolean
          cancelado_em: string | null
          criado_em: string
          fundador: boolean
          id: string
          mes: string | null
          recorrente: boolean
          usuario_id: string | null
          valor_centavos: number
        }
        Insert: {
          anonimo?: boolean
          ativo?: boolean
          cancelado_em?: string | null
          criado_em?: string
          fundador?: boolean
          id?: string
          mes?: string | null
          recorrente?: boolean
          usuario_id?: string | null
          valor_centavos: number
        }
        Update: {
          anonimo?: boolean
          ativo?: boolean
          cancelado_em?: string | null
          criado_em?: string
          fundador?: boolean
          id?: string
          mes?: string | null
          recorrente?: boolean
          usuario_id?: string | null
          valor_centavos?: number
        }
        Relationships: []
      }
      atividades: {
        Row: {
          arquivo_path: string | null
          cadencia_media: number | null
          comentario: string | null
          criado_em: string
          distancia_m: number
          duracao_movimento_s: number | null
          duracao_s: number
          fc_max: number | null
          fc_media: number | null
          fonte: string
          ganho_m: number | null
          id: string
          id_local: string
          inicio: string
          pace_medio_s_km: number | null
          percepcao: number | null
          polilinha: string | null
          privacidade: string
          splits: Json | null
          tempo_por_zona: Json | null
          tenis_id: string | null
          treino_prescrito_id: string | null
          user_id: string
        }
        Insert: {
          arquivo_path?: string | null
          cadencia_media?: number | null
          comentario?: string | null
          criado_em?: string
          distancia_m: number
          duracao_movimento_s?: number | null
          duracao_s: number
          fc_max?: number | null
          fc_media?: number | null
          fonte: string
          ganho_m?: number | null
          id?: string
          id_local: string
          inicio: string
          pace_medio_s_km?: number | null
          percepcao?: number | null
          polilinha?: string | null
          privacidade?: string
          splits?: Json | null
          tempo_por_zona?: Json | null
          tenis_id?: string | null
          treino_prescrito_id?: string | null
          user_id: string
        }
        Update: {
          arquivo_path?: string | null
          cadencia_media?: number | null
          comentario?: string | null
          criado_em?: string
          distancia_m?: number
          duracao_movimento_s?: number | null
          duracao_s?: number
          fc_max?: number | null
          fc_media?: number | null
          fonte?: string
          ganho_m?: number | null
          id?: string
          id_local?: string
          inicio?: string
          pace_medio_s_km?: number | null
          percepcao?: number | null
          polilinha?: string | null
          privacidade?: string
          splits?: Json | null
          tempo_por_zona?: Json | null
          tenis_id?: string | null
          treino_prescrito_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atividades_tenis_id_fkey"
            columns: ["tenis_id"]
            isOneToOne: false
            referencedRelation: "tenis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividades_treino_prescrito_id_fkey"
            columns: ["treino_prescrito_id"]
            isOneToOne: false
            referencedRelation: "treinos_prescritos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atividades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      comentarios: {
        Row: {
          atividade_id: string
          autor_id: string
          criado_em: string
          id: string
          texto: string
        }
        Insert: {
          atividade_id: string
          autor_id: string
          criado_em?: string
          id?: string
          texto: string
        }
        Update: {
          atividade_id?: string
          autor_id?: string
          criado_em?: string
          id?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_atividade_id_fkey"
            columns: ["atividade_id"]
            isOneToOne: false
            referencedRelation: "atividades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comentarios_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      convites: {
        Row: {
          criado_em: string
          expira_em: string
          grupo_id: string
          id: string
          papel: string
          token: string
          usos: number
          usos_max: number
        }
        Insert: {
          criado_em?: string
          expira_em: string
          grupo_id: string
          id?: string
          papel: string
          token: string
          usos?: number
          usos_max?: number
        }
        Update: {
          criado_em?: string
          expira_em?: string
          grupo_id?: string
          id?: string
          papel?: string
          token?: string
          usos?: number
          usos_max?: number
        }
        Relationships: [
          {
            foreignKeyName: "convites_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      encontro_presencas: {
        Row: {
          criado_em: string
          encontro_id: string
          status: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          encontro_id: string
          status: string
          user_id: string
        }
        Update: {
          criado_em?: string
          encontro_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "encontro_presencas_encontro_id_fkey"
            columns: ["encontro_id"]
            isOneToOne: false
            referencedRelation: "encontros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encontro_presencas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      encontros: {
        Row: {
          criado_em: string
          criado_por: string
          descricao: string | null
          grupo_id: string | null
          id: string
          inicio: string
          lat: number | null
          lng: number | null
          local_nome: string | null
          publico: boolean
          titulo: string
        }
        Insert: {
          criado_em?: string
          criado_por: string
          descricao?: string | null
          grupo_id?: string | null
          id?: string
          inicio: string
          lat?: number | null
          lng?: number | null
          local_nome?: string | null
          publico?: boolean
          titulo: string
        }
        Update: {
          criado_em?: string
          criado_por?: string
          descricao?: string | null
          grupo_id?: string | null
          id?: string
          inicio?: string
          lat?: number | null
          lng?: number | null
          local_nome?: string | null
          publico?: boolean
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "encontros_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "encontros_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      grupo_membros: {
        Row: {
          entrou_em: string
          grupo_id: string
          id: string
          papel: string
          status: string
          user_id: string
        }
        Insert: {
          entrou_em?: string
          grupo_id: string
          id?: string
          papel: string
          status?: string
          user_id: string
        }
        Update: {
          entrou_em?: string
          grupo_id?: string
          id?: string
          papel?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupo_membros_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupo_membros_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos: {
        Row: {
          bio: string | null
          cidade: string | null
          criado_em: string
          criado_por: string
          foto_path: string | null
          id: string
          nome: string
          publico: boolean
          slug: string
          tipo: string
          uf: string | null
        }
        Insert: {
          bio?: string | null
          cidade?: string | null
          criado_em?: string
          criado_por: string
          foto_path?: string | null
          id?: string
          nome: string
          publico?: boolean
          slug: string
          tipo: string
          uf?: string | null
        }
        Update: {
          bio?: string | null
          cidade?: string | null
          criado_em?: string
          criado_por?: string
          foto_path?: string | null
          id?: string
          nome?: string
          publico?: boolean
          slug?: string
          tipo?: string
          uf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grupos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      lista_espera: {
        Row: {
          confirmado_em: string | null
          criado_em: string
          email: string
          id: string
          origem: string
        }
        Insert: {
          confirmado_em?: string | null
          criado_em?: string
          email: string
          id?: string
          origem?: string
        }
        Update: {
          confirmado_em?: string | null
          criado_em?: string
          email?: string
          id?: string
          origem?: string
        }
        Relationships: []
      }
      metas: {
        Row: {
          alvo: number | null
          criado_em: string
          id: string
          periodo_fim: string | null
          periodo_inicio: string | null
          prova_data: string | null
          prova_nome: string | null
          tipo: string
          user_id: string
        }
        Insert: {
          alvo?: number | null
          criado_em?: string
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          prova_data?: string | null
          prova_nome?: string | null
          tipo: string
          user_id: string
        }
        Update: {
          alvo?: number | null
          criado_em?: string
          id?: string
          periodo_fim?: string | null
          periodo_inicio?: string | null
          prova_data?: string | null
          prova_nome?: string | null
          tipo?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "metas_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      niveis_apoio: {
        Row: {
          alcancado_em: string | null
          descricao: string
          meta_centavos: number
          nome: string
          ordem: number
        }
        Insert: {
          alcancado_em?: string | null
          descricao: string
          meta_centavos: number
          nome: string
          ordem: number
        }
        Update: {
          alcancado_em?: string | null
          descricao?: string
          meta_centavos?: number
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      perfis: {
        Row: {
          apelido: string
          bio: string | null
          cidade: string | null
          criado_em: string
          foto_path: string | null
          id: string
          nome: string
          perfil_publico: boolean
          uf: string | null
          unidade: string
        }
        Insert: {
          apelido: string
          bio?: string | null
          cidade?: string | null
          criado_em?: string
          foto_path?: string | null
          id: string
          nome: string
          perfil_publico?: boolean
          uf?: string | null
          unidade?: string
        }
        Update: {
          apelido?: string
          bio?: string | null
          cidade?: string | null
          criado_em?: string
          foto_path?: string | null
          id?: string
          nome?: string
          perfil_publico?: boolean
          uf?: string | null
          unidade?: string
        }
        Relationships: []
      }
      projeto: {
        Row: {
          apoio_abre_em: string
          atualizado_em: string
          id: boolean
          lanca_em: string
        }
        Insert: {
          apoio_abre_em: string
          atualizado_em?: string
          id?: boolean
          lanca_em: string
        }
        Update: {
          apoio_abre_em?: string
          atualizado_em?: string
          id?: boolean
          lanca_em?: string
        }
        Relationships: []
      }
      tenis: {
        Row: {
          aposentado_em: string | null
          ativo: boolean
          criado_em: string
          id: string
          km_inicial: number
          marca: string | null
          nome: string
          user_id: string
        }
        Insert: {
          aposentado_em?: string | null
          ativo?: boolean
          criado_em?: string
          id?: string
          km_inicial?: number
          marca?: string | null
          nome: string
          user_id: string
        }
        Update: {
          aposentado_em?: string | null
          ativo?: boolean
          criado_em?: string
          id?: string
          km_inicial?: number
          marca?: string | null
          nome?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      transparencia_meses: {
        Row: {
          apoio_bruto_centavos: number | null
          custo_centavos: number
          mes: string
          nota: string | null
          publicado: boolean
          taxa_centavos: number | null
        }
        Insert: {
          apoio_bruto_centavos?: number | null
          custo_centavos: number
          mes: string
          nota?: string | null
          publicado?: boolean
          taxa_centavos?: number | null
        }
        Update: {
          apoio_bruto_centavos?: number | null
          custo_centavos?: number
          mes?: string
          nota?: string | null
          publicado?: boolean
          taxa_centavos?: number | null
        }
        Relationships: []
      }
      treinos_modelo: {
        Row: {
          autor_id: string
          criado_em: string
          estrutura: Json
          faixa_volume: string | null
          grupo_id: string | null
          id: string
          nome: string
          notas: string | null
          publico: boolean
          tipo: string
          usos: number
        }
        Insert: {
          autor_id: string
          criado_em?: string
          estrutura: Json
          faixa_volume?: string | null
          grupo_id?: string | null
          id?: string
          nome: string
          notas?: string | null
          publico?: boolean
          tipo: string
          usos?: number
        }
        Update: {
          autor_id?: string
          criado_em?: string
          estrutura?: Json
          faixa_volume?: string | null
          grupo_id?: string | null
          id?: string
          nome?: string
          notas?: string | null
          publico?: boolean
          tipo?: string
          usos?: number
        }
        Relationships: [
          {
            foreignKeyName: "treinos_modelo_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinos_modelo_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      treinos_prescritos: {
        Row: {
          criado_em: string
          criado_por: string
          data: string
          estrutura: Json
          grupo_id: string
          id: string
          modelo_id: string | null
          notas: string | null
          status: string
          turma_id: string | null
          user_id: string
        }
        Insert: {
          criado_em?: string
          criado_por: string
          data: string
          estrutura: Json
          grupo_id: string
          id?: string
          modelo_id?: string | null
          notas?: string | null
          status?: string
          turma_id?: string | null
          user_id: string
        }
        Update: {
          criado_em?: string
          criado_por?: string
          data?: string
          estrutura?: Json
          grupo_id?: string
          id?: string
          modelo_id?: string | null
          notas?: string | null
          status?: string
          turma_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "treinos_prescritos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinos_prescritos_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinos_prescritos_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "treinos_modelo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinos_prescritos_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treinos_prescritos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      turma_membros: {
        Row: {
          entrou_em: string
          turma_id: string
          user_id: string
        }
        Insert: {
          entrou_em?: string
          turma_id: string
          user_id: string
        }
        Update: {
          entrou_em?: string
          turma_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "turma_membros_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turma_membros_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      turmas: {
        Row: {
          criado_em: string
          descricao: string | null
          grupo_id: string
          id: string
          nome: string
        }
        Insert: {
          criado_em?: string
          descricao?: string | null
          grupo_id: string
          id?: string
          nome: string
        }
        Update: {
          criado_em?: string
          descricao?: string | null
          grupo_id?: string
          id?: string
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "turmas_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      zonas_privacidade: {
        Row: {
          criado_em: string
          id: string
          lat: number
          lng: number
          raio_m: number
          user_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          lat: number
          lng: number
          raio_m?: number
          user_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          lat?: number
          lng?: number
          raio_m?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "zonas_privacidade_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      compartilha_grupo: { Args: { p_user: string }; Returns: boolean }
      e_assessor: { Args: { p_grupo: string }; Returns: boolean }
      e_assessor_do_treino: { Args: { p_treino: string }; Returns: boolean }
      e_membro: { Args: { p_grupo: string }; Returns: boolean }
      entrar_na_lista: {
        Args: { p_email: string; p_origem?: string }
        Returns: undefined
      }
      resumo_sinal_aberto: {
        Args: never
        Returns: {
          apoiadores: number
          bruto_centavos: number
          comunidade_centavos: number
          custo_do_mes_centavos: number
          descricao: string
          fundador_centavos: number
          liquido_estimado_centavos: number
          mes: string
          meta_bruta_centavos: number
          nivel: number
          nome: string
          taxa_estimada_centavos: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
