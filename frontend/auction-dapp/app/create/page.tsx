"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { Upload, Calendar, DollarSign, Percent, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CreateAuctionPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingBid: "",
    reservePrice: "",
    duration: "",
    royalty: "",
    category: "",
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleCreateAuction = async () => {
    setIsCreating(true)

    // Simulate auction creation
    setTimeout(() => {
      alert("Auction created successfully!")
      setIsCreating(false)
      // Reset form or redirect
    }, 3000)
  }

  return (
    <div className="min-h-screen gradient-bg">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/auctions">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Auctions
            </Link>
          </Button>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Create <span className="gradient-text">Auction</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              List your NFT for auction and let collectors bid on your unique digital artwork.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Upload Section */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Artwork
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-purple-500/50 rounded-lg p-8 text-center">
                  {imageFile ? (
                    <div>
                      <p className="text-green-400 mb-2">✓ File uploaded successfully</p>
                      <p className="text-sm text-gray-400">{imageFile.name}</p>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-12 w-12 mx-auto mb-4 text-purple-400" />
                      <p className="text-lg mb-2">Drop your file here, or browse</p>
                      <p className="text-sm text-gray-400">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button variant="outline" className="mt-4 border-purple-500">
                      Choose File
                    </Button>
                  </Label>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="art">Digital Art</SelectItem>
                        <SelectItem value="photography">Photography</SelectItem>
                        <SelectItem value="3d">3D Models</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Details Section */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Auction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter artwork title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your artwork..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startingBid" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Starting Bid (SUI)
                      </Label>
                      <Input
                        id="startingBid"
                        type="number"
                        placeholder="10"
                        step="0.01"
                        value={formData.startingBid}
                        onChange={(e) => handleInputChange("startingBid", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="reservePrice">Reserve Price (SUI)</Label>
                      <Input
                        id="reservePrice"
                        type="number"
                        placeholder="100"
                        step="0.01"
                        value={formData.reservePrice}
                        onChange={(e) => handleInputChange("reservePrice", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="duration" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Duration
                      </Label>
                      <Select onValueChange={(value) => handleInputChange("duration", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Day</SelectItem>
                          <SelectItem value="3">3 Days</SelectItem>
                          <SelectItem value="7">7 Days</SelectItem>
                          <SelectItem value="14">14 Days</SelectItem>
                          <SelectItem value="30">30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="royalty" className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Royalty (%)
                      </Label>
                      <Input
                        id="royalty"
                        type="number"
                        placeholder="10"
                        min="0"
                        max="50"
                        value={formData.royalty}
                        onChange={(e) => handleInputChange("royalty", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Auction Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Platform Fee</span>
                      <span>2.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Creator Royalty</span>
                      <span>{formData.royalty || "0"}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">You will receive</span>
                      <span className="font-semibold">
                        {formData.startingBid ? (Number.parseFloat(formData.startingBid) * 0.975).toFixed(3) : "0"} SUI
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCreateAuction}
                  disabled={!formData.title || !formData.startingBid || !imageFile || isCreating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isCreating ? "Creating Auction..." : "Create Auction"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
