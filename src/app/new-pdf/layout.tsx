import Link from 'next/link'
import React from 'react'

export default function HomeLayout({children}:{children:React.ReactNode}) {
  return (
    <div className='px-6 my-3'>
      <div className='w-full flex justify-between items-center'>
        <h1>PdfChat.ai</h1>
        <Link href="/login" className='text-slate-100 font-semibold px-3 py-1 bg-transparent border border-blue-200 rounded hover:bg-blue-200 hover:text-[#16183b] '>login</Link>
      </div>
      {children}
    </div>
  )
}
