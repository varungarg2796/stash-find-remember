
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface ItemCardSkeletonProps {
  viewMode?: "grid" | "list";
}

const ItemCardSkeleton = ({ viewMode = "grid" }: ItemCardSkeletonProps) => {
  if (viewMode === "list") {
    return (
      <Card className="animate-pulse">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <Skeleton className="w-16 h-16 rounded flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-full" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-pulse">
      <div className="relative">
        <Skeleton className="w-full h-48 rounded-t-lg" />
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ItemCardSkeleton;
