import { useCallback, useEffect, useState } from "react";

export const useInfiniteScroll = (fetchMore: () => Promise<void>) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await fetchMore();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [fetchMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  return { loading, error, loadMore };
};
