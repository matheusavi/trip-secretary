import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { NumericFormat } from "react-number-format";
import { Dispatch, SetStateAction, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import {
  createCompromiseAtom,
  dateAtom,
  modifyCompromiseAtom,
} from "./compromiseAtom";
import { Input } from "@/components/ui/input";
import { Compromise } from "./compromise";

interface CompromiseFormProps extends React.ComponentProps<"form"> {
  location: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
  /** When set, the form edits (or views) this compromise instead of creating a new one. */
  compromise?: Compromise;
  /** Render the fields read-only and hide the save button. */
  readOnly?: boolean;
}

export default function CompromiseForm({
  className,
  location,
  setOpen,
  compromise,
  readOnly = false,
}: CompromiseFormProps) {
  const date = useAtomValue(dateAtom);

  const [plan, setPlan] = useState(compromise?.plan ?? "");
  const [costs, setCosts] = useState(compromise?.costs ?? 0);

  const createCompromise = useSetAtom(createCompromiseAtom);
  const modifyCompromise = useSetAtom(modifyCompromiseAtom);

  function handleSaveCompromise() {
    if (compromise) {
      modifyCompromise({
        id: compromise.id,
        update: { plan: plan, costs: costs },
      });
    } else {
      createCompromise({
        plan: plan,
        costs: costs,
        date: date.toString(),
        location: location,
      });
    }
    setOpen(false);
  }

  return (
    <form
      className={cn("grid items-start gap-4", className)}
      data-testid={"form-" + location}
    >
      <div className="grid gap-2">
        <Label htmlFor="plan">Plan</Label>
        <Textarea
          id="plan"
          placeholder={readOnly ? undefined : "Put your plan details here"}
          name="plan"
          value={plan}
          readOnly={readOnly}
          onChange={(e) => setPlan(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="costs">Costs</Label>
        <NumericFormat
          id="costs"
          value={costs}
          readOnly={readOnly}
          onValueChange={(e) => setCosts(e.floatValue || 0)}
          prefix="$"
          customInput={Input}
        />
      </div>
      {!readOnly && (
        <Button type="button" onClick={handleSaveCompromise}>
          Save changes
        </Button>
      )}
    </form>
  );
}
