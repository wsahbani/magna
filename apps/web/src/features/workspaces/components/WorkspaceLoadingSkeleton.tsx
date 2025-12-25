import { Card, CardContent, CardHeader } from '@repo/ui';

export const WorkspaceLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <Card key={index} className="border-l-4 border-l-gray-300 animate-pulse">
          <CardHeader className="pb-3">
            <div className="flex items-start gap-2 mb-3">
              <div className="w-5 h-5 bg-gray-200 rounded" />
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="flex gap-2">
                  <div className="h-4 bg-gray-200 rounded w-16" />
                  <div className="h-4 bg-gray-200 rounded w-12" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="h-10 bg-gray-100 rounded" />
            
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-100 rounded" />
              ))}
            </div>
            
            <div className="flex gap-2 pt-2">
              <div className="flex-1 h-9 bg-gray-100 rounded" />
              <div className="flex-1 h-9 bg-gray-100 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export const WorkspaceStatCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="border border-gray-200 animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-24 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
