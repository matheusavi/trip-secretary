import { getLoggedUserData } from "@/lib/server/appwrite";
import UserManager from "./components/userManager";

export default function Header({ userData }: { userData: any }) {
  return (
    <header className="flex flex-row w-full justify-center py-2 bg-primary border-b-2 text-primary-foreground">
      <div className="flex justify-between flex-row gap-2 max-w-screen-xl flex-1 items-center mx-2 2xl:mx-0">
        <h2 className="text-3xl font-bold">Trip Secretary</h2>
        <UserManager userName={userData?.name ?? null} />
      </div>
    </header>
  );
}
