import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import Day from "./components/day";

export default async function Home() {
  const user = await getLoggedInUser();

  if (!user) redirect("/signup");
  return <Day />;
}
