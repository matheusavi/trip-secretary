import { slotHeight } from "@/app/constants/constants";

type HourProps = {
  hour: number;
};

export default function Hour({ hour: hour }: HourProps) {
  const displayHour = hour.toString().padStart(2, "0") + ":00";
  return (
    <div
      className="bg-white col-span-1 col-start-1 col-end-1 text-xs px-2"
      data-testid={"hour-" + hour}
      style={{ height: `${slotHeight}rem` }}
    >
      {displayHour}
    </div>
  );
}
