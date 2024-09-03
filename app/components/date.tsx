import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import DatePickerContainer from "./datepicker";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  compromisesAtom,
  dateAtom,
  userIsLoggedInAtom,
} from "./compromise/compromiseAtom";
import { useEffect } from "react";
import { Compromise } from "./compromise/compromise";
import { Button } from "@/components/ui/button";

import { CompromiseDbFactory } from "@/lib/dbFactory";

export default function Date() {
  const [date, setDate] = useAtom(dateAtom);
  const userIsLoggedIn = useAtomValue(userIsLoggedInAtom);

  const setCompromises = useSetAtom(compromisesAtom);

  useEffect(() => {
    CompromiseDbFactory.getCompromiseDb(userIsLoggedIn)
      .getCompromisesForTheDate(date.toString())
      .then((res) => {
        setCompromises(res.map((x: any) => Compromise.fromPlainObject(x)));
      });
  }, [date, setCompromises, userIsLoggedIn]);

  return (
    <div className="flex flex-row justify-evenly p-1 gap-1">
      <div className="flex-grow">
        <DatePickerContainer value={date} onChange={setDate} />
      </div>
      <Button
        onClick={() => setDate(date.add({ days: -1 }))}
        className="inline-flex items-center bg-white text-sm/6 font-semibold text-primary focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white rounded-md border p-1 border-slate-200 shadow-md"
      >
        <ArrowLeftIcon className="h-8" />
      </Button>
      <Button
        onClick={() => setDate(date.add({ days: 1 }))}
        className="inline-flex items-center bg-white text-sm/6 font-semibold text-primary focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white rounded-md border p-1 border-slate-200 shadow-md"
      >
        <ArrowRightIcon className="h-8" />
      </Button>
    </div>
  );
}
