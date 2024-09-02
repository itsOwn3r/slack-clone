import React from 'react'

const WorkspacePage = ({ params }: { params: { id: string } }) => {
  return (
    <div>id: {params.id}</div>
  )
}

export default WorkspacePage