"use client"

import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schema/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { Axios, AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ApiResponse } from '../../../../types/ApiResponse'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { User } from 'next-auth';
import { Separator } from '@/components/ui/separator'
import { Loader2, RefreshCcw } from 'lucide-react'
import MessageCard from '@/components/MessageCard'


const page = () => {

    const [Messages, setMessages] = useState<Message[]>([])
    const [Loading, SetLoading] = useState(false)
    const [isSwitchLoading, SetisSwitchLoading] = useState(false)

    const { toast } = useToast()

    const HandleDelete = (messageId: string) => {
        setMessages(Messages.filter((message) => message._id != messageId))
    }

    const { data: session } = useSession()
    console.log(session);



    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form;

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptedMessages = useCallback(
        async () => {
            SetLoading(true)
            try {
                const response = await axios.get<ApiResponse>('/api/accept-messages')
                setValue("acceptMessages", response.data.isAcceptingMessage)


            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>
                toast({
                    title: "Error",
                    variant: "destructive",
                    description: axiosError.response?.data.message || "Failed to fetch message settings"
                })
            }

            finally {
                SetLoading(false)
            }
        },

        [setValue]
    )

    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        SetLoading(true)
        SetisSwitchLoading(false)
        try {

            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])

            if (refresh) {
                toast({
                    title: "Refreshed Messages",
                    description: "Showing Latest Messages"
                })
            }

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                variant: "destructive",
                description: axiosError.response?.data.message || "Failed to fetch message settings"
            })
        }

        finally {
            SetisSwitchLoading(true)
            SetLoading(false)
        }
    }, [SetLoading, setMessages])

    useEffect(() => {
        if (!session || !session?.user) return;
        fetchAcceptedMessages();
        fetchMessages()

    }, [fetchAcceptedMessages, fetchMessages, session, setValue])


    //Handle Switch Change
    const HandleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>("/api/accept-messages", {
                acceptMessages: !acceptMessages
            })
            setValue('acceptMessages', !acceptMessages)
            toast({
                title: response.data.message,
                variant: "destructive"
            })

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                variant: "destructive",
                description: axiosError.response?.data.message || "Failed to Switch"
            })
        }
    }

    const { username } = session?.user as User
    console.log(username);

    const baseUrl = `${window.location.protocol}//${window.location.host}`
    const profileUrl = `${baseUrl}/u/${username}`

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "URL Copied",
            description: "Profile URL has been copied to clipboard"
        })
    }

    if (!session || !session.user) {
        return <div>
            Please Login
        </div>
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={HandleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {Loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {Messages.length > 0 ? (
                    Messages.map((message, index) => (
                        <MessageCard
                            key={message._id as string}
                            message={message}
                            onMessageDelete={HandleDelete}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    )
}

export default page
