// components/LoginForm.js

'use client'


import React, { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Files/Admin/ui/card";
import { Button } from "@/Files/Admin/ui/button";
import { Input } from "@/Files/Admin/ui/input";
import { Label } from "@/Files/Admin/ui/label";



const LoginForm = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset error state

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/student/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      const json = await response.json();
      

      if (json.success) {
        localStorage.setItem("token", json.authtoken);

        // Redirect to admin home page
        if (json.user && json.user.roles === 'admin') {
          router.push('/admin/admindashboard'); // Redirect to the admin dashboard route
        } else {
          // Redirect to another page for regular users if needed
          router.push('/Student/studentdashboard');
        }
      } else {
        setError(json.message || "Login failed");
        
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred during login. Please try again.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className='flex justify-center items-center min-h-screen'>
      <Card className="mx-auto w-96 bg-indigo-500 border-none" >
        <CardHeader>
          <CardTitle className="text-2xl text-white" >Login</CardTitle>
          
          <CardDescription className="mt-4 text-white">Enter your credentials below</CardDescription>
          
          
        </CardHeader>
        <CardContent>
          

          
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleLogin}>
            <div className="flex flex-col space-y-4">



              
              <div >
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email" 
                  value={credentials.email}
                  onChange={onChange}
                  placeholder="Enter your email"
                />
              </div>
              <div >
                <Label htmlFor="password" className="text-white">Password</Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={onChange}
                  placeholder="Enter your password"
                />
              </div>
            </div>
          </form>
          
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="text-white" onClick={() => setCredentials({ email: "", password: "" })}>Clear</Button>
          {/* <Button  className="bg-green-500 text-white hover:bg-green-600" onClick={() => setCredentials({ email: "", password: "" })}>Test</Button> */}
          
          <Button variant="outline" className=" text-white" type="submit" onClick={handleLogin} disabled={loading || !credentials.email || credentials.password.length < 6}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );






}

export default LoginForm;
