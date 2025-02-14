import React from 'react';
import { InputFieldProps } from '../interface/props';

//テキストなどのinput要素を構成するコンポーネント
export const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  value,
  placeholder,
  onChange,
  accept,
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <input
        id={id}
        type={type}
        className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-blue-300 focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        accept={accept}
      />
    </div>
  );
};

export default InputField;
