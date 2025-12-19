import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import api from '../utils/api';
import hasthiyaLogo from '../assets/Hasthiyalogo.jpeg';

const Profile = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name);
    }
    // Trigger stats animation after mount
    setTimeout(() => setShowStats(true), 300);
  }, [user]);

  const handleLogout = () => {
    // Clear authentication
    logout();
    
    // Force navigation to home page
    window.location.href = '/';
  };

  const handleUpdate = async () => {
    if (!fullName.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await api.put('/user/profile', { full_name: fullName });
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update user in context
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.full_name = fullName;
      localStorage.setItem('user', JSON.stringify(currentUser));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFullName(user?.full_name || '');
    setIsEditing(false);
    setError('');
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysActive = () => {
    if (!user?.created_at) return 0;
    const created = new Date(user.created_at);
    const now = new Date();
    const diff = now.getTime() - created.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-stone-950 relative overflow-hidden transition-colors duration-300">
      {/* animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-slate-50 to-pink-100 dark:from-violet-900/20 dark:via-stone-950 dark:to-pink-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        {/* navbar */}
        <nav className="border-b border-slate-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/30 backdrop-blur-xl sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg shadow-violet-500/50 group-hover:shadow-violet-500/70 transition-all transform group-hover:scale-105">
                  <img src={hasthiyaLogo} alt="Hasthiya" className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-slate-900 dark:text-slate-100 font-bold text-xl block">HasthiyaAuth</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400">My Profile</span>
                </div>
              </Link>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/50 hover:bg-red-500/20 hover:border-red-500/70 transition-all group"
                >
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="font-medium">logout</span>
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* main content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            
            {/* Loading State */}
            {authLoading && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="relative">
                  {/* Elephant icon spinning */}
                  <div className="w-20 h-20 border-4 border-violet-500/30 border-t-violet-500 
                                  rounded-full animate-spin"></div>
                  <span className="absolute inset-0 flex items-center justify-center text-3xl">
                    🐘
                  </span>
                </div>
                <p className="text-slate-400 animate-pulse text-lg">Loading your profile...</p>
              </div>
            )}

            {/* Hero Section with Avatar */}
            {!authLoading && (
            <>
            <div className="mb-12 relative">
              <div className="bg-gradient-to-r from-violet-500/10 via-pink-500/10 to-violet-500/10 rounded-3xl p-8 backdrop-blur-sm border border-violet-500/20">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  {/* Avatar with animated ring */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full animate-spin-slow opacity-75 blur-md"></div>
                    <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-violet-500/50 border-4 border-stone-950">
                      <span className="text-6xl font-bold text-white">{user?.full_name.charAt(0).toUpperCase()}</span>
                    </div>
                    {/* Status indicator */}
                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-stone-950 animate-pulse"></div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                      <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                        {user?.full_name}
                      </span>
                    </h1>
                    <p className="text-slate-400 text-lg mb-4">{user?.email}</p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-sm text-green-400 font-medium">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        online
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 border border-violet-500/30 rounded-full text-sm text-violet-400 font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        verified
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/10 border border-pink-500/30 rounded-full text-sm text-pink-400 font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        premium
                      </span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex gap-4">
                    <div className={`text-center transform transition-all duration-500 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      <div className="w-20 h-20 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold text-violet-400">{getDaysActive()}</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">days active</p>
                    </div>
                    <div className={`text-center transform transition-all duration-500 delay-100 ${showStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      <div className="w-20 h-20 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center mb-2">
                        <span className="text-2xl font-bold text-pink-400">100%</span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium">secure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* messages */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 flex items-center gap-3 animate-shake">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-xl text-green-400 flex items-center gap-3">
                <svg className="w-5 h-5 flex-shrink-0 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{success}</span>
              </div>
            )}

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              
              {/* Left Column - Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Personal Information Card */}
                <div className="bg-stone-900/50 backdrop-blur-xl border border-stone-800 rounded-2xl p-6 shadow-2xl hover:border-violet-500/30 transition-all">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Personal Information
                    </h2>
                    {!isEditing && (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg border border-violet-500/30 hover:bg-violet-500/20 transition-all flex items-center gap-2 group"
                      >
                        <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span className="text-sm font-medium">edit</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-5">
                    {/* Full Name */}
                    <div className="group">
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold flex items-center gap-2">
                        <div className="w-1 h-4 bg-violet-500 rounded-full"></div>
                        full name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
                          disabled={loading}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <p className="text-lg text-white font-medium px-4 py-3 bg-stone-800/30 rounded-xl">{user?.full_name}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="group">
                      <label className="block text-xs uppercase tracking-wider text-slate-400 mb-2 font-semibold flex items-center gap-2">
                        <div className="w-1 h-4 bg-pink-500 rounded-full"></div>
                        email address
                      </label>
                      <div className="px-4 py-3 bg-stone-800/30 rounded-xl">
                        <p className="text-lg text-white font-medium">{user?.email}</p>
                        <p className="text-xs text-slate-500 mt-1">🔒 email address cannot be changed for security</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={handleUpdate}
                          disabled={loading}
                          className="flex-1 bg-gradient-to-r from-violet-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
                        >
                          {loading ? (
                            <>
                              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              saving...
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              save changes
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={loading}
                          className="px-6 py-3 bg-slate-700/50 text-slate-300 rounded-xl font-semibold hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Security Info Card */}
                <div className="bg-stone-900/50 backdrop-blur-xl border border-stone-800 rounded-2xl p-6 shadow-2xl hover:border-pink-500/30 transition-all">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Security & Privacy
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-green-400">password</p>
                          <p className="text-xs text-slate-400">encrypted</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-violet-500/5 border border-violet-500/20 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-violet-400">JWT tokens</p>
                          <p className="text-xs text-slate-400">active</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Stats & Info */}
              <div className="space-y-6">
                
                {/* Account Details Card */}
                <div className="bg-stone-900/50 backdrop-blur-xl border border-stone-800 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Account Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="pb-4 border-b border-stone-800">
                      <p className="text-xs text-slate-400 mb-1">user id</p>
                      <p className="text-sm text-violet-400 font-mono font-semibold">#{user?.id}</p>
                    </div>
                    
                    <div className="pb-4 border-b border-stone-800">
                      <p className="text-xs text-slate-400 mb-1">member since</p>
                      <p className="text-sm text-white font-medium">{formatDate(user?.created_at)}</p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400 mb-1">account type</p>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-violet-500/20 to-pink-500/20 border border-violet-500/30 rounded-lg text-sm text-violet-300 font-semibold">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        premium
                      </span>
                    </div>
                  </div>
                </div>

                {/* Activity Card */}
                <div className="bg-gradient-to-br from-violet-500/10 to-pink-500/10 backdrop-blur-xl border border-violet-500/30 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Activity
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-stone-900/50 rounded-lg">
                      <span className="text-sm text-slate-300">last login</span>
                      <span className="text-sm text-violet-400 font-semibold">today</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-stone-900/50 rounded-lg">
                      <span className="text-sm text-slate-300">total sessions</span>
                      <span className="text-sm text-pink-400 font-semibold">{getDaysActive()}</span>
                    </div>
                  </div>
                </div>

                {/* Status Card */}
                <div className="bg-green-500/10 border border-green-500/50 rounded-2xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-400 mb-1">all systems operational</p>
                      <p className="text-xs text-slate-400">your account is secure and active</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
