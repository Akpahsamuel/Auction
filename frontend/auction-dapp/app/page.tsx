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
                <Image
                  src="/hero-art.png"
                  alt="Preditor NFT Art"
                  width={600}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
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
