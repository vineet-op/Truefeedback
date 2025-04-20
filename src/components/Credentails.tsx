import React from 'react'
import { toast } from './ui/use-toast'
import { Button } from './ui/button'
import { ClipboardCopy, Lock, Mail } from "lucide-react"

const Credentails = () => {

    const testCredentials = {
        username: "SuperUsers",
        password: "123456789",
    }

    const copyToClipboard = (text: string, type: string) => {
        navigator.clipboard.writeText(text)
        toast({
            title: "Copied to clipboard",
            description: `${type} has been copied to your clipboard.`,
            duration: 2000,
        })
    }



    return (
        <div className="mb-6 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
            <div className="mb-2 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
                Test Credentials
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-between gap-2 text-xs"
                    onClick={() => copyToClipboard(testCredentials.username, "Username")}
                >
                    <span className="truncate">{testCredentials.username}</span>
                    <ClipboardCopy className="h-3.5 w-3.5 flex-shrink-0" />
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 justify-between gap-2 text-xs"
                    onClick={() => copyToClipboard(testCredentials.password, "Password")}
                >
                    <span>{testCredentials.password}</span>
                    <ClipboardCopy className="h-3.5 w-3.5 flex-shrink-0" />
                </Button>
            </div>
        </div>
    )
}

export default Credentails