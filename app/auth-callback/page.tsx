import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/db";

export default async function AuthCallbackPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id || !user.email) {
    redirect("/");
  }

  // Sync Kinde metadata to our TiDB database
  await prisma.user.upsert({
    where: { kindeId: user.id },
    update: {
      email: user.email,
      firstName: user.given_name ?? "",
      lastName: user.family_name ?? "",
      imageUrl: user.picture,
    },
    create: {
      kindeId: user.id,
      email: user.email,
      firstName: user.given_name ?? "",
      lastName: user.family_name ?? "",
      imageUrl: user.picture,
    },
  });

  // Automatically advance users to the dashboard
  redirect("/dashboard");
}
