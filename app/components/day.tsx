type HourProps = {
  day: number;
};

export default function Hour({ day: hour }: HourProps) {
  return (
    <div
      className="bg-slate-400 col-span-1 col-start-1 col-end-1 w-8"
      data-testid={"hour-" + hour}
    >
      {hour}
    </div>
  );
}
