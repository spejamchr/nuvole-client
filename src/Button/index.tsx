import clsx from 'clsx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

const Button: React.FC<Props> = ({ children, className, ...rest }) => {
  return (
    <button
      className={clsx(
        className,
        `m-1 rounded-full border border-gray-500 bg-gray-900 px-4 py-1 text-gray-300 drop-shadow-xl transition disabled:border-gray-600 disabled:bg-gray-800 disabled:text-gray-400 disabled:drop-shadow-md`,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};

export default observer(Button);
