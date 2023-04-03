import { always } from '@kofno/piper';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Result } from 'resulty';

interface Props<E, A> {
  result: Result<E, A>;
  children: React.ReactNode | ((value: A) => React.ReactNode);
  error?: (err: E) => React.ReactNode;
  onError?: (err: E) => void;
}

class WhenResult<E, A> extends React.Component<Props<E, A>> {
  render() {
    const { result, children, error, onError } = this.props;
    return result
      .elseDo((e) => {
        if (onError) {
          onError(e);
        }
      })
      .cata({
        Ok: typeof children === 'function' ? children : always(children),
        Err: error || always(<></>),
      });
  }
}

export default observer(WhenResult);
