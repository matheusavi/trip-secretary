import { useMemo } from "react";

type HourProps = {
  hour: number;
};

export default function Hour({ hour: hour }: HourProps) {
  const displayHour = useMemo(() => {
    return hour.toString().padStart(2, "0") + ":00";
  }, [hour]);
  return (
    <div
      className="bg-white col-span-1 col-start-1 col-end-1 border-r-2 text-xs h-11"
      data-testid={"hour-" + hour}
    >
      {displayHour}
    </div>
  );
}