import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }){
  const isAdmin = (await cookies()).get("admin")?.value === "true"; // set by /api/admin
  if(!isAdmin) redirect("/admin-login");
  return <div className="space-y-6">{children}</div>;
}
