import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function Feedback() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Feedback</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] flex flex-col items-center">
        <DialogHeader className="flex items-center">
          <DialogTitle>Leave Feedback</DialogTitle>
          <DialogDescription className="text-center">
            We'd love to know what went well or how we can improve the product
            experience.
          </DialogDescription>
        </DialogHeader>
        <Textarea />
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
