import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import axios from 'axios';
import { useSettings } from '@/hooks/use-settings';

// Use environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function RegisterPage() {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const { settings } = useSettings();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!name || !mobile || !email || !password || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        // Mobile number validation (optional - adjust as needed)
        if (!/^[0-9]{10}$/.test(mobile)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // Make API call to register user
            const response = await axios.post(`${API_URL}/users/register`, {
                name: name.trim(),
                mobile: mobile.trim(),
                email: email.trim().toLowerCase(),
                password
            });

            if (response.data.success) {
                toast.success('Registration successful! Please login.');
                setLoading(false);
                // Navigate to login page after successful registration
                setTimeout(() => {
                    navigate('/login');
                }, 500);
            }
        } catch (err: any) {
            setLoading(false);
            
            // Handle different error scenarios
            if (err.response) {
                // Server responded with error
                const errorMessage = err.response.data?.message || 'Registration failed';
                setError(errorMessage);
                
                // Show specific error messages
                if (err.response.status === 400) {
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
                toast.error('Registration failed');
            }
            
            console.error('Registration error:', err);
        } finally {
            // Ensure loading is set to false if not already
            setLoading(false);
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
                        Create Account
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-sm">
                        Register to get started with {settings?.short_name || 'MVB'}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-3 px-6 pb-2">
                        <div className="space-y-1">
                            <Label htmlFor="name" className="text-gray-700 font-semibold text-xs">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-9 pr-3 py-2 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm bg-gray-50/50 hover:bg-white transition-colors"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="mobile" className="text-gray-700 font-semibold text-xs">Mobile Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="mobile"
                                    type="tel"
                                    placeholder="Enter 10-digit mobile number"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    className="pl-9 pr-3 py-2 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm bg-gray-50/50 hover:bg-white transition-colors"
                                    required
                                    disabled={loading}
                                    maxLength={10}
                                />
                            </div>
                        </div>
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
                                    placeholder="Min 6 chars"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-9 pr-10 py-2 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm bg-gray-50/50 hover:bg-white transition-colors"
                                    required
                                    disabled={loading}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword" className="text-gray-700 font-semibold text-xs">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-9 pr-10 py-2 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg text-sm bg-gray-50/50 hover:bg-white transition-colors"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    tabIndex={-1}
                                >
                                    {showConfirmPassword ? (
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
                                    Creating account...
                                </span>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Register
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-center text-gray-600">
                            Already have an account?{' '}
                            <Button 
                                variant="link" 
                                className="px-0 text-xs font-semibold text-blue-600 hover:text-blue-800 h-auto"
                                type="button"
                                onClick={() => navigate('/login')}
                            >
                                Login here
                            </Button>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}