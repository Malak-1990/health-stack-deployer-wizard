export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_profiles_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          appointment_date: string
          appointment_type: string
          created_at: string
          doctor_name: string
          id: string
          location: string | null
          notes: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          appointment_date: string
          appointment_type: string
          created_at?: string
          doctor_name: string
          id?: string
          location?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          appointment_date?: string
          appointment_type?: string
          created_at?: string
          doctor_name?: string
          id?: string
          location?: string | null
          notes?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      connected_devices: {
        Row: {
          device_id: string
          device_name: string
          device_type: string
          id: string
          is_active: boolean
          last_connected: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          device_id: string
          device_name: string
          device_type: string
          id?: string
          is_active?: boolean
          last_connected?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          device_id?: string
          device_name?: string
          device_type?: string
          id?: string
          is_active?: boolean
          last_connected?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      daily_health_logs: {
        Row: {
          created_at: string
          date: string
          exercise_minutes: number | null
          id: string
          mood: number | null
          notes: string | null
          sleep_hours: number | null
          stress_level: number | null
          updated_at: string
          user_id: string
          water_intake_ml: number | null
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          date: string
          exercise_minutes?: number | null
          id?: string
          mood?: number | null
          notes?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id: string
          water_intake_ml?: number | null
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          exercise_minutes?: number | null
          id?: string
          mood?: number | null
          notes?: string | null
          sleep_hours?: number | null
          stress_level?: number | null
          updated_at?: string
          user_id?: string
          water_intake_ml?: number | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      doctor_patient_links: {
        Row: {
          doctor_id: string
          patient_id: string
        }
        Insert: {
          doctor_id: string
          patient_id: string
        }
        Update: {
          doctor_id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_patient_links_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "doctor_patient_links_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      encrypted_health_data: {
        Row: {
          created_at: string
          data_type: string
          encrypted_data: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_type: string
          encrypted_data: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_type?: string
          encrypted_data?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      family_patient_links: {
        Row: {
          family_id: string
          patient_id: string
        }
        Insert: {
          family_id: string
          patient_id: string
        }
        Update: {
          family_id?: string
          patient_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_patient_links_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_patient_links_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      frontend_diagnostics: {
        Row: {
          browser_info: Json | null
          created_at: string | null
          error_message: string | null
          id: string
          page_url: string | null
          stack_trace: string | null
          user_id: string | null
        }
        Insert: {
          browser_info?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          page_url?: string | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Update: {
          browser_info?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          page_url?: string | null
          stack_trace?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      heart_rate_readings: {
        Row: {
          created_at: string
          diastolic_bp: number | null
          encrypted_notes: string | null
          heart_rate: number
          id: string
          notes: string | null
          recorded_at: string
          systolic_bp: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          diastolic_bp?: number | null
          encrypted_notes?: string | null
          heart_rate: number
          id?: string
          notes?: string | null
          recorded_at?: string
          systolic_bp?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          diastolic_bp?: number | null
          encrypted_notes?: string | null
          heart_rate?: number
          id?: string
          notes?: string | null
          recorded_at?: string
          systolic_bp?: number | null
          user_id?: string
        }
        Relationships: []
      }
      otp_table: {
        Row: {
          expires_at: string
          id: string
          otp_code: string
          user_id: string
        }
        Insert: {
          expires_at: string
          id?: string
          otp_code: string
          user_id: string
        }
        Update: {
          expires_at?: string
          id?: string
          otp_code?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          full_name: string | null
          gender: string | null
          height_cm: number | null
          id: string
          medical_conditions: string[] | null
          medications: string[] | null
          role: string
          updated_at: string
          weight_kg: number | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          role?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          full_name?: string | null
          gender?: string | null
          height_cm?: number | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          role?: string
          updated_at?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      redirection_logs: {
        Row: {
          context_data: Json | null
          created_at: string | null
          error_message: string | null
          id: string
          resolved: boolean | null
          resolved_at: string | null
          user_id: string | null
        }
        Insert: {
          context_data?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          user_id?: string | null
        }
        Update: {
          context_data?: Json | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          resolved?: boolean | null
          resolved_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      smart_alerts: {
        Row: {
          alert_type: string
          created_at: string
          data: Json | null
          id: string
          is_read: boolean
          message: string
          resolved_at: string | null
          severity: string
          user_id: string
        }
        Insert: {
          alert_type: string
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message: string
          resolved_at?: string | null
          severity: string
          user_id: string
        }
        Update: {
          alert_type?: string
          created_at?: string
          data?: Json | null
          id?: string
          is_read?: boolean
          message?: string
          resolved_at?: string | null
          severity?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          email_confirmed_at: string | null
          id: string
          last_sign_in_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          email_confirmed_at?: string | null
          id?: string
          last_sign_in_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          email_confirmed_at?: string | null
          id?: string
          last_sign_in_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ensure_user_has_profile: {
        Args: { user_email: string }
        Returns: string
      }
      generate_otp: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_with_auth: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          full_name: string
          role: string
          created_at: string
          updated_at: string
          email_confirmed_at: string
          last_sign_in_at: string
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      grant_admin_privileges: {
        Args: { user_email: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
