/**
 * Represents the AWS S3 credentials required to sign requests.
 */
export interface AwsCredentials {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  region?: string;
}

const textEncoder = new TextEncoder();

async function sha256(data: string): Promise<ArrayBuffer> {
  const buffer = textEncoder.encode(data);
  return crypto.subtle.digest('SHA-256', buffer);
}

async function hmacSha256(key: ArrayBuffer | Uint8Array, data: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key as BufferSource,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, textEncoder.encode(data));
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(textEncoder.encode(`AWS4${key}`), dateStamp);
  const kRegion = await hmacSha256(kDate, regionName);
  const kService = await hmacSha256(kRegion, serviceName);

  return await hmacSha256(kService, 'aws4_request');
}

/**
 * Generates an AWS Signature Version 4 signed URL for S3 operations.
 *
 * @param credentials - The AWS credentials to use for signing.
 * @param method - The HTTP method (e.g., 'GET', 'PUT', 'DELETE').
 * @param key - The S3 object key or path.
 * @param expiresIn - The expiration time of the signed URL in seconds. Defaults to 3600 (1 hour).
 * @returns A promise that resolves to the fully signed URL.
 */
export async function signS3Url(
  credentials: AwsCredentials,
  method: string,
  key: string,
  expiresIn = 3600
): Promise<string> {
  let url = credentials.endpoint;
  if (!url.endsWith('/')) url += '/';
  if (key) {
    if (key.startsWith('?')) {
      url += key;
    } else {
      url += key.replace(/^\//, '');
    }
  }

  const parsedUrl = new URL(url);
  const region = credentials.region || 'auto';
  const service = 's3';

  const date = new Date();
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.substring(0, 8);

  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;

  parsedUrl.searchParams.set('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
  parsedUrl.searchParams.set('X-Amz-Credential', `${credentials.accessKeyId}/${credentialScope}`);
  parsedUrl.searchParams.set('X-Amz-Date', amzDate);
  parsedUrl.searchParams.set('X-Amz-Expires', expiresIn.toString());
  parsedUrl.searchParams.set('X-Amz-SignedHeaders', 'host');

  const payloadHash = 'UNSIGNED-PAYLOAD';

  const canonicalHeaders = `host:${parsedUrl.host}\n`;
  const signedHeaders = 'host';

  const canonicalUri = parsedUrl.pathname.split('/').map(encodeURIComponent).join('/').replace(/%2F/g, '/');

  const searchParamsKeys = Array.from(parsedUrl.searchParams.keys()).sort();
  const canonicalQueryString = searchParamsKeys
    .map((k) => {
      const encodedKey = encodeURIComponent(k).replace(/\+/g, '%20');
      const encodedValue = encodeURIComponent(parsedUrl.searchParams.get(k)!).replace(/\+/g, '%20');
      return `${encodedKey}=${encodedValue}`;
    })
    .join('&');

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, toHex(await sha256(canonicalRequest))].join('\n');

  const signingKey = await getSignatureKey(credentials.secretAccessKey, dateStamp, region, service);
  const signature = toHex(await hmacSha256(signingKey, stringToSign));

  parsedUrl.searchParams.set('X-Amz-Signature', signature);

  return parsedUrl.toString();
}

/**
 * Generates a signed Fetch Request object for server-side S3 operations.
 *
 * @param credentials - The AWS credentials to use for signing.
 * @param method - The HTTP method (e.g., 'GET', 'PUT', 'DELETE').
 * @param key - The S3 object key or path.
 * @returns A promise that resolves to the signed Request object.
 */
export async function signS3Request(credentials: AwsCredentials, method: string, key: string): Promise<Request> {
  const url = await signS3Url(credentials, method, key);
  return new Request(url, { method });
}
