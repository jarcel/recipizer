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
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          name: string | null
          account_type: string
          recipe_count: number
        }
        Insert: {
          id: string
          updated_at?: string | null
          name?: string | null
          account_type?: string
          recipe_count?: number
        }
        Update: {
          id?: string
          updated_at?: string | null
          name?: string | null
          account_type?: string
          recipe_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recipes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          ingredients: string[]
          instructions: string[]
          prep_time: string | null
          cook_time: string | null
          total_time: string | null
          servings: number | null
          cuisine: string | null
          category: string[] | null
          source_url: string | null
          source_website: string | null
          image: string | null
          notes: string | null
          is_public: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description?: string | null
          ingredients: string[]
          instructions: string[]
          prep_time?: string | null
          cook_time?: string | null
          total_time?: string | null
          servings?: number | null
          cuisine?: string | null
          category?: string[] | null
          source_url?: string | null
          source_website?: string | null
          image?: string | null
          notes?: string | null
          is_public?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          description?: string | null
          ingredients?: string[]
          instructions?: string[]
          prep_time?: string | null
          cook_time?: string | null
          total_time?: string | null
          servings?: number | null
          cuisine?: string | null
          category?: string[] | null
          source_url?: string | null
          source_website?: string | null
          image?: string | null
          notes?: string | null
          is_public?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "recipes_user_id_fkey"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}