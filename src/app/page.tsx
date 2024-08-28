import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { AuthScreen } from "@/features/auth/components/auth-screen";

export default async function Home() {
  const user = await auth();
  console.log(user);
  return (
    <AuthScreen />
  )
}
