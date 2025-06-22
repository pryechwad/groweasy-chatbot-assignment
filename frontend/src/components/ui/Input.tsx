import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      className="border p-2 rounded w-full focus:outline-none focus:ring"
      {...props}
    />
  );
};

export default Input;
