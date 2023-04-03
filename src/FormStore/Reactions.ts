import { callApi } from '@/Appy';
import { assertNever } from '@/AssertNever';
import { resultToTask } from '@/CooperExt';
import { error } from '@/Logging';
import { ClassReactor, EffectsProps } from '@/Reactor';
import { resourceFormDecoder } from '@/Resource/Decoders';
import {
  ApiFormRequestPayload,
  findLinkT,
  formToValidatedApiValues,
  Link,
  Resource,
  resourceWithValidationErrorMessages,
} from '@/Resource/Types';
import Decoder from 'jsonous';
import Task from 'taskarian';
import FormStore from '.';
import { LoadError, State, SubmitError, Submitting } from './Types';

const fetchResource = <T>(decoder: Decoder<T>) => callApi(resourceFormDecoder(decoder), {});

const submitForm = <T>(decoder: Decoder<T>, payload: ApiFormRequestPayload) =>
  callApi(decoder, payload);

interface Props<F, S extends Resource<unknown>> {
  fetchingDecoder: Decoder<F>;
  submittingDecoder: Decoder<S>;
}

export const handleSubmitError =
  <F, S extends Resource<unknown>>(
    store: FormStore<F, S>,
    state: Submitting<F>,
    decoder: Decoder<F>,
  ) =>
  (err: SubmitError): void => {
    switch (err.kind) {
      case 'validation-error':
        store.ready(resourceWithValidationErrorMessages(state.resource));
        break;
      case 'bad-status':
        resourceFormDecoder(decoder)
          .decodeJson(err.response.body)
          .cata<void>({
            Ok: store.ready,
            Err: () => store.submittingError(err),
          });
        break;
      case 'failed-decoder':
      case 'missing-link':
      case 'bad-url':
      case 'timeout':
      case 'bad-payload':
      case 'network-error':
        store.submittingError(err);
        break;
      default:
        assertNever(err);
    }
  };

export class FormStoreReactions<F, S extends Resource<unknown>> extends ClassReactor<
  FormStore<F, S>,
  Props<F, S>
> {
  effects =
    ({ store, fetchingDecoder, submittingDecoder }: EffectsProps<FormStore<F, S>, Props<F, S>>) =>
    (state: State<F, S>): void => {
      switch (state.kind) {
        case 'waiting':
          break;
        case 'loading':
          Task.succeed<LoadError, Link>(state.link)
            .andThen(fetchResource(fetchingDecoder))
            .fork(store.loadingError, store.ready);
          break;
        case 'loading-error':
          error('Error loading endpoint:', JSON.stringify(state.error));
          break;
        case 'ready':
          break;
        case 'submitting':
          Task.succeed<SubmitError, {}>({})
            .assign('link', findLinkT(state.resource.form.actionRel)(state.resource.links))
            .assign(
              'values',
              resultToTask(() => formToValidatedApiValues(state.resource)),
            )
            .andThen(({ link, values }) => submitForm(submittingDecoder, values)(link))
            .fork(handleSubmitError(store, state, fetchingDecoder), store.submitted);
          break;
        case 'submitting-error':
          error('Error submitting form:', JSON.stringify(state.error));
          break;
        case 'submitted':
          break;
        default:
          assertNever(state);
      }
    };
}

export default FormStoreReactions;
