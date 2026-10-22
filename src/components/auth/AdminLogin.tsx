import React, { useState } from 'react';
import { 
  Flame, 
  Lock, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Database,
  ArrowRight,
  KeyRound,
  ExternalLink
} from 'lucide-react';
import { supabase, isSupabaseConfigured, setRuntimeSupabaseCredentials, supabaseUrl } from '../../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: (user: any) => void;
  onContinueOfflineDemo: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onContinueOfflineDemo
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Connection settings modal / expander if keys are missing
  const [showConfigPanel, setShowConfigPanel] = useState(!isSupabaseConfigured);
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!email || !password) {
      setErrorMessage('Please enter both your admin email and password.');
      return;
    }

    if (!isSupabaseConfigured) {
      setErrorMessage(
        'Supabase is not yet configured. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY below, or use the offline preview mode.'
      );
      setShowConfigPanel(true);
      return;
    }

    try {
      setLoading(true);

      if (isSignUpMode) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: { role: 'admin', full_name: 'Lead Administrator' }
          }
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (data?.session && data.user) {
          onLoginSuccess(data.user);
          return;
        } else {
          setSuccessNotice(
            'Admin registered successfully! If email confirmation is enabled in your Supabase project, check your inbox or auto-confirm the user in Supabase Dashboard > Authentication > Users.'
          );
          return;
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        if (error.message?.toLowerCase().includes('email not confirmed')) {
          setErrorMessage(
            'Email not confirmed in Supabase. In your Supabase Dashboard > Authentication > Users, click on this user and select "Confirm email", or turn off "Confirm email" in Auth Settings > Providers > Email.'
          );
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      if (data?.user) {
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl && customKey) {
      setRuntimeSupabaseCredentials(customUrl, customKey);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      {/* Background Decor */}
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#E31B23] mx-auto flex items-center justify-center text-white shadow-md mb-3">
            <Flame className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-[#171717] tracking-tight">
            Devil Cleanerz &amp; Enterprises
          </h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            Executive Admin Portal • Secure Supabase Authentication
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-[#EAEAEA] shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-[#EAEAEA] mb-6">
            <div>
              <h2 className="text-sm font-bold text-[#171717]">
                {isSignUpMode ? 'Register Admin Account' : 'Admin Sign In'}
              </h2>
              <p className="text-[11px] text-[#666666]">
                {isSignUpMode ? 'Create verified admin account on Supabase' : 'Only authorized cleaning administrators'}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected</span>
            </div>
          </div>

          {/* Success / Info Message */}
          {successNotice && (
            <div className="mb-5 p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
              <div className="leading-relaxed">
                {successNotice}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50/80 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-[#E31B23]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold">Authentication status: </span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@devilcleanerz.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F7F7F7]/60 border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23] focus:bg-white text-[#171717]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#171717] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#F7F7F7]/60 border border-[#EAEAEA] rounded-xl focus:outline-none focus:border-[#E31B23] focus:bg-white text-[#171717]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#E31B23] hover:bg-[#c9151c] disabled:opacity-70 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>{isSignUpMode ? 'Create Admin Account' : 'Sign In as Admin'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="mt-4 pt-3 border-t border-[#EAEAEA] flex items-center justify-between text-xs">
            <span className="text-[#666666]">
              {isSignUpMode ? 'Already have an admin login?' : 'Need to register an admin account?'}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsSignUpMode(!isSignUpMode);
                setErrorMessage(null);
                setSuccessNotice(null);
              }}
              className="font-bold text-[#E31B23] hover:underline cursor-pointer"
            >
              {isSignUpMode ? 'Switch to Sign In' : 'Register Admin'}
            </button>
          </div>

          {/* Fallback to preview option if keys not yet added */}
          <div className="mt-3 pt-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={onContinueOfflineDemo}
              className="text-xs text-gray-500 hover:text-[#171717] font-semibold text-center py-1 transition-colors cursor-pointer"
            >
              Explore In-Memory Preview Mode →
            </button>
          </div>
        </div>

        {/* Supabase Connection Status Card */}
        <div className="mt-4 p-4 bg-white rounded-2xl border border-[#EAEAEA] shadow-xs text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#E31B23]" />
              <span className="font-bold text-[#171717]">Supabase Connection</span>
            </div>
            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
              isSupabaseConfigured ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'
            }`}>
              {isSupabaseConfigured ? 'Configured' : 'Credentials Needed'}
            </span>
          </div>

          {!isSupabaseConfigured ? (
            <div className="mt-2 text-[11px] text-[#666666] leading-relaxed">
              <p>
                Provide <code className="bg-gray-100 px-1 py-0.5 rounded text-[#171717]">VITE_SUPABASE_URL</code> and <code className="bg-gray-100 px-1 py-0.5 rounded text-[#171717]">VITE_SUPABASE_PUBLISHABLE_KEY</code> in environment variables or enter them below to connect directly:
              </p>

              <button
                type="button"
                onClick={() => setShowConfigPanel(!showConfigPanel)}
                className="mt-2 text-[11px] text-[#E31B23] font-bold underline cursor-pointer"
              >
                {showConfigPanel ? 'Hide Connection Form' : 'Configure Supabase Keys Now'}
              </button>

              {showConfigPanel && (
                <form onSubmit={handleSaveConfig} className="mt-3 space-y-2.5 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-[10px] font-bold text-[#171717] mb-1">Project URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://xyzcompany.supabase.co"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-[11px] border border-gray-200 rounded-lg focus:outline-none focus:border-[#E31B23]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#171717] mb-1">Publishable / Anon Key</label>
                    <input
                      type="password"
                      required
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-[11px] border border-gray-200 rounded-lg focus:outline-none focus:border-[#E31B23]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 bg-[#171717] text-white text-[11px] font-bold rounded-lg hover:bg-black transition-colors"
                  >
                    Connect Supabase Project
                  </button>
                </form>
              )}
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-gray-500 font-mono truncate">
              Connected to: {supabaseUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
