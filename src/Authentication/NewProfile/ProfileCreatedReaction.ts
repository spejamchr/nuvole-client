import Reactor from '@/Reactor';
import { sessionStore } from '@/SessionStore';
import { assertNever } from '@kofno/piper';
import { NewProfileStore } from './Types';

const ProfileCreatedReaction = Reactor<NewProfileStore>(() => (state) => {
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

export default ProfileCreatedReaction;
