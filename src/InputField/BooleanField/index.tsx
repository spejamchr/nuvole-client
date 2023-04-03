import { BooleanInput } from '@/Resource/Types';
import clsx from 'clsx';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  input: BooleanInput;
  className?: string;
}

const BooleanField: React.FC<Props> = ({ input, className }) => (
  <div className={`w-full p-1`}>
    <span>
      {input.label}
      <span className={`pl-3 text-xs text-rose-200`}>{input.errors.join(', ')}</span>
    </span>
    <div className={`flex`}>
      <label className={`flex items-center`}>
        <input
          type="radio"
          className={clsx(
            `bg-gray-700 transition duration-200 disabled:bg-gray-600 disabled:text-gray-400`,
            { 'border-rose-300': input.errors.length > 0 },
            className,
          )}
          checked={input.value}
          onChange={action(() => (input.value = !input.value))}
        />
        <span className={`pl-3`}>Yes</span>
      </label>
      <span className={`pl-12`} />
      <label className={`flex items-center`}>
        <input
          type="radio"
          className={clsx(
            `bg-gray-700 transition duration-200 disabled:bg-gray-600 disabled:text-gray-400`,
            { 'border-rose-300': input.errors.length > 0 },
            className,
          )}
          checked={!input.value}
          onChange={action(() => (input.value = !input.value))}
        />
        <span className={`pl-3`}>No</span>
      </label>
    </div>
  </div>
);
export default observer(BooleanField);
