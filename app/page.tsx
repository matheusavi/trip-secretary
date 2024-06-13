import { Checkbox, Input } from "@headlessui/react";
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from "@heroicons/react/24/solid";

type DayProps = {
  day: number
}

function Day({ day }: DayProps) {
  return (
    <div className="bg-slate-400 col-span-1 col-start-1 col-end-1 w-8">
      {day}
    </div>
  );
}

function CompromiseContainer() {
  return (
    <div className="bg-blue-400 p-1 space-x-1 row-start-1 col-start-2 col-end-2 flex flex-row">
      <Input placeholder="Day plan" className="grow-[12] w-1" />
      <Input placeholder="Costs" className="shrink grow-[1] w-1" />
      <Checkbox checked={true} className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500">
        <svg className="stroke-white opacity-0 group-data-[checked]:opacity-100" viewBox="0 0 14 14" fill="none">
          <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Checkbox>
    </div>
  );
}

export default function Home() {
  const days = Array.from(Array(25).keys()).slice(1);

  return (
    <main className="flex flex-row w-full justify-center">
      <div className="container bg-slate-600">
        <div className="flex flex-row flex-nowrap justify-between">
          <h1 className="flex-grow">Trip to Monza - 01/06/2024</h1>
          <div className="h-8 flex flex-row justify-between grow-0">
            <ArrowLeftCircleIcon />
            <ArrowRightCircleIcon />
          </div>
        </div>
        <div className="bg-white w-full h-full text-black grid grid-cols-[0.01fr_auto] gap-1">
          {
            days.map((item, index) => (
              <Day key={index} day={item} />
            ))
          }
          <CompromiseContainer />
        </div>
      </div>
    </main>
  );
}
