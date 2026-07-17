import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Eye, EyeOff, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useSettings } from '@/hooks/use-settings';

// API Base URL - Update this based on your environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { settings } = useSettings();

    // Check for saved credentials on component mount
    useEffect(() => {
        console.log('🔍 AdminLogin component mounted');
        const savedEmail = localStorage.getItem('adminEmail');
        const savedRememberMe = localStorage.getItem('rememberMe');
        console.log('📧 Saved email:', savedEmail);
        console.log('🔑 Saved rememberMe:', savedRememberMe);
        
        if (savedEmail && savedRememberMe === 'true') {
            setEmail(savedEmail);
            setRememberMe(true);
        }
        
        // Check if already logged in
        const isAuthenticated = localStorage.getItem('adminAuth') === 'true';
        console.log('🔐 Is authenticated:', isAuthenticated);
        if (isAuthenticated) {
            console.log('🚀 Redirecting to dashboard...');
            navigate('/admin/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('📝 Form submitted');
        console.log('📧 Email:', email);
        console.log('🔑 Password:', password ? '***' : 'empty');
        console.log('💭 Remember me:', rememberMe);
        
        setError('');
        setSuccess('');
        setLoading(true);
        console.log('⏳ Loading set to true');

        try {
            const requestBody = {
                email,
                password,
                rememberMe
            };
            console.log('📤 Sending request to:', `${API_BASE_URL}/api/admin/login`);
            console.log('📦 Request body:', { ...requestBody, password: '***' });

            const response = await fetch(`${API_BASE_URL}/api/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            console.log('📥 Response status:', response.status);
            console.log('📥 Response status text:', response.statusText);

            const data = await response.json();
            console.log('📦 Response data:', data);

            if (data.success) {
                console.log('✅ Login successful!');
                console.log('👤 Admin data:', data.admin);
                console.log('🆕 Is first time:', data.isFirstTime);
                
                // Show success message
                if (data.isFirstTime) {
                    setSuccess('🎉 Account created successfully! Welcome admin!');
                    console.log('🎉 First time admin login');
                } else {
                    setSuccess('✅ Login successful!');
                }
                
                // Store auth state
                localStorage.setItem('adminAuth', 'true');
                localStorage.setItem('adminId', data.admin.id.toString());
                localStorage.setItem('adminEmail', email);
                console.log('💾 Stored adminId:', data.admin.id);
                
                // Store admin data
                if (data.admin) {
                    localStorage.setItem('adminData', JSON.stringify(data.admin));
                    console.log('💾 Stored adminData');
                }

                // Handle remember me
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                    localStorage.setItem('adminEmail', email);
                    console.log('💾 Remember me enabled');
                } else {
                    localStorage.removeItem('rememberMe');
                    localStorage.removeItem('adminEmail');
                    console.log('🗑️ Remember me disabled');
                }

                // Navigate after a short delay to show success message
                setTimeout(() => {
                    console.log('🚀 Navigating to /admin/dashboard');
                    navigate('/admin/dashboard');
                }, 1500);
                
            } else {
                console.log('❌ Login failed:', data.message);
                setError(data.message || 'Invalid email or password');
                setLoading(false);
            }
        } catch (error) {
            console.error('🔥 Login error:', error);
            setError('Network error. Please check your connection and try again.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4">
            <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader className="space-y-2 text-center pt-8">
                    <div className="flex justify-center mb-4">
                        {settings?.logo_url ? (
                            <img 
                                src={`${API_BASE_URL}${settings.logo_url}`} 
                                alt={settings.short_name || 'Logo'}
                                className="w-20 h-20 object-contain rounded-2xl shadow-lg shadow-blue-200"
                            />
                        ) : (
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-200">
                                {settings?.short_name?.charAt(0) || 'MVB'}
                            </div>
                        )}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                        {settings?.short_name || 'MVB'} Admin Login
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-base">
                        Sign in to your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5 px-8">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-semibold text-sm">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-11 pr-4 py-6 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base bg-gray-50/50 hover:bg-white transition-colors"
                                    required
                                    disabled={loading}
                                    autoComplete="email"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-700 font-semibold text-sm">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-11 pr-12 py-6 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base bg-gray-50/50 hover:bg-white transition-colors"
                                    required
                                    disabled={loading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={loading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-xl text-center border border-red-200 animate-in slide-in-from-top-1">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-xl text-center border border-green-200 animate-in slide-in-from-top-1">
                                {success}
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
                                <Label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                                    Remember me
                                </Label>
                            </div>
                            <Button 
                                variant="link" 
                                className="px-0 text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline decoration-2 underline-offset-2"
                                type="button"
                                onClick={() => {
                                    navigate('/admin/forgot-password');
                                }}
                            >
                                Forgot password?
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-2">
                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 rounded-xl text-base shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all duration-200"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5 mr-2" />
                                    Login / Register
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-gray-400 text-center">
                            First time? Your account will be created automatically
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}