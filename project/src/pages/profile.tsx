// pages/profile.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Edit, Save, X, Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { baseurl } from '@/Baseurl/baseurl';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserProfile {
  id: number;
  name: string;
  mobile: string;
  email: string;
  created_at: string;
}

export function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', mobile: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  // Change Password states
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const session = localStorage.getItem('userSession');
      if (!session) {
        toast.error('Please login to view profile');
        navigate('/register');
        return;
      }

      const userSession = JSON.parse(session);
      const response = await fetch(`${baseurl}/api/users/${userSession.userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const result = await response.json();

      if (result.success) {
        setUser(result.user);
        setEditData({
          name: result.user.name,
          mobile: result.user.mobile,
          email: result.user.email
        });
      } else {
        toast.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      if (user) {
        setEditData({
          name: user.name,
          mobile: user.mobile,
          email: user.email
        });
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const session = localStorage.getItem('userSession');
      const userSession = JSON.parse(session || '{}');

      const response = await fetch(`${baseurl}/api/users/${userSession.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const result = await response.json();

      if (result.success) {
        setUser(result.user);
        toast.success('Profile updated successfully');
        setIsEditing(false);
        
        const updatedSession = { ...userSession, name: result.user.name, email: result.user.email };
        localStorage.setItem('userSession', JSON.stringify(updatedSession));
        window.dispatchEvent(new Event('authChange'));
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      setIsChangingPassword(true);
      const session = localStorage.getItem('userSession');
      const userSession = JSON.parse(session || '{}');

      const response = await fetch(`${baseurl}/api/users/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userSession.userId,
          currentPassword,
          newPassword,
        }),
      });

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to change password');
      }

      const result = await response.json();

      if (result.success) {
        toast.success('Password changed successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowChangePassword(false);
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <User className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-semibold">User not found</h3>
            <Button onClick={() => navigate('/register')} className="mt-4">
              Go to Register
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 bg-clip-text text-transparent">
            My Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your account information
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Member since {formatDate(user.created_at)}
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              <Button
                variant={isEditing ? "destructive" : "outline"}
                size="sm"
                onClick={handleEditToggle}
              >
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Full Name
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="text-lg font-medium">{user.name}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email Address
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="text-lg font-medium">{user.email}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Mobile Number
                  </Label>
                  {isEditing ? (
                    <Input
                      id="mobile"
                      value={editData.mobile}
                      onChange={(e) => setEditData({ ...editData, mobile: e.target.value })}
                      placeholder="Enter your mobile number"
                    />
                  ) : (
                    <div className="text-lg font-medium">{user.mobile}</div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Member Since
                  </Label>
                  <div className="text-lg font-medium">{formatDate(user.created_at)}</div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button variant="outline" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {!showChangePassword ? (
                <Button
                  onClick={() => setShowChangePassword(true)}
                  className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 characters)"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowChangePassword(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      disabled={isChangingPassword}
                      className="bg-gradient-to-r from-pink-500 via-orange-500 via-yellow-400 to-blue-600 text-white"
                    >
                      {isChangingPassword ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}