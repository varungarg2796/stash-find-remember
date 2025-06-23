import { useQuery } from '@tanstack/react-query';
import { shareApi } from '@/services/api/shareApi';

const QUERY_KEYS = {
  sharedCollection: (shareId: string) => ['sharedCollection', shareId],
};

/**
 * Hook to fetch a public, shared collection by its shareId.
 * @param shareId - The unique ID for sharing.
 */
export const useSharedCollectionQuery = (shareId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.sharedCollection(shareId),
    queryFn: () => shareApi.getSharedCollection(shareId),
    enabled: !!shareId, // Only run if a shareId is present
    retry: false, // Don't retry on 404 errors, as it means the collection isn't found
  });
};