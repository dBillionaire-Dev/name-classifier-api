export interface GenderizeRawResponse {
  name: string;
  gender: string | null;
  probability: number;
  count: number;
}

interface GenderizeServiceResult {
  success: boolean;
  data?: GenderizeRawResponse;
  statusCode: number;
  message?: string;
}

export async function fetchGenderize(name: string): Promise<GenderizeServiceResult> {
  try {
    const url = `https://api.genderize.io/?name=${encodeURIComponent(name)}`;
    const response = await fetch(url);

    if (!response.ok) {
      return {
        success: false,
        statusCode: 502,
        message: `Upstream API error: received status ${response.status}`,
      };
    }

    const data: GenderizeRawResponse = await response.json();

    return {
      success: true,
      data,
      statusCode: 200,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: 500,
      message: "Internal server error: failed to reach Genderize API",
    };
  }
}
