import { findLink } from '@/Resource/Types';
import { rootStore } from '@/RootStore';
import { observer } from 'mobx-react';
import * as React from 'react';
import SubmitableForm from './SubmitableForm';
import WaitingForm from './WaitingForm';
import { andTry } from '@/CooperExt';

interface Props {}

const Form: React.FC<Props> = ({}) => {
  return rootStore.resource
    .map((r) => r.links)
    .cata(andTry(findLink('authenticate')))
    .map((link) => <SubmitableForm authLink={link} />)
    .getOrElse(() => <WaitingForm />);
};

export default observer(Form);
