import { Building2, Users, FileText, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@repo/ui';
import { Heading3, Body, Caption } from '@repo/ui';

interface WorkspaceStatCardsProps {
  totalWorkspaces: number;
  activeMembers: number;
  totalProcesses: number;
  totalDepartments: number;
  isLoading?: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  isLoading?: boolean;
}

const StatCard = ({ title, value, icon: Icon, color, bgColor, isLoading }: StatCardProps) => {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Caption className="text-gray-600 text-xs">{title}</Caption>
            {isLoading ? (
              <div className="h-6 w-16 bg-gray-200 animate-pulse rounded mt-1" />
            ) : (
              <Body className="text-gray-900 font-semibold mt-0.5">{value}</Body>
            )}
          </div>
          <div className={`p-2 rounded-lg ${bgColor}`}>
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const WorkspaceStatCards = ({
  totalWorkspaces,
  activeMembers,
  totalProcesses,
  totalDepartments,
  isLoading = false,
}: WorkspaceStatCardsProps) => {
  const stats = [
    {
      title: 'Total Workspaces',
      value: totalWorkspaces,
      icon: Building2,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Membres Actifs',
      value: activeMembers,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Processus',
      value: totalProcesses,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Départements',
      value: totalDepartments,
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          bgColor={stat.bgColor}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
};
