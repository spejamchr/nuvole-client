import { callApi } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { error } from '@/Logging';
import Reactor from '@/Reactor';
import { authenticationStore } from '.';
import { userSessionResourceDecoder } from './Decoders';
import { AuthenticationPayload } from './Types';

const authenticate = (payload: AuthenticationPayload) =>
  callApi(userSessionResourceDecoder, payload);

const Reactions = Reactor<typeof authenticationStore>((store) => (state) => {
  switch (state.kind) {
    case 'waiting':
      break;
    case 'form-entry':
    case 'form-ready':
      break;
    case 'authenticating':
      authenticate({ email: state.email, password: state.password })(state.submitTo).fork(
        store.authenticatingError,
        store.authenticated,
      );
      break;
    case 'authenticating-error':
      error('Error authenticating', state.error.kind);
      break;
    case 'authenticated':
      break;
    default:
      assertNever(state);
  }
});

export default Reactions;
