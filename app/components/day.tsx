type DayProps = {
  day: number;
};

export default function Day({ day }: DayProps) {
  return (
    <div className="bg-slate-400 col-span-1 col-start-1 col-end-1 w-8">
      {day}
    </div>
  );
}
