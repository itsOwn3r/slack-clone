import Hint from '@/components/hint'
import { Button } from '@/components/ui/button'
import { MessageSquareTextIcon, Pencil, Smile, TrashIcon } from 'lucide-react'
import React from 'react'

const Toolbar = ({ isAuthor, isPending, handleEdit, handleDelete }: { isAuthor: boolean, isPending: boolean, handleEdit: () => void, handleDelete: () => void }) => {
  return (
    <div className='absolute top-0 right-5'>
        <div className='group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm'>

            <Hint label='Reaction'>
                <Button variant="ghost" size="iconSm" disabled={isPending}>
                    <Smile className='size-4' />
                </Button>
            </Hint>
            
            <Hint label='Thread'>
                <Button variant="ghost" size="iconSm" disabled={isPending}>
                    <MessageSquareTextIcon className='size-4' />
                </Button>
            </Hint>

            {isAuthor && (
                <>
                <Hint label='Edit Message'>
                    <Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleEdit}>
                        <Pencil className='size-4' />
                    </Button>
                </Hint>

                <Hint label='Delete Message'>
                    <Button variant="ghost" size="iconSm" disabled={isPending} onClick={handleDelete}>
                        <TrashIcon className='size-4' />
                    </Button>
                </Hint>
                </>
            )}
        </div>
    </div>
  )
}

export default Toolbar