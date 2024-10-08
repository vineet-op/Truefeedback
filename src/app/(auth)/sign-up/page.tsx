"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue, useDebounceCallback } from "usehooks-ts"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schema/signUpSchema"
import axios, { AxiosError } from "axios"
import { ApiResponse } from "../../../../types/ApiResponse"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';


export default function Signup() {


    const [username, setusername] = useState("");
    const [usernameMessage, setusernameMessage] = useState("");
    const [isCheckingUsername, setisCheckingUsername] = useState(false);
    const [isSubmitting, setisSubmitting] = useState(false)

    const debounced = useDebounceCallback(setusername, 300)

    const router = useRouter();
    const { toast } = useToast();


    //Zod Implementations

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        }
    })


    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debounced) {
                setisCheckingUsername(true);
                setusernameMessage("");

                try {

                    const respose = await axios.get(`/api/check-username-unique?username=${debounced}`)
                    setusernameMessage(respose.data.message)

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>
                    setusernameMessage(axiosError.response?.data.message ?? "Error While Checking Unique Username")


                }

                finally {
                    setisCheckingUsername(false)
                }
            }
        }

        checkUsernameUnique()

    }, [debounced])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setisSubmitting(true);

        try {
            const response = await axios.post<ApiResponse>("/api/sign-up", data)
            toast({
                title: "Success",
                description: response.data.message
            })
            router.replace(`verify/${username}`)
            setisSubmitting(false)
            console.log(data);

        } catch (error) {
            console.error("Error in Sign-up of User", error);
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Sign-Up Failed",
                description: errorMessage,
                variant: "destructive"
            })
            setisSubmitting(false)

        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            debounced(e.target.value);
                                            setusername(e.target.value)
                                        }}
                                    />
                                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                                    {!isCheckingUsername && usernameMessage && (
                                        <p
                                            className={`text-sm ${usernameMessage === 'Username is unique'
                                                ? 'text-green-500'
                                                : 'text-red-500'
                                                }`}
                                        >
                                            {usernameMessage}
                                        </p>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <Input {...field} name="email" />
                                    <p className=' text-black text-sm'>We will send you a verification code</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <Input type="password" {...field} name="password" />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className='w-full' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}


