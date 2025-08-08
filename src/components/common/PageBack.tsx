'use client';
import { useRouter } from 'next/navigation';
import React from 'react'
import { IoArrowBack } from "react-icons/io5";


const PageBack = () => {

    const router = useRouter();

    return (
        <button onClick={() => router.back()} className='flex gap-x-2 items-center bg-slate-300 px-4 py-2 rounded shadow text-slate-800 font-bold cursor-pointer'>
            <IoArrowBack />
            Back
        </button>
    )
}

export default PageBack