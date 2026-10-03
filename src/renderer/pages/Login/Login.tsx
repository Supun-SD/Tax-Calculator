import { useEffect, useState } from "react";
import { ImCalculator } from "react-icons/im";
import {
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdError,
  MdPerson,
} from "react-icons/md";
import { Text } from "@radix-ui/themes";
import { ClipLoader } from "react-spinners";
import { useUserContext } from "../../contexts/UserContext";
import packageJson from "../../../../package.json";
import { check } from "@tauri-apps/plugin-updater";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useUserContext();

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const update = await check();

        if (!update) {
          console.log("No update available.");
          return;
        }

        console.log(`Update available: ${update.version}`);

        await update.downloadAndInstall((event) => {
          switch (event.event) {
            case "Started":
              console.log(
                `Downloading update: ${event.data.contentLength ?? 0} bytes`
              );
              break;

            case "Progress":
              console.log(`Downloaded ${event.data.chunkLength} bytes`);
              break;

            case "Finished":
              console.log("Update download finished.");
              break;
          }
        });

        console.log("Update installed.");
      } catch (error) {
        console.error("Automatic update failed:", error);
      }
    };

    checkForUpdates();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trim(),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      return;
    }
    await login(formData.username, formData.password);
  };

  const isSubmitDisabled = !formData.username || !formData.password;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mt-12 flex flex-col items-center justify-center p-8">
      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-blue-400/20">
              <ImCalculator className="text-4xl text-blue-300" />
            </div>
            <Text className="text-4xl font-bold text-white">
              TAX CALCULATOR
            </Text>
          </div>
        </div>

        {/* Login Form */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-8 py-12 backdrop-blur-sm">
          <div className="mb-6 text-center">
            <Text className="mb-2 text-2xl font-bold text-white">
              Welcome Back
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdPerson className="text-xl text-gray-400" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="h-12 w-full rounded-lg border border-white/20 bg-white/10 pl-10 pr-4 text-white placeholder-gray-300/50 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your username"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MdLock className="text-xl text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="h-12 w-full rounded-lg border border-white/20 bg-white/10 pl-10 pr-12 text-white placeholder-gray-300/50 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 transition-colors duration-200 hover:text-gray-300"
                  disabled={loading}
                >
                  {showPassword ? (
                    <MdVisibilityOff className="text-xl" />
                  ) : (
                    <MdVisibility className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                <MdError className="flex-shrink-0 text-lg text-red-400" />
                <Text className="text-sm text-red-200">{error}</Text>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isSubmitDisabled}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-blue-400/30 bg-blue-400/20 font-medium text-blue-300 transition-all duration-200 hover:scale-105 hover:bg-blue-400/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <ClipLoader color="#60A5FA" size={20} />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <Text className="text-sm text-gray-400">
            Tax Calculation System v{packageJson.version}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;
