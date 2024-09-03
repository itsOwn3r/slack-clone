import React from 'react';
import { auth } from '@/auth';
import db from '@/lib/db';
import { notFound, redirect } from 'next/navigation';

const WorkspacePage = async ({ params }: { params: { id: string } }) => {

    const user = await auth();

    if (!user) {
        return redirect("/auth");
    }

    const workspace = await db.workspaces.findUnique({
        where: {
            id: params.id,
            OR: [
                  {
                    userId: user.user.id
                  },
                  {
                    Members: {
                      some: { userId: user.user.id }
                  }
              }
            ]
        }
    })

    if (!workspace) {
        return notFound();
    }


  return (
    <div>id: {workspace?.name}</div>
  )
}

export default WorkspacePage;