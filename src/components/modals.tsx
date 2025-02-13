"use client";
import CreateFirstWorkspaceModal from '@/features/workspaces/components/create-first-workspace-modal';
import CreateWorkspaceModal from '@/features/workspaces/components/create-workspace-modal';
import React, { useEffect, useState } from 'react'

const Modals = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    },[])

    if (!isMounted) {
        return null;
    }
  return (
    <>
        <CreateWorkspaceModal />
        <CreateFirstWorkspaceModal />
    </>
  )
}

export default Modals