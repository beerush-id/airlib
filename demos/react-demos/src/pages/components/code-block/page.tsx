import { Card, CardBody, CardGroup, CardHeader, CardTitle, CodeBlock } from '@airlib/react-ui/components';
import { page, setup } from '@airlib/react';
import { codeBlockRoute } from '../route.js';
import { sleep } from '@airlib/core';

const CodeBlockDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Code Block</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Syntax highlighted code blocks powered by Shiki, featuring dynamic themes, languages, and built-in async
          resolution.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Static String</CardTitle>
            <p className="air-body-sm">
              Pass raw code directly. The component will autonomously load Shiki, syntax highlight the code, and render
              it.
            </p>
          </CardHeader>
          <CardBody>
            <CodeBlock
              lang="tsx"
              code={`export const SimpleButton = () => {
  return <button className="air-btn">Click Me</button>;
};`}
            />
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Async Resolution (Promise)</CardTitle>
            <p className="air-body-sm">
              Pass a Promise or an async function. The component will show a built-in progress indicator while waiting
              for the code.
            </p>
          </CardHeader>
          <CardBody>
            <CodeBlock
              lang="typescript"
              code={async () => {
                await sleep(2000);
                return `// Loaded after 2 seconds!
export async function fetchData() {
  const res = await fetch('/api/data');
  return res.json();
}`;
              }}
            />
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'CodeBlockDemo');

export const CodeBlockPage = page(codeBlockRoute).render(() => <CodeBlockDemo />);
export default CodeBlockPage;
