import { GenderizeRawResponse } from "../services/genderize";

export interface ClassifyResult {
  name: string;
  gender: string;
  probability: number;
  sample_size: number;
  is_confident: boolean;
  processed_at: string;
}

export function processGenderizeResponse(
  name: string,
  raw: GenderizeRawResponse
): ClassifyResult {
  const sample_size = raw.count;
  const probability = raw.probability;

  // Both conditions must be true
  const is_confident = probability >= 0.7 && sample_size >= 100;

  // UTC ISO 8601 timestamp, generated fresh on every request
  const processed_at = new Date().toISOString();

  return {
    name,
    gender: raw.gender as string,
    probability,
    sample_size,
    is_confident,
    processed_at,
  };
}
