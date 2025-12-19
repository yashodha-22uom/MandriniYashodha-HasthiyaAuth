import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import hasthiyaLogo from '../assets/Hasthiyalogo.jpeg';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-stone-950 relative overflow-hidden">
      {/* animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-stone-950 to-pink-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10">
        {/* navbar */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-violet-500/50">
                <img src={hasthiyaLogo} alt="Hasthiya" className="w-full h-full object-cover" />
              </div>
              <span className="text-slate-100 font-bold text-xl">HasthiyaAuth</span>
            </div>
            {!isAuthenticated && (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
                >
                  sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-violet-500 to-pink-500 text-white rounded-lg hover:from-violet-600 hover:to-pink-600 transition-all"
                >
                  get started
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* hero section */}
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {isAuthenticated ? (
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/50 rounded-full text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  you're logged in
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  hey there, <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">{user?.full_name}</span>
                </h1>
                <p className="text-xl text-slate-400 mb-12">
                  your account is active and ready to use
                </p>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg shadow-violet-500/30"
                >
                  <span>go to profile</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/50 rounded-full text-violet-400 text-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  secure authentication
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-slate-100 mb-6">
                  auth made <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">simple</span>
                </h1>
                <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12">
                  modern authentication system with jwt tokens, bcrypt encryption, and a clean user experience
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/register"
                    className="px-8 py-4 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-pink-600 transition-all shadow-lg shadow-violet-500/30"
                  >
                    create account
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 bg-slate-800/50 backdrop-blur-sm text-white font-semibold rounded-xl border border-slate-700 hover:bg-slate-800 transition-all"
                  >
                    sign in
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* features */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800 rounded-2xl p-8 hover:border-violet-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">military-grade security</h3>
                <p className="text-slate-400">
                  bcrypt password hashing with jwt token authentication keeps your data safe
                </p>
              </div>

              <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800 rounded-2xl p-8 hover:border-pink-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">blazing fast</h3>
                <p className="text-slate-400">
                  built with react, vite, and optimized for performance from the ground up
                </p>
              </div>

              <div className="bg-stone-900/50 backdrop-blur-sm border border-stone-800 rounded-2xl p-8 hover:border-violet-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">developer friendly</h3>
                <p className="text-slate-400">
                  clean api, typescript support, and comprehensive documentation included
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="container mx-auto px-4 py-8 border-t border-stone-800">
          <p className="text-center text-slate-500 text-sm">
            built with 💜 using react, node.js, and mysql
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
