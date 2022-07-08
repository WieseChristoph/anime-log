import { PrismaClient } from "@prisma/client";

// used for connection pooling. So that not every request has to create a new connection.
export const prisma = new PrismaClient();
