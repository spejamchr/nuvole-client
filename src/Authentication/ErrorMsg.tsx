import { authenticationStore } from '@/AuthenticationStore';
import { AuthenticatingError } from '@/AuthenticationStore/Types';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {}

const errorMessge = (state: AuthenticatingError): string => {
  switch (state.error.kind) {
    case 'bad-url':
    case 'timeout':
    case 'bad-payload':
      return 'Service error, please try again later';
    case 'bad-status':
      switch (state.error.response.status) {
        case 401:
          return 'Incorrect email/password login';
        default:
          return 'Service error, please try again later';
      }
    case 'network-error':
      return 'Network error: is there an internet connection?';
  }
};

const ErrorMsg: React.FC<Props> = () => {
  switch (authenticationStore.state.kind) {
    case 'waiting':
    case 'form-entry':
    case 'form-ready':
    case 'authenticating':
    case 'authenticated':
      return <></>;
    case 'authenticating-error':
      return <div className={`pb-4 text-rose-200`}>{errorMessge(authenticationStore.state)}</div>;
  }
};

export default observer(ErrorMsg);
