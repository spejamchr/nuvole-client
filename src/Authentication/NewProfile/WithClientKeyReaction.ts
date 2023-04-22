import Reactor from '@/Reactor';
import { NewProfilePayload } from './Types';
import { clientKeyStore } from '@/ClientKeyStore';
import { assertNever } from '@kofno/piper';
import { ResourceForm } from '@/Resource/Types';
import { action } from 'mobx';

interface Props {
  newProfileForm: ResourceForm<NewProfilePayload>;
}

const WithClientKeyReaction = Reactor<typeof clientKeyStore, Props>(
  ({ newProfileForm }) =>
    (state) => {
      switch (state.kind) {
        case 'with-client-key':
          newProfileForm.form.inputs.forEach(
            action((i) => {
              if (i.kind === 'string' && i.name === 'root_public_key') {
                i.value = state.clientKey.publicKey;
              }
            }),
          );
          break;
        case 'waiting':
        case 'reading-storage':
        case 'reading-storage-error':
        case 'without-client-key':
        case 'creating-client-key':
        case 'writing-storage':
        case 'writing-storage-error':
          break;
        default:
          assertNever(state);
      }
    },
);

export default WithClientKeyReaction;
