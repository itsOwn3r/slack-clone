"use client";
import { useCreateFirstWorkspaceModal } from "@/features/workspaces/store/stores";
import React, { useEffect } from "react";

const CreateWorkspace = () => {
  const [open, setOpen] = useCreateFirstWorkspaceModal();

  useEffect(() => {
    setOpen(true);
  }, [setOpen]);

  return <div></div>;
};

export default CreateWorkspace;
