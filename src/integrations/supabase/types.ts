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
      businesses: {
        Row: {
          active: boolean | null
          country: string | null
          created_at: string | null
          currency: string
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          owner_id: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          country?: string | null
          created_at?: string | null
          currency: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          owner_id?: string | null
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          country?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          owner_id?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_credit_sales: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          due_date: string | null
          id: string
          paid_amount: number | null
          sale_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          paid_amount?: number | null
          sale_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          due_date?: string | null
          id?: string
          paid_amount?: number | null
          sale_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_credit_sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_credit_sales_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      client_transactions: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          date: string
          description: string | null
          id: string
          reference_id: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string | null
          credit_limit: number | null
          email: string | null
          id: string
          is_vip: boolean | null
          last_visit: string | null
          loyalty_points: number | null
          name: string
          notes: string | null
          outstanding_balance: number | null
          phone: string | null
          status: string
          tags: string[] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email?: string | null
          id?: string
          is_vip?: boolean | null
          last_visit?: string | null
          loyalty_points?: number | null
          name: string
          notes?: string | null
          outstanding_balance?: number | null
          phone?: string | null
          status?: string
          tags?: string[] | null
          type?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          credit_limit?: number | null
          email?: string | null
          id?: string
          is_vip?: boolean | null
          last_visit?: string | null
          loyalty_points?: number | null
          name?: string
          notes?: string | null
          outstanding_balance?: number | null
          phone?: string | null
          status?: string
          tags?: string[] | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      combo_components: {
        Row: {
          combo_product_id: string
          component_product_id: string
          created_at: string | null
          id: string
          quantity: number
          updated_at: string | null
        }
        Insert: {
          combo_product_id: string
          component_product_id: string
          created_at?: string | null
          id?: string
          quantity?: number
          updated_at?: string | null
        }
        Update: {
          combo_product_id?: string
          component_product_id?: string
          created_at?: string | null
          id?: string
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "combo_components_combo_product_id_fkey"
            columns: ["combo_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combo_components_component_product_id_fkey"
            columns: ["component_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      extended_users: {
        Row: {
          created_at: string | null
          id: string
          is_deleted: boolean | null
          last_login: string | null
          status: Database["public"]["Enums"]["user_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_deleted?: boolean | null
          last_login?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          last_login?: string | null
          status?: Database["public"]["Enums"]["user_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_years: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          created_at: string | null
          created_by: string
          end_date: string
          id: string
          name: string
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string | null
          created_by: string
          end_date: string
          id?: string
          name: string
          start_date: string
          status: string
          updated_at?: string | null
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string | null
          created_by?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          account: string
          amount: number
          created_at: string | null
          financial_year_id: string | null
          id: string
          transaction_id: string
          type: string
          updated_at: string | null
        }
        Insert: {
          account: string
          amount: number
          created_at?: string | null
          financial_year_id?: string | null
          id?: string
          transaction_id: string
          type: string
          updated_at?: string | null
        }
        Update: {
          account?: string
          amount?: number
          created_at?: string | null
          financial_year_id?: string | null
          id?: string
          transaction_id?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_financial_year_id_fkey"
            columns: ["financial_year_id"]
            isOneToOne: false
            referencedRelation: "financial_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "journal_entries_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string | null
          business_id: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          business_id?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_location_stock: {
        Row: {
          created_at: string | null
          id: string
          location_id: string
          min_stock_level: number | null
          product_id: string
          stock: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id: string
          min_stock_level?: number | null
          product_id: string
          stock?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string
          min_stock_level?: number | null
          product_id?: string
          stock?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_location_stock_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_location_stock_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          category_id: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          has_stock: boolean | null
          id: string
          image_url: string | null
          is_combo: boolean | null
          name: string
          price: number
          stock: number
          updated_at: string | null
        }
        Insert: {
          barcode?: string | null
          category_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          has_stock?: boolean | null
          id?: string
          image_url?: string | null
          is_combo?: boolean | null
          name: string
          price: number
          stock?: number
          updated_at?: string | null
        }
        Update: {
          barcode?: string | null
          category_id?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          has_stock?: boolean | null
          id?: string
          image_url?: string | null
          is_combo?: boolean | null
          name?: string
          price?: number
          stock?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_products_category"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          purchase_order_id: string
          quantity: number
          total_cost: number
          unit_cost: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          purchase_order_id: string
          quantity: number
          total_cost: number
          unit_cost: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          purchase_order_id?: string
          quantity?: number
          total_cost?: number
          unit_cost?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          id: string
          location_id: string | null
          notes: string | null
          status: string
          supplier_id: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          status?: string
          supplier_id?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          status?: string
          supplier_id?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      register_sessions: {
        Row: {
          closed_at: string | null
          closed_by: string | null
          created_at: string
          current_balance: Json
          discrepancies: Json | null
          discrepancy_approved_at: string | null
          discrepancy_approved_by: string | null
          discrepancy_notes: string | null
          discrepancy_resolution: string | null
          expected_balance: Json
          id: string
          is_open: boolean
          name: string
          opened_at: string | null
          opened_by: string | null
          opening_balance: Json
          updated_at: string
        }
        Insert: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          current_balance?: Json
          discrepancies?: Json | null
          discrepancy_approved_at?: string | null
          discrepancy_approved_by?: string | null
          discrepancy_notes?: string | null
          discrepancy_resolution?: string | null
          expected_balance?: Json
          id?: string
          is_open?: boolean
          name: string
          opened_at?: string | null
          opened_by?: string | null
          opening_balance?: Json
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
          closed_by?: string | null
          created_at?: string
          current_balance?: Json
          discrepancies?: Json | null
          discrepancy_approved_at?: string | null
          discrepancy_approved_by?: string | null
          discrepancy_notes?: string | null
          discrepancy_resolution?: string | null
          expected_balance?: Json
          id?: string
          is_open?: boolean
          name?: string
          opened_at?: string | null
          opened_by?: string | null
          opening_balance?: Json
          updated_at?: string
        }
        Relationships: []
      }
      return_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          return_id: string
          sale_item_id: string | null
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity: number
          return_id: string
          sale_item_id?: string | null
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          return_id?: string
          sale_item_id?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "return_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_items_sale_item_id_fkey"
            columns: ["sale_item_id"]
            isOneToOne: false
            referencedRelation: "sale_items"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          location_id: string | null
          reason: string | null
          refund_method: string
          sale_id: string | null
          status: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          reason?: string | null
          refund_method?: string
          sale_id?: string | null
          status?: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          reason?: string | null
          refund_method?: string
          sale_id?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          created_at: string | null
          enabled: boolean | null
          id: string
          permission_id: string
          role_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          permission_id: string
          role_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          enabled?: boolean | null
          id?: string
          permission_id?: string
          role_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sale_items: {
        Row: {
          created_at: string | null
          discount_amount: number
          id: string
          product_id: string
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          discount_amount?: number
          id?: string
          product_id: string
          quantity: number
          sale_id: string
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          discount_amount?: number
          id?: string
          product_id?: string
          quantity?: number
          sale_id?: string
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          client_id: string | null
          created_at: string | null
          discount_amount: number
          id: string
          location_id: string | null
          payment_method: string
          status: string
          subtotal: number
          tax_amount: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          discount_amount?: number
          id?: string
          location_id?: string | null
          payment_method?: string
          status?: string
          subtotal: number
          tax_amount?: number
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          discount_amount?: number
          id?: string
          location_id?: string | null
          payment_method?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      stock_transfer_items: {
        Row: {
          created_at: string | null
          id: string
          product_id: string
          quantity: number
          stock_transfer_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id: string
          quantity: number
          stock_transfer_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string
          quantity?: number
          stock_transfer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_transfer_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfer_items_stock_transfer_id_fkey"
            columns: ["stock_transfer_id"]
            isOneToOne: false
            referencedRelation: "stock_transfers"
            referencedColumns: ["id"]
          },
        ]
      }
      stock_transfers: {
        Row: {
          created_at: string | null
          destination_location_id: string
          id: string
          notes: string | null
          source_location_id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          destination_location_id: string
          id?: string
          notes?: string | null
          source_location_id: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          destination_location_id?: string
          id?: string
          notes?: string | null
          source_location_id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_transfers_destination_location_id_fkey"
            columns: ["destination_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_transfers_source_location_id_fkey"
            columns: ["source_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          financial_year_id: string | null
          id: string
          location_id: string | null
          notes: string | null
          reference_id: string | null
          reference_type: string | null
          status: string
          type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          financial_year_id?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          financial_year_id?: string | null
          id?: string
          location_id?: string | null
          notes?: string | null
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_financial_year_id_fkey"
            columns: ["financial_year_id"]
            isOneToOne: false
            referencedRelation: "financial_years"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_delete_user: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      user_status: "pending" | "active" | "inactive" | "denied"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
