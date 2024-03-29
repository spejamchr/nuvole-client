import Button from '@/Button';
import { andTryR } from '@/CooperExt';
import StringField from '@/InputField/StringField';
import WithInput from '@/InputField/WithInput';
import ReadStore from '@/ReadStore';
import { findLink } from '@/Resource/Types';
import { RootPayload } from '@/RootResource/Types';
import WhenResult from '@/WhenResult';
import { observer } from 'mobx-react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import ErrorMsg from './ErrorMsg';
import { AuthFormResource, AuthFormStore } from './Types';

interface Props {
  store: AuthFormStore;
  resource: AuthFormResource;
  rootStore: ReadStore<RootPayload>;
}

const Form: React.FC<Props> = ({ store, resource, rootStore }) => {
  return (
    <form
      noValidate
      className={`m-8 w-fit bg-gray-800 p-8`}
      onSubmit={(e) => {
        e.preventDefault();
        store.submitting(resource);
      }}
    >
      <div className={`flex place-items-end justify-between`}>
        <div className={`pb-4 pr-4 text-lg text-gray-200`}>Login</div>
        <ErrorMsg store={store} />
      </div>
      <div className={`w-64`}>
        <WithInput inputs={resource.form.inputs} name="email" kind="string">
          {(input) => <StringField input={input} />}
        </WithInput>
        <WithInput inputs={resource.form.inputs} name="password" kind="string">
          {(input) => <StringField input={input} />}
        </WithInput>
        <div className={'my-4 flex flex-col'}>
          <Button disabled={!store.submittable}>Submit</Button>
        </div>
      </div>
      <WhenResult
        result={rootStore.resource.map((r) => r.links).cata(andTryR(findLink('new_user')))}
      >
        <Link to="profile/new">New User</Link>
      </WhenResult>
    </form>
  );
};

export default observer(Form);
