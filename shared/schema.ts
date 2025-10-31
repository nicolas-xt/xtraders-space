import { z } from "zod";

export const userStatusSchema = z.enum(["Online", "Offline", "In Call"]);
export type UserStatus = z.infer<typeof userStatusSchema>;

export const teamMemberSchema = z.object({
  uid: z.string(),
  name: z.string(),
  email: z.string().email(),
  photoURL: z.string().nullable(),
  status: userStatusSchema,
  customStatus: z.string().optional(),
  lastSeen: z.number(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;

export const driveFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  mimeType: z.string(),
  modifiedTime: z.string(),
  webViewLink: z.string(),
  iconLink: z.string().optional(),
});

export type DriveFile = z.infer<typeof driveFileSchema>;

export const announcementSchema = z.object({
  id: z.string(),
  authorId: z.string(),
  authorName: z.string(),
  authorPhoto: z.string().nullable(),
  message: z.string().max(500),
  timestamp: z.number(),
  pinned: z.boolean().default(false),
});

export type Announcement = z.infer<typeof announcementSchema>;

export const statusPresets = [
  { label: "In a meeting", emoji: "💼" },
  { label: "Focus time", emoji: "🎯" },
  { label: "On a break", emoji: "☕" },
  { label: "Lunch", emoji: "🍽️" },
  { label: "Out of office", emoji: "🏖️" },
] as const;
