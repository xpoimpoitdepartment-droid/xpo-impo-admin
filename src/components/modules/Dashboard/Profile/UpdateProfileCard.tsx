'use client';
import ProfileForm from "@/components/forms/ProfileForm";
import { ReusableDialog } from "@/components/shared/ReusableDialog";
import { Button } from "@/components/ui/button";
import { SquarePen } from "lucide-react";
import React, { useState } from "react";

const UpdateProfileCard = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6">
      <div className="flex justify-between">
        <h2 className="font-bold opacity-80 text-lg">Profile Update</h2>
        <ReusableDialog
          trigger={
            <Button
              variant="outline"
              className="flex items-center gap-2 opacity-60"
            >
              <SquarePen />
              Edit
            </Button>
          }
          contentClassName="max-h-[500px] xl:max-h-[800px] overflow-y-scroll
              w-11/12 max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl"
        >
          <ProfileForm mode="edit" onClose={() => setIsEditDialogOpen(false)} />
        </ReusableDialog>
      </div>
      <ProfileForm mode="view" />
    </div>
  );
};

export default UpdateProfileCard;
