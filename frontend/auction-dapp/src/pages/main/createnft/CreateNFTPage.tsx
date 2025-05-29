import React, { useState, useCallback, useMemo } from "react";
import { ArrowLeft, Upload, Image, Clock, FileText, AlertCircle, CheckCircle2, Sparkles, Eye, Zap } from "lucide-react";

// TypeScript interfaces
interface FormData {
  title: string;
  description: string;
  startingBid: string;
  duration: string;
  durationUnit: DurationUnit;
  category: Category;
  image: File | null;
  imagePreview: string | null;
}

interface FormErrors {
  title?: string;
  description?: string;
  startingBid?: string;
  duration?: string;
  image?: string;
  general?: string;
}

interface DurationUnitOption {
  value: DurationUnit;
  label: string;
  multiplier: number;
}

interface AuctionData {
  title: string;
  description: string;
  starting_bid: number;
  duration_ms: number;
  category: Category;
  image: File;
}

type DurationUnit = "hours" | "days" | "weeks";
type Category = "Digital Art" | "Collectibles" | "Music" | "Photography" | "Gaming" | "Utility";
type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const CreateNFTPage: React.FC = () => {
  // State management with proper typing
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    startingBid: "",
    duration: "",
    durationUnit: "hours",
    category: "Digital Art",
    image: null,
    imagePreview: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("idle");

  // Constants with proper typing
  const categories: readonly Category[] = [
    "Digital Art", 
    "Collectibles", 
    "Music", 
    "Photography", 
    "Gaming", 
    "Utility"
  ] as const;

  const durationUnits: readonly DurationUnitOption[] = [
    { value: "hours", label: "Hours", multiplier: 60 * 60 * 1000 },
    { value: "days", label: "Days", multiplier: 24 * 60 * 60 * 1000 },
    { value: "weeks", label: "Weeks", multiplier: 7 * 24 * 60 * 60 * 1000 }
  ] as const;

  // Memoized values
  const durationInMs = useMemo((): number => {
    if (!formData.duration) return 0;
    const multiplier = durationUnits.find(unit => unit.value === formData.durationUnit)?.multiplier ?? 1;
    return parseInt(formData.duration) * multiplier;
  }, [formData.duration, formData.durationUnit]);

  const formattedDuration = useMemo((): string => {
    if (durationInMs === 0) return "";
    
    const seconds = Math.floor(durationInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
  }, [durationInMs]);

  const isFormValid = useMemo((): boolean => {
    return (
      formData.title.trim().length > 0 &&
      formData.description.trim().length > 0 &&
      formData.startingBid.length > 0 &&
      parseFloat(formData.startingBid) > 0 &&
      formData.duration.length > 0 &&
      parseInt(formData.duration) > 0 &&
      formData.image !== null &&
      Object.keys(errors).length === 0
    );
  }, [formData, errors]);

  // Event handlers with proper typing
  const handleInputChange = useCallback(<K extends keyof FormData>(
    field: K, 
    value: FormData[K]
  ): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors(prev => ({ ...prev, image: "Image size should be less than 10MB" }));
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, image: "Please upload a valid image file (JPG, PNG, GIF, WebP)" }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result as string;
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: result
      }));
    };
    reader.readAsDataURL(file);
    
    // Clear any existing image errors
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: undefined }));
    }
  }, [errors.image]);

  const removeImage = useCallback((): void => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    // Starting bid validation
    if (!formData.startingBid) {
      newErrors.startingBid = "Starting bid is required";
    } else {
      const bid = parseFloat(formData.startingBid);
      if (isNaN(bid) || bid <= 0) {
        newErrors.startingBid = "Starting bid must be a valid number greater than 0";
      } else if (bid < 0.001) {
        newErrors.startingBid = "Minimum starting bid is 0.001 ETH";
      }
    }

    // Duration validation
    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    } else {
      const duration = parseInt(formData.duration);
      if (isNaN(duration) || duration <= 0) {
        newErrors.duration = "Duration must be a valid number greater than 0";
      }
    }

    // Image validation
    if (!formData.image) {
      newErrors.image = "NFT image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback((): void => {
    setFormData({
      title: "",
      description: "",
      startingBid: "",
      duration: "",
      durationUnit: "hours",
      category: "Digital Art",
      image: null,
      imagePreview: null
    });
    setErrors({});
    setSubmissionStatus("idle");
  }, []);

  const handleSubmit = useCallback(async (): Promise<void> => {
    if (!validateForm()) {
      setSubmissionStatus("error");
      return;
    }

    setSubmissionStatus("submitting");
    
    try {
      // Convert ETH to wei (18 decimal places)
      const startingBidWei = Math.floor(parseFloat(formData.startingBid) * 1e18);

      const auctionData: AuctionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        starting_bid: startingBidWei,
        duration_ms: durationInMs,
        category: formData.category,
        image: formData.image!
      };

      console.log("Creating NFT auction with data:", auctionData);
      
      // Simulate API call with realistic delay
      await new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          // Simulate random success/failure for demo
          if (Math.random() > 0.1) {
            resolve();
          } else {
            reject(new Error("Network error occurred"));
          }
        }, 2000);
      });
      
      setSubmissionStatus("success");
      
      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
      }, 3000);
      
    } catch (error) {
      console.error("Error creating auction:", error);
      setSubmissionStatus("error");
      setErrors({ general: "Failed to create NFT auction. Please try again." });
    }
  }, [formData, validateForm, durationInMs, resetForm]);

  const handleGoBack = useCallback((): void => {
    // In a real app, this would use router navigation
    console.log("Navigate back to previous page");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button 
              onClick={handleGoBack}
              className="flex items-center justify-center w-12 h-12 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md group"
              aria-label="Go back"
            >
              <ArrowLeft size={20} className="text-gray-600 group-hover:text-gray-800" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 gradient-text">
                Create NFT Auction
              </h1>
              <p className="text-gray-600 text-lg">
                Upload your digital artwork and set auction parameters
              </p>
            </div>
          </div>
          
          {submissionStatus === "success" && (
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
              <CheckCircle2 size={20} className="text-green-600" />
              <span className="font-medium text-green-800">NFT Auction Created Successfully!</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Image Upload & Preview */}
          <div className="space-y-6">
            {/* Image Upload Section */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Image size={20} className="text-blue-600" />
                  </div>
                  Upload NFT Image
                </h2>
                <p className="text-gray-600 text-sm mt-1">Choose the image that represents your NFT</p>
              </div>
              
              <div className="p-6">
                <div className="relative border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all duration-300 cursor-pointer group">
                  {formData.imagePreview ? (
                    <div className="relative">
                      <img 
                        src={formData.imagePreview} 
                        alt="NFT Preview" 
                        className="max-w-full max-h-80 mx-auto rounded-xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 text-sm font-bold"
                        aria-label="Remove image"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
                        <Upload className="text-gray-400 group-hover:text-blue-500 transition-colors" size={24} />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Drop your NFT image here
                      </h3>
                      <p className="text-gray-500 mb-4">
                        or click to browse from your device
                      </p>
                      <div className="text-sm text-gray-400">
                        Supports JPG, PNG, GIF, WebP • Max 10MB
                      </div>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    aria-label="Upload NFT image"
                  />
                </div>
                
                {errors.image && (
                  <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{errors.image}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Live Preview Card */}
            {formData.imagePreview && (
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Eye size={20} className="text-purple-600" />
                    </div>
                    Live Preview
                  </h3>
                </div>
                <div className="p-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        className="w-full h-48 object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                    <h4 className="font-semibold text-xl text-gray-900 mb-2">
                      {formData.title || "Untitled NFT"}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {formData.description || "No description provided"}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500 font-medium">Starting bid</span>
                      <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {formData.startingBid || "0"} SUI
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Form Fields */}
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText size={20} className="text-green-600" />
                  </div>
                  NFT Details
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    NFT Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter a captivating title for your NFT"
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 outline-none ${
                      errors.title 
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.title && (
                      <div className="flex items-center gap-1">
                        <AlertCircle size={14} className="text-red-500" />
                        <p className="text-red-600 text-sm">{errors.title}</p>
                      </div>
                    )}
                    <p className="text-gray-400 text-sm ml-auto">
                      {formData.title.length}/100
                    </p>
                  </div>
                </div>

                {/* Description Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe your NFT, its story, and what makes it unique..."
                    rows={4}
                    className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 outline-none resize-none ${
                      errors.description 
                        ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                    maxLength={500}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.description && (
                      <div className="flex items-center gap-1">
                        <AlertCircle size={14} className="text-red-500" />
                        <p className="text-red-600 text-sm">{errors.description}</p>
                      </div>
                    )}
                    <p className="text-gray-400 text-sm ml-auto">
                      {formData.description.length}/500
                    </p>
                  </div>
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2 rt-r-gap-4">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value as Category)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-300 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Auction Settings */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Zap size={20} className="text-orange-600" />
                  </div>
                  Auction Settings
                </h2>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Starting Bid Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Starting Bid (SUI) *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.001"
                      min="0.001"
                      value={formData.startingBid}
                      onChange={(e) => handleInputChange("startingBid", e.target.value)}
                      placeholder="0.1"
                      className={`w-full px-4 py-3 pr-12 border rounded-xl transition-all duration-200 outline-none ${
                        errors.startingBid 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      }`}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 font-medium">
                      SUI
                    </div>
                  </div>
                  {errors.startingBid && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertCircle size={14} className="text-red-500" />
                      <p className="text-red-600 text-sm">{errors.startingBid}</p>
                    </div>
                  )}
                </div>

                {/* Duration Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Auction Duration *
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="7"
                      className={`flex-1 px-4 py-3 border rounded-xl transition-all duration-200 outline-none ${
                        errors.duration 
                          ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-200' 
                          : 'border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                      }`}
                    />
                    <select
                      value={formData.durationUnit}
                      onChange={(e) => handleInputChange("durationUnit", e.target.value as DurationUnit)}
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white min-w-[100px]"
                    >
                      {durationUnits.map(unit => (
                        <option key={unit.value} value={unit.value}>{unit.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  {errors.duration && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertCircle size={14} className="text-red-500" />
                      <p className="text-red-600 text-sm">{errors.duration}</p>
                    </div>
                  )}
                  
                  {formattedDuration && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <Clock size={14} className="inline mr-1" />
                        <strong>Duration:</strong> {formattedDuration}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
                  <p className="text-red-700">{errors.general}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || submissionStatus === "submitting"}
                className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  submissionStatus === "success"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/25"
                    : submissionStatus === "error"
                    ? "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg shadow-red-500/25"
                    : isFormValid && submissionStatus !== "submitting"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-600/25 transform hover:scale-[1.02]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {submissionStatus === "submitting" ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Auction...
                  </div>
                ) : submissionStatus === "success" ? (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 size={20} />
                    Auction Created Successfully!
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles size={20} />
                    Create NFT Auction
                  </div>
                )}
              </button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                By creating an auction, you agree to our{' '}
                <button className="text-blue-600 hover:text-blue-700 underline">
                  terms and conditions
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNFTPage;
