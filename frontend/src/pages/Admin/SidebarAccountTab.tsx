import { useState } from "react";
import { LogOut, User } from "lucide-react";

interface AdminAccountProps {
  adminName: string;
  adminEmail: string;
}

export default function AdminAccount({
  adminName,
  adminEmail,
}: AdminAccountProps) {
  const [showInfo, setShowInfo] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      // Your logout logic here
      console.log("Signed out");
    }
  };

  return (
    <div className="relative border-t border-gray-700 p-3 flex items-center justify-between">
      {/* Name & Avatar */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setShowInfo((prev) => !prev)}
      >
        <User className="w-6 h-6 text-white" />
        <span className="text-sm font-medium">{adminName}</span>
      </div>

      {/* Logout Icon */}
      <LogOut
        className="w-5 h-5 text-red-400 cursor-pointer hover:text-red-300"
        onClick={handleLogout}
      />

      {/* Admin Info Card */}
      {showInfo && (
        <div className="absolute bottom-14 left-0 w-56 bg-gray-900 text-white rounded-lg shadow-lg p-4 z-50">
          <h3 className="font-semibold mb-1">{adminName}</h3>
          <p className="text-sm text-gray-300">{adminEmail}</p>
          <p className="mt-2 text-xs text-gray-400">Role: Administrator</p>
        </div>
      )}
    </div>
  );
}
