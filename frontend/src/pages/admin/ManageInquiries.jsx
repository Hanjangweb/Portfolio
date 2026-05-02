import React, { useEffect, useState } from 'react';
import { contactAPI } from '../../utils/api';
import { useFetch } from '../../hooks/useCustom';
import { Mail, User, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageInquiries = () => {
  const { fetchData } = useFetch();
  const [inquiries, setInquiries] = useState([]);

  const loadInquiries = async () => {
    try {
      const data = await fetchData(() => contactAPI.getAll());
      setInquiries(data?.data || []);
    } catch (error) {
      console.error('Error loading inquiries:', error);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Inquiries</h1>
        <div className="text-sm text-gray-500 bg-white dark:bg-[#0f172a] px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          Total: <span className="font-bold text-primary">{inquiries.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {inquiries.map((inquiry) => (
          <div key={inquiry._id} className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-blue-600">
                  <User size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{inquiry.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={14} />
                    {inquiry.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Clock size={14} />
                {new Date(inquiry.createdAt).toLocaleString()}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject: {inquiry.subject}</p>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{inquiry.message}</p>
            </div>
            
            <div className="mt-4 flex justify-end gap-3">
              <a 
                href={`mailto:${inquiry.email}`}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Reply via Email
              </a>
            </div>
          </div>
        ))}
        
        {inquiries.length === 0 && (
          <div className="py-20 text-center bg-white dark:bg-[#0f172a] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
            <Mail size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No inquiries yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageInquiries;
