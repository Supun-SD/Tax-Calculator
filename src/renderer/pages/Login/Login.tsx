import { useState } from 'react';
import { ImCalculator } from 'react-icons/im';
import { MdLock, MdVisibility, MdVisibilityOff, MdError, MdPerson } from 'react-icons/md';
import { Text } from '@radix-ui/themes';
import { ClipLoader } from 'react-spinners';
import { useUserContext } from '../../contexts/UserContext';
import { useSettingsContext } from '../../contexts/SettingsContext';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { loading: settingsLoading, error: settingsError, refreshSettings } = useSettingsContext();
    const { login, loading, error } = useUserContext();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value.trim()
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

    if (settingsLoading) {
        return (
            <div className="flex flex-col items-center p-8 mt-36">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12 flex flex-col items-center gap-6">
                    <div className="w-16 h-16 bg-blue-400/20 rounded-xl flex items-center justify-center">
                        <ImCalculator className="text-blue-300 text-4xl" />
                    </div>
                    <div className="text-center">
                        <Text className="text-white text-2xl font-bold mb-2">System Loading</Text><br />
                        <Text className="text-gray-300 text-sm">Initializing Tax Calculation System</Text>
                    </div>
                    <ClipLoader color="#60A5FA" size={40} />
                </div>
            </div>
        );
    }

    if (settingsError) {
        return (
            <div className="flex flex-col items-center p-8 mt-36">
                <div className="bg-red-500/10 backdrop-blur-sm rounded-xl border border-red-500/20 p-12 flex flex-col items-center gap-6 max-w-md">
                    <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center">
                        <MdError className="text-red-400 text-4xl" />
                    </div>
                    <div className="text-center">
                        <Text className="text-red-300 text-2xl font-bold mb-2">System Error</Text><br />
                        <div className="text-gray-300 text-sm">Failed to initialize the system</div><br />
                        <Text className="text-red-200 text-xs bg-red-500/10 rounded-lg p-3 border border-red-500/20 mt-3">
                            {error}
                        </Text>
                    </div>
                    <button
                        onClick={refreshSettings}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg px-6 py-3 font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2"
                    >
                        <MdError className="text-lg" />
                        Reload System
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-8 mt-12">
            {/* Login Container */}
            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        <div className="w-16 h-16 bg-blue-400/20 rounded-xl flex items-center justify-center">
                            <ImCalculator className="text-blue-300 text-4xl" />
                        </div>
                        <Text className="text-white text-4xl font-bold">TAX CALCULATOR</Text>
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-8  py-12">
                    <div className="text-center mb-6">
                        <Text className="text-white text-2xl font-bold mb-2">Welcome Back</Text>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="block text-gray-300 text-sm font-medium">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MdPerson className="text-gray-400 text-xl" />
                                </div>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full h-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300/50 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your username"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="block text-gray-300 text-sm font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MdLock className="text-gray-400 text-xl" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full h-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300/50 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your password"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors duration-200"
                                    disabled={loading}
                                >
                                    {showPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
                                <MdError className="text-red-400 text-lg flex-shrink-0" />
                                <Text className="text-red-200 text-sm">{error}</Text>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || isSubmitDisabled}
                            className="w-full h-12 bg-blue-400/20 hover:bg-blue-400/30 text-blue-300 border border-blue-400/30 rounded-lg font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
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
                <div className="text-center mt-8">
                    <Text className="text-gray-400 text-sm">
                        Tax Calculation System v1.0
                    </Text>
                </div>
            </div>
        </div>
    );
};

export default Login;