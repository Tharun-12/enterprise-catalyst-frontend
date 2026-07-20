import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Shield, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/hooks/use-settings';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export function CustomerVerifyOTP() {
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const navigate = useNavigate();
    const { settings } = useSettings();

    useEffect(() => {
        const storedEmail = sessionStorage.getItem('customerResetEmail');
        if (!storedEmail) {
            navigate('/customer/forgot-password');
            return;
        }
        setEmail(storedEmail);

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess('OTP verified successfully!');
                toast.success('OTP verified successfully!');
                // Store that OTP is verified
                sessionStorage.setItem('customerOTPVerified', 'true');
                setTimeout(() => {
                    navigate('/customer/reset-password');
                }, 1500);
            } else {
                setError(data.message || 'Invalid OTP. Please try again.');
                toast.error(data.message || 'Invalid OTP');
            }
        } catch (error) {
            setError('Network error. Please check your connection and try again.');
            toast.error('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResendLoading(true);
        setError('');
        setSuccess('');

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
                setSuccess('New OTP sent successfully!');
                toast.success('New OTP sent successfully!');
                setCanResend(false);
                setCountdown(30);
                const timer = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            setCanResend(true);
                            clearInterval(timer);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setError(data.message || 'Failed to resend OTP.');
                toast.error(data.message || 'Failed to resend OTP');
            }
        } catch (error) {
            setError('Network error. Please try again.');
            toast.error('Network error. Please try again.');
        } finally {
            setResendLoading(false);
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
                        OTP Verification
                    </CardTitle>
                    <CardDescription className="text-gray-500 text-base">
                        Enter OTP sent to {email}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5 px-8">
                        <div className="space-y-2">
                            <Label htmlFor="otp" className="text-gray-700 font-semibold text-sm">Enter OTP</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="pl-11 pr-4 py-6 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl text-base bg-gray-50/50 hover:bg-white transition-colors text-center text-2xl tracking-widest font-mono"
                                    required
                                    disabled={loading}
                                    maxLength={6}
                                    autoComplete="one-time-code"
                                />
                            </div>
                            <p className="text-xs text-gray-500 text-center mt-2">
                                <Shield className="w-3 h-3 inline mr-1" />
                                OTP expires in 5 minutes
                            </p>
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
                        <div className="text-center pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleResendOTP}
                                disabled={!canResend || resendLoading}
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                            >
                                {resendLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Resending...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <RefreshCw className="w-4 h-4" />
                                        {canResend ? 'Resend OTP' : `Resend OTP in ${countdown}s`}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 px-8 pb-8 pt-2">
                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-6 rounded-xl text-base shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all duration-200"
                            disabled={loading || otp.length < 6}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying OTP...
                                </span>
                            ) : (
                                <>
                                    <Shield className="w-5 h-5 mr-2" />
                                    Verify OTP
                                </>
                            )}
                        </Button>
                        <Button 
                            variant="ghost" 
                            className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                            type="button"
                            onClick={() => navigate('/customer/forgot-password')}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Forgot Password
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}