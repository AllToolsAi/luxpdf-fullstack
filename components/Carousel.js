// components/Carousel.js
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Carousel() {
    return (
        <div className="relative">
            {/* Your content goes here */}

            <button
                type="button"
                aria-label="Previous Slide"
                className="absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-colors"
            >
                <ChevronLeftIcon className="w-6 h-6 text-gray-800" />
            </button>

            <button
                type="button"
                aria-label="Next Slide"
                className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full bg-white/50 hover:bg-white/80 backdrop-blur-sm transition-colors"
            >
                <ChevronRightIcon className="w-6 h-6 text-gray-800" />
            </button>
        </div>
    );
}
