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
      products: {
        Row: {
          id: number
          name: string
          supplier_price: number
        }
        Insert: {
          id?: number
          name: string
          supplier_price: number
        }
        Update: {
          id?: number
          name?: string
          supplier_price?: number
        }
        Relationships: []
      }
      stock_history: {
        Row: {
          date: string
          product_id: number
          stock: number
        }
        Insert: {
          date: string
          product_id: number
          stock: number
        }
        Update: {
          date?: string
          product_id?: number
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "stock_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      product_sales: {
        Row: {
          date: string | null
          product_id: number | null
          product_name: string | null
          stock: number | null
          supplier_price: number | null
          stock_difference: number | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      calculate_and_insert_stock_history: {
        Args: {
          p_product_id: number
          p_date: string
          p_stock: number
        }
        Returns: undefined
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
