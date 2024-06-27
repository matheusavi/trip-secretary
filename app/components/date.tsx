import { Button } from "@headlessui/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import DatePickerContainer from "./datepicker";
import { useAtom, useSetAtom } from "jotai";
import { compromisesAtom, dateAtom } from "./compromise/compromiseAtom";
import { getCompromisesForTheDate } from "@/lib/server/appwrite";
import { useEffect } from "react";
import { Compromise } from "./compromise/compromise";

export default function Date() {
  const [date, setDate] = useAtom(dateAtom);

  const setCompromises = useSetAtom(compromisesAtom);

  useEffect(() => {
    getCompromisesForTheDate(date.toString()).then((res) => {
      setCompromises(res.map((x) => Compromise.fromPlainObject(x)));
    });
  }, [date, setCompromises]);

  return (
    <div className="flex flex-row justify-between grow-0">
      <div className="flex-grow">
        <DatePickerContainer value={date} onChange={setDate} />
      </div>
      <Button
        onClick={() => setDate(date.add({ days: -1 }))}
        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
      >
        <ArrowLeftIcon className="h-8" />
      </Button>
      <Button
        onClick={() => setDate(date.add({ days: 1 }))}
        className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
      >
        <ArrowRightIcon className="h-8" />
      </Button>
    </div>
  );
}
