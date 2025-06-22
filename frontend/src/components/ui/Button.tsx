import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', children, ...props }) => {
  const base = 'px-4 py-2 rounded font-medium';
  const styles =
    variant === 'primary'
      ? 'bg-blue-500 text-white hover:bg-blue-600'
      : 'bg-gray-200 text-black hover:bg-gray-300';

  return <button className={`${base} ${styles}`} {...props}>{children}</button>;
};

export default Button;
