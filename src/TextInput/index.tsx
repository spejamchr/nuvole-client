import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  inputProps?: Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'value' | 'onChange'
  >;
  errors?: ReadonlyArray<string>;
}

const TextIput: React.FC<Props> = ({ label, value, onChange, inputProps, errors }) => {
  errors ||= [];
  const { className, ...rest } = inputProps || {};
  return (
    <div className={`w-full p-1`}>
      <label>
        <div>
          {label}
          {inputProps?.required ? (
            <abbr title="Required" className="pl-1 text-rose-200">
              *
            </abbr>
          ) : (
            <></>
          )}
          <span className={`pl-3 text-xs text-rose-200`}>{errors.join(', ')}</span>
        </div>
        <input
          className={clsx(
            `bg-gray-700 transition duration-200 disabled:bg-gray-600 disabled:text-gray-400`,
            { 'border-rose-300': errors.length > 0 },
            className,
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          {...rest}
        />
      </label>
    </div>
  );
};

export default observer(TextIput);
