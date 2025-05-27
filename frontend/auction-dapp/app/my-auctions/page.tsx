"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { Clock, TrendingUp, Eye, Edit, Trash2, Plus } from "lucide-react"

interface MyAuction {
  id: string
  title: string
  currentBid: number
  endTime: Date
  image: string
  bidCount: number
  status: "active" | "ended" | "draft"
  views: number
}

export default function MyAuctionsPage() {
  const [auctions, setAuctions] = useState<MyAuction[]>([])

  useEffect(() => {
    // Mock user's auctions
    const mockAuctions: MyAuction[] = [
      {
        id: "1",
        title: "Digital Dreamscape",
        currentBid: 1.2,
        endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
        image: "/placeholder.svg?height=300&width=300",
        bidCount: 5,
        status: "active",
        views: 234,
      },
      {
        id: "2",
        title: "Neon Cityscape",
        currentBid: 2.8,
        endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        image: "/placeholder.svg?height=300&width=300",
        bidCount: 12,
        status: "ended",
        views: 456,
      },
      {
        id: "3",
        title: "Abstract Geometry",
        currentBid: 0,
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        image: "/placeholder.svg?height=300&width=300",
        bidCount: 0,
        status: "draft",
        views: 0,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "ended":
        return "bg-gray-500"
      case "draft":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const activeAuctions = auctions.filter((a) => a.status === "active")
  const endedAuctions = auctions.filter((a) => a.status === "ended")
  const draftAuctions = auctions.filter((a) => a.status === "draft")

  const AuctionCard = ({ auction }: { auction: MyAuction }) => (
    <Card className="auction-card hover:scale-105 transition-transform duration-300">
      <CardHeader className="p-0">
        <div className="relative">
          <Image
            src={auction.image || "/placeholder.svg"}
            alt={auction.title}
            width={300}
            height={300}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div className="absolute top-4 right-4">
            <Badge className={getStatusColor(auction.status)}>
              {auction.status.charAt(0).toUpperCase() + auction.status.slice(1)}
            </Badge>
          </div>
          {auction.status === "active" && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="bg-black/50 text-white">
                <Clock className="w-3 h-3 mr-1" />
                {formatTimeRemaining(auction.endTime)}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-xl mb-4">{auction.title}</CardTitle>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-400">Current Bid</p>
            <p className="text-xl font-bold gradient-text">
              {auction.currentBid > 0 ? `${auction.currentBid} SUI` : "No bids"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Bids</p>
            <p className="text-lg font-semibold">{auction.bidCount}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {auction.views} views
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            {auction.bidCount} bids
          </div>
        </div>

        <div className="flex gap-2">
          {auction.status === "draft" ? (
            <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">Publish Auction</Button>
          ) : (
            <Button asChild className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
              <Link href={`/auctions/${auction.id}`}>View Auction</Link>
            </Button>
          )}
          <Button variant="outline" size="icon" className="border-purple-500">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="border-red-500 text-red-400">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                My <span className="gradient-text">Auctions</span>
              </h1>
              <p className="text-xl text-gray-300">Manage your NFT auctions and track their performance.</p>
            </div>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Link href="/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Auction
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="card-gradient">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold gradient-text">{auctions.length}</p>
                <p className="text-gray-400">Total Auctions</p>
              </CardContent>
            </Card>
            <Card className="card-gradient">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-green-400">{activeAuctions.length}</p>
                <p className="text-gray-400">Active</p>
              </CardContent>
            </Card>
            <Card className="card-gradient">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-blue-400">
                  {auctions.reduce((sum, a) => sum + a.currentBid, 0).toFixed(1)}
                </p>
                <p className="text-gray-400">Total Volume (SUI)</p>
              </CardContent>
            </Card>
            <Card className="card-gradient">
              <CardContent className="p-6 text-center">
                <p className="text-3xl font-bold text-purple-400">{auctions.reduce((sum, a) => sum + a.views, 0)}</p>
                <p className="text-gray-400">Total Views</p>
              </CardContent>
            </Card>
          </div>

          {/* Auctions Tabs */}
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/20 backdrop-blur-md">
              <TabsTrigger value="active">Active ({activeAuctions.length})</TabsTrigger>
              <TabsTrigger value="ended">Ended ({endedAuctions.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftAuctions.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-8">
              {activeAuctions.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeAuctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-400 mb-4">No active auctions</p>
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <Link href="/create">Create Your First Auction</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ended" className="mt-8">
              {endedAuctions.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {endedAuctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-400">No ended auctions</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="drafts" className="mt-8">
              {draftAuctions.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {draftAuctions.map((auction) => (
                    <AuctionCard key={auction.id} auction={auction} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-xl text-gray-400">No draft auctions</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
