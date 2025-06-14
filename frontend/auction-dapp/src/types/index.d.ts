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
  durationMs: number;
  nftId: string;
  startTime?: number;
  endTime?: number;
};
