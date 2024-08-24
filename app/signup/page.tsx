import { getLoggedInUser } from "@/lib/server/appwrite";
import { redirect } from "next/navigation";
import { signUpWithGoogle } from "@/lib/server/oauth";

export default async function SignUpPage() {
  const user = await getLoggedInUser();
  if (user) redirect("/");

  return (
    <>
      <form action={signUpWithGoogle}>
        <button type="submit">Sign up with Google</button>
      </form>
    </>
  );
}
