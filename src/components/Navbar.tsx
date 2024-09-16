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
        signOut({ callbackUrl: 'http://localhost:3000/sign-in' });
    };

    return (
        <nav>
            <div className='flex flex-1 justify-between flex-row  bg-gray-800 '>
                <a href="#" className=' m-4 text-center text-white font-semibold'>True Feedback</a>
                {
                    session ? (
                        <>
                            <span> Welcome{user?.username || user?.email}</span>
                            <Button onClick={() => onLogout()} >Logout</Button>
                        </>
                    ) : (
                        <Link href="/sign-up">
                            <Button className='m-4'>
                                Login
                            </Button>
                        </Link>
                    )
                }
            </div>
        </nav >
    )
}

