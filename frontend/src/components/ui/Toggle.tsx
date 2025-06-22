import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => (
  <label className="inline-flex items-center cursor-pointer">
    <span className="mr-2 text-sm">Dark Mode</span>
    <input
      type="checkbox"
      className="sr-only"
      checked={checked}
      onChange={onChange}
    />
    <div className="w-10 h-6 bg-gray-300 rounded-full shadow-inner">
      <div
        className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-1'
        }`}
      ></div>
    </div>
  </label>
);

export default Toggle;
