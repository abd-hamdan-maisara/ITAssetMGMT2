import { pgTable, text, serial, integer, boolean, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Status enum for hardware
export const statusEnum = pgEnum('status', ['in_stock', 'assigned', 'maintenance', 'retired']);
export const hardwareTypeEnum = pgEnum('type', ['laptop', 'desktop', 'server', 'monitor', 'printer', 'network', 'peripheral', 'other']);
export const credentialTypeEnum = pgEnum('credential_type', ['network', 'server', 'service', 'database', 'api']);

// Hardware table
export const hardware = pgTable("hardware", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: hardwareTypeEnum("type").notNull(),
  manufacturer: text("manufacturer").notNull(),
  model: text("model").notNull(),
  serialNumber: text("serial_number").notNull().unique(),
  purchaseDate: timestamp("purchase_date"),
  warrantyExpiry: timestamp("warranty_expiry"),
  status: statusEnum("status").notNull().default('in_stock'),
  location: text("location"),
  assignedTo: text("assigned_to"), // Could be person or department
  notes: text("notes"),
  imageUrl: text("image_url"), // URL to hardware image
  lastUpdated: timestamp("last_updated").defaultNow()
});

// Credentials table
export const credentials = pgTable("credentials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: credentialTypeEnum("type").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  url: text("url"), // For services or API endpoints
  ipAddress: text("ip_address"), // For network devices
  notes: text("notes"),
  expirationDate: timestamp("expiration_date"),
  lastUpdated: timestamp("last_updated").defaultNow()
});

// Network Devices table
export const networkDevices = pgTable("network_devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // router, switch, firewall, etc.
  manufacturer: text("manufacturer").notNull(),
  model: text("model").notNull(),
  serialNumber: text("serial_number").notNull().unique(),
  ipAddress: text("ip_address").notNull(),
  macAddress: text("mac_address"),
  location: text("location"),
  status: statusEnum("status").notNull().default('in_stock'),
  notes: text("notes"),
  purchaseDate: timestamp("purchase_date"),
  lastUpdated: timestamp("last_updated").defaultNow()
});

// VLANs table
export const vlans = pgTable("vlans", {
  id: serial("id").primaryKey(),
  vlanId: integer("vlan_id").notNull().unique(),
  name: text("name").notNull(),
  subnet: text("subnet").notNull(),
  description: text("description"),
  assignedDevices: text("assigned_devices"),
  lastUpdated: timestamp("last_updated").defaultNow()
});

// General Inventory items table
export const generalInventory = pgTable("general_inventory", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // storage, AV, peripheral, etc.
  description: text("description"),
  serialNumber: text("serial_number"),
  quantity: integer("quantity").notNull().default(1),
  location: text("location"),
  status: statusEnum("status").notNull().default('in_stock'),
  notes: text("notes"),
  purchaseDate: timestamp("purchase_date"),
  lastUpdated: timestamp("last_updated").defaultNow()
});

// Assignments table
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  hardwareId: integer("hardware_id"),
  networkDeviceId: integer("network_device_id"),
  generalInventoryId: integer("general_inventory_id"),
  assignedTo: text("assigned_to").notNull(),
  department: text("department"),
  assignmentDate: timestamp("assignment_date").defaultNow().notNull(),
  returnDate: timestamp("return_date"),
  status: text("status").notNull().default('active'), // active, returned, pending
  notes: text("notes"),
  lastUpdated: timestamp("last_updated").defaultNow()
});

// Activity log table
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  action: text("action").notNull(), // add, edit, delete, assign, etc.
  itemType: text("item_type").notNull(), // hardware, credential, network, etc.
  itemId: integer("item_id").notNull(),
  details: text("details"),
  timestamp: timestamp("timestamp").defaultNow().notNull()
});

// Insert schemas
export const insertHardwareSchema = createInsertSchema(hardware).omit({ id: true, lastUpdated: true });
export const insertCredentialSchema = createInsertSchema(credentials).omit({ id: true, lastUpdated: true });
export const insertNetworkDeviceSchema = createInsertSchema(networkDevices).omit({ id: true, lastUpdated: true });
export const insertVlanSchema = createInsertSchema(vlans).omit({ id: true, lastUpdated: true });
export const insertGeneralInventorySchema = createInsertSchema(generalInventory).omit({ id: true, lastUpdated: true });
export const insertAssignmentSchema = createInsertSchema(assignments).omit({ id: true, lastUpdated: true });
export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({ id: true, timestamp: true });

// Types
export type Hardware = typeof hardware.$inferSelect;
export type InsertHardware = z.infer<typeof insertHardwareSchema>;

export type Credential = typeof credentials.$inferSelect;
export type InsertCredential = z.infer<typeof insertCredentialSchema>;

export type NetworkDevice = typeof networkDevices.$inferSelect;
export type InsertNetworkDevice = z.infer<typeof insertNetworkDeviceSchema>;

export type Vlan = typeof vlans.$inferSelect;
export type InsertVlan = z.infer<typeof insertVlanSchema>;

export type GeneralInventoryItem = typeof generalInventory.$inferSelect;
export type InsertGeneralInventoryItem = z.infer<typeof insertGeneralInventorySchema>;

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
