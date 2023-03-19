import { sessionExpiringSoon, UserSession, UserSessionResource } from '@/AuthenticationStore/Types';
import { resultToTask } from '@/CooperExt';
import { Link } from '@/Resource/Types';
import { sessionStore } from '@/SessionStore';
import { NoCurrentSession } from '@/SessionStore/Types';
import { identity } from '@kofno/piper';
import { Header, HttpError, RequestBuilder, toHttpResponseTask } from 'ajaxian';
import Decoder from 'jsonous';
import Task from 'taskarian';

export type AppyError = HttpError;

export const request = <T>(link: Link, decoder: Decoder<T>, payload: {}): RequestBuilder<T> =>
  new RequestBuilder<T>({
    url: link.href,
    method: link.method,
    data: payload,
    timeout: 0,
    headers: [],
    withCredentials: true,
    decoder: decoder.toJsonFn(),
  });

export const callApi =
  <T, Payload extends {} = {}>(decoder: Decoder<T>, payload: Payload) =>
  (link: Link): Task<HttpError, T> =>
    toHttpResponseTask(request(link, decoder, payload)).map((s) => s.result);

export const withActiveSession = resultToTask(sessionStore.session);

export const authHeader = (session: UserSessionResource): Header => ({
  field: 'Authentication',
  value: `Bearer ${session.payload.jwt}`,
});

export const triggerSessionRefreshIfExpiringSoon = (session: UserSession): void => {
  if (sessionExpiringSoon(session)) {
    sessionStore.refreshingSession();
  }
};

export const callAuthenticatedApi =
  <T, Payload extends {} = {}>(decoder: Decoder<T>, payload: Payload) =>
  (link: Link): Task<NoCurrentSession | HttpError, T> =>
    withActiveSession
      .mapError<NoCurrentSession | HttpError>(identity)
      .do(({ payload }) => triggerSessionRefreshIfExpiringSoon(payload))
      .map(authHeader)
      .map(request(link, decoder, payload).withHeader)
      .andThen(toHttpResponseTask)
      .map((s) => s.result);
