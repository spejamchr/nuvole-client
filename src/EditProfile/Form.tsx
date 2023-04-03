import Button from '@/Button';
import FormStore from '@/FormStore';
import BooleanField from '@/InputField/BooleanField';
import StringField from '@/InputField/StringField';
import WithInput from '@/InputField/WithInput';
import { ResourceForm } from '@/Resource/Types';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { EditProfilePayload } from './Types';

interface Props {
  store: FormStore<EditProfilePayload>;
  resource: ResourceForm<EditProfilePayload>;
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
    <div className={`flex place-items-end justify-between`}>
      <div className={`pb-4 pr-4 text-lg text-gray-200`}>Edit Profile</div>
    </div>
    <div>
      <WithInput inputs={resource.form.inputs} name="public_reference_token" kind="string">
        {(input) => (
          <>
            <StringField input={input} className={`w-96 font-mono`} />
            <Button type="button" onClick={action(() => (input.value = crypto.randomUUID()))}>
              Randomize
            </Button>
          </>
        )}
      </WithInput>
      <WithInput inputs={resource.form.inputs} name="email" kind="string">
        {(input) => <StringField input={input} />}
      </WithInput>
      <WithInput inputs={resource.form.inputs} name="name" kind="string">
        {(input) => <StringField input={input} />}
      </WithInput>
      <WithInput inputs={resource.form.inputs} name="findable_by_prt" kind="boolean">
        {(input) => <BooleanField input={input} />}
      </WithInput>
      <WithInput inputs={resource.form.inputs} name="findable_by_email" kind="boolean">
        {(input) => <BooleanField input={input} />}
      </WithInput>
      <WithInput inputs={resource.form.inputs} name="findable_by_name" kind="boolean">
        {(input) => <BooleanField input={input} />}
      </WithInput>
      <div className={'mt-4 flex flex-col'}>
        <Button disabled={!store.submittable}>Submit</Button>
      </div>
    </div>
  </form>
);

export default observer(Form);
