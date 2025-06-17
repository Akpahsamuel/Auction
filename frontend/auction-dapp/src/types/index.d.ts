export type RouteProps = {
  path: string;
  label: string;
  description?: string;
  roles?: "ADMIN" | "USER";
  component: React.ReactComponentElement<never> | React.ReactElement;
};

export type Auction = {
  title: string;
  description: string;
  startingBid: number;
  endTimeMs: number; // Absolute timestamp in milliseconds
  nftId: string;
  startTime?: number;
  endTime?: number;
  // NFT metadata for completed auction storage
  nftName?: string;
  nftDescription?: string;
  nftImageUrl?: string;
};
