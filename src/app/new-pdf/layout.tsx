import Link from 'next/link'
import React from 'react'
import NavBar from '../components/NavBar'

export default function HomeLayout({children}:{children:React.ReactNode}) {
  return (
    <div className='px-6 my-3'>
      {children}
    </div>
  )
}
