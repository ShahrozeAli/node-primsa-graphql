import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface Context {
  prisma: PrismaClient;
}

const resolvers = {
  Query: {
    getSession: async (
      _: any,
      { sessionId }: { sessionId: number },
      { prisma }: Context,
    ) => {
      return prisma.session.findUnique({
        where: {
          id: sessionId,
        },
      });
    },
    getUserSessions: async (
      _: any,
      { userId }: { userId: number },
      { prisma }: Context,
    ) => {
      return prisma.session.findMany({
        where: {
          userId: userId,
        },
      });
    },
  },
  Mutation: {
    createRole: async (
      _: any,
      { name, description }: { name: string; description?: string },
      { prisma }: Context,
    ) => {
      return prisma.role.create({
        data: {
          name,
          description,
        },
      });
    },
    editRole: async (
      _: any,
      {
        id,
        name,
        description,
      }: { id: number; name: string; description?: string },
      { prisma }: Context,
    ) => {
      return prisma.role.update({
        where: {
          id,
        },
        data: {
          name,
          description,
        },
      });
    },
    deleteRole: async (_: any, { id }: { id: number }, { prisma }: Context) => {
      return prisma.role.delete({
        where: {
          id,
        },
      });
    },
    editUser: async (
      _: any,
      { id, username, email }: { id: number; username: string; email: string },
      { prisma }: Context,
    ) => {
      return prisma.user.update({
        where: {
          id,
        },
        data: {
          username,
          email,
        },
      });
    },
    createUserSession: async (
      _: any,
      {
        userId,
        startTime,
        endTime,
      }: { userId: number; startTime: string; endTime?: string },
      { prisma }: Context,
    ) => {
      return prisma.session.create({
        data: {
          userId,
          startTime,
          endTime,
        },
      });
    },
    deleteSession: async (
      _: any,
      { sessionId }: { sessionId: number },
      { prisma }: Context,
    ) => {
      return prisma.session.delete({
        where: {
          id: sessionId,
        },
      });
    },
    getSessionDataWithoutUser: async (
      _: any,
      { sessionId }: { sessionId: number },
      { prisma }: Context,
    ) => {
      return prisma.session.findUnique({
        where: {
          id: sessionId,
        },
      });
    },
    getSessionDataWithUserAndRoles: async (
      _: any,
      { sessionId }: { sessionId: number },
      { prisma }: Context,
    ) => {
      try {
        // Fetch session data including user and roles
        const sessionWithUserAndRoles = await prisma.session.findUnique({
          where: {
            id: sessionId,
          },
          include: {
            user: {
              select: {
                roles: true,
              },
            },
          },
        });

        if (!sessionWithUserAndRoles) {
          throw new Error("Session not found");
        }

        return sessionWithUserAndRoles;
      } catch (error) {
        console.error(
          "Error fetching session data with user and roles:",
          error,
        );
        throw new Error("Failed to fetch session data with user and roles");
      }
    },
  },
};

export default resolvers;
