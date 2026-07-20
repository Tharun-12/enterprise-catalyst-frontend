import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import axios from 'axios';
import { useSettings } from '@/hooks/use-settings';

// Use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { settings } = useSettings();

    useEffect(() => {
        // Check if user is already logged in
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
            navigate('/');
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validation
        if (!email || !password) {
            setError('Email and password are required');
            setLoading(false);
            return;
        }

        try {
            // Make API call to login
            const response = await axios.post(`${API_URL}/users/login`, {
                email: email.trim().toLowerCase(),
                password
            });

            if (response.data.success) {
                // Store session
                const sessionData = {
                    userId: response.data.user.id,
                    name: response.data.user.name,
                    email: response.data.user.email,
                    mobile: response.data.user.mobile,
                    loggedIn: true,
                    loginTime: new Date().toISOString()
                };
                
                localStorage.setItem('userSession', JSON.stringify(sessionData));
                
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                }
                
                toast.success(`Welcome back, ${response.data.user.name}!`);
                setLoading(false);
                navigate('/');
            }
        } catch (err: any) {
            setLoading(false);
            
            // Handle different error scenarios
            if (err.response) {
                // Server responded with error
                const errorMessage = err.response.data?.message || 'Login failed';
                setError(errorMessage);
                
                // Show specific error messages
                if (err.response.status === 401) {
                    toast.error('Invalid credentials. Please try again.');
                } else if (err.response.status === 400) {
                    toast.error(errorMessage);
                } else if (err.response.status === 500) {
                    toast.error('Server error. Please try again later.');
                }
            } else if (err.request) {
                // Request made but no response
                setError('Network error. Please check your connection.');
                toast.error('Cannot connect to server');
            } else {
                // Something else happened
                setError('An unexpected error occurred. Please try again.');
                toast.error('Login failed');
            }
            
            console.error('Login error:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="space-y-1 text-center pt-6 pb-2">
                    <div className="flex justify-center mb-2">
                        {settings?.logo_url ? (
                            <img 
                                src={`${API_URL.replace('/api', '')}${settings.logo_url}`} 
                                alt={settings.short_name || 'Logo'}
                                className="w-14 h-14 object-contain rounded-2xl shadow-lg shadow-blue-200"
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
                                {settings?.short_name?.charAt(0) || 'MVB'}
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-800">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-sm">
                        Sign in to your {settings?.short_name || 'MVB'} account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4 px-6 pb-2">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="text-gray-700 font-semibold text-xs">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-9 pr-3 py-2 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm bg-gray-50/50 hover:bg-white transition-colors"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password" className="text-gray-700 font-semibold text-xs">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-9 pr-10 py-2 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm bg-gray-50/50 hover:bg-white transition-colors"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="text-xs text-red-600 bg-red-50 p-2 rounded-lg text-center border border-red-200">
                                {error}
                            </div>
                        )}
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center space-x-2">
                                <Checkbox 
                                    id="remember" 
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 w-4 h-4"
                                />
                                <Label htmlFor="remember" className="text-xs text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                                    Remember me
                                </Label>
                            </div>
                            <Button 
                                variant="link" 
                                className="px-0 text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline decoration-2 underline-offset-2 h-auto"
                                type="button"
                                onClick={() => navigate('/customer/forgot-password')}
                            >
                                Forgot password?
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-3 px-6 pb-6 pt-0">
                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2 h-11 rounded-lg text-sm shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all duration-200"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Login
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-center text-gray-600">
                            Don't have an account?{' '}
                            <Button 
                                variant="link" 
                                className="px-0 text-xs font-semibold text-blue-600 hover:text-blue-800 h-auto"
                                type="button"
                                onClick={() => navigate('/register')}
                            >
                                Create one here
                            </Button>
                        </p>
                        <p className="text-[10px] text-center text-gray-400 font-medium tracking-wide">
                            Customer Centricity with Peace of Mind
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}