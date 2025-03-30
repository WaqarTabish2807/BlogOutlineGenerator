import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { OutlineContent } from "@shared/schema";
import { z } from "zod";
import { extractTextFromDocx, extractTextFromPdf, extractTextFromTxt } from "./document-parser";
import { generateOutline } from "./outline-generator";

// Setup multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword', // .doc
      'text/plain', // .txt
      'application/pdf', // .pdf
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only DOCX, DOC, TXT, and PDF files are allowed.'));
    }
  },
});

// Validation schema for the outline generation request
const generateOutlineSchema = z.object({
  topic: z.string().min(3).max(200),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.post('/api/upload-sample', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const file = req.file;
      let content = '';
      
      // Extract text based on file type
      if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        content = await extractTextFromDocx(file.buffer);
      } else if (file.mimetype === 'application/msword') {
        content = await extractTextFromDocx(file.buffer);
      } else if (file.mimetype === 'text/plain') {
        content = await extractTextFromTxt(file.buffer);
      } else if (file.mimetype === 'application/pdf') {
        content = await extractTextFromPdf(file.buffer);
      }
      
      // Store the sample outline
      const sampleOutline = await storage.createSampleOutline({
        userId: 1, // Default user ID for now
        name: file.originalname,
        content,
      });
      
      res.status(201).json({
        id: sampleOutline.id,
        name: sampleOutline.name,
        preview: content.substring(0, 200) + (content.length > 200 ? '...' : '')
      });
    } catch (error) {
      console.error('Error uploading sample:', error);
      res.status(500).json({ message: 'Failed to process the uploaded file' });
    }
  });
  
  app.post('/api/generate-outline', async (req: Request, res: Response) => {
    try {
      // Validate request body
      const result = generateOutlineSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: 'Invalid request',
          errors: result.error.format() 
        });
      }
      
      const { topic } = result.data;
      
      // Get the most recent sample outline
      const samples = await storage.getSampleOutlines();
      if (samples.length === 0) {
        return res.status(400).json({ message: 'No sample outline found. Please upload a sample first.' });
      }
      
      // Use the most recent sample
      const sample = samples[samples.length - 1];
      
      // Generate the outline
      const outlineContent = await generateOutline(topic, sample.content);
      
      // Store the generated outline
      const generatedOutline = await storage.createGeneratedOutline({
        userId: 1, // Default user ID for now
        sampleId: sample.id,
        topic,
        content: outlineContent,
      });
      
      res.status(201).json({
        id: generatedOutline.id,
        topic: generatedOutline.topic,
        content: outlineContent,
      });
    } catch (error) {
      console.error('Error generating outline:', error);
      res.status(500).json({ message: 'Failed to generate outline' });
    }
  });

  app.get('/api/samples', async (req: Request, res: Response) => {
    try {
      const samples = await storage.getSampleOutlines();
      
      // Return basic info about each sample
      const sampleInfo = samples.map(sample => ({
        id: sample.id,
        name: sample.name,
        createdAt: sample.createdAt,
      }));
      
      res.status(200).json(sampleInfo);
    } catch (error) {
      console.error('Error fetching samples:', error);
      res.status(500).json({ message: 'Failed to fetch sample outlines' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Document parsing functions
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  // Simple placeholder implementation - in a real app, use a proper library
  return "Sample outline content extracted from DOCX";
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Simple placeholder implementation - in a real app, use a proper library
  return "Sample outline content extracted from PDF";
}

async function extractTextFromTxt(buffer: Buffer): Promise<string> {
  return buffer.toString('utf-8');
}

// Outline generator function
async function generateOutline(topic: string, sampleContent: string): Promise<OutlineContent> {
  // Simple outline generation logic - in a real app, this might be more sophisticated
  const title = topic;
  
  // Parse the sample content to understand its structure
  const sections = [
    {
      title: "I. Introduction",
      items: [
        "Define the topic and its importance",
        "Statistics related to the topic",
        "Overview of the benefits"
      ]
    },
    {
      title: "II. Understanding the Topic",
      items: [
        "Common challenges",
        "The psychology behind the topic",
        "Assessment: Identifying your style"
      ]
    },
    {
      title: "III. Main Points",
      items: [
        "First major point with evidence",
        "Second major point with examples",
        "Third major point with analysis"
      ]
    },
    {
      title: "IV. Practical Applications",
      items: [
        "How to apply the first concept",
        "Strategies for the second concept",
        "Tools and resources"
      ]
    },
    {
      title: "V. Case Studies",
      items: [
        "Example 1: Success story",
        "Example 2: Lessons learned",
        "Key takeaways from examples"
      ]
    },
    {
      title: "VI. Conclusion",
      items: [
        "Recap of main points",
        "Call to action",
        "Final thoughts and future outlook"
      ]
    }
  ];
  
  return { title, sections };
}
