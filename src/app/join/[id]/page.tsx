"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import VerificationInput from "react-verification-input";
import { toast } from 'sonner';

const JoinWorkspacePage = ({ params }: { params: { id: string } }) => {

    const [joinCode, setJoinCode] = useState("");

    const router = useRouter();

  const joinHandler = async () => {
    if (joinCode.length !== 5) {
        toast.error("Enter the code please!");
        return;
    }

    try {

        const join = await fetch("/api/workspace/join", {
            method: "POST",
            body: JSON.stringify({ id: params.id, joinCode })
        })

        const response = await join.json();

        console.log(response);

        if (response.success) {
            toast.success(response.message, {
                className: "text-lg",
                duration: 4000
            })

            router.replace(`/workspace/${response.workspaceId}`);
        } else {
            toast.error(response.message, {
                className: "text-lg",
                duration: 4000            
            })
        }        
    } catch (error) {
        toast.error("Something Went Wrong!", {
                className: "text-lg",
                duration: 4000
        }
        )
    }
  }
    return (
    <div className='h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md'>
        <Image className='rounded-md' src="/car.jpg" width={175} height={175} alt='Workspace logo' />
        <div className="flex flex-col gap-y-4 items-center justify-center max-w-md">
            <div className='flex flex-col gap-y-2 items-center justify-center'>
                <h1 className='text-2xl font-bold'>Join Workspace</h1>
                <p className='text-lg text-muted-foreground'>Enter the workspace code to join</p>
            </div>
            <VerificationInput onChange={setJoinCode} onBlur={joinHandler} length={5} classNames={{
                container: "flex gap-x-2",
                character: "uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500",
                characterInactive: "bg-muted",
                characterFilled: "bg-white text-black"
            }}
            autoFocus
            />
        </div>

        <div className='flex gap-x-4'>
            <Button size="lg" variant="outline" asChild>
                <Link href="/">Back to Home</Link>
            </Button>
        </div>
    </div>
  )
}

export default JoinWorkspacePage;