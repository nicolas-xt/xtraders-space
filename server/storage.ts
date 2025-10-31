import { type TeamMember } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getTeamMember(uid: string): Promise<TeamMember | undefined>;
  createTeamMember(member: Omit<TeamMember, "uid">): Promise<TeamMember>;
}

export class MemStorage implements IStorage {
  private members: Map<string, TeamMember>;

  constructor() {
    this.members = new Map();
  }

  async getTeamMember(uid: string): Promise<TeamMember | undefined> {
    return this.members.get(uid);
  }

  async createTeamMember(memberData: Omit<TeamMember, "uid">): Promise<TeamMember> {
    const uid = randomUUID();
    const member: TeamMember = { ...memberData, uid };
    this.members.set(uid, member);
    return member;
  }
}

export const storage = new MemStorage();
