import { Loading, LoadingError, Ready, Waiting } from '@/CommonStates/Types';

export type State<T> = Waiting | Loading | LoadingError | Ready<T>;
