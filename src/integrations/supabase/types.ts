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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      birthday_coupons: {
        Row: {
          coupon_code: string
          created_at: string | null
          discount_percent: number
          id: string
          is_used: boolean | null
          user_id: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          coupon_code: string
          created_at?: string | null
          discount_percent?: number
          id?: string
          is_used?: boolean | null
          user_id: string
          valid_from: string
          valid_until: string
        }
        Update: {
          coupon_code?: string
          created_at?: string | null
          discount_percent?: number
          id?: string
          is_used?: boolean | null
          user_id?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          category: string
          created_at: string
          email: string
          id: string
          message: string
          name: string
          order_id: string | null
          phone: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          order_id?: string | null
          phone?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          order_id?: string | null
          phone?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string | null
          customer_email: string
          customer_name: string
          id: string
          items: Json
          payment_method: string | null
          phone: string | null
          shipping_address: string | null
          status: Database["public"]["Enums"]["order_status"]
          total: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_email: string
          customer_name: string
          id?: string
          items?: Json
          payment_method?: string | null
          phone?: string | null
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_email?: string
          customer_name?: string
          id?: string
          items?: Json
          payment_method?: string | null
          phone?: string | null
          shipping_address?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          total?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          countdown_minutes: number | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          price: number
          status: Database["public"]["Enums"]["product_status"]
          stock_quantity: number
          updated_at: string | null
          urgency_message: string | null
        }
        Insert: {
          countdown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          price?: number
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number
          updated_at?: string | null
          urgency_message?: string | null
        }
        Update: {
          countdown_minutes?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          price?: number
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number
          updated_at?: string | null
          urgency_message?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          blocked: boolean | null
          created_at: string | null
          date_of_birth: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          blocked?: boolean | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          blocked?: boolean | null
          created_at?: string | null
          date_of_birth?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      saved_addresses: {
        Row: {
          address: string
          city: string
          created_at: string | null
          full_name: string
          id: string
          is_default: boolean | null
          label: string
          phone: string
          pincode: string
          state: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string | null
          full_name: string
          id?: string
          is_default?: boolean | null
          label?: string
          phone: string
          pincode: string
          state: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string | null
          full_name?: string
          id?: string
          is_default?: boolean | null
          label?: string
          phone?: string
          pincode?: string
          state?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          banner_text: string | null
          birthday_coupon_validity_days: number | null
          birthday_discount_enabled: boolean | null
          birthday_discount_percent: number | null
          countdown_minutes: number | null
          discount_codes: Json | null
          id: string
          shipping_charge: number | null
          updated_at: string | null
          urgency_message: string | null
        }
        Insert: {
          banner_text?: string | null
          birthday_coupon_validity_days?: number | null
          birthday_discount_enabled?: boolean | null
          birthday_discount_percent?: number | null
          countdown_minutes?: number | null
          discount_codes?: Json | null
          id?: string
          shipping_charge?: number | null
          updated_at?: string | null
          urgency_message?: string | null
        }
        Update: {
          banner_text?: string | null
          birthday_coupon_validity_days?: number | null
          birthday_discount_enabled?: boolean | null
          birthday_discount_percent?: number | null
          countdown_minutes?: number | null
          discount_codes?: Json | null
          id?: string
          shipping_charge?: number | null
          updated_at?: string | null
          urgency_message?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          discount_percent: number
          frequency: Database["public"]["Enums"]["subscription_frequency"]
          id: string
          next_delivery_date: string
          product_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discount_percent?: number
          frequency?: Database["public"]["Enums"]["subscription_frequency"]
          id?: string
          next_delivery_date?: string
          product_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          discount_percent?: number
          frequency?: Database["public"]["Enums"]["subscription_frequency"]
          id?: string
          next_delivery_date?: string
          product_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          created_at: string | null
          customer_name: string
          customer_photo_url: string | null
          id: string
          is_approved: boolean | null
          is_verified_purchase: boolean | null
          rating: number
          review_text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_name: string
          customer_photo_url?: string | null
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          rating?: number
          review_text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string
          customer_photo_url?: string | null
          id?: string
          is_approved?: boolean | null
          is_verified_purchase?: boolean | null
          rating?: number
          review_text?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      public_site_settings: {
        Row: {
          banner_text: string | null
          birthday_coupon_validity_days: number | null
          birthday_discount_enabled: boolean | null
          birthday_discount_percent: number | null
          countdown_minutes: number | null
          id: string | null
          shipping_charge: number | null
          updated_at: string | null
          urgency_message: string | null
        }
        Insert: {
          banner_text?: string | null
          birthday_coupon_validity_days?: number | null
          birthday_discount_enabled?: boolean | null
          birthday_discount_percent?: number | null
          countdown_minutes?: number | null
          id?: string | null
          shipping_charge?: number | null
          updated_at?: string | null
          urgency_message?: string | null
        }
        Update: {
          banner_text?: string | null
          birthday_coupon_validity_days?: number | null
          birthday_discount_enabled?: boolean | null
          birthday_discount_percent?: number | null
          countdown_minutes?: number | null
          id?: string | null
          shipping_charge?: number | null
          updated_at?: string | null
          urgency_message?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      order_status: "pending" | "shipped" | "delivered" | "cancelled"
      product_status: "in_stock" | "out_of_stock" | "coming_soon"
      subscription_frequency: "30_days" | "60_days"
      subscription_status: "active" | "paused" | "cancelled"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      order_status: ["pending", "shipped", "delivered", "cancelled"],
      product_status: ["in_stock", "out_of_stock", "coming_soon"],
      subscription_frequency: ["30_days", "60_days"],
      subscription_status: ["active", "paused", "cancelled"],
    },
  },
} as const
