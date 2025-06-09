// components/Hero.js
export default function Hero() {
    return (
        <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
            <div className="container mx-auto px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Beautiful UI Components
                    </h1>
                    <p className="text-xl text-gray mb-8">
                        Modern design system for your Next.js projects
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button className="bg-primary hover:bg-secondary text-white
              px-8 py-3 rounded-lg font-medium">
                            Get Started
                        </button>
                        <button className="border-2 border-primary text-primary
              hover:bg-primary/10 px-8 py-3 rounded-lg font-medium">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}