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

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar).map(msg => msg.trim()); // Split and trim any extra spaces
};

export default function SendMessage() {
    const [aiMessages, setAiMessages] = useState("");
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
            const response = await axios.post<string>('/api/suggest-messages');
            setAiMessages(response.data);
            setMessageLoading(false);
        } catch (error) {
            console.error('Error fetching messages:', error);
            toast({
                description: "Error While Suggesting Message",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl h-screen">
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
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading || !messageContent}>
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>

            <Button onClick={fetchSuggestedMessages}>
                Suggest Messages
            </Button>

            {MessageLoading ? (
                <div className="border border-blue-300 shadow rounded-md p-4 mt-10 max-w-md w-full mx-auto">
                    <div className="animate-pulse flex space-x-4">
                        <div className="flex-1 space-y-6 py-1">
                            {/* Increase height of the first skeleton bar */}
                            <div className="h-4 bg-slate-700 rounded"></div>
                            <div className="space-y-3">
                                <div className="grid grid-cols-3 gap-4">
                                    {/* Increase height of the second and third skeleton bars */}
                                    <div className="h-4 bg-slate-700 rounded col-span-2"></div>
                                    <div className="h-4 bg-slate-700 rounded col-span-1"></div>
                                </div>
                                {/* Increase height of the last skeleton bar */}
                                <div className="h-4 bg-slate-700 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>

            ) :
                <div className="flex flex-1 justify-center items-center mt-10">
                    {/* <h2 className="text-xl font-semibold mb-2">Messages:</h2> */}
                    <p className="whitespace-pre-wrap text-lg">{aiMessages}</p>
                </div >
            }
        </div >
    );
}
