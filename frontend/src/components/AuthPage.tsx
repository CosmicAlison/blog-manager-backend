import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
      } else {
        if (!username.trim()) {
          throw new Error("Name is required");
        }
        await register(username, email, password);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-4xl text-stone-900 mb-2">The Daily Blogger</h1>
          <p className="text-sm text-stone-500">Your personal blog space</p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 shadow-lg p-8">
          {/* Toggle tabs */}
          <div className="flex gap-2 mb-6 bg-stone-100 rounded-lg p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                isLogin
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                !isLogin
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (<div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder:text-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all"
              />
            </div>)}
            
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your username"
                  required={!isLogin}
                  className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder:text-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all"
                />
              </div>



            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-3 py-2 rounded-lg border border-stone-200 bg-white text-stone-800 placeholder:text-stone-300 outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-stone-800 text-white font-medium hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Loading..." : isLogin ? "Login" : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
