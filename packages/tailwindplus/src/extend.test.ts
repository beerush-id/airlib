import { describe, expect, test } from 'vitest';
import { run } from './test-utils/run';

const css = String.raw;

describe('@extend directive', () => {
  test('merges selectors between compound utilities', async () => {
    const output = await run(
      ['air-submit'],
      css`
        @layer utilities {
          @tailwind utilities;
        }

        @utility air-button {
          display: inline-flex;
          padding: 1rem;
        }

        @utility air-submit {
          @extend air-button;
          background-color: #007bff;
        }
      `
    );

    expect(output).toContain('.air-button, .air-submit {\n    padding: 1rem;\n    display: inline-flex;\n  }');
    expect(output).toContain('.air-submit {\n    background-color: #007bff;\n  }');
  });

  test('supports extending utilities from regular CSS rules', async () => {
    const output = await run(
      [],
      css`
        @layer utilities {
          @tailwind utilities;
        }

        @utility air-card {
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .my-card {
          @extend air-card;
          padding: 2rem;
        }
      `
    );

    expect(output).toContain(
      '.air-card, .my-card {\n    border-radius: .5rem;\n    box-shadow: 0 4px 6px -1px #0000001a;\n  }'
    );
    expect(output).toContain('.my-card {\n  padding: 2rem;\n}');
  });

  test('supports transitive selector merging', async () => {
    const output = await run(
      ['air-primary'],
      css`
        @layer utilities {
          @tailwind utilities;
        }

        @utility air-base {
          font-family: sans-serif;
        }

        @utility air-button {
          @extend air-base;
          padding: 1rem;
        }

        @utility air-primary {
          @extend air-button;
          color: white;
        }
      `
    );

    expect(output).toContain('.air-base, .air-button, .air-primary {\n    font-family: sans-serif;\n  }');
    expect(output).toContain('.air-button, .air-primary {\n    padding: 1rem;\n  }');
    expect(output).toContain('.air-primary {\n    color: #fff;\n  }');
  });

  test('preserves variants during selector merging', async () => {
    const output = await run(
      ['hover:air-submit'],
      css`
        @layer utilities {
          @tailwind utilities;
        }

        @utility air-button {
          transition: background-color 0.2s;
        }

        @utility air-submit {
          @extend air-button;
          background-color: blue;
        }
      `
    );

    expect(output).toContain(
      ':is(.hover\\:air-button, .hover\\:air-submit):hover {\n      transition: background-color .2s;\n    }'
    );
    expect(output).toContain('.hover\\:air-submit:hover {\n      background-color: #00f;\n    }');
  });

  test('throws error on circular extend dependency', async () => {
    await expect(
      run(
        ['air-b'],
        css`
          @layer utilities {
            @tailwind utilities;
          }

          @utility air-a {
            @extend air-b;
          }

          @utility air-b {
            @extend air-a;
          }
        `
      )
    ).rejects.toThrow(/Circular dependency detected in @extend/);
  });

  test('supports extending utilities inside nested rules within @utility', async () => {
    const output = await run(
      ['air-submit'],
      css`
        @layer utilities {
          @tailwind utilities;
        }

        @utility air-disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        @utility air-submit {
          display: inline-flex;

          &:disabled,
          &[aria-disabled='true'] {
            @extend air-disabled;
          }
        }
      `
    );

    expect(output).toContain('.air-submit {\n    display: inline-flex;');
    expect(output).toContain('cursor: not-allowed;');
    expect(output).toContain('opacity: 0.5;');
  });

  test('prevents infinite loop when extending from self-referential nested selectors', async () => {
    const output = await run(
      [],
      css`
        @layer utilities {
          @tailwind utilities;
        }

        @utility air-icon {
          width: 1rem;
        }

        @utility air-button {
          & .air-icon {
            @extend air-icon;
            color: red;
          }
        }
      `
    );

    expect(output).toContain('width: 1rem;');
  });
});
