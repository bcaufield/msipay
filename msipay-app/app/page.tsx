import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { navConfig } from "@/lib/nav";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  const role = session.user.role;
  redirect(`/${role}/${navConfig[role][0].panel}`);
}
