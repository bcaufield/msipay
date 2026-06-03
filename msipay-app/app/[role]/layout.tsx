import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { isRole, navConfig } from "@/lib/nav";

export default async function RoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ role: string }>;
}) {
  const { role } = await params;
  if (!isRole(role)) notFound();

  const session = await auth();
  if (!session?.user) redirect("/signin");

  // Each account has a single role — send users to their own area.
  const userRole = session.user.role;
  if (userRole !== role) {
    redirect(`/${userRole}/${navConfig[userRole][0].panel}`);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role={userRole} userEmail={session.user.email ?? ""} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </main>
    </div>
  );
}
