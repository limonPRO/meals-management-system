import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, Navigate } from 'react-router-dom';
import { post } from '../services/api';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const addMutation = useMutation({
    mutationFn: (newItem) => post(`/users/login`, newItem),
    onSuccess: (data) => {
      const { user, token } = data.data;
      console.log("a")
      dispatch(setCredentials({ user, token , role:"Admin"}));
      // Redirect to home page after successful login
      return <Navigate to="/item" />;
    },
    onError: (error) => {
      console.error('Login error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate({
      email,
      password,
    });
  };

  return (
    <div className="w-full p-4 flex items-center justify-center h-screen ">
      <form className="w-[500px]" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="mb-2.5 block font-medium !text-black dark:text-white">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 !text-black outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="absolute right-4 top-4">
              {/* Email icon SVG */}
            </span>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2.5 block font-medium !text-black dark:text-white">
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 !text-black outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="absolute right-4 top-4">
              {/* Password icon SVG */}
            </span>
          </div>
        </div>

        <div className="mb-5">
          <input
            type="submit"
            value="Sign In"
            className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-black transition hover:bg-opacity-90"
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
