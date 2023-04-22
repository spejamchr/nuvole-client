import Button from '@/Button';
import StringField from '@/InputField/StringField';
import WithInput from '@/InputField/WithInput';
import { ResourceForm } from '@/Resource/Types';
import { observer } from 'mobx-react';
import * as React from 'react';
import { NewProfilePayload, NewProfileStore } from './Types';
import WithClientKeyReaction from './WithClientKeyReaction';
import { clientKeyStore } from '@/ClientKeyStore';

interface Props {
  store: NewProfileStore;
  resource: ResourceForm<NewProfilePayload>;
}

const Form: React.FC<Props> = ({ store, resource }) => (
  <form
    noValidate
    className={`m-8 w-fit bg-gray-800 p-8`}
    onSubmit={(e) => {
      e.preventDefault();
      store.submitting(resource);
    }}
  >
    <WithClientKeyReaction store={clientKeyStore} newProfileForm={resource} />
    <div className={`flex place-items-end justify-between`}>
      <div className={`pb-4 pr-4 text-lg text-gray-200`}>New Profile</div>
    </div>
    <div>
      <WithInput inputs={resource.form.inputs} name="email" kind="string">
        {(input) => <StringField input={input} />}
      </WithInput>
      <WithInput inputs={resource.form.inputs} name="password" kind="string">
        {(input) => <StringField input={input} />}
      </WithInput>
      <WithInput inputs={resource.form.inputs} name="password_confirmation" kind="string">
        {(input) => <StringField input={input} />}
      </WithInput>
      <div className={'mt-4 flex flex-col'}>
        <Button disabled={!store.submittable}>Submit</Button>
      </div>
    </div>
  </form>
);

export default observer(Form);
