import { getLoggedUserData } from "@/lib/server/appwrite";
import Day from "./components/day";
import Header from "./header";
import { CompromiseDbFactory } from "@/lib/dbFactory";
import { today, getLocalTimeZone } from "@internationalized/date";

export default async function Home() {
  const userLoggedIn = !!(await getLoggedUserData());
  let date = null;
  let compromises = null;
  if (userLoggedIn) {
    date = today(getLocalTimeZone()).toString();
    compromises =
      await CompromiseDbFactory.getCompromiseDb(
        userLoggedIn,
      ).getCompromisesForTheDate(date);
  }

  return (
    <>
      <Header />
      <Day
        userLoggedIn={userLoggedIn}
        date={date}
        compromisesFromServer={compromises}
      />
    </>
  );
}
