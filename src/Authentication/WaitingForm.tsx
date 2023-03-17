import { observer } from 'mobx-react';
import * as React from 'react';
import Inputs from './Inputs';

interface Props {}

const WaitingForm: React.FC<Props> = ({}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <Inputs />
      <button>Submit</button>
    </form>
  );
};

export default observer(WaitingForm);
