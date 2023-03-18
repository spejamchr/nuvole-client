import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  password?: boolean;
}

const TextIput: React.FC<Props> = ({ label, value, onChange, password }) => {
  return (
    <div className={`w-full p-1`}>
      <label className={`flex w-full items-center justify-between`}>
        <span className={`w-full px-4 text-right`}>{label}</span>
        <input
          className={`bg-gray-700`}
          type={password ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  );
};

export default observer(TextIput);
