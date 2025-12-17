// src/types/db_types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          id: string
          interval: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          id?: string
          interval?: Database["public"]["Enums"]["pricing_plan_interval"] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database["public"]["Enums"]["pricing_type"] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prices_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          active: boolean | null
          description: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          quantity: number | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          trial_end: string | null
          trial_start: string | null
          user_id: string
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id: string
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          quantity?: number | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          trial_end?: string | null
          trial_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_price_id_fkey"
            columns: ["price_id"]
            referencedRelation: "prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          billing_address: Json | null
          full_name: string | null
          id: string
          payment_method: Json | null
          subscription_credits: number | null
          purchased_credits: number | null
          last_credits_reset_date: string | null
        }
        Insert: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id: string
          payment_method?: Json | null
          subscription_credits?: number | null
          purchased_credits?: number | null
          last_credits_reset_date?: string | null
        }
        Update: {
          avatar_url?: string | null
          billing_address?: Json | null
          full_name?: string | null
          id?: string
          payment_method?: Json | null
          subscription_credits?: number | null
          purchased_credits?: number | null
          last_credits_reset_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      credit_purchases: {
        Row: {
          id: string
          user_id: string
          amount: number
          price_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          price_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          price_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_purchases_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      credit_usage: {
        Row: {
          id: string
          user_id: string
          amount: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          description?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_usage_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      generated_media: {
        Row: {
          id: string
          user_id: string
          prompt: string
          media_type: string // Stays 'image' or 'video'
          media_url: string
          storage_path: string
          credits_used: number
          status: string
          created_at: string
          metadata: Json | null
          // Add the new columns
          start_image_url: string | null
          end_image_url: string | null
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          media_type: string
          media_url: string
          storage_path: string
          credits_used: number
          status?: string
          created_at?: string
          metadata?: Json | null
          // Add the new columns
          start_image_url?: string | null
          end_image_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          media_type?: string
          media_url?: string
          storage_path?: string
          credits_used?: number
          status?: string
          created_at?: string
          metadata?: Json | null
          // Add the new columns
          start_image_url?: string | null
          end_image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_media_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }

    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      pricing_plan_interval: "day" | "week" | "month" | "year"
      pricing_type: "one_time" | "recurring"
      subscription_status: "trialing" | "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "unpaid" | "paused"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type User = Database["public"]["Tables"]["users"]["Row"]
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"] & {
  prices?: Price
}
export type Product = Database["public"]["Tables"]["products"]["Row"]
export type Price = Database["public"]["Tables"]["prices"]["Row"] & {
  products?: Product
}
export type Customer = Database["public"]["Tables"]["customers"]["Row"]
export type CreditPurchase = Database["public"]["Tables"]["credit_purchases"]["Row"]
export type CreditUsage = Database["public"]["Tables"]["credit_usage"]["Row"]
export type GeneratedMedia = Database["public"]["Tables"]["generated_media"]["Row"]
