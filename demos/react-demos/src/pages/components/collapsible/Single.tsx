import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleTrigger,
  Field,
  FieldLabel,
} from '@airlib/react-ui/components';
import { TextField } from '@airlib/react-ui/form';
import { $bind, $use, classx, mutable, setup, Snippet } from '@airlib/react';

const Single = setup(() => {
  const steps = mutable({
    current: 'step-1',
    shipping: false,
    payment: false,
    review: false,
  });

  return (
    <CollapsibleGroup value={$bind(steps, 'current')} className="air-card-group">
      <Collapsible className="air-card-outlined" name="step-1">
        <CollapsibleTrigger className="air-card-header items-center cursor-pointer hover:text-primary transition-colors">
          <Snippet>
            {() => (
              <div
                className={classx(
                  'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 transition-colors',
                  steps.shipping ? 'bg-primary text-on-primary' : 'bg-primary/20 text-primary',
                )}
              >
                1
              </div>
            )}
          </Snippet>
          <span className="font-semibold">Shipping Details</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-6">
          <Field>
            <TextField id="fn-1" variant="outlined" placeholder="e.g. John Doe" />
            <FieldLabel>Full Name</FieldLabel>
          </Field>
          <Field>
            <TextField id="al-1" variant="outlined" placeholder="e.g. 123 Main St" />
            <FieldLabel>Address Line 1</FieldLabel>
          </Field>
          <div className="flex justify-end py-6">
            <Button
              variant="filled"
              onClick={() => {
                steps.shipping = true;
                steps.current = 'step-2';
              }}
            >
              Continue to Payment
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="air-card-outlined" name="step-2">
        <CollapsibleTrigger
          disabled={$use(() => !steps.shipping)}
          className="air-card-header items-center cursor-pointer hover:text-primary transition-colors"
        >
          <Snippet>
            {() => (
              <div
                className={classx(
                  'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 transition-colors',
                  steps.payment ? 'bg-primary text-on-primary' : 'bg-primary/20 text-primary',
                )}
              >
                2
              </div>
            )}
          </Snippet>
          <span className="font-semibold">Payment Method</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-6">
          <Field>
            <TextField id="cn-1" variant="outlined" placeholder="0000 0000 0000 0000" />
            <FieldLabel>Card Number</FieldLabel>
          </Field>
          <div className="flex gap-4">
            <Field className="flex-1">
              <TextField id="mm-1" variant="outlined" placeholder="MM/YY" />
              <FieldLabel>Expiration</FieldLabel>
            </Field>
            <Field className="flex-1">
              <TextField id="cvc-1" variant="outlined" placeholder="123" />
              <FieldLabel>CVC</FieldLabel>
            </Field>
          </div>
          <div className="flex justify-end py-6">
            <Button
              variant="filled"
              onClick={() => {
                steps.payment = true;
                steps.current = 'step-3';
              }}
            >
              Review Order
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible className="air-card-outlined" name="step-3">
        <CollapsibleTrigger
          disabled={$use(() => !steps.payment)}
          className="air-card-header items-center cursor-pointer hover:text-primary transition-colors"
        >
          <Snippet>
            {() => (
              <div
                className={classx(
                  'flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm shrink-0 transition-colors',
                  steps.review ? 'bg-primary text-on-primary' : 'bg-primary/20 text-primary',
                )}
              >
                3
              </div>
            )}
          </Snippet>
          <span className="font-semibold">Order Review</span>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-6">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Subtotal</span>
            <span>$120.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Shipping</span>
            <span>$5.00</span>
          </div>
          <div className="flex justify-between font-bold mt-2">
            <span className="text-on-surface">Total</span>
            <span>$125.00</span>
          </div>
          <div className="flex justify-end py-6">
            <Button
              variant="filled"
              className="w-full"
              onClick={() => {
                steps.review = true;
                steps.current = '';
              }}
            >
              Place Order
            </Button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </CollapsibleGroup>
  );
}, 'Single');

export default Single;
