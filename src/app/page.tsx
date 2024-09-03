import { auth } from "@/auth";
import { AuthScreen } from "@/features/auth/components/auth-screen";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { getWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await auth();

  if (!user) {
    return redirect("/auth");
  }

  // const workspaces = await getWorkspaces();

  // const [open, setOpen] = useCreateWorkspaceModal();
  // console.log(open);
  return (
    <div>Hello</div>
  )
}
