import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  password?: boolean;
  inputProps?: Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'value' | 'onChange' | 'type'
  >;
}

const TextIput: React.FC<Props> = ({ label, value, onChange, password, inputProps }) => {
  const { className, ...rest } = inputProps || {};
  return (
    <div className={`w-full p-1`}>
      <label className={`flex w-full items-center justify-between`}>
        <span className={`w-full px-4 text-right`}>{label}</span>
        <input
          className={clsx(
            `bg-gray-700 transition duration-200 disabled:bg-gray-600 disabled:text-gray-400`,
            className,
          )}
          type={password ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
      </label>
    </div>
  );
};

export default observer(TextIput);
