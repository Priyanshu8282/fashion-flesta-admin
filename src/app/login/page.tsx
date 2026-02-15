'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { adminService } from '@/services';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Auto-redirect if already logged in
  useEffect(() => {
    if (adminService.isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);

  const validateForm = () => {
    let isValid = true;

    if (!email) {
      setEmailError('Email address is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setError('');
    
    try {
      const response = await adminService.login({ email, password });
      if (response.success) {
        toast.success(response.message || 'Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        toast.error(response.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message || 'Invalid email or password';
      setError(errorMessage);
      toast.error(errorMessage);
    } 
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Left side: Premium Image - Visible on LG screens and up */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-110"
          style={{ backgroundImage: "url('/assets/login-bg.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-white h-full w-full">
          <div className="animate-fade-in-up">
            <h2 className="text-4xl font-bold tracking-tight mb-2">Fashion Flesta</h2>
            <div className="h-1 w-12 bg-primary-500 rounded-full" />
          </div>
          
          <div className="animate-fade-in-up delay-200">
            <p className="text-xl font-light italic opacity-90 mb-4 max-w-sm">
              "Elegance is not standing out, but being remembered."
            </p>
            <p className="text-sm opacity-60 tracking-widest uppercase">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-gray-50/50">
        <div className="w-full max-w-md animate-fade-in-up">
          {/* Logo/Icon */}
          <div className="mb-10 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-600 rounded-xl mb-6 shadow-lg shadow-primary-200 lg:hidden">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">Welcome Back</h1>
            <p className="text-gray-500 text-lg font-medium">Please enter your details to sign in.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md animate-fade-in-up">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 group">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700 group-focus-within:text-primary-600 transition-colors">
                Email Address<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  required
                  autoComplete="email"
                  className={`w-full px-4 py-3.5 bg-white border ${emailError ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-primary-100'} rounded-xl focus:ring-4 focus:border-primary-500 outline-none transition-all placeholder:text-gray-300 text-gray-900 shadow-sm`}
                  placeholder="Enter your email address"
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-500 font-medium animate-fade-in-up">{emailError}</p>
              )}
            </div>

            <div className="space-y-2 group">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700 group-focus-within:text-primary-600 transition-colors">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  required
                  autoComplete="current-password"
                  className={`w-full px-4 py-3.5 bg-white border ${passwordError ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:ring-primary-100'} rounded-xl focus:ring-4 focus:border-primary-500 outline-none transition-all placeholder:text-gray-300 text-gray-900 shadow-sm`}
                  placeholder="Enter your password"
                />
              </div>
              {passwordError && (
                <p className="text-xs text-red-500 font-medium animate-fade-in-up">{passwordError}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 text-primary-600 border-gray-300 rounded-md focus:ring-primary-500 focus:ring-offset-0 cursor-pointer"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-600 font-medium cursor-pointer select-none">
                Keep me signed in
              </label>
            </div>

            <button
              type="submit"
              className="w-full h-14 bg-gray-900 text-white rounded-xl font-bold hover:bg-black active:scale-[0.98] focus:ring-4 focus:ring-gray-200 transition-all shadow-xl shadow-gray-200 group overflow-hidden relative"
            >
              <span className="relative z-10 flex items-center justify-center">
                Sign In
              </span>
              <div className="absolute inset-0 bg-primary-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-center text-sm text-gray-400 font-medium">
              © {new Date().getFullYear()} Fashion Flesta. Admin Access Only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
