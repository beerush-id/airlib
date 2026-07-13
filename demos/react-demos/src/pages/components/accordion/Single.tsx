import { Accordion, AccordionGroup } from '@airlib/react-ui/components';

export default () => (
  <AccordionGroup value="faq-2">
    <Accordion name="faq-1" label="How do I update my primary billing method?">
      <p className="air-body-md text-on-surface-variant">
        You can update your credit card details or switch to automated ACH bank transfers directly from your
        subscription billing settings.
      </p>
    </Accordion>
    <Accordion name="faq-2" label="Where can I find API endpoints and authentication keys?">
      <p className="air-body-md text-on-surface-variant">
        All REST and GraphQL endpoint schemas, along with personal access token generation tools, are located inside the
        developer portal.
      </p>
    </Accordion>
    <Accordion name="faq-3" label="Can multiple panels stay open simultaneously?">
      <p className="air-body-md text-on-surface-variant">
        Yes! When the parent `AccordionGroup` does not enforce a shared `value` selection, any number of panels can be
        opened independently by the user.
      </p>
    </Accordion>
  </AccordionGroup>
);
