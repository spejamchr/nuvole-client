import { StringInput } from '@/Resource/Types';
import TextInput from '@/TextInput';
import { identity } from '@kofno/piper';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

interface Props {
  input: StringInput;
}

const StringField: React.FC<Props> = ({ input }) => (
  <TextInput
    label={input.label}
    value={input.value}
    onChange={action((v) => (input.value = v))}
    inputProps={{
      disabled: input.access === 'readonly',
      minLength: input.minLength.map<number | undefined>(identity).getOrElseValue(undefined),
      maxLength: input.maxLength.map<number | undefined>(identity).getOrElseValue(undefined),
      name: input.name,
      type: input.type,
      required: input.access === 'required',
    }}
  />
);

export default observer(StringField);
