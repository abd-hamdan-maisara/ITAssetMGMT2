import { 
  Hardware, InsertHardware, 
  Credential, InsertCredential, 
  NetworkDevice, InsertNetworkDevice, 
  Vlan, InsertVlan, 
  GeneralInventoryItem, InsertGeneralInventoryItem,
  Assignment, InsertAssignment,
  ActivityLog, InsertActivityLog,
} from "@shared/schema";

export interface IStorage {
  // Hardware methods
  getHardware(id: number): Promise<Hardware | undefined>;
  getAllHardware(): Promise<Hardware[]>;
  createHardware(hardware: InsertHardware): Promise<Hardware>;
  updateHardware(id: number, hardware: Partial<InsertHardware>): Promise<Hardware | undefined>;
  deleteHardware(id: number): Promise<boolean>;
  
  // Credential methods
  getCredential(id: number): Promise<Credential | undefined>;
  getAllCredentials(): Promise<Credential[]>;
  createCredential(credential: InsertCredential): Promise<Credential>;
  updateCredential(id: number, credential: Partial<InsertCredential>): Promise<Credential | undefined>;
  deleteCredential(id: number): Promise<boolean>;
  
  // Network device methods
  getNetworkDevice(id: number): Promise<NetworkDevice | undefined>;
  getAllNetworkDevices(): Promise<NetworkDevice[]>;
  createNetworkDevice(device: InsertNetworkDevice): Promise<NetworkDevice>;
  updateNetworkDevice(id: number, device: Partial<InsertNetworkDevice>): Promise<NetworkDevice | undefined>;
  deleteNetworkDevice(id: number): Promise<boolean>;
  
  // VLAN methods
  getVlan(id: number): Promise<Vlan | undefined>;
  getAllVlans(): Promise<Vlan[]>;
  createVlan(vlan: InsertVlan): Promise<Vlan>;
  updateVlan(id: number, vlan: Partial<InsertVlan>): Promise<Vlan | undefined>;
  deleteVlan(id: number): Promise<boolean>;
  
  // General inventory methods
  getGeneralInventoryItem(id: number): Promise<GeneralInventoryItem | undefined>;
  getAllGeneralInventory(): Promise<GeneralInventoryItem[]>;
  createGeneralInventoryItem(item: InsertGeneralInventoryItem): Promise<GeneralInventoryItem>;
  updateGeneralInventoryItem(id: number, item: Partial<InsertGeneralInventoryItem>): Promise<GeneralInventoryItem | undefined>;
  deleteGeneralInventoryItem(id: number): Promise<boolean>;
  
  // Assignment methods
  getAssignment(id: number): Promise<Assignment | undefined>;
  getAllAssignments(): Promise<Assignment[]>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: number, assignment: Partial<InsertAssignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: number): Promise<boolean>;
  
  // Activity log methods
  getActivityLog(id: number): Promise<ActivityLog | undefined>;
  getAllActivityLogs(): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private hardware: Map<number, Hardware>;
  private credentials: Map<number, Credential>;
  private networkDevices: Map<number, NetworkDevice>;
  private vlans: Map<number, Vlan>;
  private generalInventory: Map<number, GeneralInventoryItem>;
  private assignments: Map<number, Assignment>;
  private activityLogs: Map<number, ActivityLog>;
  
  private hardwareId: number = 1;
  private credentialId: number = 1;
  private networkDeviceId: number = 1;
  private vlanId: number = 1;
  private generalInventoryId: number = 1;
  private assignmentId: number = 1;
  private activityLogId: number = 1;

  constructor() {
    this.hardware = new Map();
    this.credentials = new Map();
    this.networkDevices = new Map();
    this.vlans = new Map();
    this.generalInventory = new Map();
    this.assignments = new Map();
    this.activityLogs = new Map();
  }

  // Hardware methods
  async getHardware(id: number): Promise<Hardware | undefined> {
    return this.hardware.get(id);
  }

  async getAllHardware(): Promise<Hardware[]> {
    return Array.from(this.hardware.values());
  }

  async createHardware(hardware: InsertHardware): Promise<Hardware> {
    const id = this.hardwareId++;
    const now = new Date();
    const newHardware: Hardware = { 
      ...hardware, 
      id, 
      lastUpdated: now 
    };
    this.hardware.set(id, newHardware);
    return newHardware;
  }

  async updateHardware(id: number, hardware: Partial<InsertHardware>): Promise<Hardware | undefined> {
    const existingHardware = this.hardware.get(id);
    if (!existingHardware) return undefined;
    
    const updatedHardware: Hardware = { 
      ...existingHardware, 
      ...hardware, 
      lastUpdated: new Date() 
    };
    this.hardware.set(id, updatedHardware);
    return updatedHardware;
  }

  async deleteHardware(id: number): Promise<boolean> {
    return this.hardware.delete(id);
  }

  // Credential methods
  async getCredential(id: number): Promise<Credential | undefined> {
    return this.credentials.get(id);
  }

  async getAllCredentials(): Promise<Credential[]> {
    return Array.from(this.credentials.values());
  }

  async createCredential(credential: InsertCredential): Promise<Credential> {
    const id = this.credentialId++;
    const now = new Date();
    const newCredential: Credential = { 
      ...credential, 
      id, 
      lastUpdated: now 
    };
    this.credentials.set(id, newCredential);
    return newCredential;
  }

  async updateCredential(id: number, credential: Partial<InsertCredential>): Promise<Credential | undefined> {
    const existingCredential = this.credentials.get(id);
    if (!existingCredential) return undefined;
    
    const updatedCredential: Credential = { 
      ...existingCredential, 
      ...credential, 
      lastUpdated: new Date() 
    };
    this.credentials.set(id, updatedCredential);
    return updatedCredential;
  }

  async deleteCredential(id: number): Promise<boolean> {
    return this.credentials.delete(id);
  }

  // Network device methods
  async getNetworkDevice(id: number): Promise<NetworkDevice | undefined> {
    return this.networkDevices.get(id);
  }

  async getAllNetworkDevices(): Promise<NetworkDevice[]> {
    return Array.from(this.networkDevices.values());
  }

  async createNetworkDevice(device: InsertNetworkDevice): Promise<NetworkDevice> {
    const id = this.networkDeviceId++;
    const now = new Date();
    const newDevice: NetworkDevice = { 
      ...device, 
      id, 
      lastUpdated: now 
    };
    this.networkDevices.set(id, newDevice);
    return newDevice;
  }

  async updateNetworkDevice(id: number, device: Partial<InsertNetworkDevice>): Promise<NetworkDevice | undefined> {
    const existingDevice = this.networkDevices.get(id);
    if (!existingDevice) return undefined;
    
    const updatedDevice: NetworkDevice = { 
      ...existingDevice, 
      ...device, 
      lastUpdated: new Date() 
    };
    this.networkDevices.set(id, updatedDevice);
    return updatedDevice;
  }

  async deleteNetworkDevice(id: number): Promise<boolean> {
    return this.networkDevices.delete(id);
  }

  // VLAN methods
  async getVlan(id: number): Promise<Vlan | undefined> {
    return this.vlans.get(id);
  }

  async getAllVlans(): Promise<Vlan[]> {
    return Array.from(this.vlans.values());
  }

  async createVlan(vlan: InsertVlan): Promise<Vlan> {
    const id = this.vlanId++;
    const now = new Date();
    const newVlan: Vlan = { 
      ...vlan, 
      id, 
      lastUpdated: now 
    };
    this.vlans.set(id, newVlan);
    return newVlan;
  }

  async updateVlan(id: number, vlan: Partial<InsertVlan>): Promise<Vlan | undefined> {
    const existingVlan = this.vlans.get(id);
    if (!existingVlan) return undefined;
    
    const updatedVlan: Vlan = { 
      ...existingVlan, 
      ...vlan, 
      lastUpdated: new Date() 
    };
    this.vlans.set(id, updatedVlan);
    return updatedVlan;
  }

  async deleteVlan(id: number): Promise<boolean> {
    return this.vlans.delete(id);
  }

  // General inventory methods
  async getGeneralInventoryItem(id: number): Promise<GeneralInventoryItem | undefined> {
    return this.generalInventory.get(id);
  }

  async getAllGeneralInventory(): Promise<GeneralInventoryItem[]> {
    return Array.from(this.generalInventory.values());
  }

  async createGeneralInventoryItem(item: InsertGeneralInventoryItem): Promise<GeneralInventoryItem> {
    const id = this.generalInventoryId++;
    const now = new Date();
    const newItem: GeneralInventoryItem = { 
      ...item, 
      id, 
      lastUpdated: now 
    };
    this.generalInventory.set(id, newItem);
    return newItem;
  }

  async updateGeneralInventoryItem(id: number, item: Partial<InsertGeneralInventoryItem>): Promise<GeneralInventoryItem | undefined> {
    const existingItem = this.generalInventory.get(id);
    if (!existingItem) return undefined;
    
    const updatedItem: GeneralInventoryItem = { 
      ...existingItem, 
      ...item, 
      lastUpdated: new Date() 
    };
    this.generalInventory.set(id, updatedItem);
    return updatedItem;
  }

  async deleteGeneralInventoryItem(id: number): Promise<boolean> {
    return this.generalInventory.delete(id);
  }

  // Assignment methods
  async getAssignment(id: number): Promise<Assignment | undefined> {
    return this.assignments.get(id);
  }

  async getAllAssignments(): Promise<Assignment[]> {
    return Array.from(this.assignments.values());
  }

  async createAssignment(assignment: InsertAssignment): Promise<Assignment> {
    const id = this.assignmentId++;
    const now = new Date();
    const newAssignment: Assignment = { 
      ...assignment, 
      id, 
      lastUpdated: now 
    };
    this.assignments.set(id, newAssignment);
    return newAssignment;
  }

  async updateAssignment(id: number, assignment: Partial<InsertAssignment>): Promise<Assignment | undefined> {
    const existingAssignment = this.assignments.get(id);
    if (!existingAssignment) return undefined;
    
    const updatedAssignment: Assignment = { 
      ...existingAssignment, 
      ...assignment, 
      lastUpdated: new Date() 
    };
    this.assignments.set(id, updatedAssignment);
    return updatedAssignment;
  }

  async deleteAssignment(id: number): Promise<boolean> {
    return this.assignments.delete(id);
  }

  // Activity log methods
  async getActivityLog(id: number): Promise<ActivityLog | undefined> {
    return this.activityLogs.get(id);
  }

  async getAllActivityLogs(): Promise<ActivityLog[]> {
    return Array.from(this.activityLogs.values()).sort((a, b) => {
      // Sort by timestamp in descending order (newest first)
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = this.activityLogId++;
    const now = new Date();
    const newLog: ActivityLog = { 
      ...log, 
      id, 
      timestamp: now 
    };
    this.activityLogs.set(id, newLog);
    return newLog;
  }
}

export const storage = new MemStorage();
