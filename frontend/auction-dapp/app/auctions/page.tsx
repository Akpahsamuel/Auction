"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Clock, Heart } from "lucide-react"

interface Auction {
  id: string
  title: string
  artist: string
  currentBid: number
  endTime: Date
  image: string
  bidCount: number
  isActive: boolean
}

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<Auction[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "ending">("all")

  useEffect(() => {
    // Mock auction data
    const mockAuctions: Auction[] = [
      {
        id: "1",
        title: "Cosmic Nebula #001",
        artist: "PreditorArtist",
        currentBid: 2.5,
        endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        image: "/placeholder.svg?height=300&width=300",
        bidCount: 12,
        isActive: true,
      },
      {
        id: "2",
        title: "Stellar Formation",
        artist: "CosmicCreator",
        currentBid: 1.8,
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
        image: "/placeholder.svg?height=300&width=300",
        bidCount: 8,
        isActive: true,
      },
      {
        id: "3",
        title: "Galactic Swirl",
        artist: "StarArtist",
        currentBid: 3.2,
        endTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
        image: "/placeholder.svg?height=300&width=300",
        bidCount: 25,
        isActive: true,
      },
      {
        id: "4",
        title: "Quantum Realm",
        artist: "DigitalDreamer",
        currentBid: 4.1,
        endTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
        image: "/placeholder.svg?height=300&width=300",
        bidCount: 18,
        isActive: true,
      },
    ]
    setAuctions(mockAuctions)
  }, [])

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date()
    const diff = endTime.getTime() - now.getTime()

    if (diff <= 0) return "Ended"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const filteredAuctions = auctions.filter((auction) => {
    if (filter === "active") return auction.isActive
    if (filter === "ending") {
      const timeLeft = auction.endTime.getTime() - Date.now()
      return timeLeft <= 60 * 60 * 1000 // Less than 1 hour
    }
    return true
  })

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Live <span className="gradient-text">Auctions</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover and bid on exclusive Preditor NFTs. Don't miss out on these rare digital artworks.
            </p>
          </div>

          {/* Filters */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2 p-1 bg-black/20 rounded-lg backdrop-blur-md">
              <Button
                variant={filter === "all" ? "default" : "ghost"}
                onClick={() => setFilter("all")}
                className={filter === "all" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
              >
                All Auctions
              </Button>
              <Button
                variant={filter === "active" ? "default" : "ghost"}
                onClick={() => setFilter("active")}
                className={filter === "active" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
              >
                Active
              </Button>
              <Button
                variant={filter === "ending" ? "default" : "ghost"}
                onClick={() => setFilter("ending")}
                className={filter === "ending" ? "bg-gradient-to-r from-purple-600 to-pink-600" : ""}
              >
                Ending Soon
              </Button>
            </div>
          </div>

          {/* Auctions Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAuctions.map((auction) => (
              <Card key={auction.id} className="auction-card hover:scale-105 transition-transform duration-300">
                <CardHeader className="p-0">
                  <div className="relative">
                    <Image
                      src={auction.image || "/placeholder.svg"}
                      alt={auction.title}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-black/50 text-white">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeRemaining(auction.endTime)}
                      </Badge>
                    </div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">Live</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <CardTitle className="text-xl mb-2">{auction.title}</CardTitle>
                  <p className="text-gray-400 mb-4">by {auction.artist}</p>

                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <p className="text-sm text-gray-400">Current Bid</p>
                      <p className="text-2xl font-bold gradient-text">{auction.currentBid} SUI</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Bids</p>
                      <p className="text-lg font-semibold">{auction.bidCount}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      asChild
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Link href={`/auctions/${auction.id}`}>Place Bid</Link>
                    </Button>
                    <Button variant="outline" size="icon" className="border-purple-500">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAuctions.length === 0 && (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400">No auctions found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
