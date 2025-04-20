'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schema/messageSchema';
import { ApiResponse } from '../../../../types/ApiResponse';
import { CardHeader, CardContent, Card } from '@/components/ui/card';


const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar).map(msg => msg.trim()); // Split and trim any extra spaces
};

export default function SendMessage() {
    const [aiMessages, setAiMessages] = useState<string[]>([]);
    const [MessageLoading, setMessageLoading] = useState(false);

    const params = useParams<{ username: string }>();
    const username = params.username;

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
    });

    const messageContent = form.watch('content');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/send-messages', {
                username,
                ...data,
            });
            toast({
                title: response.data.message,
                variant: 'default',
            });
            form.reset({ ...form.getValues(), content: '' });
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast({
                title: 'Error',
                description:
                    axiosError.response?.data.message ?? 'Failed to send message',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSuggestedMessages = async () => {
        try {
            setMessageLoading(true);
            const response = await axios.post('/api/suggest-messages');
            const messageString = response.data.message;
            const parsedMessages = parseStringMessages(messageString);
            setAiMessages(parsedMessages);
            setMessageLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast({
                description: "Error While Suggesting Message",
                variant: "destructive",
            });
        }
    };

    const handleMessageClick = (message: string) => {
        form.setValue('content', message);
    };


    return (
        <div className="container mx-auto my-8 p-6 relative bg-white rounded max-w-4xl h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Profile Link
            </h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center w-full">
                        {isLoading ? (
                            <Button className='w-full' disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button className='w-full' type="submit" disabled={isLoading || !messageContent}>
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <div className="space-y-4 my-8 mt-10">
                <Card className="dark:bg-black border-none">
                    <CardHeader className="text-center text-2xl font-semibold">
                        Click on any message below to select it.
                    </CardHeader>
                    <CardContent className="flex flex-col space-y-2 max-sm:space-y-4">

                        {aiMessages.length > 0 ? (
                            aiMessages.map((message, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    className='w-full text-wrap max-sm:h-16'
                                    onClick={() => handleMessageClick(message)}
                                >
                                    {message}
                                </Button>
                            ))
                        ) : (
                            <p className="text-gray-500">No messages available. Try suggesting some!</p>
                        )}
                    </CardContent>
                </Card>
                <div className="space-y-2 w-full">
                    {isLoading ? (
                        <Button disabled className="my-4 w-full text-white bg-blue-700 hover:bg-blue-800">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Suggesting
                        </Button>
                    ) : (
                        <Button
                            onClick={fetchSuggestedMessages}
                            className="my-4 w-full text-white bg-blue-700 hover:bg-blue-800"
                            disabled={isLoading}
                        >
                            Suggest Messages
                        </Button>
                    )}
                </div>
            </div>

            <div className='w-full absolute overflow-hidden sm:bottom-5 mx-auto flex justify-center text-center'>
                <div className='font-medium text-base align-text-bottom underline'>
                    <a href="https://X.com/Vineet2OP" target="_blank" rel="noopener noreferrer" className='text-blue-500 hover:text-blue-700'>
                        Made with 💖 By Vineet
                    </a>
                </div>
            </div>
        </div>
    );
}
