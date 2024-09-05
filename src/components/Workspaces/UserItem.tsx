"use client";
import { LucideIcon } from 'lucide-react'
import React from 'react'
import { IconType } from 'react-icons/lib'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const userItemVariants = cva(
    "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
    {
        variants: {
            variant: {
                default: "text-[#f9edffcc]",
                active: "text-[#481349] bg-white/90 hover:bg-white/90"
            },
        },
        defaultVariants: {
            variant: "default"
        }
    },
)

const UserItem = ({ label = "Member", id, variant, image }: { image?: string, label?: string, id: number, variant?: VariantProps<typeof userItemVariants>["variant"] }) => {
    const workspaceId = useParams();

    const avatarFallback = label.charAt(0).toUpperCase();

    return (
    <Button size='sm' variant="transparent" className={cn(userItemVariants({ variant: variant }))} asChild>
        <Link href={`/workspace/${workspaceId.id}/member/${id}`}>
            <Avatar className='size-5 rounded-md mr-1'>
                <AvatarImage className='rounded-md' src={"/images/124599.jpg"} />
                <AvatarFallback className='rounded-md text-white bg-sky-500 text-sm'>
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>
            <span className='text-sm truncate'>{label}</span>
        </Link>
    </Button>
  )
}

export default UserItem;