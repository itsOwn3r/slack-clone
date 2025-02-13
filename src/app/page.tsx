import { auth } from "@/auth";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/stores";
import { getWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import CreateWorkspace from "@/components/Workspaces/CreateWorkspace";

export default async function Home() {
  const user = await auth();

  if (!user) {
    return redirect("/auth");
  }

  const workspaces = await getWorkspaces(user.user.id);
  // const workspaces = [];

  if (workspaces.length > 0) {
    return redirect(`/workspace/${workspaces[0].id}`);
  } else {
    return (
      <CreateWorkspace />
    )    
  }

}
