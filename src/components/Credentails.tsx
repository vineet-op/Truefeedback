import React from 'react'
import { toast } from './ui/use-toast'

const Credentails = () => {
    return (
        <div className="flex items-center  w-fit">
            <p className="mb-2 text-red-500 text-pretty pr-5">Test Credentials</p>
            <div className="flex space-x-4">

                <p onClick={() => {
                    navigator.clipboard.writeText('SuperUsers'), toast({
                        title: "Copied to clipboard"
                    })
                }} className=" text-white text-center bg-neutral-950 cursor-pointer rounded-lg hover:bg-neutral-600">Click to copy Username</p>


                <button onClick={() => {
                    navigator.clipboard.writeText('123456789'), toast({
                        title: "Copied to clipboard"
                    })
                }} className=" text-white bg-neutral-900 cursor-pointer rounded-lg hover:bg-neutral-600"> Click to copy Password</button>

            </div>
        </div>
    )
}

export default Credentails