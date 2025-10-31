import { z } from "zod";

export const userStatusSchema = z.enum(["Online", "Offline", "In Call"]);
export type UserStatus = z.infer<typeof userStatusSchema>;

export const teamMemberSchema = z.object({
  uid: z.string(),
  name: z.string(),
  email: z.string().email(),
  photoURL: z.string().nullable(),
  status: userStatusSchema,
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
