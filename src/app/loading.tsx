export default function Loading() {
    return (
        <div className="flex flex-col items-center space-y-4 my-auto">
            {/* Animated Spinner */}
            <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div
                    className="w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin absolute top-0 left-0"
                    style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                ></div>
            </div>

            {/* Pulsing Dots */}
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </div>

            {/* Loading Text */}
            <p className="text-gray-600 font-medium animate-pulse text-2xl">
                Loading...
            </p>
        </div>
    );
}