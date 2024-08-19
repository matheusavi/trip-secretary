import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CompromiseForm({
  className,
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="plan">Plan</Label>
        <Input type="text" id="plan" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cost">Cost</Label>
        <Input id="cost" defaultValue="" />
      </div>
      <Button type="submit">Save changes</Button>
    </form>
  );
}
