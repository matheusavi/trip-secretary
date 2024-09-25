import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/16/solid";
import DatePickerContainer from "./datepicker";
import { useAtom, useSetAtom } from "jotai";
import {
  dateAtom,
  loadCompromiseFromDateAtom,
} from "./compromise/compromiseAtom";
import { Button } from "@/components/ui/button";
import { CalendarDate } from "@internationalized/date";

export default function Date() {
  const [date, setDate] = useAtom(dateAtom);
  const loadCompromises = useSetAtom(loadCompromiseFromDateAtom);
  function onChangeDate(value: CalendarDate) {
    setDate(value);
    loadCompromises();
  }
  return (
    <div className="flex flex-row justify-evenly p-1 gap-1">
      <div className="flex-grow">
        <DatePickerContainer value={date} onChange={onChangeDate} />
      </div>
      <Button
        onClick={() => onChangeDate(date.add({ days: -1 }))}
        className="inline-flex items-center bg-white text-sm/6 font-semibold text-primary focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white rounded-md border p-1 border-slate-200 shadow-md"
      >
        <ArrowLeftIcon className="h-8" />
      </Button>
      <Button
        onClick={() => onChangeDate(date.add({ days: 1 }))}
        className="inline-flex items-center bg-white text-sm/6 font-semibold text-primary focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white rounded-md border p-1 border-slate-200 shadow-md"
      >
        <ArrowRightIcon className="h-8" />
      </Button>
    </div>
  );
}
