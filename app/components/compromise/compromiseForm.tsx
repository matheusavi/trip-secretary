import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NumericFormat } from "react-number-format";
import { Dispatch, SetStateAction, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { createCompromiseAtom, dateAtom } from "./compromiseAtom";
import { Input } from "@/components/ui/input";

interface CompromiseFormProps extends React.ComponentProps<"form"> {
  location: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CompromiseForm({
  className,
  location,
  setOpen,
}: CompromiseFormProps) {
  const date = useAtomValue(dateAtom);

  const [plan, setPlan] = useState("");
  const [costs, setCosts] = useState(0);

  const createCompromise = useSetAtom(createCompromiseAtom);
  function handleCreateCompromise() {
    createCompromise({
      plan: plan,
      costs: costs,
      date: date.toString(),
      location: location,
    });
    setOpen(false);
  }

  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="plan">Plan</Label>
        <Textarea
          id="plan"
          placeholder="Put your plan details here"
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="costs">Costs</Label>
        <NumericFormat
          id="costs"
          value={costs}
          onValueChange={(e) => setCosts(e.floatValue || 0)}
          prefix="$"
          customInput={Input}
        />
      </div>
      <Button type="button" onClick={handleCreateCompromise}>
        Save changes
      </Button>
    </form>
  );
}
