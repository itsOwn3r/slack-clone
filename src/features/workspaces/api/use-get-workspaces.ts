import db from "@/lib/db";

const getWorkspaces = async () => {
  const findWorkspaces = await db.workspaces.findMany();
  return findWorkspaces;
};

export { getWorkspaces };
