
'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from "@/Files/Admin/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Files/Admin/ui/card";
import { Input } from "@/Files/Admin/ui/input";
import { Label } from "@/Files/Admin/ui/label";

const RegisterForm = () => {
  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password }),
      });

      const json = await response.json();
      

      if (json.success) {
        localStorage.setItem("token", json.authtoken);

        // Check if the registered user is admin
        if (json.user && json.user.roles === 'admin') {
          console.log('User is admin, redirecting to admin dashboard');
          router.push('/admin/admindashboard'); // Redirect to the admin dashboard route
        } else {
          console.log('User is not admin, no redirection needed');
          // Redirect to another page for regular users if needed
          router.push('/Student/studentdashboard');
        }
      } else {
        setError(json.message || "Registration failed");
        
      
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
    <Card className="mx-auto w-96 bg-indigo-500 border-none">
      <CardHeader>
        <CardTitle className="text-2xl text-white">Register</CardTitle>
        <CardDescription className="mt-4 text-white">Create a new account to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister}>
          
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                name="name"
                value={credentials.name}
                onChange={onChange}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                name="email"
                value={credentials.email}
                onChange={onChange}
                placeholder="Your email"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={credentials.password}
                onChange={onChange}
                placeholder="Your password"
              />
            </div>
          
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="text-white" onClick={() => router.push('/login')}>Cancel</Button>
         <Button variant="outline" className="text-white" type="submit" onClick={handleRegister} disabled={loading || credentials.name.length < 6 || credentials.password.length < 6}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </CardFooter>
    </Card>
    </div>
  );
}

export default RegisterForm;
