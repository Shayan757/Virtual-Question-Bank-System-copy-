// components/LoginForm.js
import React, { useState } from 'react';
import { useRouter } from 'next/router';

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
      console.log("Response from server:", json);

      if (json.success) {
        localStorage.setItem("token", json.authtoken);

        // Redirect to admin home page
        if (json.user && json.user.roles === 'admin') {
          router.push('/admin/admindashboard'); // Redirect to the admin dashboard route
        } else {
          // Redirect to another page for regular users if needed
          // router.push('/some-other-route');
        }
      } else {
        setError(json.message || "Login failed");
        console.log("Login failed:", json.message);
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
    <div className='container mx-auto p-4'>
      <div className='max-w-md mx-auto bg-white p-8 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold mb-6 text-center'>Login to Your Account</h1>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              name='email'
              id="email"
              value={credentials.email}
              onChange={onChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              id="password"
              name='password'
              value={credentials.password}
              onChange={onChange}
            />
          </div>
          <button
            disabled={credentials.email.length === 0 || credentials.password.length < 6}
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
