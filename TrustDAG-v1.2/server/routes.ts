import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertFileSchema,
  insertAccessGrantSchema,
  insertAuditEventSchema,
  insertUserPreferencesSchema,
  type File,
  type AccessGrant,
  type AuditEvent,
  type UserPreferences,
} from "@shared/schema";
import { uploadToIPFS, downloadFromIPFS } from "./lib/ipfs";
import { isValidAddress } from "./lib/web3";

export async function registerRoutes(app: Express): Promise<Server> {
  // File endpoints
  app.get("/api/files", async (req, res) => {
    try {
      const ownerAddress = req.query.owner as string;
      
      if (!ownerAddress) {
        return res.status(400).json({ error: "Owner address is required" });
      }

      if (!isValidAddress(ownerAddress)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const files = await storage.getFilesByOwner(ownerAddress);
      res.json(files);
    } catch (error: any) {
      console.error("Error fetching files:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/files", async (req, res) => {
    try {
      const validatedData = insertFileSchema.parse(req.body);
      
      if (!isValidAddress(validatedData.ownerAddress)) {
        return res.status(400).json({ error: "Invalid owner address" });
      }

      const file = await storage.createFile(validatedData);

      // Log upload event
      await storage.createAuditEvent({
        eventType: "upload",
        fileId: file.fileId,
        fileName: file.name,
        actorAddress: file.ownerAddress,
        targetAddress: null,
        metadata: JSON.stringify({ size: file.size, mimeType: file.mimeType }),
      });

      res.status(201).json(file);
    } catch (error: any) {
      console.error("Error creating file:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      res.json(file);
    } catch (error: any) {
      console.error("Error fetching file:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }

      await storage.deleteFile(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      console.error("Error deleting file:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // IPFS upload endpoint (accepts encrypted file data)
  app.post("/api/ipfs/upload", async (req, res) => {
    try {
      const { encryptedData, fileName } = req.body;
      
      if (!encryptedData || !fileName) {
        return res.status(400).json({ error: "Missing encrypted data or filename" });
      }

      // Convert base64 to buffer
      const buffer = Buffer.from(encryptedData, "base64");
      
      // Upload to IPFS
      const result = await uploadToIPFS(buffer, fileName);
      
      res.json(result);
    } catch (error: any) {
      console.error("Error uploading to IPFS:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // IPFS download endpoint
  app.get("/api/ipfs/download/:cid", async (req, res) => {
    try {
      const { cid } = req.params;
      
      // Download from IPFS
      const data = await downloadFromIPFS(cid);
      
      // Return as base64
      res.json({ data: data.toString("base64") });
    } catch (error: any) {
      console.error("Error downloading from IPFS:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Access grant endpoints
  app.get("/api/access-grants", async (req, res) => {
    try {
      const fileId = req.query.fileId as string;
      const address = req.query.address as string;

      if (fileId) {
        const grants = await storage.getAccessGrantsByFileId(fileId);
        return res.json(grants);
      }

      if (address) {
        if (!isValidAddress(address)) {
          return res.status(400).json({ error: "Invalid wallet address" });
        }
        const grants = await storage.getAccessGrantsByAddress(address);
        return res.json(grants);
      }

      res.status(400).json({ error: "Either fileId or address is required" });
    } catch (error: any) {
      console.error("Error fetching access grants:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/access-grants", async (req, res) => {
    try {
      const validatedData = insertAccessGrantSchema.parse(req.body);
      
      if (!isValidAddress(validatedData.grantedTo) || !isValidAddress(validatedData.grantedBy)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const grant = await storage.createAccessGrant(validatedData);

      // Log grant event
      await storage.createAuditEvent({
        eventType: "grant",
        fileId: grant.fileId,
        fileName: null,
        actorAddress: grant.grantedBy,
        targetAddress: grant.grantedTo,
        metadata: JSON.stringify({ role: grant.role }),
      });

      res.status(201).json(grant);
    } catch (error: any) {
      console.error("Error creating access grant:", error);
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/access-grants/:id", async (req, res) => {
    try {
      const grant = await storage.getAccessGrantsByFileId(req.params.id);
      
      if (!grant || grant.length === 0) {
        return res.status(404).json({ error: "Access grant not found" });
      }

      await storage.revokeAccessGrant(req.params.id);

      // Log revoke event
      await storage.createAuditEvent({
        eventType: "revoke",
        fileId: req.params.id,
        fileName: null,
        actorAddress: grant[0]?.grantedBy || "",
        targetAddress: grant[0]?.grantedTo || "",
        metadata: null,
      });

      res.status(204).send();
    } catch (error: any) {
      console.error("Error revoking access grant:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/access-grants/check", async (req, res) => {
    try {
      const fileId = req.query.fileId as string;
      const address = req.query.address as string;

      if (!fileId || !address) {
        return res.status(400).json({ error: "Both fileId and address are required" });
      }

      if (!isValidAddress(address)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const hasAccess = await storage.hasAccess(fileId, address);
      res.json({ hasAccess });
    } catch (error: any) {
      console.error("Error checking access:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Audit event endpoints
  app.get("/api/audit-events", async (req, res) => {
    try {
      const address = req.query.address as string;
      const fileId = req.query.fileId as string;
      const limit = parseInt(req.query.limit as string) || 100;

      if (address) {
        if (!isValidAddress(address)) {
          return res.status(400).json({ error: "Invalid wallet address" });
        }
        const events = await storage.getAuditEventsByAddress(address);
        return res.json(events);
      }

      if (fileId) {
        const events = await storage.getAuditEventsByFileId(fileId);
        return res.json(events);
      }

      const events = await storage.getAuditEvents(limit);
      res.json(events);
    } catch (error: any) {
      console.error("Error fetching audit events:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/audit-events", async (req, res) => {
    try {
      const validatedData = insertAuditEventSchema.parse(req.body);
      
      if (!isValidAddress(validatedData.actorAddress)) {
        return res.status(400).json({ error: "Invalid actor address" });
      }

      if (validatedData.targetAddress && !isValidAddress(validatedData.targetAddress)) {
        return res.status(400).json({ error: "Invalid target address" });
      }

      const event = await storage.createAuditEvent(validatedData);
      res.status(201).json(event);
    } catch (error: any) {
      console.error("Error creating audit event:", error);
      res.status(400).json({ error: error.message });
    }
  });

  // User preferences endpoints
  app.get("/api/user-preferences/:address", async (req, res) => {
    try {
      const { address } = req.params;
      
      if (!isValidAddress(address)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const preferences = await storage.getUserPreferences(address);
      
      if (!preferences) {
        return res.status(404).json({ error: "User preferences not found" });
      }

      res.json(preferences);
    } catch (error: any) {
      console.error("Error fetching user preferences:", error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/user-preferences", async (req, res) => {
    try {
      const validatedData = insertUserPreferencesSchema.parse(req.body);
      
      if (!isValidAddress(validatedData.walletAddress)) {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const preferences = await storage.createOrUpdateUserPreferences(validatedData);
      res.status(201).json(preferences);
    } catch (error: any) {
      console.error("Error updating user preferences:", error);
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
