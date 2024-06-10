import { ChevronDownIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function Header() {
    return (
        <header className="flex flex-row w-full justify-center py-2 bg-black border-slate-800 border-b-2">
            <div className="flex justify-between flex-row gap-2 max-w-7xl flex-1 items-center">
                <Image
                    className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
                    src="/logo.svg"
                    alt="Trip secretary Logo"
                    width={60}
                    height={60}
                    priority
                />
                <h2 className="text-3xl font-bold">
                    Trip Secretary
                </h2>
                <div className="flex flex-row items-center cursor-pointer">
                    <UserCircleIcon className="h-10 flex-shrink-0 dark:drop-shadow-[0_0_0.3rem_#ffffff70]" />
                    <ChevronDownIcon className="flex-shrink-0 h-5" />
                </div>
            </div>
        </header>
    )
}