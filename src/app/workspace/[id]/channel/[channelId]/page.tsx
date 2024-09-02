import { auth } from '@/auth'
import db from '@/lib/db'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

const ChannelIdPage = async ({ params }: { params: { channelId: string } }) => {
    const user = await auth();

    if (!user) {
        return redirect("/auth");
    }

  return (
    <div>id: </div>
  )
}

export default ChannelIdPage;