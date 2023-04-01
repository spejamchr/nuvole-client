import { SubmittingError } from '@/FormStore/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { AuthenticationFormPayload, AuthFormStore } from './Types';

interface Props {
  store: AuthFormStore;
}

const errorMessge = (state: SubmittingError<AuthenticationFormPayload>): string => {
  switch (state.error.kind) {
    case 'missing-link':
      return 'Form not submittable';
    case 'failed-decoder':
      return 'Form submitted successfully, but received unexpected response';
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

const ErrorMsg: React.FC<Props> = ({ store }) => {
  switch (store.state.kind) {
    case 'waiting':
    case 'loading':
    case 'loading-error':
    case 'ready':
    case 'submitting':
    case 'submitted':
      return <></>;
    case 'submitting-error':
      return <div className={`pb-4 text-rose-200`}>{errorMessge(store.state)}</div>;
  }
};

export default observer(ErrorMsg);
