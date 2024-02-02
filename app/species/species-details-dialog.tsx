"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Database } from "@/lib/schema";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesDetailsDialog({ species }: { species: Species }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Icons.add className="mr-3 h-5 w-5" />
          Add Species
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{species.scientific_name}</DialogTitle>
          {species.common_name && <DialogDescription>{species.common_name}</DialogDescription>}
          <DialogDescription>
            Add a new species here. Click &quot;Add Species&quot; below when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        {/* TODO: */}
      </DialogContent>
    </Dialog>
  );
}
