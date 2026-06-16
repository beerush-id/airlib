import { getContext, setContext } from '@irpclib/irpc';
import type { AwsCredentials } from './signer.js';

const S3_CREDENTIALS = Symbol('S3_CREDENTIALS');

/**
 * Injects AWS S3 credentials into the current IRPC context.
 *
 * @param credentials - The AWS credentials to be stored in the context.
 */
export function setS3Credentials(credentials: AwsCredentials) {
  setContext(S3_CREDENTIALS, credentials);
}

/**
 * Retrieves the AWS S3 credentials from the current IRPC context.
 *
 * @returns The stored credentials, or undefined if not set.
 */
export function getS3Credentials(): AwsCredentials | undefined {
  return getContext<AwsCredentials>(S3_CREDENTIALS);
}

/**
 * Creates an IRPC middleware hook to inject S3 credentials into the context.
 *
 * @param credentials - The AWS credentials to inject.
 * @returns An IRPC hook function.
 */
export function s3credentials(credentials: AwsCredentials) {
  return () => {
    setS3Credentials(credentials);
  };
}
