import { classx } from '@airlib/uikit/utils';
import { template } from '@anchorlib/react';
import { type ElementProps } from '../supporting.js';
import { PROGRESS_CONFIGS } from './config.js';

export type LinearProgressProps = ElementProps<'div'> & {
  value?: number;
};

export const LinearProgress = template<LinearProgressProps>(
  ({ className, value, ...rest }) => (
    <div {...rest} className={classx([PROGRESS_CONFIGS.linearClass, className])}>
      <div
        className={`${PROGRESS_CONFIGS.linearBarClass} ${PROGRESS_CONFIGS.linearPrimaryClass}`}
        style={value !== undefined ? { width: `${value}%` } : undefined}
      />
    </div>
  ),
  'LinearProgress'
);

export type CircularProgressProps = ElementProps<'div'> & {
  indeterminate?: boolean;
};

export const CircularProgress = template<CircularProgressProps>(({ className, indeterminate, ...rest }) => {
  const baseClass =
    `${PROGRESS_CONFIGS.circularClass} ${indeterminate ? PROGRESS_CONFIGS.circularIndeterminateClass : ''}`.trim();
  const circleClass =
    `${PROGRESS_CONFIGS.circularCircleClass} ${PROGRESS_CONFIGS.circularPrimaryClass} ${indeterminate ? PROGRESS_CONFIGS.circularCircleIndeterminateClass : ''}`.trim();

  return (
    <div {...rest} className={classx([baseClass, className])}>
      <svg viewBox="22 22 44 44" className="w-full h-full">
        <circle className={circleClass} cx="44" cy="44" r="20" />
      </svg>
    </div>
  );
}, 'CircularProgress');
