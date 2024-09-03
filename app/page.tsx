import { getLoggedInUser } from "@/lib/server/appwrite";
import Day from "./components/day";

export default async function Home() {
  const userLoggedIn = !!(await getLoggedInUser());
  return <Day userLoggedIn={userLoggedIn} />;
}
