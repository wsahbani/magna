/**
 * Dashboard Page
 * Main dashboard with statistics and overview
 */

import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui'
import {
  TrendingUp,
  FileText,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Workflow,
  Activity,
} from 'lucide-react'

interface StatCard {
  title: string
  value: string | number
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon: any
  color: string
}

const stats: StatCard[] = [
  {
    title: 'Total Processes',
    value: '156',
    change: '+12%',
    changeType: 'positive',
    icon: Workflow,
    color: 'text-blue-600 bg-blue-100',
  },
  {
    title: 'Published',
    value: '89',
    change: '+8%',
    changeType: 'positive',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100',
  },
  {
    title: 'In Review',
    value: '23',
    change: '-3%',
    changeType: 'negative',
    icon: Clock,
    color: 'text-orange-600 bg-orange-100',
  },
  {
    title: 'Total Users',
    value: '48',
    change: '+5',
    changeType: 'positive',
    icon: Users,
    color: 'text-purple-600 bg-purple-100',
  },
]

const recentActivities = [
  {
    user: 'Sarah Martin',
    action: 'published',
    target: 'Sales Pipeline Process',
    time: '2 hours ago',
    type: 'publish',
  },
  {
    user: 'John Doe',
    action: 'commented on',
    target: 'Customer Onboarding',
    time: '4 hours ago',
    type: 'comment',
  },
  {
    user: 'Emma Wilson',
    action: 'created',
    target: 'New HR Process',
    time: '6 hours ago',
    type: 'create',
  },
  {
    user: 'Michael Brown',
    action: 'approved',
    target: 'Invoice Processing',
    time: '1 day ago',
    type: 'approve',
  },
]

const pendingReviews = [
  { name: 'Customer Support Process', department: 'Support', daysWaiting: 2 },
  { name: 'Expense Approval', department: 'Finance', daysWaiting: 5 },
  { name: 'Employee Onboarding', department: 'HR', daysWaiting: 1 },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    {stat.change && (
                      <p className="text-sm mt-2 flex items-center gap-1">
                        <TrendingUp
                          className={`w-4 h-4 ${
                            stat.changeType === 'positive'
                              ? 'text-green-600'
                              : stat.changeType === 'negative'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        />
                        <span
                          className={
                            stat.changeType === 'positive'
                              ? 'text-green-600'
                              : stat.changeType === 'negative'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }
                        >
                          {stat.change}
                        </span>
                        <span className="text-gray-500">vs last month</span>
                      </p>
                    )}
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-medium text-sm">
                      {activity.user.split(' ').map((n) => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-gray-600">{activity.action}</span>{' '}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingReviews.map((review, index) => (
                <div key={index} className="pb-4 border-b last:border-0 last:pb-0">
                  <p className="text-sm font-medium text-gray-900">{review.name}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{review.department}</span>
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full">
                      {review.daysWaiting}d waiting
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-orange-600 hover:text-orange-700 font-medium">
              View all pending reviews →
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Process Status Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Process by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: 'Published', count: 89, color: 'bg-green-600', percentage: 57 },
                { status: 'In Review', count: 23, color: 'bg-orange-600', percentage: 15 },
                { status: 'Draft', count: 34, color: 'bg-blue-600', percentage: 22 },
                { status: 'Archived', count: 10, color: 'bg-gray-400', percentage: 6 },
              ].map((item) => (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition-colors group">
                <FileText className="w-8 h-8 text-gray-400 group-hover:text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  New Process
                </p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition-colors group">
                <Users className="w-8 h-8 text-gray-400 group-hover:text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  Add User
                </p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition-colors group">
                <Workflow className="w-8 h-8 text-gray-400 group-hover:text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  View Templates
                </p>
              </button>
              <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-600 hover:bg-orange-50 transition-colors group">
                <FileText className="w-8 h-8 text-gray-400 group-hover:text-orange-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  Upload Document
                </p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
