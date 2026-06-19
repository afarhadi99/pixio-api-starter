/**
 * Pixio API Integration — pure client + model catalog.
 * No platform dependencies; safe to import from web (server) and React Native.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface PixioRunRequest<T = Record<string, any>> {
  deployment_id: string;
  inputs: T;
  webhook?: string;
  webhook_intermediate_status?: boolean;
}

export interface PixioRunResponse {
  run_id: string;
  status: string;
  [key: string]: any;
}

export interface KreaFluxInputs {
  text: string;
  width?: number;
  height?: number;
}

export interface QwenEditInputs {
  image1: string;
  positive?: string;
  negative?: string;
  image2?: string;
  image3?: string;
}

export interface WanFirstLastFrameInputs {
  start_image: string;
  end_image: string;
  positive: string;
  negative?: string;
  height?: number;
  width?: number;
  length?: number;
}

// ============================================================================
// MODEL DEFINITIONS
// ============================================================================

export interface PixioModel<T = Record<string, any>> {
  id: string;
  name: string;
  description: string;
  deploymentId: string;
  category: 'image' | 'video' | 'edit';
  creditCost: number;
  defaultInputs?: Partial<T>;
  inputSchema: {
    [K in keyof T]: {
      type: string;
      required: boolean;
      default?: any;
      description?: string;
    };
  };
}

export const KREA_FLUX: PixioModel<KreaFluxInputs> = {
  id: 'krea-flux',
  name: 'Krea Flux',
  description:
    'High-quality image generation with Flux model. Perfect for fashion, portraits, and detailed imagery.',
  deploymentId: process.env.DEPLOYMENT_ID_KREA_FLUX || '3d9bb06d-af94-4247-9c29-b6dc7789f820',
  category: 'image',
  creditCost: 10,
  defaultInputs: { width: 1024, height: 1024 },
  inputSchema: {
    text: { type: 'string', required: true, description: 'Text prompt describing the image' },
    width: { type: 'number', required: false, default: 1024, description: 'Output width in pixels' },
    height: {
      type: 'number',
      required: false,
      default: 1024,
      description: 'Output height in pixels',
    },
  },
};

export const QWEN_EDIT: PixioModel<QwenEditInputs> = {
  id: 'qwen-edit',
  name: 'Qwen Edit',
  description:
    'AI-powered image editing with multiple image inputs and positive/negative prompting.',
  deploymentId: process.env.DEPLOYMENT_ID_QWEN_EDIT || '5a152b3b-2b07-4f9f-81e0-d394b9fbd6a3',
  category: 'edit',
  creditCost: 15,
  defaultInputs: { positive: '', negative: '' },
  inputSchema: {
    image1: { type: 'string', required: true, description: 'URL to the primary image to edit' },
    positive: { type: 'string', required: false, default: '', description: 'What to add/enhance' },
    negative: { type: 'string', required: false, default: '', description: 'What to avoid' },
    image2: { type: 'string', required: false, description: 'URL to second reference image' },
    image3: { type: 'string', required: false, description: 'URL to third reference image' },
  },
};

export const WAN_FIRST_LAST_FRAME: PixioModel<WanFirstLastFrameInputs> = {
  id: 'wan-first-last-frame',
  name: 'Wan 2.2 First/Last Frame',
  description: 'Generate smooth video transitions between two keyframe images.',
  deploymentId: process.env.DEPLOYMENT_ID_WAN_FIRST_LAST || '8c463102-0525-4cf1-8535-731fee0f93b4',
  category: 'video',
  creditCost: 100,
  defaultInputs: { height: 512, width: 512, length: 81, negative: '' },
  inputSchema: {
    start_image: { type: 'string', required: true, description: 'URL to the starting keyframe' },
    end_image: { type: 'string', required: true, description: 'URL to the ending keyframe' },
    positive: { type: 'string', required: true, description: 'Desired transition' },
    negative: { type: 'string', required: false, default: '', description: 'What to avoid' },
    height: { type: 'number', required: false, default: 512, description: 'Video height in pixels' },
    width: { type: 'number', required: false, default: 512, description: 'Video width in pixels' },
    length: { type: 'number', required: false, default: 81, description: 'Video length in frames' },
  },
};

export const PIXIO_MODELS = {
  kreaFlux: KREA_FLUX,
  qwenEdit: QWEN_EDIT,
  wanFirstLastFrame: WAN_FIRST_LAST_FRAME,
} as const;

export function getModelById(modelId: string): PixioModel | undefined {
  return Object.values(PIXIO_MODELS).find((model) => model.id === modelId);
}

export function getModelByDeploymentId(deploymentId: string): PixioModel | undefined {
  return Object.values(PIXIO_MODELS).find((model) => model.deploymentId === deploymentId);
}

// ============================================================================
// API CLIENT
// ============================================================================

export const PIXIO_API_CONFIG = {
  baseUrl: 'https://pixio-api-workers-production.up.railway.app',
  endpoints: {
    queueRun: '/api/run/deployment/queue',
    getRun: '/api/run',
    cancelRun: '/api/run/cancel',
  },
} as const;

export async function queuePixioRun<T = Record<string, any>>(
  request: PixioRunRequest<T>,
  apiKey: string,
): Promise<{ success: boolean; data?: PixioRunResponse; error?: string }> {
  try {
    const url = `${PIXIO_API_CONFIG.baseUrl}${PIXIO_API_CONFIG.endpoints.queueRun}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `API request failed (${response.status}): ${errorText}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getPixioRun(
  runId: string,
  apiKey: string,
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const url = `${PIXIO_API_CONFIG.baseUrl}${PIXIO_API_CONFIG.endpoints.getRun}?run_id=${runId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Failed to get run status (${response.status}): ${errorText}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function cancelPixioRun(
  runId: string,
  apiKey: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${PIXIO_API_CONFIG.baseUrl}${PIXIO_API_CONFIG.endpoints.cancelRun}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ run_id: runId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Failed to cancel run (${response.status}): ${errorText}` };
    }
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============================================================================
// HELPERS
// ============================================================================

export function validateModelInputs<T extends Record<string, any>>(
  model: PixioModel<T>,
  inputs: Partial<T>,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  Object.entries(model.inputSchema).forEach(([key, schema]) => {
    if ((schema as { required: boolean }).required && !(key in inputs)) {
      errors.push(`Missing required field: ${key}`);
    }
  });
  return { valid: errors.length === 0, errors };
}

export function prepareModelInputs<T extends Record<string, any>>(
  model: PixioModel<T>,
  userInputs: Partial<T>,
): T {
  return { ...model.defaultInputs, ...userInputs } as T;
}

export function createRunRequest<T extends Record<string, any>>(
  model: PixioModel<T>,
  inputs: Partial<T>,
  options?: { webhook?: string; webhookIntermediateStatus?: boolean },
): PixioRunRequest<T> {
  return {
    deployment_id: model.deploymentId,
    inputs: prepareModelInputs(model, inputs),
    webhook: options?.webhook,
    webhook_intermediate_status: options?.webhookIntermediateStatus,
  };
}
