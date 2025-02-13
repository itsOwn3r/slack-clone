import db from "@/lib/db";

const getWorkspaces = async (userId: string) => {
  const findWorkspaces = await db.workspaces.findMany({
    where: {
      OR: [
        {
          userId: userId
        },
        {
          Members: {
            some: { userId: userId }
        }
    }
  ]
    }
  });
  return findWorkspaces;
};

export { getWorkspaces };
