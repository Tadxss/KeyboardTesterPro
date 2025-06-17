import { Heart } from 'lucide-react';

export default function BuyMeACoffee() {
    return (
        <div className="mt-8 bg-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        {/* Background decorative elements */}

        <div className="relative z-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-4xl animate-pulse">❤️</div>
            <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                Enjoying the Keyboard Tester?
            </h3>
            {/* <div className="text-4xl animate-bounce delay-300">💻</div> */}
            </div>
            
            <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            If this tool helped you test your keyboard or saved you time, consider supporting my work! 
            Your support helps me create more useful tools and keep them free for everyone.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-2">
                <a
                    href="https://coff.ee/daryltadss8" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 bg-white hover:bg-yellow-50 text-orange-600 font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border-2 border-orange-200 hover:border-orange-300"
                >
                    <span className="text-2xl group-hover:animate-bounce">☕</span>
                    <span className="text-lg">Buy Me a Coffee</span>
                </a>
            </div>
            
        </div>
        </div>
    )
}
