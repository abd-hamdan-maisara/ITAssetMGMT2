import { db } from "./db";
import { User, users, Hardware, hardware, NetworkDevice, networkDevices, 
         Vlan, vlans, Credential, credentials, Assignment, assignments,
         Request, requests, RequestComment, requestComments,
         Activity, activities,
         InsertUser, InsertHardware, InsertNetworkDevice, InsertVlan, 
         InsertCredential, InsertAssignment, InsertRequest, 
         InsertRequestComment, InsertActivity, DashboardStats,
         HardwareStatus, NetworkDeviceStatus, RequestStatus, 
         AssignmentStatus } from "@shared/schema";
import { eq, desc, asc, and, isNull, isNotNull, count } from "drizzle-orm";
import connectPgSimple from "connect-pg-simple";
import session from "express-session";
import { pool } from "./db";

// Define PostgreSQL session store
const PostgresSessionStore = connectPgSimple(session);

export interface IStorage {
  // Session store
  sessionStore: session.Store;
  
  // Users
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // Hardware
  getHardware(): Promise<Hardware[]>;
  getHardwareById(id: number): Promise<Hardware | undefined>;
  getHardwareByStatus(status: string): Promise<Hardware[]>;
  createHardware(hardware: InsertHardware): Promise<Hardware>;
  updateHardware(id: number, hardwareData: Partial<InsertHardware>): Promise<Hardware | undefined>;
  
  // Network Devices
  getNetworkDevices(): Promise<NetworkDevice[]>;
  getNetworkDeviceById(id: number): Promise<NetworkDevice | undefined>;
  createNetworkDevice(device: InsertNetworkDevice): Promise<NetworkDevice>;
  updateNetworkDevice(id: number, deviceData: Partial<InsertNetworkDevice>): Promise<NetworkDevice | undefined>;
  
  // VLANs
  getVlans(): Promise<Vlan[]>;
  getVlanById(id: number): Promise<Vlan | undefined>;
  createVlan(vlan: InsertVlan): Promise<Vlan>;
  updateVlan(id: number, vlanData: Partial<InsertVlan>): Promise<Vlan | undefined>;
  
  // Credentials
  getCredentials(): Promise<Credential[]>;
  getCredentialById(id: number): Promise<Credential | undefined>;
  getCredentialsByType(type: string): Promise<Credential[]>;
  createCredential(credential: InsertCredential): Promise<Credential>;
  updateCredential(id: number, credentialData: Partial<InsertCredential>): Promise<Credential | undefined>;
  
  // Assignments
  getAssignments(): Promise<Assignment[]>;
  getAssignmentById(id: number): Promise<Assignment | undefined>;
  getAssignmentsByUserId(userId: number): Promise<Assignment[]>;
  getAssignmentsByHardwareId(hardwareId: number): Promise<Assignment[]>;
  getActiveAssignments(): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: number, assignmentData: Partial<InsertAssignment>): Promise<Assignment | undefined>;
  
  // Requests
  getRequests(): Promise<Request[]>;
  getRequestById(id: number): Promise<Request | undefined>;
  getRequestsByStatus(status: string): Promise<Request[]>;
  getRequestsByUser(userId: number): Promise<Request[]>;
  createRequest(request: InsertRequest): Promise<Request>;
  updateRequest(id: number, requestData: Partial<InsertRequest>): Promise<Request | undefined>;
  
  // Request Comments
  getRequestComments(requestId: number): Promise<RequestComment[]>;
  createRequestComment(comment: InsertRequestComment): Promise<RequestComment>;
  
  // Activities
  getActivities(limit?: number): Promise<Activity[]>;
  getActivitiesByEntityType(entityType: string, entityId?: number): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
  // Dashboard
  getDashboardStats(): Promise<DashboardStats>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true
    });
  }
  
  // Users
  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(asc(users.fullName));
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }
  
  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }
  
  // Hardware
  async getHardware(): Promise<Hardware[]> {
    return await db.select().from(hardware).orderBy(asc(hardware.name));
  }
  
  async getHardwareById(id: number): Promise<Hardware | undefined> {
    const result = await db.select().from(hardware).where(eq(hardware.id, id));
    return result[0];
  }
  
  async getHardwareByStatus(status: string): Promise<Hardware[]> {
    return await db.select().from(hardware)
      .where(eq(hardware.status, status))
      .orderBy(asc(hardware.name));
  }
  
  async createHardware(hardwareItem: InsertHardware): Promise<Hardware> {
    const result = await db.insert(hardware).values(hardwareItem).returning();
    
    // Create activity log
    await this.createActivity({
      action: "hardware_added",
      entityId: result[0].id,
      entityType: "hardware",
      details: { name: result[0].name, type: result[0].type }
    });
    
    return result[0];
  }
  
  async updateHardware(id: number, hardwareData: Partial<InsertHardware>): Promise<Hardware | undefined> {
    const result = await db.update(hardware)
      .set(hardwareData)
      .where(eq(hardware.id, id))
      .returning();
      
    if (result[0]) {
      // Create activity log
      await this.createActivity({
        action: "hardware_updated",
        entityId: id,
        entityType: "hardware",
        details: { name: result[0].name, updates: Object.keys(hardwareData) }
      });
    }
    
    return result[0];
  }
  
  // Network Devices
  async getNetworkDevices(): Promise<NetworkDevice[]> {
    return await db.select().from(networkDevices).orderBy(asc(networkDevices.name));
  }
  
  async getNetworkDeviceById(id: number): Promise<NetworkDevice | undefined> {
    const result = await db.select().from(networkDevices).where(eq(networkDevices.id, id));
    return result[0];
  }
  
  async createNetworkDevice(device: InsertNetworkDevice): Promise<NetworkDevice> {
    const result = await db.insert(networkDevices).values(device).returning();
    
    // Create activity log
    await this.createActivity({
      action: "network_device_added",
      entityId: result[0].id,
      entityType: "network_device",
      details: { name: result[0].name, type: result[0].type }
    });
    
    return result[0];
  }
  
  async updateNetworkDevice(id: number, deviceData: Partial<InsertNetworkDevice>): Promise<NetworkDevice | undefined> {
    const result = await db.update(networkDevices)
      .set(deviceData)
      .where(eq(networkDevices.id, id))
      .returning();
      
    if (result[0]) {
      // Create activity log
      await this.createActivity({
        action: "network_device_updated",
        entityId: id,
        entityType: "network_device",
        details: { name: result[0].name, updates: Object.keys(deviceData) }
      });
    }
    
    return result[0];
  }
  
  // VLANs
  async getVlans(): Promise<Vlan[]> {
    return await db.select().from(vlans).orderBy(asc(vlans.vlanId));
  }
  
  async getVlanById(id: number): Promise<Vlan | undefined> {
    const result = await db.select().from(vlans).where(eq(vlans.id, id));
    return result[0];
  }
  
  async createVlan(vlan: InsertVlan): Promise<Vlan> {
    const result = await db.insert(vlans).values(vlan).returning();
    
    // Create activity log
    await this.createActivity({
      action: "vlan_added",
      entityId: result[0].id,
      entityType: "vlan",
      details: { name: result[0].name, vlanId: result[0].vlanId }
    });
    
    return result[0];
  }
  
  async updateVlan(id: number, vlanData: Partial<InsertVlan>): Promise<Vlan | undefined> {
    const result = await db.update(vlans)
      .set(vlanData)
      .where(eq(vlans.id, id))
      .returning();
      
    if (result[0]) {
      // Create activity log
      await this.createActivity({
        action: "vlan_updated",
        entityId: id,
        entityType: "vlan",
        details: { name: result[0].name, updates: Object.keys(vlanData) }
      });
    }
    
    return result[0];
  }
  
  // Credentials
  async getCredentials(): Promise<Credential[]> {
    return await db.select().from(credentials).orderBy(asc(credentials.name));
  }
  
  async getCredentialById(id: number): Promise<Credential | undefined> {
    const result = await db.select().from(credentials).where(eq(credentials.id, id));
    return result[0];
  }
  
  async getCredentialsByType(type: string): Promise<Credential[]> {
    return await db.select().from(credentials)
      .where(eq(credentials.type, type))
      .orderBy(asc(credentials.name));
  }
  
  async createCredential(credential: InsertCredential): Promise<Credential> {
    const result = await db.insert(credentials).values(credential).returning();
    
    // Create activity log
    await this.createActivity({
      action: "credential_added",
      entityId: result[0].id,
      entityType: "credential",
      details: { name: result[0].name, type: result[0].type }
    });
    
    return result[0];
  }
  
  async updateCredential(id: number, credentialData: Partial<InsertCredential>): Promise<Credential | undefined> {
    const result = await db.update(credentials)
      .set(credentialData)
      .where(eq(credentials.id, id))
      .returning();
      
    if (result[0]) {
      // Create activity log
      await this.createActivity({
        action: "credential_updated",
        entityId: id,
        entityType: "credential",
        details: { name: result[0].name, updates: Object.keys(credentialData) }
      });
    }
    
    return result[0];
  }
  
  // Assignments
  async getAssignments(): Promise<Assignment[]> {
    return await db.select().from(assignments).orderBy(desc(assignments.assignedDate));
  }
  
  async getAssignmentById(id: number): Promise<Assignment | undefined> {
    const result = await db.select().from(assignments).where(eq(assignments.id, id));
    return result[0];
  }
  
  async getAssignmentsByUserId(userId: number): Promise<Assignment[]> {
    return await db.select().from(assignments)
      .where(eq(assignments.userId, userId))
      .orderBy(desc(assignments.assignedDate));
  }
  
  async getAssignmentsByHardwareId(hardwareId: number): Promise<Assignment[]> {
    return await db.select().from(assignments)
      .where(eq(assignments.hardwareId, hardwareId))
      .orderBy(desc(assignments.assignedDate));
  }
  
  async getActiveAssignments(): Promise<Assignment[]> {
    return await db.select().from(assignments)
      .where(eq(assignments.status, AssignmentStatus.ACTIVE))
      .orderBy(desc(assignments.assignedDate));
  }
  
  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const result = await db.insert(assignments).values(assignment).returning();
    
    // Update hardware status to assigned
    await db.update(hardware)
      .set({ status: HardwareStatus.ASSIGNED })
      .where(eq(hardware.id, assignment.hardwareId));
    
    // Create activity log
    await this.createActivity({
      action: "equipment_assigned",
      entityId: result[0].id,
      entityType: "assignment",
      details: {
        userId: result[0].userId,
        hardwareId: result[0].hardwareId
      }
    });
    
    return result[0];
  }
  
  async updateAssignment(id: number, assignmentData: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const result = await db.update(assignments)
      .set(assignmentData)
      .where(eq(assignments.id, id))
      .returning();
      
    if (result[0]) {
      // If returned date is set, update hardware status to available
      if (assignmentData.returnedDate && assignmentData.status === AssignmentStatus.RETURNED) {
        await db.update(hardware)
          .set({ status: HardwareStatus.AVAILABLE })
          .where(eq(hardware.id, result[0].hardwareId));
          
        // Create activity log for return
        await this.createActivity({
          action: "equipment_returned",
          entityId: id,
          entityType: "assignment",
          details: {
            userId: result[0].userId,
            hardwareId: result[0].hardwareId
          }
        });
      }
    }
    
    return result[0];
  }
  
  // Requests
  async getRequests(): Promise<Request[]> {
    return await db.select().from(requests).orderBy(desc(requests.createdAt));
  }
  
  async getRequestById(id: number): Promise<Request | undefined> {
    const result = await db.select().from(requests).where(eq(requests.id, id));
    return result[0];
  }
  
  async getRequestsByStatus(status: string): Promise<Request[]> {
    return await db.select().from(requests)
      .where(eq(requests.status, status))
      .orderBy(desc(requests.createdAt));
  }
  
  async getRequestsByUser(userId: number): Promise<Request[]> {
    return await db.select().from(requests)
      .where(eq(requests.requesterId, userId))
      .orderBy(desc(requests.createdAt));
  }
  
  async createRequest(request: InsertRequest): Promise<Request> {
    const result = await db.insert(requests).values(request).returning();
    
    // Create activity log
    await this.createActivity({
      action: "request_submitted",
      userId: request.requesterId,
      entityId: result[0].id,
      entityType: "request",
      details: { title: result[0].title, priority: result[0].priority }
    });
    
    return result[0];
  }
  
  async updateRequest(id: number, requestData: Partial<InsertRequest>): Promise<Request | undefined> {
    // Get original request for comparison
    const originalRequest = await this.getRequestById(id);
    if (!originalRequest) return undefined;
    
    // Add updated timestamp
    const updateData = { ...requestData, updatedAt: new Date() };
    
    // If status changed to resolved, add resolved timestamp
    if (requestData.status === RequestStatus.RESOLVED && originalRequest.status !== RequestStatus.RESOLVED) {
      // Using as any to bypass TypeScript's type checking for this property
      (updateData as any).resolvedAt = new Date();
    }
    
    const result = await db.update(requests)
      .set(updateData)
      .where(eq(requests.id, id))
      .returning();
      
    if (result[0]) {
      // Create activity log with appropriate action
      let action = "request_updated";
      if (requestData.status && requestData.status !== originalRequest.status) {
        if (requestData.status === RequestStatus.IN_PROGRESS) {
          action = "request_started";
        } else if (requestData.status === RequestStatus.RESOLVED) {
          action = "request_resolved";
        } else if (requestData.status === RequestStatus.CLOSED) {
          action = "request_closed";
        }
      }
      
      await this.createActivity({
        action,
        userId: requestData.assigneeId || originalRequest.assigneeId,
        entityId: id,
        entityType: "request",
        details: { 
          title: originalRequest.title,
          updates: Object.keys(requestData),
          newStatus: requestData.status
        }
      });
    }
    
    return result[0];
  }
  
  // Request Comments
  async getRequestComments(requestId: number): Promise<RequestComment[]> {
    return await db.select().from(requestComments)
      .where(eq(requestComments.requestId, requestId))
      .orderBy(asc(requestComments.createdAt));
  }
  
  async createRequestComment(comment: InsertRequestComment): Promise<RequestComment> {
    const result = await db.insert(requestComments).values(comment).returning();
    
    // Create activity log
    await this.createActivity({
      action: "comment_added",
      userId: comment.userId,
      entityId: comment.requestId,
      entityType: "request",
      details: { commentId: result[0].id }
    });
    
    return result[0];
  }
  
  // Activities
  async getActivities(limit?: number): Promise<Activity[]> {
    const query = db.select().from(activities).orderBy(desc(activities.createdAt));
    
    if (limit) {
      query.limit(limit);
    }
    
    return await query;
  }
  
  async getActivitiesByEntityType(entityType: string, entityId?: number): Promise<Activity[]> {
    // Create conditions array
    const conditions = [eq(activities.entityType, entityType)];
    
    // Add entityId condition if provided
    if (entityId) {
      conditions.push(eq(activities.entityId, entityId));
    }
    
    // Use and() to combine conditions
    const query = db.select().from(activities)
      .where(and(...conditions))
      .orderBy(desc(activities.createdAt));
    
    return await query;
  }
  
  async createActivity(activity: InsertActivity): Promise<Activity> {
    const result = await db.insert(activities).values(activity).returning();
    return result[0];
  }
  
  // Dashboard
  async getDashboardStats(): Promise<DashboardStats> {
    // Get total hardware count
    const totalHardwareResult = await db.select({ count: count() }).from(hardware);
    const totalHardware = totalHardwareResult[0].count;
    
    // Get assigned hardware count
    const assignedHardwareResult = await db.select({ count: count() }).from(hardware)
      .where(eq(hardware.status, HardwareStatus.ASSIGNED));
    const assignedHardware = assignedHardwareResult[0].count;
    
    // Get open requests count
    const openRequestsResult = await db.select({ count: count() }).from(requests)
      .where(eq(requests.status, RequestStatus.OPEN));
    const openRequests = openRequestsResult[0].count;
    
    // Get network devices count
    const networkDevicesResult = await db.select({ count: count() }).from(networkDevices);
    const networkDevicesCount = networkDevicesResult[0].count;
    
    return {
      totalHardware,
      assignedHardware,
      openRequests,
      networkDevices: networkDevicesCount
    };
  }
}

export const storage = new DatabaseStorage();