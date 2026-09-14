import { useMe } from '../../hooks/useApi';
import { ResourceGridSkeleton } from '../ui/Skeleton';

export function AuthInit({ children }) {
  const { isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ResourceGridSkeleton count={3} />
      </div>
    );
  }

  return children;
}
