import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { RoleBasedPortal } from "@/components/role-based-portal"

export default async function AdminPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (session.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <RoleBasedPortal
      user={{
        email: session.email,
        name: session.name || "Admin User",
        role: "ADMIN",
      }}
    />
  )
}
