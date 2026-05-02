import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from '../hooks/useCustom';
import { authAPI } from '../utils/api';
import { useAuthStore } from '../store/store';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const { values, handleChange, handleSubmit, loading } = useForm(
    {
      email: '',
      password: '',
    },
    async (formData) => {
      try {
        const response = await authAPI.login(formData);
        const { token, user } = response.data;
        setUser(user, token, user.role || 'user');
        toast.success('Logged in successfully!');
        if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <LogIn className="text-blue-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-xs mt-4 border-t pt-4">
          Demo credentials:<br />
          Email: admin@example.com<br />
          Password: password
        </p>
      </div>
    </div>
  );
};

export default Login;
