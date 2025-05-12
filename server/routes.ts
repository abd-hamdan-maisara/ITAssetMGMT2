import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertHardwareSchema, insertCredentialSchema, insertNetworkDeviceSchema, insertVlanSchema, insertGeneralInventorySchema, insertAssignmentSchema, insertActivityLogSchema, insertUserSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  const apiRouter = app;

  // Hardware routes
  apiRouter.get("/api/hardware", async (req: Request, res: Response) => {
    try {
      const hardware = await storage.getAllHardware();
      res.json(hardware);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hardware inventory" });
    }
  });

  apiRouter.get("/api/hardware/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const hardware = await storage.getHardware(id);
      if (!hardware) {
        return res.status(404).json({ error: "Hardware not found" });
      }
      res.json(hardware);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch hardware" });
    }
  });

  apiRouter.post("/api/hardware", async (req: Request, res: Response) => {
    try {
      const validatedData = insertHardwareSchema.parse(req.body);
      const newHardware = await storage.createHardware(validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin", // In a real app, this would be the authenticated user
        action: "add",
        itemType: "hardware",
        itemId: newHardware.id,
        details: `Added ${newHardware.name} to hardware inventory`
      });
      
      res.status(201).json(newHardware);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create hardware" });
    }
  });

  apiRouter.put("/api/hardware/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingHardware = await storage.getHardware(id);
      if (!existingHardware) {
        return res.status(404).json({ error: "Hardware not found" });
      }
      
      const validatedData = insertHardwareSchema.partial().parse(req.body);
      const updatedHardware = await storage.updateHardware(id, validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin", // In a real app, this would be the authenticated user
        action: "update",
        itemType: "hardware",
        itemId: id,
        details: `Updated ${updatedHardware?.name} in hardware inventory`
      });
      
      res.json(updatedHardware);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update hardware" });
    }
  });

  apiRouter.delete("/api/hardware/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const hardware = await storage.getHardware(id);
      if (!hardware) {
        return res.status(404).json({ error: "Hardware not found" });
      }
      
      await storage.deleteHardware(id);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin", // In a real app, this would be the authenticated user
        action: "delete",
        itemType: "hardware",
        itemId: id,
        details: `Deleted ${hardware.name} from hardware inventory`
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete hardware" });
    }
  });

  // Credential routes
  apiRouter.get("/api/credentials", async (req: Request, res: Response) => {
    try {
      const credentials = await storage.getAllCredentials();
      res.json(credentials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credentials" });
    }
  });

  apiRouter.get("/api/credentials/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const credential = await storage.getCredential(id);
      if (!credential) {
        return res.status(404).json({ error: "Credential not found" });
      }
      res.json(credential);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credential" });
    }
  });

  apiRouter.post("/api/credentials", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCredentialSchema.parse(req.body);
      const newCredential = await storage.createCredential(validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "add",
        itemType: "credential",
        itemId: newCredential.id,
        details: `Added ${newCredential.name} to credentials`
      });
      
      res.status(201).json(newCredential);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create credential" });
    }
  });

  apiRouter.put("/api/credentials/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingCredential = await storage.getCredential(id);
      if (!existingCredential) {
        return res.status(404).json({ error: "Credential not found" });
      }
      
      const validatedData = insertCredentialSchema.partial().parse(req.body);
      const updatedCredential = await storage.updateCredential(id, validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "update",
        itemType: "credential",
        itemId: id,
        details: `Updated ${updatedCredential?.name} in credentials`
      });
      
      res.json(updatedCredential);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update credential" });
    }
  });

  apiRouter.delete("/api/credentials/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const credential = await storage.getCredential(id);
      if (!credential) {
        return res.status(404).json({ error: "Credential not found" });
      }
      
      await storage.deleteCredential(id);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "delete",
        itemType: "credential",
        itemId: id,
        details: `Deleted ${credential.name} from credentials`
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete credential" });
    }
  });

  // Network device routes
  apiRouter.get("/api/network-devices", async (req: Request, res: Response) => {
    try {
      const devices = await storage.getAllNetworkDevices();
      res.json(devices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch network devices" });
    }
  });

  apiRouter.get("/api/network-devices/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const device = await storage.getNetworkDevice(id);
      if (!device) {
        return res.status(404).json({ error: "Network device not found" });
      }
      res.json(device);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch network device" });
    }
  });

  apiRouter.post("/api/network-devices", async (req: Request, res: Response) => {
    try {
      const validatedData = insertNetworkDeviceSchema.parse(req.body);
      const newDevice = await storage.createNetworkDevice(validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "add",
        itemType: "network_device",
        itemId: newDevice.id,
        details: `Added ${newDevice.name} to network devices`
      });
      
      res.status(201).json(newDevice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create network device" });
    }
  });

  apiRouter.put("/api/network-devices/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingDevice = await storage.getNetworkDevice(id);
      if (!existingDevice) {
        return res.status(404).json({ error: "Network device not found" });
      }
      
      const validatedData = insertNetworkDeviceSchema.partial().parse(req.body);
      const updatedDevice = await storage.updateNetworkDevice(id, validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "update",
        itemType: "network_device",
        itemId: id,
        details: `Updated ${updatedDevice?.name} in network devices`
      });
      
      res.json(updatedDevice);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update network device" });
    }
  });

  apiRouter.delete("/api/network-devices/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const device = await storage.getNetworkDevice(id);
      if (!device) {
        return res.status(404).json({ error: "Network device not found" });
      }
      
      await storage.deleteNetworkDevice(id);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "delete",
        itemType: "network_device",
        itemId: id,
        details: `Deleted ${device.name} from network devices`
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete network device" });
    }
  });

  // VLAN routes
  apiRouter.get("/api/vlans", async (req: Request, res: Response) => {
    try {
      const vlans = await storage.getAllVlans();
      res.json(vlans);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch VLANs" });
    }
  });

  apiRouter.get("/api/vlans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const vlan = await storage.getVlan(id);
      if (!vlan) {
        return res.status(404).json({ error: "VLAN not found" });
      }
      res.json(vlan);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch VLAN" });
    }
  });

  apiRouter.post("/api/vlans", async (req: Request, res: Response) => {
    try {
      const validatedData = insertVlanSchema.parse(req.body);
      const newVlan = await storage.createVlan(validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "add",
        itemType: "vlan",
        itemId: newVlan.id,
        details: `Added VLAN ${newVlan.name} (ID: ${newVlan.vlanId})`
      });
      
      res.status(201).json(newVlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create VLAN" });
    }
  });

  apiRouter.put("/api/vlans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingVlan = await storage.getVlan(id);
      if (!existingVlan) {
        return res.status(404).json({ error: "VLAN not found" });
      }
      
      const validatedData = insertVlanSchema.partial().parse(req.body);
      const updatedVlan = await storage.updateVlan(id, validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "update",
        itemType: "vlan",
        itemId: id,
        details: `Updated VLAN ${updatedVlan?.name} (ID: ${updatedVlan?.vlanId})`
      });
      
      res.json(updatedVlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update VLAN" });
    }
  });

  apiRouter.delete("/api/vlans/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const vlan = await storage.getVlan(id);
      if (!vlan) {
        return res.status(404).json({ error: "VLAN not found" });
      }
      
      await storage.deleteVlan(id);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "delete",
        itemType: "vlan",
        itemId: id,
        details: `Deleted VLAN ${vlan.name} (ID: ${vlan.vlanId})`
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete VLAN" });
    }
  });

  // General inventory routes
  apiRouter.get("/api/general-inventory", async (req: Request, res: Response) => {
    try {
      const items = await storage.getAllGeneralInventory();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch general inventory" });
    }
  });

  apiRouter.get("/api/general-inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getGeneralInventoryItem(id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch item" });
    }
  });

  apiRouter.post("/api/general-inventory", async (req: Request, res: Response) => {
    try {
      const validatedData = insertGeneralInventorySchema.parse(req.body);
      const newItem = await storage.createGeneralInventoryItem(validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "add",
        itemType: "general_inventory",
        itemId: newItem.id,
        details: `Added ${newItem.name} to general inventory`
      });
      
      res.status(201).json(newItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create general inventory item" });
    }
  });

  apiRouter.put("/api/general-inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingItem = await storage.getGeneralInventoryItem(id);
      if (!existingItem) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      const validatedData = insertGeneralInventorySchema.partial().parse(req.body);
      const updatedItem = await storage.updateGeneralInventoryItem(id, validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "update",
        itemType: "general_inventory",
        itemId: id,
        details: `Updated ${updatedItem?.name} in general inventory`
      });
      
      res.json(updatedItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update general inventory item" });
    }
  });

  apiRouter.delete("/api/general-inventory/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const item = await storage.getGeneralInventoryItem(id);
      if (!item) {
        return res.status(404).json({ error: "Item not found" });
      }
      
      await storage.deleteGeneralInventoryItem(id);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "delete",
        itemType: "general_inventory",
        itemId: id,
        details: `Deleted ${item.name} from general inventory`
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete general inventory item" });
    }
  });

  // Assignment routes
  apiRouter.get("/api/assignments", async (req: Request, res: Response) => {
    try {
      const assignments = await storage.getAllAssignments();
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assignments" });
    }
  });

  apiRouter.get("/api/assignments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const assignment = await storage.getAssignment(id);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch assignment" });
    }
  });

  apiRouter.post("/api/assignments", async (req: Request, res: Response) => {
    try {
      const validatedData = insertAssignmentSchema.parse(req.body);
      const newAssignment = await storage.createAssignment(validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "assign",
        itemType: "assignment",
        itemId: newAssignment.id,
        details: `Created new assignment to ${newAssignment.assignedTo}`
      });
      
      res.status(201).json(newAssignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to create assignment" });
    }
  });

  apiRouter.put("/api/assignments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const existingAssignment = await storage.getAssignment(id);
      if (!existingAssignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      
      const validatedData = insertAssignmentSchema.partial().parse(req.body);
      const updatedAssignment = await storage.updateAssignment(id, validatedData);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "update",
        itemType: "assignment",
        itemId: id,
        details: `Updated assignment to ${updatedAssignment?.assignedTo}`
      });
      
      res.json(updatedAssignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to update assignment" });
    }
  });

  apiRouter.delete("/api/assignments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const assignment = await storage.getAssignment(id);
      if (!assignment) {
        return res.status(404).json({ error: "Assignment not found" });
      }
      
      await storage.deleteAssignment(id);
      
      // Log the activity
      await storage.createActivityLog({
        userId: "admin",
        action: "delete",
        itemType: "assignment",
        itemId: id,
        details: `Deleted assignment to ${assignment.assignedTo}`
      });
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete assignment" });
    }
  });

  // Activity log routes
  apiRouter.get("/api/activity-logs", async (req: Request, res: Response) => {
    try {
      const logs = await storage.getAllActivityLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity logs" });
    }
  });

  apiRouter.get("/api/activity-logs/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const log = await storage.getActivityLog(id);
      if (!log) {
        return res.status(404).json({ error: "Activity log not found" });
      }
      res.json(log);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity log" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
