# AIR Filesystem

Managing files across different environments and storage providers often requires bulky SDKs and varying APIs. The AIR Filesystem provides a unified, isomorphic API built on top of IRPC, allowing seamless file operations across the network or directly on the backend.

## Unified Storage API

To interact with files consistently, we need a standard interface. The `@airlib/fs` package exports a set of IRPC stubs that define common filesystem operations.

```typescript
import { fs } from '@airlib/fs';
import { IRPCFile } from '@irpclib/irpc';

// Read a file (returns a signed URL and metadata)
const file = await fs.read('path/to/image.png');

// Write a file
const newFile = new IRPCFile({ name: 'doc.txt', type: 'text/plain', size: 12 }, new Blob(['Hello']));
const result = await fs.write('path/to/doc.txt', newFile);

// Remove a file
await fs.remove('path/to/doc.txt');

// Remove a directory recursively
await fs.rmdir('path/to/dir', true);

// List directory contents
const contents = await fs.dir('path/to/dir');
```

These stubs ensure that your frontend and backend code use the exact same signature for file operations.

## Backend Implementation

To process these filesystem operations, we connect the adapter to a specific storage driver. For instance, the S3 driver allows direct interaction with AWS S3 without installing the bulky AWS SDK.

```typescript
import { adapter } from '@airlib/fs/constructor';
import { S3Driver } from '@airlib/fs/drivers/s3';

// Initialize the driver with options
const driver = new S3Driver({
  maxKeys: 100, // Pagination size for listings
  deleteChunkSize: 10 // Concurrency for recursive deletions
});

// Attach the driver to the IRPC adapter
adapter.use(driver);
```

The adapter listens to the IRPC stubs and dispatches the operations to the configured S3 driver.

### Injecting Credentials

To access S3 securely, operations require AWS credentials. Instead of passing credentials to every function call, we inject them into the execution context using a middleware hook.

```typescript
import { irpc, fs } from '@airlib/fs';
import { s3credentials } from '@airlib/fs/drivers/s3';

// Register the credentials hook
irpc.hook(fs, s3credentials({
  endpoint: 'https://s3.amazonaws.com',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: 'us-east-1'
}));
```

By hooking the credentials into the IRPC context, the S3 driver can securely resolve them during execution without polluting the public API signature.
