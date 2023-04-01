import Button from '@/Button';
import StringField from '@/InputField/StringField';
import WithInput from '@/InputField/WithInput';
import { observer } from 'mobx-react';
import * as React from 'react';
import ErrorMsg from './ErrorMsg';
import { AuthFormResource, AuthFormStore } from './Types';

interface Props {
  store: AuthFormStore;
  resource: AuthFormResource;
}

const Form: React.FC<Props> = ({ store, resource }) => {
  return (
    <form
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
      <div className={`w-96`}>
        <WithInput inputs={resource.form.inputs} name="email" kind="string">
          {(input) => <StringField input={input} />}
        </WithInput>
        <WithInput inputs={resource.form.inputs} name="password" kind="string">
          {(input) => <StringField input={input} />}
        </WithInput>
        <div className={'mt-4 flex flex-col'}>
          <Button disabled={!store.submittable}>Submit</Button>
        </div>
      </div>
    </form>
  );
};

export default observer(Form);
