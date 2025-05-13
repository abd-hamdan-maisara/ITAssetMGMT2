import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertUserSchema, 
  insertHardwareSchema, 
  insertNetworkDeviceSchema, 
  insertVlanSchema,
  insertCredentialSchema,
  insertAssignmentSchema,
  insertRequestSchema,
  insertRequestCommentSchema,
  insertActivitySchema,
  UserRoles,
  HardwareStatus,
  NetworkDeviceStatus,
  RequestStatus
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard routes
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const userData = req.body;
      
      const user = await storage.updateUser(id, userData);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Hardware routes
  app.get("/api/hardware", async (req, res) => {
    try {
      const status = req.query.status as string;
      
      let hardware;
      if (status) {
        hardware = await storage.getHardwareByStatus(status);
      } else {
        hardware = await storage.getHardware();
      }
      
      res.json(hardware);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hardware" });
    }
  });

  app.get("/api/hardware/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const hardware = await storage.getHardwareById(id);
      
      if (!hardware) {
        return res.status(404).json({ message: "Hardware not found" });
      }
      
      res.json(hardware);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hardware" });
    }
  });

  app.post("/api/hardware", async (req, res) => {
    try {
      const hardwareData = insertHardwareSchema.parse(req.body);
      const hardware = await storage.createHardware(hardwareData);
      res.status(201).json(hardware);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid hardware data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create hardware" });
    }
  });

  app.patch("/api/hardware/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const hardwareData = req.body;
      
      const hardware = await storage.updateHardware(id, hardwareData);
      
      if (!hardware) {
        return res.status(404).json({ message: "Hardware not found" });
      }
      
      res.json(hardware);
    } catch (error) {
      res.status(500).json({ message: "Failed to update hardware" });
    }
  });

  // Network Device routes
  app.get("/api/network-devices", async (req, res) => {
    try {
      const networkDevices = await storage.getNetworkDevices();
      res.json(networkDevices);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch network devices" });
    }
  });

  app.get("/api/network-devices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const device = await storage.getNetworkDeviceById(id);
      
      if (!device) {
        return res.status(404).json({ message: "Network device not found" });
      }
      
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch network device" });
    }
  });

  app.post("/api/network-devices", async (req, res) => {
    try {
      const deviceData = insertNetworkDeviceSchema.parse(req.body);
      const device = await storage.createNetworkDevice(deviceData);
      res.status(201).json(device);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid network device data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create network device" });
    }
  });

  app.patch("/api/network-devices/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deviceData = req.body;
      
      const device = await storage.updateNetworkDevice(id, deviceData);
      
      if (!device) {
        return res.status(404).json({ message: "Network device not found" });
      }
      
      res.json(device);
    } catch (error) {
      res.status(500).json({ message: "Failed to update network device" });
    }
  });

  // VLAN routes
  app.get("/api/vlans", async (req, res) => {
    try {
      const vlans = await storage.getVlans();
      res.json(vlans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch VLANs" });
    }
  });

  app.get("/api/vlans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vlan = await storage.getVlanById(id);
      
      if (!vlan) {
        return res.status(404).json({ message: "VLAN not found" });
      }
      
      res.json(vlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch VLAN" });
    }
  });

  app.post("/api/vlans", async (req, res) => {
    try {
      const vlanData = insertVlanSchema.parse(req.body);
      const vlan = await storage.createVlan(vlanData);
      res.status(201).json(vlan);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid VLAN data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create VLAN" });
    }
  });

  app.patch("/api/vlans/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const vlanData = req.body;
      
      const vlan = await storage.updateVlan(id, vlanData);
      
      if (!vlan) {
        return res.status(404).json({ message: "VLAN not found" });
      }
      
      res.json(vlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to update VLAN" });
    }
  });

  // Credential routes
  app.get("/api/credentials", async (req, res) => {
    try {
      const type = req.query.type as string;
      
      let credentials;
      if (type) {
        credentials = await storage.getCredentialsByType(type);
      } else {
        credentials = await storage.getCredentials();
      }
      
      res.json(credentials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credentials" });
    }
  });

  app.get("/api/credentials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const credential = await storage.getCredentialById(id);
      
      if (!credential) {
        return res.status(404).json({ message: "Credential not found" });
      }
      
      res.json(credential);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch credential" });
    }
  });

  app.post("/api/credentials", async (req, res) => {
    try {
      const credentialData = insertCredentialSchema.parse(req.body);
      const credential = await storage.createCredential(credentialData);
      res.status(201).json(credential);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid credential data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create credential" });
    }
  });

  app.patch("/api/credentials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const credentialData = req.body;
      
      const credential = await storage.updateCredential(id, credentialData);
      
      if (!credential) {
        return res.status(404).json({ message: "Credential not found" });
      }
      
      res.json(credential);
    } catch (error) {
      res.status(500).json({ message: "Failed to update credential" });
    }
  });

  // Assignment routes
  app.get("/api/assignments", async (req, res) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const hardwareId = req.query.hardwareId ? parseInt(req.query.hardwareId as string) : undefined;
      const active = req.query.active === 'true';
      
      let assignments;
      if (userId) {
        assignments = await storage.getAssignmentsByUserId(userId);
      } else if (hardwareId) {
        assignments = await storage.getAssignmentsByHardwareId(hardwareId);
      } else if (active) {
        assignments = await storage.getActiveAssignments();
      } else {
        assignments = await storage.getAssignments();
      }
      
      res.json(assignments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignments" });
    }
  });

  app.get("/api/assignments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assignment = await storage.getAssignmentById(id);
      
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assignment" });
    }
  });

  app.post("/api/assignments", async (req, res) => {
    try {
      const assignmentData = insertAssignmentSchema.parse(req.body);
      const assignment = await storage.createAssignment(assignmentData);
      res.status(201).json(assignment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid assignment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create assignment" });
    }
  });

  app.patch("/api/assignments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const assignmentData = req.body;
      
      const assignment = await storage.updateAssignment(id, assignmentData);
      
      if (!assignment) {
        return res.status(404).json({ message: "Assignment not found" });
      }
      
      res.json(assignment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update assignment" });
    }
  });

  // Request routes
  app.get("/api/requests", async (req, res) => {
    try {
      const status = req.query.status as string;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      let requests;
      if (status) {
        requests = await storage.getRequestsByStatus(status);
      } else if (userId) {
        requests = await storage.getRequestsByUser(userId);
      } else {
        requests = await storage.getRequests();
      }
      
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get("/api/requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const request = await storage.getRequestById(id);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch request" });
    }
  });

  app.post("/api/requests", async (req, res) => {
    try {
      const requestData = insertRequestSchema.parse(req.body);
      const request = await storage.createRequest(requestData);
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid request data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  app.patch("/api/requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const requestData = req.body;
      
      const request = await storage.updateRequest(id, requestData);
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to update request" });
    }
  });

  // Request comment routes
  app.get("/api/requests/:requestId/comments", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const comments = await storage.getRequestComments(requestId);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch request comments" });
    }
  });

  app.post("/api/requests/:requestId/comments", async (req, res) => {
    try {
      const requestId = parseInt(req.params.requestId);
      const commentData = { ...req.body, requestId };
      
      const validatedData = insertRequestCommentSchema.parse(commentData);
      const comment = await storage.createRequestComment(validatedData);
      
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const entityType = req.query.entityType as string;
      const entityId = req.query.entityId ? parseInt(req.query.entityId as string) : undefined;
      
      let activities;
      if (entityType) {
        activities = await storage.getActivitiesByEntityType(entityType, entityId);
      } else {
        activities = await storage.getActivities(limit);
      }
      
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Setup authentication routes
  setupAuth(app);

  const httpServer = createServer(app);
  return httpServer;
}
