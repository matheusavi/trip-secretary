import { getLoggedUserData } from "@/lib/server/appwrite";
import Day from "./components/day";
import { CompromiseDbFactory } from "@/lib/dbFactory";
import { today, getLocalTimeZone } from "@internationalized/date";

export default async function Home() {
  const userData = await getLoggedUserData();
  let date = null;
  let compromises = null;
  if (userData) {
    date = today(getLocalTimeZone()).toString();
    compromises =
      await CompromiseDbFactory.getCompromiseDb(
        !!userData,
      ).getCompromisesForTheDate(date);
  }

  return (
    <Day userData={userData} date={date} compromisesFromServer={compromises} />
  );
}
