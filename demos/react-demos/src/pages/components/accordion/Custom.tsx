import { Accordion, AccordionContent, AccordionGroup, AccordionHeader, Icon, Status } from '@airlib/react-ui';

export default () => (
  <AccordionGroup value="profile">
    <Accordion name="profile">
      <AccordionHeader>
        <div className="flex items-center gap-3">
          <Icon name="account_circle" className="text-primary" />
          <span>Profile & Identity</span>
        </div>
        <div className="flex items-center gap-3">
          <Status variant="surface">Verified</Status>
          <Icon name="expand_more" />
        </div>
      </AccordionHeader>
      <AccordionContent>
        <p className="air-body-md text-on-surface-variant">
          Your identity verification is active. Changes to primary email addresses or tax identification numbers require
          re-verification through our security portal.
        </p>
      </AccordionContent>
    </Accordion>

    <Accordion name="billing">
      <AccordionHeader>
        <div className="flex items-center gap-3">
          <Icon name="credit_card" className="text-primary" />
          <span>Billing & Subscriptions</span>
        </div>
        <div className="flex items-center gap-3">
          <Status variant="primary">Pro Plan</Status>
          <Icon name="expand_more" />
        </div>
      </AccordionHeader>
      <AccordionContent>
        <p className="air-body-md text-on-surface-variant">
          Your enterprise Pro Plan subscription renews automatically on the first of every month. Download invoice PDFs
          directly from your billing dashboard.
        </p>
      </AccordionContent>
    </Accordion>
  </AccordionGroup>
);
