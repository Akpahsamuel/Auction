export type RouteProps = {
  path: string;
  label: string;
  description?: string;
  roles?: "ADMIN" | "USER";
  component: React.ReactComponentElement<never> | React.ReactElement;
};
