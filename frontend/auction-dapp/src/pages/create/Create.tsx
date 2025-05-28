import { useState } from 'react';
import './Create.css';

const Create = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startingPrice: '',
    duration: '24',
    image: null as File | null,
    previewUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle NFT creation logic here
    console.log('Form submitted:', formData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        image: file,
        previewUrl: URL.createObjectURL(file)
      }));
    }
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <h1>Create New NFT</h1>
        <p className="subtitle">Create and auction your unique digital assets</p>

        <form onSubmit={handleSubmit} className="create-form">
          <div className="form-layout">
            {/* Left Section - Image Upload */}
            <div className="image-section">
              <div className="image-upload-area"
                   style={{
                     backgroundImage: formData.previewUrl ? `url(${formData.previewUrl})` : 'none'
                   }}>
                {!formData.previewUrl && (
                  <div className="upload-placeholder">
                    <i className="fas fa-image"></i>
                    <p>Click or drag image to upload</p>
                    <span>Supports JPG, PNG and GIF. Max size: 10MB.</span>
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="file-input"
                />
              </div>
            </div>

            {/* Right Section - Basic Details */}
            <div className="details-section">
              <div className="form-group">
                <label htmlFor="name">NFT Name</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter NFT name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Starting Price (ETH)</label>
                <input
                  type="number"
                  id="price"
                  value={formData.startingPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, startingPrice: e.target.value }))}
                  placeholder="0.01"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">Auction Duration</label>
                <select
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                >
                  <option value="24">24 Hours</option>
                  <option value="48">48 Hours</option>
                  <option value="72">72 Hours</option>
                  <option value="168">7 Days</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bottom Section - Description */}
          <div className="bottom-section">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your NFT"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary create-btn">
              Create NFT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
