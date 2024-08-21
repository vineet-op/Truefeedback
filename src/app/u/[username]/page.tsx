"use client"
import { useParams } from 'next/navigation'
import React from 'react'

function page() {

    const params = useParams()
    const username = params.username


    return (
        <div>Userpage {username}</div>
    )
}

export default page