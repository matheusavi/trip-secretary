import { getLoggedUserData } from "@/lib/server/appwrite";
import Day from "./components/day";
import Header from "./header";

export default async function Home() {
  const userLoggedIn = !!(await getLoggedUserData());
  return (
    <>
      <Header />
      <Day userLoggedIn={userLoggedIn} />
    </>
  );
}
