"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { Clock, TrendingUp, Users, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Bid {
  id: string
  bidder: string
  amount: number
  timestamp: Date
}

interface AuctionDetails {
  id: string
  title: string
  artist: string
  description: string
  currentBid: number
  minBid: number
  endTime: Date
  image: string
  bidCount: number
  isActive: boolean
  bids: Bid[]
  creator: string
  royalty: number
}

export default function AuctionDetailPage() {
  const params = useParams()
  const [auction, setAuction] = useState<AuctionDetails | null>(null)
  const [bidAmount, setBidAmount] = useState("")
  const [timeRemaining, setTimeRemaining] = useState("")
  const [isPlacingBid, setIsPlacingBid] = useState(false)

  useEffect(() => {
    // Mock auction details
    const mockAuction: AuctionDetails = {
      id: params.id as string,
      title: "Cosmic Nebula #001",
      artist: "PreditorArtist",
      description:
        "A stunning representation of cosmic beauty, this NFT captures the ethereal dance of stellar gases and cosmic dust in a distant nebula. Created using advanced digital techniques, this piece represents the intersection of art and astronomy.",
      currentBid: 2.5,
      minBid: 2.6,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      image: "/placeholder.svg?height=600&width=600",
      bidCount: 12,
      isActive: true,
      creator: "0x1234...5678",
      royalty: 10,
      bids: [
        { id: "1", bidder: "0xabcd...efgh", amount: 2.5, timestamp: new Date(Date.now() - 10 * 60 * 1000) },
        { id: "2", bidder: "0x9876...5432", amount: 2.3, timestamp: new Date(Date.now() - 25 * 60 * 1000) },
        { id: "3", bidder: "0xfedc...ba98", amount: 2.1, timestamp: new Date(Date.now() - 45 * 60 * 1000) },
      ],
    }
    setAuction(mockAuction)
  }, [params.id])

  useEffect(() => {
    if (!auction) return

    const updateTimer = () => {
      const now = new Date()
      const diff = auction.endTime.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining("Auction Ended")
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      )
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [auction])

  const handlePlaceBid = async () => {
    if (!bidAmount || Number.parseFloat(bidAmount) < auction!.minBid) return

    setIsPlacingBid(true)

    // Simulate bid placement
    setTimeout(() => {
      const newBid: Bid = {
        id: Date.now().toString(),
        bidder: "0x1111...2222", // Current user
        amount: Number.parseFloat(bidAmount),
        timestamp: new Date(),
      }

      setAuction((prev) =>
        prev
          ? {
              ...prev,
              currentBid: Number.parseFloat(bidAmount),
              minBid: Number.parseFloat(bidAmount) + 0.1,
              bidCount: prev.bidCount + 1,
              bids: [newBid, ...prev.bids],
            }
          : null,
      )

      setBidAmount("")
      setIsPlacingBid(false)
    }, 2000)
  }

  if (!auction) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-300">Loading auction details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/auctions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Auctions
            </Link>
          </Button>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="space-y-6">
              <div className="relative">
                <Image
                  src={auction.image || "/placeholder.svg"}
                  alt={auction.title}
                  width={600}
                  height={600}
                  className="w-full rounded-2xl"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">Live Auction</Badge>
                </div>
              </div>

              {/* Auction Stats */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="card-gradient">
                  <CardContent className="p-4 text-center">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                    <p className="text-sm text-gray-400">Current Bid</p>
                    <p className="text-xl font-bold gradient-text">{auction.currentBid} SUI</p>
                  </CardContent>
                </Card>
                <Card className="card-gradient">
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                    <p className="text-sm text-gray-400">Total Bids</p>
                    <p className="text-xl font-bold">{auction.bidCount}</p>
                  </CardContent>
                </Card>
                <Card className="card-gradient">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                    <p className="text-sm text-gray-400">Time Left</p>
                    <p className="text-lg font-bold">{timeRemaining}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl font-bold mb-4">{auction.title}</h1>
                <p className="text-xl text-gray-300 mb-6">by {auction.artist}</p>
                <p className="text-gray-300 leading-relaxed">{auction.description}</p>
              </div>

              {/* Bidding Section */}
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    Place Your Bid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Minimum bid: {auction.minBid} SUI</p>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Enter bid amount in SUI"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={auction.minBid}
                        step="0.1"
                        className="flex-1"
                      />
                      <span className="flex items-center px-3 text-gray-400">SUI</span>
                    </div>
                  </div>
                  <Button
                    onClick={handlePlaceBid}
                    disabled={!bidAmount || Number.parseFloat(bidAmount) < auction.minBid || isPlacingBid}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isPlacingBid ? "Placing Bid..." : "Place Bid"}
                  </Button>
                  <p className="text-xs text-gray-400 text-center">
                    By placing a bid, you agree to our terms and conditions. Funds will be held in escrow.
                  </p>
                </CardContent>
              </Card>

              {/* Auction Details */}
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Auction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creator</span>
                    <span className="font-mono">{auction.creator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Royalty</span>
                    <span>{auction.royalty}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auction End</span>
                    <span>{auction.endTime.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Bid History */}
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Bid History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {auction.bids.map((bid, index) => (
                      <div key={bid.id}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-mono text-sm">{bid.bidder}</p>
                            <p className="text-xs text-gray-400">{bid.timestamp.toLocaleString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">{bid.amount} SUI</p>
                            {index === 0 && (
                              <Badge variant="secondary" className="text-xs">
                                Highest Bid
                              </Badge>
                            )}
                          </div>
                        </div>
                        {index < auction.bids.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
