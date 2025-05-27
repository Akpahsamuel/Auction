import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ArrowRight, TrendingUp, Users, Zap } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Collect Super Rare <span className="gradient-text">Preditor Art & NFTs</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Join our preditor and NFTs and create your own collection. Discover the best Preditor Art and participate in
                exclusive auctions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8"
                >
                  <Link href="/auctions">
                    Explore Auctions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-lg px-8"
                >
                  <Link href="/create">How it works?</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-8">
                <div>
                  <div className="text-3xl font-bold text-white">20k</div>
                  <div className="text-gray-400">Active Users</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">16k</div>
                  <div className="text-gray-400">Total Volume (SUI)</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">12k</div>
                  <div className="text-gray-400">Artists</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <div className="animate-bounce w-[350px] mx-auto">
                  <div className="relative transform hover:scale-110 transition-transform duration-300">
                    
                    {/* Robot Head */}
                    <div className="relative mx-auto w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl shadow-xl border-3 border-white/20 mb-3">
                      {/* Antenna */}
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                        <div className="w-1 h-4 bg-blue-300 rounded-full"></div>
                        <div className="w-2 h-2 bg-red-400 rounded-full mx-auto animate-pulse"></div>
                      </div>
                      
                      {/* Eyes */}
                      <div className="flex justify-center items-center pt-4 space-x-3">
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-inner">
                          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                        </div>
                        <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-inner">
                          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      
                      {/* Mouth */}
                      <div className="mt-3 flex justify-center">
                        <div className="w-8 h-1 bg-gray-800 rounded-full"></div>
                      </div>
                      
                      {/* Head decorations */}
                      <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-green-400 rounded-full animate-ping"></div>
                      <div className="absolute top-3 right-3 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                    </div>

                    {/* Robot Body */}
                    <div className="relative mx-auto w-40 h-48 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl shadow-2xl border-4 border-white/20">
                      {/* Chest Panel */}
                      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-gray-800 rounded-lg border-2 border-gray-600">
                        <div className="flex justify-center items-center h-full space-x-2">
                          <div className="w-2 h-8 bg-green-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-6 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                          <div className="w-2 h-4 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
                        </div>
                      </div>
                      
                      {/* Control Buttons */}
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                        <div className="w-6 h-6 bg-blue-300 rounded-full shadow-inner hover:bg-blue-200 cursor-pointer transition-colors"></div>
                        <div className="w-6 h-6 bg-purple-300 rounded-full shadow-inner hover:bg-purple-200 cursor-pointer transition-colors"></div>
                        <div className="w-6 h-6 bg-pink-300 rounded-full shadow-inner hover:bg-pink-200 cursor-pointer transition-colors"></div>
                      </div>
                      
                      {/* Side Panels */}
                      <div className="absolute top-12 -left-2 w-4 h-12 bg-gray-700 rounded-l-lg"></div>
                      <div className="absolute top-12 -right-2 w-4 h-12 bg-gray-700 rounded-r-lg"></div>
                    </div>

                    {/* Robot Arms */}
                    <div className="absolute top-32 -left-8 w-6 h-20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full transform rotate-12 origin-top shadow-xl">
                      <div className="absolute -bottom-2 -left-1 w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-500"></div>
                    </div>
                    <div className="absolute top-32 -right-8 w-6 h-20 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full transform -rotate-12 origin-top shadow-xl">
                      <div className="absolute -bottom-2 -right-1 w-8 h-8 bg-gray-600 rounded-full border-2 border-gray-500"></div>
                    </div>

                    {/* Robot Legs */}
                    <div className="flex justify-center space-x-4 mt-2">
                      <div className="w-8 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-xl">
                        <div className="absolute bottom-0 w-12 h-4 bg-gray-800 rounded-full transform -translate-x-2 shadow-lg"></div>
                      </div>
                      <div className="w-8 h-16 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-xl">
                        <div className="absolute bottom-0 w-12 h-4 bg-gray-800 rounded-full transform -translate-x-2 shadow-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Preditor Auctions?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the future of NFT trading with our secure, transparent, and user-friendly auction platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-gradient">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Lightning Fast</h3>
                <p className="text-gray-300">
                  Experience instant bidding with our optimized blockchain integration and real-time updates.
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Secure Trading</h3>
                <p className="text-gray-300">
                  Your funds are protected with smart contracts and escrow services for worry-free transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Global Community</h3>
                <p className="text-gray-300">
                  Join thousands of collectors and artists from around the world in our vibrant marketplace.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-purple-500/20">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold mb-4">Trusted Partners</h3>
            <div className="flex justify-center items-center gap-12 opacity-60">
              <div className="text-lg font-semibold">METAMASK</div>
              <div className="text-lg font-semibold">BINANCE</div>
              <div className="text-lg font-semibold">COINBASE</div>
              <div className="text-lg font-semibold">CYBER WALLET</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
