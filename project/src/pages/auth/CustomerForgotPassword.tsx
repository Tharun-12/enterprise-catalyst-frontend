import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function CustomerForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { settings } = useSettings();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('OTP sent successfully! Please check your email.');
                sessionStorage.setItem('customerResetEmail', email);
                toast.success('OTP sent to your email');
                setTimeout(() => {
                    navigate('/customer/verify-otp');
                }, 1500);
            } else {
                setError(data.message || 'Failed to send OTP. Please try again.');
                toast.error(data.message || 'Failed to send OTP');
            }
        } catch (error) {
            setError('Network error. Please check your connection and try again.');
            toast.error('Network error. Please try again.');
        } finally {
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
                        Forgot Password?
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-base">
                        Enter your details to reset your password
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5 px-8">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-700 font-semibold text-sm">Email</Label>
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
                                    Sending OTP...
                                </span>
                            ) : (
                                <>
                                    <Send className="w-5 h-5 mr-2" />
                                    Send OTP
                                </>
                            )}
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                            type="button"
                            onClick={() => navigate('/login')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Login
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}