import React, { useEffect, useState } from 'react';
import { analyticsAPI, projectsAPI, blogAPI, contactAPI } from '../../utils/api';
import { useFetch } from '../../hooks/useCustom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Users, FileText, Mail, ArrowUpRight } from 'lucide-react';

export const Dashboard = () => {
  const { fetchData } = useFetch();
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [blog, setBlog] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, projectsData, blogData, messagesData] = await Promise.all([
          fetchData(() => analyticsAPI.getStats().catch(() => ({}))), // Fallback if analytics not ready
          fetchData(() => projectsAPI.getAll()),
          fetchData(() => blogAPI.getAll(1, 100)),
          fetchData(() => contactAPI.getAll()),
        ]);
        setStats(statsData?.data || { totalVisits: 0, weeklyVisits: [], categoryStats: [] });
        setProjects(projectsData?.data || []);
        setBlog(blogData?.data || []);
        setMessages(messagesData?.data || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    loadDashboardData();
  }, [fetchData]);

  const statCards = [
    { title: 'Total Projects', value: projects.length, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Blog Posts', value: blog.length, icon: FileText, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' },
    { title: 'Messages', value: messages.length, icon: Mail, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
    { title: 'Total Visits', value: stats?.totalVisits || 0, icon: Users, color: 'text-orange-600', bg: 'bg-orange-100 dark:bg-orange-900/30' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-emerald-500 flex items-center font-medium">
                <ArrowUpRight size={16} className="mr-1" />
                12%
              </span>
              <span className="text-gray-400 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Visitor Traffic</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.weeklyVisits || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Projects by Category</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.categoryStats || []}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <div className="lg:col-span-1 bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Visited Pages</h2>
          </div>
          <div className="p-6 space-y-4">
            {stats?.topPages?.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-md text-xs font-bold text-gray-500">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                    {page.page === '/' ? 'Home' : (page.page.substring(1).charAt(0).toUpperCase() + page.page.substring(2))}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{page.count} views</span>
              </div>
            ))}
            {(!stats?.topPages || stats.topPages.length === 0) && (
              <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Inquiries</h2>
            <button className="text-primary hover:text-blue-700 text-sm font-semibold transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Subject</th>
                  <th className="px-6 py-4 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {messages.slice(0, 5).map((message) => (
                  <tr key={message._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-white">{message.name}</div>
                      <div className="text-xs text-gray-500">{message.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                        {message.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-gray-500 dark:text-gray-400">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {messages.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No messages yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
