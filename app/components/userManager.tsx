"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logOutUser } from "@/lib/server/appwrite";
import { signUpWithGoogle } from "@/lib/server/oauth";

import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { useSetAtom } from "jotai";
import { startTransition } from "react";
import {
  loadCompromiseFromDateAtom,
  userIsLoggedInAtom,
} from "./compromise/compromiseAtom";

export default function UserManager({ userName }: { userName: string | null }) {
  const setLoggedInAtom = useSetAtom(userIsLoggedInAtom);
  const loadCompromises = useSetAtom(loadCompromiseFromDateAtom);
  function onClickLogOut(): void {
    startTransition(async () => {
      await logOutUser();
      setLoggedInAtom(false);
      loadCompromises();
    });
  }
  function onClickSignUp(): void {
    startTransition(async () => {
      await signUpWithGoogle();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          className="flex flex-row items-center cursor-pointer"
          data-testid="dropdown-menu-trigger"
        >
          <UserCircleIcon
            className="h-10 flex-shrink-0 dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
            aria-label="User profile"
          />
          <ChevronDownIcon
            className="flex-shrink-0 h-5"
            aria-label="User options"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{userName ?? "Anonymous user"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userName ? (
          <DropdownMenuItem onClick={onClickLogOut}>Log out</DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={onClickSignUp}>
            Sign in with Google
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
