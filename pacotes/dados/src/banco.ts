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
          ativo: boolean
          cancelado_em: string | null
          criado_em: string
          id: string
          usuario_id: string
          valor_centavos: number
        }
        Insert: {
          ativo?: boolean
          cancelado_em?: string | null
          criado_em?: string
          id?: string
          usuario_id: string
          valor_centavos: number
        }
        Update: {
          ativo?: boolean
          cancelado_em?: string | null
          criado_em?: string
          id?: string
          usuario_id?: string
          valor_centavos?: number
        }
        Relationships: []
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
      niveis_sinal_aberto: {
        Row: {
          alcancado_em: string | null
          meta_centavos: number
          nivel: number
          subtitulo: string | null
          titulo: string
        }
        Insert: {
          alcancado_em?: string | null
          meta_centavos: number
          nivel: number
          subtitulo?: string | null
          titulo: string
        }
        Update: {
          alcancado_em?: string | null
          meta_centavos?: number
          nivel?: number
          subtitulo?: string | null
          titulo?: string
        }
        Relationships: []
      }
      transparencia_meses: {
        Row: {
          custo_centavos: number
          descricao: string
          mes: string
          nivel: number
          publicado: boolean
        }
        Insert: {
          custo_centavos: number
          descricao: string
          mes: string
          nivel: number
          publicado?: boolean
        }
        Update: {
          custo_centavos?: number
          descricao?: string
          mes?: string
          nivel?: number
          publicado?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "transparencia_meses_nivel_fkey"
            columns: ["nivel"]
            isOneToOne: false
            referencedRelation: "niveis_sinal_aberto"
            referencedColumns: ["nivel"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      entrar_na_lista: {
        Args: { p_email: string; p_origem?: string }
        Returns: undefined
      }
      resumo_sinal_aberto: {
        Args: never
        Returns: {
          apoiadores: number
          arrecadado_centavos: number
          custo_centavos: number
          descricao: string
          mes: string
          nivel: number
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

/**
 * Apelido em português para o tipo gerado.
 *
 * Este arquivo é gerado por `pnpm --filter @rua/dados gerar-tipos` e por isso
 * está em inglês — não editar acima desta linha, o comando sobrescreve.
 */
export type Banco = Database;
