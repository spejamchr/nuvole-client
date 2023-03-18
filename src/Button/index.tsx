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
      className={clsx(className, `m-1 border border-gray-500 bg-gray-900 px-2 py-1 text-gray-400`)}
      {...rest}
    >
      {children}
    </button>
  );
};

export default observer(Button);
