import { sessionStore } from '@/SessionStore';
import { UserSession } from '@/SessionStore/Types';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  session: UserSession;
  onTimeout: () => void;
}

const alertLengthMs = 60_000;

class AlertTimeoutManager extends React.Component<Props> {
  timeoutHandles: Array<number> = [];

  componentDidMount(): void {
    const logoutInMs = this.props.session.expiresAt.valueOf() - new Date().valueOf();
    const alertInMs = logoutInMs - alertLengthMs;
    this.timeoutHandles = [
      window.setTimeout(sessionStore.logout, logoutInMs),
      window.setTimeout(this.props.onTimeout, alertInMs),
    ];
  }

  componentWillUnmount(): void {
    this.timeoutHandles.forEach(window.clearTimeout);
  }

  render() {
    return <></>;
  }
}

export default observer(AlertTimeoutManager);
