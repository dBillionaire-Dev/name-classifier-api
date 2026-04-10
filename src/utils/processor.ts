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
  const sample_size: number = raw.count;
  const probability: number = raw.probability;

  // Both conditions must be true
  const is_confident: boolean = probability >= 0.7 && sample_size >= 100;

  // UTC ISO 8601 timestamp, generated fresh on every request
  const processed_at: string = new Date().toISOString();

  return {
    name,
    gender: raw.gender ?? "unknown",
    probability,
    sample_size,
    is_confident,
    processed_at,
  };
}
