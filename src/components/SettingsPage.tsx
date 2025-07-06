import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col">
      <div className="flex-1 p-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Settings</h1>
        <div className="text-center py-8 text-gray-400">
          <p>Coming soon...</p>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Developed by David Mbazza
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            © 2024 All rights reserved
          </p>
        </div>
      </footer>
    </div>
  );
};