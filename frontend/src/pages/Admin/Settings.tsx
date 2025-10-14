import React from "react";
import {
  UserPlus,
  Palette,
  Settings as SettingsIcon,
  Shield,
} from "lucide-react";
import SideBar from "../Admin/SideBar";
import { useNavigate } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();

  const goToAdminLogin = () => {
    navigate("/admin/Login");
  };

  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-gray-50 p-6">
        {/* Page Header */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <SettingsIcon className="w-8 h-8 text-red-500 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                Sna<span className="text-red-500">Plan</span> Admin Settings
              </h1>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Admin Management Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="bg-red-50 p-3 rounded-lg mr-4">
                  <UserPlus className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Admin Management
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Add new administrators to the system
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-700">
                  Register new admin users and manage administrative access to
                  the platform.
                </p>
                <button
                  onClick={goToAdminLogin}
                  className="w-full bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium cursor-pointer"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Register New Admin</span>
                </button>
              </div>
            </div>
            {/* Theme Settings Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="bg-purple-50 p-3 rounded-lg mr-4">
                  <Palette className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Theme Settings
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Switch between light and dark modes
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-700">
                  Toggle between dark and light theme modes for a personalized
                  experience.
                </p>
                <button className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium">
                  <Palette className="w-5 h-5" />
                  <span>Toggle Theme Mode</span>
                </button>
              </div>
            </div>

            {/* System Security Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-50 p-3 rounded-lg mr-4">
                  <Shield className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    System Security
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Configure security settings and permissions
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-700">
                  Manage system-wide security settings, user permissions, and
                  access controls.
                </p>
                <button className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium">
                  <Shield className="w-5 h-5" />
                  <span>Security Settings</span>
                </button>
              </div>
            </div>

            {/* Application Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center mb-4">
                <div className="bg-green-50 p-3 rounded-lg mr-4">
                  <SettingsIcon className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    System Information
                  </h2>
                  <p className="text-gray-600 text-sm">
                    View application details and status
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-gray-700 space-y-2">
                  <div className="flex justify-between">
                    <span>Version:</span>
                    <span className="font-medium">v1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-600 font-medium">● Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="flex flex-wrap gap-3">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
                System Health Check
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
                Export Logs
              </button>
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
                Backup Settings
              </button>
              <button className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200 text-sm font-medium">
                Clear Cache
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
