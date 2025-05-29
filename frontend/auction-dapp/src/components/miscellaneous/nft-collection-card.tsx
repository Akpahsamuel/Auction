interface NFTCollectionCardProps {
  images: string[];
  title: string;
  author: string;
  authorImage: string;
  price: number;
  volume: number;
  growth: string;
}

export const NFTCollectionCard = ({
  images,
  title,
  author,
  authorImage,
  price,
  volume,
  growth,
}: NFTCollectionCardProps) => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-xl w-full flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`nft-${i}`}
            className="aspect-square object-cover w-full h-full rounded-xl"
          />
        ))}
      </div>

      <div className="mt-4 flex justify-between items-start">
        <div className="flex flex-col gap-3">
          <h2 className="font-semibold text-xl">{title}</h2>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <img
              src={authorImage}
              alt="author"
              className="w-10 h-10 rounded-full object-cover border-2 border-[#006fee]"
            />
            <span>by {author}</span>
          </div>
        </div>
        <div className="text-green-600 bg-green-100 text-xs font-semibold px-2 py-[2px] rounded-full">
          {growth}
        </div>
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <div>
          <p className="text-xs">Floor Price</p>
          <p className="font-medium">{price} ETH</p>
        </div>
        <div>
          <p className="text-xs">Volume</p>
          <p className="font-medium">{volume} ETH</p>
        </div>
        <button className="text-[#006fee] !px-4 !py-2 rounded-lg bg-[#006fee]/20 font-semibold cursor-pointer hover:opacity-80 transition-all duration-300">
          View
        </button>
      </div>
    </div>
  );
};
