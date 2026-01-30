"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";

interface AuthDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  authMode: "login" | "register" | "forgot-password";
  setAuthMode: (mode: "login" | "register" | "forgot-password") => void;
  onAuthSuccess: (user: any) => void;
}

export function AuthDrawer({ isOpen, onClose, authMode, setAuthMode, onAuthSuccess }: AuthDrawerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [authErrors, setAuthErrors] = useState<any>(null);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [forgotPasswordData, setForgotPasswordData] = useState({ email: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthErrors(null);
    try {
      const response = await apiClient('/login', {
        method: 'POST',
        body: JSON.stringify(loginData),
      });

      if (response.success === false) {
        setAuthErrors(response.errors || { message: response.message });
        setIsLoading(false);
        return;
      }

      onAuthSuccess(response.user);
      localStorage.setItem('auth-token', response.token);
      localStorage.setItem('user-data', JSON.stringify(response.user));
      onClose();
      setLoginData({ email: "", password: "" });

      // Redirect to verification page if email not verified
      if (response.email_verified === false) {
        router.push('/verify-email');
      }
    } catch (error: any) {
      setAuthErrors(error.errors || { message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthErrors(null);
    try {
      const response = await apiClient('/register', {
        method: 'POST',
        body: JSON.stringify(registerData),
      });

      if (response.success === false) {
        setAuthErrors(response.errors || { message: response.message });
        setIsLoading(false);
        return;
      }

      onAuthSuccess(response.user);
      localStorage.setItem('auth-token', response.token);
      localStorage.setItem('user-data', JSON.stringify(response.user));
      onClose();
      setRegisterData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });

      // Redirect to email verification page
      router.push('/verify-email');
    } catch (error: any) {
      setAuthErrors(error.errors || { message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthErrors(null);
    setSuccessMessage("");
    try {
      const response = await apiClient('/forgot-password', {
        method: 'POST',
        body: JSON.stringify(forgotPasswordData),
      });

      if (response.success === false) {
        setAuthErrors(response.errors || { message: response.message });
        setIsLoading(false);
        return;
      }

      setSuccessMessage(response.message);
      setForgotPasswordData({ email: "" });
    } catch (error: any) {
      setAuthErrors(error.errors || { message: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-130 transition-all duration-500",
        isOpen ? "visible" : "invisible pointer-events-none"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transition-transform duration-500 ease-in-out transform",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex flex-col h-full bg-white relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors z-140 cursor-pointer"
          >
            <X className="w-6 h-6 text-gray-900" />
          </button>

          <div className="px-8 pt-12 bg-white z-135">
            {authMode !== "forgot-password" && (
              <div className="flex border-b border-gray-100 max-w-sm mx-auto">
                <button
                  onClick={() => setAuthMode("login")}
                  className={cn(
                    "flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all relative cursor-pointer",
                    authMode === "login" ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  Login
                  {authMode === "login" && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8C0000]" />
                  )}
                </button>
                <button
                  onClick={() => setAuthMode("register")}
                  className={cn(
                    "flex-1 py-4 text-xs font-black uppercase tracking-widest transition-all relative cursor-pointer",
                    authMode === "register" ? "text-gray-900" : "text-gray-400"
                  )}
                >
                  Register
                  {authMode === "register" && (
                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8C0000]" />
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pt-10 px-8 pb-12 scrollbar-hide">
            {authMode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-12 max-w-sm mx-auto">
                <div className="space-y-2 text-center">
                  <h2 className="text-4xl font-black text-gray-900">Welcome Back</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Authentic African Fashion Awaits</p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-1 group">
                    <input
                      type="email"
                      required
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full py-4 bg-transparent border-b border-gray-200 focus:border-[#8C0000] outline-none transition-colors text-gray-900"
                    />
                    {authErrors?.email && <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{authErrors.email[0]}</p>}
                  </div>

                  <div className="space-y-1 relative group">
                    <input
                      type={showLoginPassword ? "text" : "password"}
                      required
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full py-4 bg-transparent border-b border-gray-200 focus:border-[#8C0000] outline-none transition-colors text-gray-900 pr-10"
                    />
                    {authErrors?.password && <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{authErrors.password[0]}</p>}
                    <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-0 top-4 text-gray-300 hover:text-gray-500 cursor-pointer">
                      {showLoginPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-sm font-medium">
                    <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#8C0000] focus:ring-[#8C0000]" />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setAuthMode("forgot-password")}
                      className="text-gray-600 hover:text-[#8C0000] transition-colors cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <div className="space-y-6 pt-4">
                    <button
                      disabled={isLoading}
                      className="w-full bg-[#8C0000] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-900/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Signing In..." : "Sign In"}
                    </button>
                    {authErrors?.message && <p className="text-center text-xs text-red-600 font-bold mt-2">{authErrors.message}</p>}
                  </div>
                </div>
              </form>
            ) : authMode === "register" ? (
              <form onSubmit={handleRegister} className="space-y-10 max-w-sm mx-auto">
                <div className="space-y-2 text-center">
                  <h2 className="text-4xl font-black text-gray-900">Join Us</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Experience the Elegance</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      value={registerData.name}
                      onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                      placeholder="Full name | username"
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:border-[#8C0000] outline-none transition-colors text-gray-900"
                    />
                    {authErrors?.name && <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{authErrors.name[0]}</p>}
                  </div>

                  <div className="space-y-1">
                    <input
                      type="email"
                      required
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      placeholder="Email"
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:border-[#8C0000] outline-none transition-colors text-gray-900"
                    />
                    {authErrors?.email && <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{authErrors.email[0]}</p>}
                  </div>

                  <div className="space-y-1 relative">
                    <input
                      type={showRegisterPassword ? "text" : "password"}
                      required
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      placeholder="Password"
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:border-[#8C0000] outline-none transition-colors text-gray-900 pr-10"
                    />
                    {authErrors?.password && <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{authErrors.password[0]}</p>}
                    <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="absolute right-0 top-3 text-gray-300 hover:text-gray-500 cursor-pointer">
                      {showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <div className="space-y-1 relative">
                    <input
                      type={showRegisterConfirmPassword ? "text" : "password"}
                      required
                      value={registerData.password_confirmation}
                      onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })}
                      placeholder="Confirm Password"
                      className="w-full py-3 bg-transparent border-b border-gray-200 focus:border-[#8C0000] outline-none transition-colors text-gray-900 pr-10"
                    />
                    <button type="button" onClick={() => setShowRegisterConfirmPassword(!showRegisterConfirmPassword)} className="absolute right-0 top-3 text-gray-300 hover:text-gray-500 cursor-pointer">
                      {showRegisterConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                    By continuing, you agree to our <span className="text-gray-900 font-bold decoration-dotted underline cursor-pointer">Terms, Data Policy and Cookies Policy</span>
                  </p>

                  <div className="space-y-6 pt-4">
                    <button
                      disabled={isLoading}
                      className="w-full bg-[#8C0000] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-900/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Creating Account..." : "Register"}
                    </button>

                    <p className="text-center text-gray-500 font-medium">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => setAuthMode("login")}
                        className="text-gray-900 font-black hover:text-[#8C0000] transition-colors cursor-pointer"
                      >
                        Log In
                      </button>
                    </p>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-10 max-w-sm mx-auto">
                <div className="space-y-4 text-center">
                  <h2 className="text-4xl font-black text-gray-900">Forgot Password</h2>
                  <p className="text-[12px] text-gray-500 font-medium leading-relaxed">
                    Kindly provide your email address. You will receive an email shortly with instructions on how to reset your password
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="space-y-1">
                    <input
                      type="email"
                      required
                      value={forgotPasswordData.email}
                      onChange={(e) => setForgotPasswordData({ email: e.target.value })}
                      placeholder="Email"
                      className="w-full py-4 bg-transparent border-b border-gray-200 focus:border-[#8C0000] outline-none transition-colors text-gray-900"
                    />
                    {authErrors?.email && <p className="text-[10px] text-red-600 font-bold uppercase mt-1">{authErrors.email[0]}</p>}
                  </div>

                  <div className="space-y-6 pt-4">
                    <button
                      disabled={isLoading}
                      type="submit"
                      className="w-full bg-[#8C0000] text-white py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-xl shadow-red-900/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Sending..." : "Submit"}
                    </button>

                    {successMessage && (
                      <p className="text-center text-xs text-green-600 font-bold mt-2">
                        {successMessage}
                      </p>
                    )}
                    {authErrors?.message && (
                      <p className="text-center text-xs text-red-600 font-bold mt-2">
                        {authErrors.message}
                      </p>
                    )}

                    <p className="text-center text-gray-500 font-medium">
                      Remember your password?{" "}
                      <button
                        type="button"
                        onClick={() => setAuthMode("login")}
                        className="text-gray-900 font-black hover:text-[#8C0000] transition-colors cursor-pointer"
                      >
                        Log In
                      </button>
                    </p>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
