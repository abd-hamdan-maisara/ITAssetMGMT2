import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sku: text("sku").notNull().unique(),
  description: text("description"),
  price: doublePrecision("price").notNull(),
  stock: integer("stock").notNull().default(0),
  minStockLevel: integer("min_stock_level").default(10),
  categoryId: integer("category_id").references(() => categories.id),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const suppliers = pgTable("suppliers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contactName: text("contact_name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  supplierId: integer("supplier_id").references(() => suppliers.id),
  status: text("status").notNull().default("pending"), // pending, received, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").notNull(),
  price: doublePrecision("price").notNull(),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // product_added, order_placed, stock_updated, etc
  description: text("description").notNull(),
  entityId: integer("entity_id"), // ID of related entity (product, order, etc)
  entityType: text("entity_type"), // product, order, etc
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertSupplierSchema = createInsertSchema(suppliers).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertOrderItemSchema = createInsertSchema(orderItems).omit({ id: true });
export const insertActivitySchema = createInsertSchema(activities).omit({ id: true, createdAt: true });

// Types
export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Supplier = typeof suppliers.$inferSelect;
export type InsertSupplier = z.infer<typeof insertSupplierSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// Enum for activity types
export const ActivityTypes = {
  PRODUCT_ADDED: "product_added",
  PRODUCT_UPDATED: "product_updated",
  STOCK_UPDATED: "stock_updated",
  ORDER_PLACED: "order_placed",
  ORDER_RECEIVED: "order_received",
  ORDER_CANCELLED: "order_cancelled",
  LOW_STOCK_ALERT: "low_stock_alert",
} as const;

// Enum for order status
export const OrderStatus = {
  PENDING: "pending",
  RECEIVED: "received",
  CANCELLED: "cancelled",
} as const;

// Dashboard stats type
export type DashboardStats = {
  totalProducts: number;
  lowStockItems: number;
  activeOrders: number;
  totalSuppliers: number;
};

// General Inventory schema
export const generalInventory = pgTable("general_inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // storage, audio/visual, peripherals, networking, etc
  serialNumber: text("serial_number"),
  description: text("description"),
  location: text("location"),
  status: text("status").notNull().default("available"), // available, in-use, maintenance, retired
  purchaseDate: timestamp("purchase_date"),
  warranty: text("warranty"),
  notes: text("notes"),
});

export const insertGeneralInventorySchema = createInsertSchema(generalInventory).omit({ id: true });
export type GeneralInventoryItem = typeof generalInventory.$inferSelect;
export type InsertGeneralInventoryItem = z.infer<typeof insertGeneralInventorySchema>;
