"use client"

import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schema/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ApiResponse } from '../../../../types/ApiResponse'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { ClipboardCopy, MessageSquare, RefreshCw } from "lucide-react"
import MessageCard from '@/components/MessageCard'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from 'next-auth'

const Page = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)

    const { toast } = useToast()

    const { data: session, status } = useSession()



    const handleDelete = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId))
    }


    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptedMessages = useCallback(async () => {
        setLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                variant: 'destructive',
                description: axiosError.response?.data.message || 'Failed to fetch message settings'
            })
        } finally {
            setLoading(false)
        }
    }, [setValue, toast])

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setLoading(true)
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            console.log(response.data.message);

            if (refresh) {
                toast({
                    title: 'Refreshed Messages',
                    description: 'Showing Latest Messages'
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                variant: 'destructive',
                description: axiosError.response?.data.message || 'Failed to fetch messages'
            })
        } finally {
            setIsSwitchLoading(false)
            setLoading(false)
        }
    }, [toast, setLoading, setMessages])

    useEffect(() => {
        if (status === 'authenticated') {
            fetchAcceptedMessages()
            fetchMessages()
        }
    }, [status, fetchAcceptedMessages, fetchMessages])

    if (status === 'loading') {
        return (
            <div className='flex flex-1 max-w-full h-screen items-center justify-center '>
                <span className="sr-only">Loading...</span>
            </div>
        )
    }

    if (status !== 'authenticated' || !session?.user) {
        console.error('Session or user is undefined')
        return (
            <div className='flex flex-1 text-center content-center'>
                <div>Error: Session or user is undefined</div>
            </div>
        )
    }

    const { username } = session.user as User

    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: 'URL Copied',
            description: 'Profile URL has been copied to clipboard'
        })
    }

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response.data.message,
                variant: 'default'
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: 'Error',
                variant: 'destructive',
                description: axiosError.response?.data.message || 'Failed to switch'
            })
        }
    }

    return (


        <main className="container mx-auto px-4 py-8 min-h-screen min-w-screen ">
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">User Dashboard</h2>
                <p className="text-muted-foreground">Manage your feedback and messages</p>
            </div>

            <div className="grid gap-8 md:grid-cols-12">
                {/* Sidebar */}
                <div className="md:col-span-4 lg:col-span-3">
                    <div className="space-y-6 rounded-lg border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        {/* User Info */}
                        <div className="text-center">
                            <Avatar className="mx-auto h-20 w-20">
                                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="User" />
                                <AvatarFallback className="text-xl">SU</AvatarFallback>
                            </Avatar>
                            <h3 className="mt-4 text-xl font-semibold">{username}</h3>
                            <p className="text-sm text-muted-foreground">Feedback Manager</p>
                        </div>

                        <Separator />

                        {/* Accept Messages Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="font-medium">Accept Messages</span>
                            <Switch
                                {...register('acceptMessages')}
                                checked={acceptMessages}
                                onCheckedChange={handleSwitchChange}
                                disabled={isSwitchLoading}
                                className="bg-slate-900"
                            />
                        </div>

                        <Separator />

                        {/* Unique Link */}
                        <div className="space-y-2">
                            <h3 className="font-semibold">Your Unique Link</h3>
                            <div className="space-y-2">
                                <div className="overflow-hidden rounded-md border bg-slate-50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800">

                                    <input
                                        type="text"
                                        value={profileUrl}
                                        disabled
                                        className="input input-bordered w-full p-2 mr-2"
                                    />
                                </div>
                                <Button
                                    onClick={copyToClipboard}
                                    variant="default"
                                    className="w-full bg-slate-900"
                                >
                                    <ClipboardCopy className="mr-2 h-4 w-4" />
                                    Copy Link
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="md:col-span-8 lg:col-span-9">
                    <div className="rounded-lg border bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <div className="flex items-center justify-between border-b p-4 dark:border-slate-800">
                            <h3 className="text-xl font-semibold">Messages</h3>
                            <Button variant="outline" size="icon" onClick={(e) => {
                                e.preventDefault();
                                fetchMessages(true)
                            }}>
                                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                            </Button>
                        </div>

                        <div className="p-4">
                            {messages.length > 0 ? (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <MessageCard
                                            key={message._id as string}
                                            message={message}
                                            onMessageDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
                                    <MessageSquare className="mb-2 h-10 w-10 text-muted-foreground opacity-20" />
                                    <p className="text-muted-foreground">No messages yet</p>
                                    <p className="text-xs text-muted-foreground">Share your link to receive feedback</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main >
    )
}

export default Page