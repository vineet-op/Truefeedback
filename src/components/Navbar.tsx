"use client"

import React from 'react'
import Link from 'next/link'
import { User } from 'next-auth'
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';





export default function Navbar() {

    const { data: session } = useSession()
    const user: User = session?.user as User;


    const onLogout = () => {
        signOut({ callbackUrl: 'http://localhost:3000' });
    };

    return (
        <nav>
            <div className='flex flex-1 justify-between flex-row  w-full bg-gray-900'>
                <a href="#" className='p-4 m-2 text-center bg-gray-900 text-lg pl-5 text-white font-semibold'>True Feedback</a>
                {
                    session ? (
                        <>
                            <div className='flex justify-center bg-gray-900 items-center  text-white text-lg'>
                                <span> Welcome  {user?.username || user?.email}</span>
                            </div>
                            <div className='flex justify-center items-center bg-gray-900'>
                                <Button className='bg-gray-900 text-xl ' onClick={() => onLogout()} >Logout</Button>
                            </div>
                        </>
                    ) : (
                        <Link href="/sign-up">
                            <Button className='m-4 bg-gray-900'  >
                                Login
                            </Button>
                        </Link>
                    )
                }
            </div>
        </nav>
    )
}

