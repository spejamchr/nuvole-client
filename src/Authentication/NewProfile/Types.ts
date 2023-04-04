import FormStore from '@/FormStore';
import { UserSessionResource } from '@/SessionStore/Types';

export interface NewProfilePayload {}
export type NewProfileStore = FormStore<NewProfilePayload, UserSessionResource>;
