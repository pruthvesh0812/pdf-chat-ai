"use server"

import Link from 'next/link';
import { initUser } from '../../utils/initUser';
import React from 'react';

const useAuthStatus = () => {
  const isLoggedIn: boolean = React.use(initUser());
  return isLoggedIn
};

export default async function UserStatus() {
  const isLoggedIn = useAuthStatus();
  return (
    <div>
      {
        (!isLoggedIn) ?
          <div>
            <Link href="/login" className='text-slate-100 font-semibold px-3 py-1 bg-transparent border border-blue-200 rounded hover:bg-blue-200 hover:text-[#16183b] '>login</Link>
          </div> :
          <div>
            <Link href="/login" className='text-slate-100 font-semibold px-3 py-1 bg-transparent border border-blue-200 rounded hover:bg-blue-200 hover:text-[#16183b] '>sign out</Link>
          </div>
      }
    </div>)
}