import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // 📁 Endpoint para buscar arquivos do Google Drive
  app.get("/api/drive/files", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const accessToken = authHeader.split('Bearer ')[1];
      const folderId = "0ANhzl3TC5lTjUk9PVA"; // ID da pasta compartilhada

      // Buscar arquivos da pasta específica do Google Drive
      const driveResponse = await fetch(
        `https://www.googleapis.com/drive/v3/files?` +
        `q='${folderId}'+in+parents&` +
        `fields=files(id,name,mimeType,modifiedTime,webViewLink)&` +
        `orderBy=modifiedTime desc&` +
        `pageSize=10`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      );

      if (!driveResponse.ok) {
        const errorData = await driveResponse.text();
        console.error("❌ Drive API Error:", errorData);
        return res.status(driveResponse.status).json({ 
          error: "Failed to fetch Drive files",
          details: errorData 
        });
      }

      const data = await driveResponse.json();
      res.json(data.files || []);
    } catch (error) {
      console.error("❌ Error fetching Drive files:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
