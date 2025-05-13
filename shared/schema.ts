import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, primaryKey, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users and Authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("user"), // admin, it_manager, technician, user
  department: text("department"),
  phoneNumber: text("phone_number"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  assignments: many(assignments),
  requests: many(requests),
}));

// Hardware Inventory
export const hardware = pgTable("hardware", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // laptop, desktop, server, printer, etc.
  manufacturer: text("manufacturer"),
  model: text("model"),
  serialNumber: text("serial_number"),
  purchaseDate: timestamp("purchase_date"),
  warrantyExpiration: timestamp("warranty_expiration"),
  status: text("status").notNull().default("available"), // available, assigned, maintenance, retired
  specifications: json("specifications"),
  notes: text("notes"),
  location: text("location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hardwareRelations = relations(hardware, ({ many }) => ({
  assignments: many(assignments),
}));

// Network Devices
export const networkDevices = pgTable("network_devices", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // switch, router, access point, firewall
  ipAddress: text("ip_address"),
  macAddress: text("mac_address"),
  location: text("location"),
  manufacturer: text("manufacturer"),
  model: text("model"),
  serialNumber: text("serial_number"),
  firmwareVersion: text("firmware_version"),
  purchaseDate: timestamp("purchase_date"),
  status: text("status").notNull().default("active"), // active, maintenance, retired
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// VLANs
export const vlans = pgTable("vlans", {
  id: serial("id").primaryKey(),
  vlanId: integer("vlan_id").notNull().unique(),
  name: text("name").notNull(),
  subnet: text("subnet"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Credentials
export const credentials = pgTable("credentials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  url: text("url"),
  description: text("description"),
  type: text("type").notNull(), // system, network, application, service
  notes: text("notes"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assignments (who has what equipment)
export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  hardwareId: integer("hardware_id").references(() => hardware.id).notNull(),
  assignedDate: timestamp("assigned_date").defaultNow(),
  returnedDate: timestamp("returned_date"),
  notes: text("notes"),
  status: text("status").notNull().default("active"), // active, returned
});

export const assignmentsRelations = relations(assignments, ({ one }) => ({
  user: one(users, {
    fields: [assignments.userId],
    references: [users.id],
  }),
  hardware: one(hardware, {
    fields: [assignments.hardwareId],
    references: [hardware.id],
  }),
}));

// IT Requests
export const requests = pgTable("requests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  requesterId: integer("requester_id").references(() => users.id).notNull(),
  assigneeId: integer("assignee_id").references(() => users.id),
  status: text("status").notNull().default("open"), // open, in-progress, resolved, closed
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  category: text("category").notNull(), // hardware, software, network, access, other
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const requestsRelations = relations(requests, ({ one }) => ({
  requester: one(users, {
    fields: [requests.requesterId],
    references: [users.id],
  }),
  assignee: one(users, {
    fields: [requests.assigneeId],
    references: [users.id],
  }),
}));

// Request Comments
export const requestComments = pgTable("request_comments", {
  id: serial("id").primaryKey(),
  requestId: integer("request_id").references(() => requests.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity Logs
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(), // login, hardware_added, assignment_created, etc.
  entityId: integer("entity_id"), // ID of related entity
  entityType: text("entity_type"), // hardware, user, assignment, etc.
  details: json("details"), // Additional details about the activity
  createdAt: timestamp("created_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true 
});

export const insertHardwareSchema = createInsertSchema(hardware).omit({ 
  id: true, 
  createdAt: true 
});

export const insertNetworkDeviceSchema = createInsertSchema(networkDevices).omit({ 
  id: true, 
  createdAt: true 
});

export const insertVlanSchema = createInsertSchema(vlans).omit({ 
  id: true, 
  createdAt: true 
});

export const insertCredentialSchema = createInsertSchema(credentials).omit({ 
  id: true, 
  createdAt: true, 
  lastUpdated: true 
});

export const insertAssignmentSchema = createInsertSchema(assignments).omit({ 
  id: true 
});

export const insertRequestSchema = createInsertSchema(requests).omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true,
  resolvedAt: true
});

export const insertRequestCommentSchema = createInsertSchema(requestComments).omit({ 
  id: true, 
  createdAt: true 
});

export const insertActivitySchema = createInsertSchema(activities).omit({ 
  id: true, 
  createdAt: true 
});

// Define types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Hardware = typeof hardware.$inferSelect;
export type InsertHardware = z.infer<typeof insertHardwareSchema>;

export type NetworkDevice = typeof networkDevices.$inferSelect;
export type InsertNetworkDevice = z.infer<typeof insertNetworkDeviceSchema>;

export type Vlan = typeof vlans.$inferSelect;
export type InsertVlan = z.infer<typeof insertVlanSchema>;

export type Credential = typeof credentials.$inferSelect;
export type InsertCredential = z.infer<typeof insertCredentialSchema>;

export type Assignment = typeof assignments.$inferSelect;
export type InsertAssignment = z.infer<typeof insertAssignmentSchema>;

export type Request = typeof requests.$inferSelect;
export type InsertRequest = z.infer<typeof insertRequestSchema>;

export type RequestComment = typeof requestComments.$inferSelect;
export type InsertRequestComment = z.infer<typeof insertRequestCommentSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

// Constant Enums
export const UserRoles = {
  ADMIN: "admin",
  IT_MANAGER: "it_manager",
  TECHNICIAN: "technician",
  USER: "user"
} as const;

export const HardwareStatus = {
  AVAILABLE: "available",
  ASSIGNED: "assigned",
  MAINTENANCE: "maintenance",
  RETIRED: "retired"
} as const;

export const NetworkDeviceStatus = {
  ACTIVE: "active",
  MAINTENANCE: "maintenance",
  RETIRED: "retired"
} as const;

export const RequestStatus = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
  CLOSED: "closed"
} as const;

export const RequestPriority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  CRITICAL: "critical"
} as const;

export const AssignmentStatus = {
  ACTIVE: "active",
  RETURNED: "returned"
} as const;

export const ActivityTypes = {
  USER_LOGIN: "user_login",
  USER_LOGOUT: "user_logout",
  USER_REGISTERED: "user_registered",
  USER_UPDATED: "user_updated",
  HARDWARE_ADDED: "hardware_added",
  HARDWARE_UPDATED: "hardware_updated",
  HARDWARE_RETIRED: "hardware_retired",
  ASSIGNMENT_CREATED: "assignment_created",
  ASSIGNMENT_UPDATED: "assignment_updated",
  ASSIGNMENT_RETURNED: "assignment_returned",
  REQUEST_CREATED: "request_created",
  REQUEST_UPDATED: "request_updated",
  REQUEST_RESOLVED: "request_resolved",
  NETWORK_DEVICE_ADDED: "network_device_added",
  NETWORK_DEVICE_UPDATED: "network_device_updated",
  CREDENTIAL_ADDED: "credential_added",
  CREDENTIAL_UPDATED: "credential_updated"
} as const;

// Dashboard stats type
export type DashboardStats = {
  totalHardware: number;
  assignedHardware: number;
  openRequests: number;
  networkDevices: number;
};
