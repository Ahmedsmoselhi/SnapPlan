import { LoaderCircle, Lock, MailIcon } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import Logo from "../../components/logo";
import { Link } from "react-router-dom";

const LoginAttendee = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      alert("fill in all fields");
      setLoading(false);
      return;
    }
    setTimeout(() => {
      setLoading(false);
      alert("Login successful!");
    }, 1000);
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-md rounded-lg bg-gray-100 p-6">
          <h1 className="text-center mb-8">
            <Logo size="text-4xl" />
          </h1>

          <h2 className="mb-8 text-center text-2xl font-semibold text-gray-800">
            Login As Event Manager
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#344054]"
              >
                Email
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[#667085]">
                  <MailIcon size={20} />
                </span>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border border-[#D0D5DD]",
                    "px-4 py-2.5 text-gray-700 placeholder:text-[#667085] pl-10",
                    "focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  )}
                />
              </div>
            </div>

            {/* Password */}

            <div className="mb-6">
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#344054]"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-[#667085]">
                  <Lock size={20} />
                </span>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Enter your Paswsord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border border-[#D0D5DD]",
                    "px-4 py-2.5 text-gray-700 placeholder:text-[#667085] pl-10",
                    "focus:border-blue-200 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  )}
                />
              </div>
            </div>

            {/* Forget Password Link */}

            <div className="mb-4 text-right">
              <a
                href="javascript:void(0)"
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "h-10 w-full rounded-lg py-2 px-4 font-medium transition duration-300 ease-in-out",
                "inline-flex items-center justify-center gap-2",
                "bg-slate-900 text-white hover:bg-slate-700",
                "disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <LoaderCircle
                  className="animate-spin"
                  color={loading ? "#9CA3AF" : "#fff"}
                />
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Sign-up Link */}
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-600">New here? </span>

            <Link
              to="/organizer/register"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginAttendee;
