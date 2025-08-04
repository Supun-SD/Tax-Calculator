import { useState } from 'react';

export default function SimpleCard() {
    const [count, setCount] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Welcome to React!
                    </h1>
                    <p className="text-gray-600">
                        This is a simple card component with Tailwind CSS styling.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="text-center">
                        <p className="text-lg text-gray-700 mb-3">
                            Counter: <span className="font-semibold text-blue-600">{count}</span>
                        </p>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => setCount(count - 1)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                                -
                            </button>
                            <button
                                onClick={() => setCount(count + 1)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <button
                            onClick={() => setIsLiked(!isLiked)}
                            className={`w-full py-2 px-4 rounded font-medium transition-colors ${isLiked
                                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {isLiked ? '❤️ Liked!' : '🤍 Click to like'}
                        </button>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        Built with React & Tailwind CSS
                    </div>
                </div>
            </div>
        </div>
    );
}