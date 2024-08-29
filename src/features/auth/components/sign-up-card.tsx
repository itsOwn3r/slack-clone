import React, { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from 'react-icons/fa';
import { SignInFlow } from '../types';
import { useRouter } from 'next/navigation';
import { TriangleAlert } from 'lucide-react';
import { SignupSchema } from '@/types/Schema';
import { signIn } from 'next-auth/react';

interface SignUpCardProps {
    setState: (state: SignInFlow) => void
}

const SignUpCard = ({ setState }: SignUpCardProps) => {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
    
  const [isLoading, setIsLoding] = useState(false);

  const router = useRouter();

  
  const signupHander = async (e: FormEvent) => {

    e.preventDefault();
    try {
        setIsLoding(true);
        setError("");

        if(confirmPassword !== password){
            setError("Passwords do not match!");
            return;
        }

        const validateForm = SignupSchema.safeParse({
            name,
            email,
            password
        })
                
        if (!validateForm.success) {
            setError(validateForm.error.issues[0].message);
            return;
        }
        
        const signUp = await fetch("/api/signup", {
            method: "POST",
            body: JSON.stringify({ name, email, password })
        })

        const data = await signUp.json();

        if (data.success) {
            // router.push("/account");
            const res = await signIn("credentials", { email, password, redirect: false });

            if (res?.error) {
                setError(res?.error);
            } else {
                router.push("/account");
            }
            
        } else {
            setError(data.message);
        }
        
    } catch (error) {
        setError((error as Error).message);
    } finally {
        setIsLoding(false);
    }
}   
  
  return (
    <Card className='w-full h-full p-8'>
        <CardHeader className='px-0 pt-0'>
            <CardTitle>
                Sign up to continue
            </CardTitle>
        <CardDescription>
            Use your email or another service to continue
        </CardDescription>
        </CardHeader>
        {!!error && (
            <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
                <TriangleAlert className='size-4' />
                <p>{error}</p>
            </div>
        )}
        <CardContent className='space-y-5 px-0 pb-0'>

            <form onSubmit={signupHander} className='space-y-2.5'>
                <Input className='' disabled={isLoading} value={name} onChange={(e) => setName(e.target.value)} placeholder='Name' type='text' required />
                <Input className='' disabled={isLoading} value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' type='email' required />
                <Input className='' disabled={isLoading} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' type='password' required />
                <Input className='' disabled={isLoading} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Confirm password' type='password' required />

                <Button className='w-full' size="lg" type='submit' disabled={isLoading}>Continue</Button>
            </form>

            <Separator />

            <div className="flex flex-col gap-y-2.5">

                <Button disabled={isLoading} onClick={() => {}} variant="outline" size="lg" className='w-full relative'>
                    <FcGoogle className='size-5 absolute left-3 top-2.5' /> Continue with Google
                </Button>

                <Button disabled={isLoading} onClick={() => {}} variant="outline" size="lg" className='w-full relative'>
                    <FaGithub className='size-5 absolute left-3 top-2.5' /> Continue with GitHub
                </Button>

            </div>

            <p className='text-xs text-muted-foreground'>
                Already have an account? <span className='cursor-pointer font-bold text-sky-700 hover:underline' onClick={() => setState("signIn")}>Sign In</span>
            </p>

        </CardContent>
    </Card>
  )
}

export default SignUpCard;