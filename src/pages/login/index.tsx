import Authentication from '@/Authentication';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {}

const Login: React.FC<Props> = () => {
  return <Authentication />;
};

export default observer(Login);
