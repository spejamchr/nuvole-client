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

const fetchResource = <FormPayload>(decoder: Decoder<FormPayload>) =>
  callApi(resourceFormDecoder(decoder), {});

const submitForm = <Response>(decoder: Decoder<Response>, payload: ApiFormRequestPayload) =>
  callApi(decoder, payload);

interface Props<FormPayload, Response extends Resource<unknown>> {
  fetchingDecoder: Decoder<FormPayload>;
  submittingDecoder: Decoder<Response>;
}

export const handleSubmitError =
  <FormPayload, Response extends Resource<unknown>>(
    store: FormStore<FormPayload, Response>,
    state: Submitting<FormPayload>,
    decoder: Decoder<FormPayload>,
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

export class FormStoreReactions<
  FormPayload,
  Response extends Resource<unknown>,
> extends ClassReactor<FormStore<FormPayload, Response>, Props<FormPayload, Response>> {
  effects =
    ({
      store,
      fetchingDecoder,
      submittingDecoder,
    }: EffectsProps<FormStore<FormPayload, Response>, Props<FormPayload, Response>>) =>
    (state: State<FormPayload, Response>): void => {
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
