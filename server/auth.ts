import { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { User } from "@shared/schema";

// Role-based access control middleware
export function checkRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Simplified auth check - just check if there's a user property on the request
    const hasUser = req.query.user !== undefined;
    
    if (!hasUser) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // For simplicity, assume admin role for now
    const role = "admin";
    
    if (!roles.includes(role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    
    next();
  };
}

export function setupAuth(app: Express) {
  // Simplified auth routes
  app.post("/api/register", async (req, res) => {
    try {
      const { username, email } = req.body;
      
      const existingUsername = await storage.getUserByUsername(username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create user with plain password for demo (should be hashed in production)
      const user = await storage.createUser({
        ...req.body,
        isActive: true
      });
      
      // Create activity log
      await storage.createActivityLog({
        userId: "system",
        action: "add",
        itemType: "user",
        itemId: user.id,
        details: `Created user: ${user.username}`
      });

      // Return user without sensitive data
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Error creating user" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Simple password check for demo
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      if (!user.isActive) {
        return res.status(401).json({ message: "Account is inactive" });
      }
      
      // Update last login time (ignore type errors for simplicity)
      try {
        await storage.updateUser(user.id, {
          lastLogin: new Date() as any
        });
      } catch (err) {
        console.error("Failed to update login time:", err);
      }
      
      // Create activity log
      await storage.createActivityLog({
        userId: user.username,
        action: "login",
        itemType: "user",
        itemId: user.id,
        details: `User logged in: ${user.username}`
      });
      
      // Return user without sensitive data
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Login error" });
    }
  });

  app.post("/api/logout", async (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
  });

  app.get("/api/user", async (req, res) => {
    try {
      // Return the admin user for simplicity
      const user = await storage.getUserByUsername("admin");
      
      if (!user) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Return user without sensitive data
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message || "Error fetching user" });
    }
  });
}