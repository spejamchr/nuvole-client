import FormStore from '@/FormStore';
import { ResourceForm } from '@/Resource/Types';
import { UserSessionResource } from '@/SessionStore/Types';

export type AuthenticationFormPayload = {};

export type AuthFormStore = FormStore<AuthenticationFormPayload, UserSessionResource>;

export type AuthFormResource = ResourceForm<AuthenticationFormPayload>;
