// src/pages/Login.jsx
import React, { useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Checkbox,
} from "@material-tailwind/react";
import logo from "../assets/logo-dark.svg"; // adjust path as needed
import { useNavigate } from "react-router-dom";

const backgroundImageUrl =
  "https://images.unsplash.com/photo-1526666923127-b2970f64b422?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function Login() {
  const navigate = useNavigate();

  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch(
        "https://api.veyza.in/veyza-api/v0/account/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      // Parse JSON response to get token and userId
      const data = await response.json();
      const { token } = data;

      if (!token) {
        throw new Error("No token found in response");
      }

      // Store token in localStorage for subsequent requests
      localStorage.setItem("authToken", token);

      // Navigate to the dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="relative flex min-h-screen bg-white">
      {/* Logo in the top-left */}
      <div className="absolute top-6 left-6 z-10 flex items-center">
        <img src={logo} alt="Veyza Logo" className="h-8 mr-2" />
      </div>

      {/* Left side (hidden on small screens) */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="w-full h-full bg-black/40 flex items-center justify-center">
          {/* Optionally, add branding text here */}
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="w-full max-w-md shadow-lg rounded-lg">
          <CardBody>
            <Typography
              variant="h5"
              color="blue-gray"
              className="mb-6 font-bold"
            >
              Welcome Back
            </Typography>
            {error && (
              <div className="mb-4 text-sm text-red-500">{error}</div>
            )}
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              {/* Email Input */}
              <Input
                type="email"
                label="Email"
                size="lg"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Password Input */}
              <Input
                type="password"
                label="Password"
                size="lg"
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Remember Me */}
              <div className="flex items-center">
                <Checkbox id="rememberMe" containerProps={{ className: "p-0" }} />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-blue-gray-500 ml-1 cursor-pointer"
                >
                  Remember Me
                </label>
              </div>

              {/* Login Button */}
              <Button
                color="blue"
                size="lg"
                className="normal-case mt-4"
                type="submit"
              >
                Login
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
