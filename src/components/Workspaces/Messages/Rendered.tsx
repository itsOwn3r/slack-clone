"use client";
import { useState, useEffect, useRef } from 'react';
import Quill from 'quill'


const Rendered = ({ value }: { value: string }) => {

    const [isEmpty, setIsEmpty] = useState(false);

    const rendererRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        
        if(!rendererRef.current) return;

        const container = rendererRef.current;

        const quil = new Quill(document.createElement("div"), {
            theme: "snow"
        })

        quil.enable(false);

        const content = JSON.parse(value);

        quil.setContents(content);

        const isEmpty = quil.getText().replace(/<(.|\n)*?>/g, "").trim().length === 0;
        setIsEmpty(isEmpty);

        container.innerHTML = quil.root.innerHTML;

        return () => {
            if (container) {
                container.innerHTML = "";
            }
        }
    }, [value])

    if(isEmpty) return null;



  return (
    <div ref={rendererRef} className='ql-editor ql-renderer' />
  )
}

export default Rendered