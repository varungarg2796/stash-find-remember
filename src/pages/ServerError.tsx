
import ErrorPage from "@/components/ErrorPage";

interface ServerErrorProps {
  onRetry?: () => void;
}

const ServerError = ({ onRetry }: ServerErrorProps) => {
  return (
    <ErrorPage
      errorCode="500"
      title="Server Error"
      description="Something went wrong on our end. Please try again in a few moments."
      showRefreshButton={true}
      onRefresh={onRetry || (() => window.location.reload())}
    />
  );
};

export default ServerError;
