import React from 'react';

interface InputFieldWithErrorsProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputFieldWithErrors: React.FC<InputFieldWithErrorsProps> = ({
  placeholder,
  value,
  onChange,
  error,
  onKeyDown,
}) => {
  const inputClasses = `px-4 py-3 rounded-md bg-gray-700 text-white border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ${error ? 'border-red-500' : 'border-gray-600'}`;

  return (
    <div className="flex flex-col w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={inputClasses}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default InputFieldWithErrors;
