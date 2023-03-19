import { callApi } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { sessionStore } from '@/SessionStore';
import { error } from '@/Logging';
import Reactor from '@/Reactor';
import { authenticationStore } from '.';
import { userSessionResourceDecoder } from './Decoders';
import { Authenticating, AuthenticationPayload, UserSessionResource } from './Types';

const authenticate = ({ email, password, submitTo }: Authenticating) =>
  callApi<UserSessionResource, AuthenticationPayload>(userSessionResourceDecoder, {
    email,
    password,
  })(submitTo);

const Reactions = Reactor<typeof authenticationStore>((store) => (state) => {
  switch (state.kind) {
    case 'waiting':
      break;
    case 'form-entry':
    case 'form-ready':
      break;
    case 'authenticating':
      authenticate(state).fork(store.authenticatingError, store.authenticated);
      break;
    case 'authenticating-error':
      error('Error authenticating', state.error.kind);
      break;
    case 'authenticated':
      sessionStore.writingSession(state.session);
      break;
    default:
      assertNever(state);
  }
});

export default Reactions;
