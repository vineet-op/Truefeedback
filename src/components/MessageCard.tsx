import React from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/User'
import { useToast } from './ui/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '../../types/ApiResponse'
import dayjs from "dayjs"



type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void

}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {


    const { toast } = useToast()

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`)
            toast({
                title: response.data.message
            })

            onMessageDelete(message._id as string);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }

    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{message.content}</CardTitle>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <div className='flex justify-end items-center'>
                            <Button variant='destructive'>
                                <X className="size-8" />
                            </Button>
                        </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                your Message from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm} >Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <CardDescription>{dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}</CardDescription>
            </CardHeader>
        </Card>

    )
}

export default MessageCard
