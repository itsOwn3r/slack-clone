"use client";
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
    </>
  )
}

export default Modals