export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "loading-sm",
    md: "loading-md",
    lg: "loading-lg",
  };

  return (
    <div className="flex justify-center items-center">
      <span className={`loading loading-spinner text-primary ${sizeClasses[size]}`}></span>
    </div>
  );
}
