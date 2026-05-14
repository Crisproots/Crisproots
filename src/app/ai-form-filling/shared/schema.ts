import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const formSubmissions = pgTable("form_submissions", {
  id: serial("id").primaryKey(),
  schemeId: text("scheme_id").notNull(),
  formData: text("form_data").notNull(), // JSON string
  language: text("language").notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFormSubmissionSchema = createInsertSchema(formSubmissions).pick({
  schemeId: true,
  formData: true,
  language: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type FormSubmission = typeof formSubmissions.$inferSelect;
export type InsertFormSubmission = z.infer<typeof insertFormSubmissionSchema>;

// Government schemes definition
export const governmentSchemes = [
  {
    id: "pm-kisan-samman-nidhi",
    name: {
      english: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
      hindi: "प्रधान मंत्री किसान सम्मान निधि (पीएम-किसान)"
    },
    description: {
      english: "Income support scheme for farmers",
      hindi: "किसानों के लिए आय सहायता योजना"
    },
    icon: "fas fa-seedling"
  },
  {
    id: "pm-fasal-bima-yojana",
    name: {
      english: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      hindi: "प्रधान मंत्री फसल बीमा योजना (पीएमएफबीवाई)"
    },
    description: {
      english: "Crop insurance scheme for farmers",
      hindi: "किसानों के लिए फसल बीमा योजना"
    },
    icon: "fas fa-umbrella"
  },
  {
    id: "pm-krishi-sinchai-yojana",
    name: {
      english: "Pradhan Mantri Krishi Sinchai Yojana (PMKSY)",
      hindi: "प्रधान मंत्री कृषि सिंचाई योजना (पीएमकेएसवाई)"
    },
    description: {
      english: "Irrigation scheme for farmers",
      hindi: "किसानों के लिए सिंचाई योजना"
    },
    icon: "fas fa-water"
  },
  {
    id: "kisan-credit-card",
    name: {
      english: "Kisan Credit Card (KCC) Scheme",
      hindi: "किसान क्रेडिट कार्ड (केसीसी) योजना"
    },
    description: {
      english: "Credit facility for farmers",
      hindi: "किसानों के लिए ऋण सुविधा"
    },
    icon: "fas fa-credit-card"
  },
  {
    id: "national-agriculture-market",
    name: {
      english: "National Agriculture Market (e-NAM)",
      hindi: "राष्ट्रीय कृषि बाजार (ई-नाम)"
    },
    description: {
      english: "Online trading platform for agriculture",
      hindi: "कृषि के लिए ऑनलाइन ट्रेडिंग प्लेटफॉर्म"
    },
    icon: "fas fa-store"
  },
  {
    id: "rashtriya-krishi-vikas-yojana",
    name: {
      english: "Rashtriya Krishi Vikas Yojana (RKVY)",
      hindi: "राष्ट्रीय कृषि विकास योजना (आरकेवीवाई)"
    },
    description: {
      english: "National agriculture development scheme",
      hindi: "राष्ट्रीय कृषि विकास योजना"
    },
    icon: "fas fa-tractor"
  }
];
