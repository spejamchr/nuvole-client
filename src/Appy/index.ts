import { Link } from '@/Resource/Types';
import { HttpError, RequestBuilder, toHttpResponseTask } from 'ajaxian';
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
  <T>(decoder: Decoder<T>, payload: {}) =>
  (link: Link): Task<HttpError, T> =>
    toHttpResponseTask(request(link, decoder, payload)).map((s) => s.result);
