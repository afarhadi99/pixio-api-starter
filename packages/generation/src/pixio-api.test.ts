import { describe, it, expect } from 'vitest';
import {
  KREA_FLUX,
  WAN_FIRST_LAST_FRAME,
  validateModelInputs,
  prepareModelInputs,
  createRunRequest,
  getModelById,
} from './pixio-api';

describe('validateModelInputs', () => {
  it('flags a missing required field', () => {
    const result = validateModelInputs(KREA_FLUX, {});
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required field: text');
  });

  it('passes when required fields are present', () => {
    expect(validateModelInputs(KREA_FLUX, { text: 'a cat' }).valid).toBe(true);
  });
});

describe('prepareModelInputs', () => {
  it('merges defaults with user inputs', () => {
    const inputs = prepareModelInputs(KREA_FLUX, { text: 'hi' });
    expect(inputs).toMatchObject({ text: 'hi', width: 1024, height: 1024 });
  });

  it('lets user inputs override defaults', () => {
    const inputs = prepareModelInputs(WAN_FIRST_LAST_FRAME, {
      start_image: 'a',
      end_image: 'b',
      positive: 'p',
      width: 768,
    });
    expect(inputs.width).toBe(768);
    expect(inputs.length).toBe(81);
  });
});

describe('createRunRequest', () => {
  it('builds a request carrying the deployment id and webhook', () => {
    const req = createRunRequest(KREA_FLUX, { text: 'hi' }, { webhook: 'https://x/hook' });
    expect(req.deployment_id).toBe(KREA_FLUX.deploymentId);
    expect(req.webhook).toBe('https://x/hook');
    expect(req.inputs).toMatchObject({ text: 'hi' });
  });
});

describe('getModelById', () => {
  it('finds a known model and returns undefined otherwise', () => {
    expect(getModelById('krea-flux')?.name).toBe('Krea Flux');
    expect(getModelById('unknown')).toBeUndefined();
  });
});
