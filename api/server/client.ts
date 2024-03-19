import { type User as prismaUser, PrismaClient } from "@prisma/client";
import { createClient } from '@supabase/supabase-js'
import { publicUser } from "./types/User";

const prisma = new PrismaClient()

export default prisma;

export function formatUser(user: prismaUser): publicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}
