import { Input } from '@/Resource/Types';
import { observer } from 'mobx-react';
import * as React from 'react';

type InputWithKind<K extends Input['kind']> = Input & { kind: K };

interface Props<K extends Input['kind']> {
  inputs: ReadonlyArray<Input>;
  name: string;
  kind: K;
  children: (input: InputWithKind<K>) => React.ReactNode;
}

class WithInput<K extends Input['kind']> extends React.Component<Props<K>> {
  render() {
    const { inputs, name, kind, children } = this.props;
    return inputs
      .filter((i): i is InputWithKind<K> => i.kind === kind && i.name === name)
      .map((i) => <React.Fragment key={i.name}>{children(i)}</React.Fragment>);
  }
}

export default observer(WithInput);
