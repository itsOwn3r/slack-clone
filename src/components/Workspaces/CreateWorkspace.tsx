"use client";
import { useCreateFirstWorkspaceModal, useCreateWorkspaceModal } from '@/features/workspaces/store/stores';
import React, { useEffect } from 'react'

const CreateWorkspace = () => {
      const [open, setOpen] = useCreateFirstWorkspaceModal();
  console.log(open);

  useEffect(() => {
    setOpen(true)
  },[setOpen])
  
  return (
    <div ></div>
  )
}

export default CreateWorkspace