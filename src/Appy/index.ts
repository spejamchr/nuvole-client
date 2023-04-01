import { Link } from '@/Resource/Types';
import { sessionStore } from '@/SessionStore';
import {
  NoCurrentSession,
  sessionExpiringSoon,
  UserSession,
  UserSessionResource,
} from '@/SessionStore/Types';
import { flatMap } from '@execonline-inc/collections';
import { identity } from '@kofno/piper';
import { Header, HttpError, RequestBuilder, toHttpResponseTask } from 'ajaxian';
import Decoder from 'jsonous';
import { Result } from 'resulty';
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

export const appendHeaders =
  (headers: ReadonlyArray<Header>) =>
  <T>(requestBuilder: RequestBuilder<T>): RequestBuilder<T> =>
    headers.reduce((rb, h) => rb.withHeader(h), requestBuilder);

export const triggerSessionRefreshIfExpiringSoon = (session: UserSession): void => {
  if (sessionExpiringSoon(session)) {
    sessionStore.refreshingSession();
  }
};

export const authHeader = (session: UserSessionResource): Header => ({
  field: 'Authorization',
  value: `Bearer ${session.payload.jwt}`,
});

export const getAuthHeader = (): Result<NoCurrentSession, Header> =>
  sessionStore
    .session()
    .do(({ payload }) => triggerSessionRefreshIfExpiringSoon(payload))
    .map(authHeader);

export const apiHeaders = (): ReadonlyArray<Header> =>
  flatMap(identity, [
    getAuthHeader()
      .map((h) => [h])
      .getOrElseValue([]),
  ]);

export const callApi =
  <T, Payload extends {} = {}>(decoder: Decoder<T>, payload: Payload) =>
  (link: Link): Task<HttpError, T> =>
    Task.succeed<HttpError, RequestBuilder<T>>(request(link, decoder, payload))
      .map(appendHeaders(apiHeaders()))
      .andThen(toHttpResponseTask)
      .map((s) => s.result);
