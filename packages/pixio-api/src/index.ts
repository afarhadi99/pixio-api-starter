// src/lib/pixio-api.ts
/**
 * Pixio API Integration
 * Centralized configuration and types for all Pixio API models/deployments
 */

// ============================================================================
// TYPES
// ============================================================================

/**
 * Base request structure for Pixio API
 */
export interface PixioRunRequest<T = Record<string, any>> {
  deployment_id: string;
  inputs: T;
  webhook?: string;
  webhook_intermediate_status?: boolean;
}

/**
 * Pixio API response structure
 */
export interface PixioRunResponse {
  run_id: string;
  status: string;
  [key: string]: any;
}

/**
 * Krea Flux model inputs
 */
export interface KreaFluxInputs {
  text: string;
  width?: number;
  height?: number;
}

/**
 * Qwen Edit model inputs
 */
export interface QwenEditInputs {
  image1: string; // URL to primary image
  positive?: string; // Positive prompt (what to add/enhance)
  negative?: string; // Negative prompt (what to avoid)
  image2?: string; // URL to second reference image
  image3?: string; // URL to third reference image
}

/**
 * Wan 2.2 First/Last Frame model inputs
 */
export interface WanFirstLastFrameInputs {
  start_image: string; // URL to start frame
  end_image: string; // URL to end frame
  positive: string; // Positive prompt describing the transition
  negative?: string; // Negative prompt
  height?: number; // Video height (default 512)
  width?: number; // Video width (default 512)
  length?: number; // Video length in frames (default 81)
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

/**
 * Krea Flux - High quality image generation
 */
export const KREA_FLUX: PixioModel<KreaFluxInputs> = {
  id: 'krea-flux',
  name: 'Krea Flux',
  description: 'High-quality image generation with Flux model. Perfect for fashion, portraits, and detailed imagery.',
  deploymentId: process.env.DEPLOYMENT_ID_KREA_FLUX || '3d9bb06d-af94-4247-9c29-b6dc7789f820',
  category: 'image',
  creditCost: 10,
  defaultInputs: {
    width: 1024,
    height: 1024
  },
  inputSchema: {
    text: {
      type: 'string',
      required: true,
      description: 'Text prompt describing the image to generate'
    },
    width: {
      type: 'number',
      required: false,
      default: 1024,
      description: 'Output image width in pixels'
    },
    height: {
      type: 'number',
      required: false,
      default: 1024,
      description: 'Output image height in pixels'
    }
  }
};

/**
 * Qwen Edit - AI-powered image editing
 */
export const QWEN_EDIT: PixioModel<QwenEditInputs> = {
  id: 'qwen-edit',
  name: 'Qwen Edit',
  description: 'AI-powered image editing with multiple image inputs and positive/negative prompting.',
  deploymentId: process.env.DEPLOYMENT_ID_QWEN_EDIT || '5a152b3b-2b07-4f9f-81e0-d394b9fbd6a3',
  category: 'edit',
  creditCost: 15,
  defaultInputs: {
    positive: '',
    negative: ''
  },
  inputSchema: {
    image1: {
      type: 'string',
      required: true,
      description: 'URL to the primary image to edit'
    },
    positive: {
      type: 'string',
      required: false,
      default: '',
      description: 'Positive prompt - describe what to add or enhance'
    },
    negative: {
      type: 'string',
      required: false,
      default: '',
      description: 'Negative prompt - describe what to avoid'
    },
    image2: {
      type: 'string',
      required: false,
      description: 'URL to second reference image (optional)'
    },
    image3: {
      type: 'string',
      required: false,
      description: 'URL to third reference image (optional)'
    }
  }
};

/**
 * Wan 2.2 First/Last Frame - Video generation from keyframes
 */
export const WAN_FIRST_LAST_FRAME: PixioModel<WanFirstLastFrameInputs> = {
  id: 'wan-first-last-frame',
  name: 'Wan 2.2 First/Last Frame',
  description: 'Generate smooth video transitions between two keyframe images.',
  deploymentId: process.env.DEPLOYMENT_ID_WAN_FIRST_LAST || '8c463102-0525-4cf1-8535-731fee0f93b4',
  category: 'video',
  creditCost: 100,
  defaultInputs: {
    height: 512,
    width: 512,
    length: 81,
    negative: ''
  },
  inputSchema: {
    start_image: {
      type: 'string',
      required: true,
      description: 'URL to the starting keyframe image'
    },
    end_image: {
      type: 'string',
      required: true,
      description: 'URL to the ending keyframe image'
    },
    positive: {
      type: 'string',
      required: true,
      description: 'Positive prompt describing the desired transition'
    },
    negative: {
      type: 'string',
      required: false,
      default: '',
      description: 'Negative prompt - what to avoid'
    },
    height: {
      type: 'number',
      required: false,
      default: 512,
      description: 'Video height in pixels'
    },
    width: {
      type: 'number',
      required: false,
      default: 512,
      description: 'Video width in pixels'
    },
    length: {
      type: 'number',
      required: false,
      default: 81,
      description: 'Video length in frames'
    }
  }
};

/**
 * All available models
 */
export const PIXIO_MODELS = {
  kreaFlux: KREA_FLUX,
  qwenEdit: QWEN_EDIT,
  wanFirstLastFrame: WAN_FIRST_LAST_FRAME
} as const;

/**
 * Get model by ID
 */
export function getModelById(modelId: string): PixioModel | undefined {
  return Object.values(PIXIO_MODELS).find(model => model.id === modelId);
}

/**
 * Get model by deployment ID
 */
export function getModelByDeploymentId(deploymentId: string): PixioModel | undefined {
  return Object.values(PIXIO_MODELS).find(model => model.deploymentId === deploymentId);
}

// ============================================================================
// API CLIENT
// ============================================================================

/**
 * Pixio API configuration
 */
export const PIXIO_API_CONFIG = {
  baseUrl: 'https://pixio-api-workers-production.up.railway.app',
  endpoints: {
    queueRun: '/api/run/deployment/queue',
    getRun: '/api/run',
    cancelRun: '/api/run/cancel'
  }
} as const;

/**
 * Queue a new run with the Pixio API
 */
export async function queuePixioRun<T = Record<string, any>>(
  request: PixioRunRequest<T>,
  apiKey: string
): Promise<{ success: boolean; data?: PixioRunResponse; error?: string }> {
  try {
    const url = `${PIXIO_API_CONFIG.baseUrl}${PIXIO_API_CONFIG.endpoints.queueRun}`;
    
    console.log('[Pixio API] Queueing run:', {
      deployment_id: request.deployment_id,
      webhook: request.webhook
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Pixio API] Queue run failed:', response.status, errorText);
      return {
        success: false,
        error: `API request failed (${response.status}): ${errorText}`
      };
    }

    const data = await response.json();
    console.log('[Pixio API] Run queued successfully:', data.run_id);

    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('[Pixio API] Error queueing run:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Get the status of a run
 */
export async function getPixioRun(
  runId: string,
  apiKey: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const url = `${PIXIO_API_CONFIG.baseUrl}${PIXIO_API_CONFIG.endpoints.getRun}?run_id=${runId}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `Failed to get run status (${response.status}): ${errorText}`
      };
    }

    const data = await response.json();
    return {
      success: true,
      data
    };
  } catch (error: any) {
    console.error('[Pixio API] Error getting run:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Cancel a running generation
 */
export async function cancelPixioRun(
  runId: string,
  apiKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `${PIXIO_API_CONFIG.baseUrl}${PIXIO_API_CONFIG.endpoints.cancelRun}`;
    
    console.log('[Pixio API] Cancelling run:', runId);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ run_id: runId })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Pixio API] Cancel run failed:', response.status, errorText);
      return {
        success: false,
        error: `Failed to cancel run (${response.status}): ${errorText}`
      };
    }

    console.log('[Pixio API] Run cancelled successfully');
    return {
      success: true
    };
  } catch (error: any) {
    console.error('[Pixio API] Error cancelling run:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Validate inputs against a model's schema
 */
export function validateModelInputs<T extends Record<string, any>>(
  model: PixioModel<T>,
  inputs: Partial<T>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  Object.entries(model.inputSchema).forEach(([key, schema]) => {
    if (schema.required && !(key in inputs)) {
      errors.push(`Missing required field: ${key}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Merge default inputs with user inputs
 */
export function prepareModelInputs<T extends Record<string, any>>(
  model: PixioModel<T>,
  userInputs: Partial<T>
): T {
  return {
    ...model.defaultInputs,
    ...userInputs
  } as T;
}

/**
 * Create a typed run request for a specific model
 */
export function createRunRequest<T extends Record<string, any>>(
  model: PixioModel<T>,
  inputs: Partial<T>,
  options?: {
    webhook?: string;
    webhookIntermediateStatus?: boolean;
  }
): PixioRunRequest<T> {
  const preparedInputs = prepareModelInputs(model, inputs);

  return {
    deployment_id: model.deploymentId,
    inputs: preparedInputs,
    webhook: options?.webhook,
    webhook_intermediate_status: options?.webhookIntermediateStatus
  };
}

// ============================================================================
// CONVENIENCE FUNCTIONS
// ============================================================================

/**
 * Generate an image using Krea Flux
 */
export async function generateWithKreaFlux(
  inputs: KreaFluxInputs,
  webhookUrl: string,
  apiKey: string
): Promise<{ success: boolean; runId?: string; error?: string }> {
  const validation = validateModelInputs(KREA_FLUX, inputs);
  if (!validation.valid) {
    return {
      success: false,
      error: `Invalid inputs: ${validation.errors.join(', ')}`
    };
  }

  const request = createRunRequest(KREA_FLUX, inputs, {
    webhook: webhookUrl,
    webhookIntermediateStatus: false
  });

  const result = await queuePixioRun(request, apiKey);

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error
    };
  }

  return {
    success: true,
    runId: result.data.run_id
  };
}

/**
 * Edit an image using Qwen Edit
 */
export async function editWithQwen(
  inputs: QwenEditInputs,
  webhookUrl: string,
  apiKey: string
): Promise<{ success: boolean; runId?: string; error?: string }> {
  const validation = validateModelInputs(QWEN_EDIT, inputs);
  if (!validation.valid) {
    return {
      success: false,
      error: `Invalid inputs: ${validation.errors.join(', ')}`
    };
  }

  const request = createRunRequest(QWEN_EDIT, inputs, {
    webhook: webhookUrl,
    webhookIntermediateStatus: false
  });

  const result = await queuePixioRun(request, apiKey);

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error
    };
  }

  return {
    success: true,
    runId: result.data.run_id
  };
}

/**
 * Generate video using Wan 2.2 First/Last Frame
 */
export async function generateWithWanFirstLastFrame(
  inputs: WanFirstLastFrameInputs,
  webhookUrl: string,
  apiKey: string
): Promise<{ success: boolean; runId?: string; error?: string }> {
  const validation = validateModelInputs(WAN_FIRST_LAST_FRAME, inputs);
  if (!validation.valid) {
    return {
      success: false,
      error: `Invalid inputs: ${validation.errors.join(', ')}`
    };
  }

  const request = createRunRequest(WAN_FIRST_LAST_FRAME, inputs, {
    webhook: webhookUrl,
    webhookIntermediateStatus: false
  });

  const result = await queuePixioRun(request, apiKey);

  if (!result.success || !result.data) {
    return {
      success: false,
      error: result.error
    };
  }

  return {
    success: true,
    runId: result.data.run_id
  };
}
