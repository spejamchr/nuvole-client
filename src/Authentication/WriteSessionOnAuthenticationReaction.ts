import { assertNever } from '@/AssertNever';
import Reactor from '@/Reactor';
import { sessionStore } from '@/SessionStore';
import { AuthFormStore } from './Types';

const WriteSessionOnAuthenticationReaction = Reactor<AuthFormStore>(() => (state) => {
  switch (state.kind) {
    case 'waiting':
    case 'loading':
    case 'loading-error':
    case 'ready':
    case 'submitting':
    case 'submitting-error':
      break;
    case 'submitted':
      sessionStore.writingSession(state.resource);
      break;
    default:
      assertNever(state);
  }
});

export default WriteSessionOnAuthenticationReaction;
