import { Link } from '@/Resource/Types';
import RootStore from '@/RootStore';
import Reactions from '@/RootStore/Reactions';
import { Ready, RootResource, State } from '@/RootStore/Types';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import Display from './Display';

interface Props {
  ready: (rootResource: RootResource) => React.ReactElement;
  other?: (state: Exclude<State, Ready>) => React.ReactElement;
}

const rootHref = 'http://localhost:3000/root.json';

const rootLink: Link = {
  rel: 'self',
  href: rootHref,
  method: 'get',
  type: 'application/json',
};

const WithRoot: React.FC<Props> = ({ ready, other }) => {
  const store = React.useRef(new RootStore());

  React.useEffect(() => store.current.loading(rootLink));

  return (
    <>
      <Reactions store={store.current} />
      <Display ready={ready} other={other || (() => <></>)} store={store.current} />
    </>
  );
};

export default observer(WithRoot);
