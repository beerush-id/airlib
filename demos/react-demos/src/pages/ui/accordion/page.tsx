import { Card, CardBody, CardGroup, CardHeader, CardTitle } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { accordionRoute } from '../route.js';

const AccordionDemo = setup(() => {
  let openIndex = 0;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Accordion</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Accordions organize content into collapsible sections.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Accordion</CardTitle>
            <p className="air-body-sm">Displays a list of items that can be expanded or collapsed.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 max-w-lg">
              <div className="air-accordion-group">
                {[0, 1, 2].map((index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div className="air-accordion-item" key={index}>
                      <button
                        className="air-accordion-header"
                        aria-expanded={isOpen}
                        onClick={() => (openIndex = isOpen ? -1 : index)}
                      >
                        Accordion Item {index + 1}
                        <span
                          className="air-icon transition-transform duration-200"
                          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        >
                          expand_more
                        </span>
                      </button>
                      <div className="air-accordion-content" data-state={isOpen ? 'open' : 'closed'}>
                        <div className="air-accordion-inner air-body-md text-on-surface-variant">
                          This is the content for accordion item {index + 1}. You can place any content here.
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'AccordionDemo');

export const AccordionPage = page(accordionRoute).render(() => <AccordionDemo />);

export default AccordionPage;
