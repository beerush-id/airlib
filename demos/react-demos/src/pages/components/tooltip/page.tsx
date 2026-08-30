import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
  Tooltip,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from '@airlib/react-ui/components';
import { page, setup } from '@airlib/react';
import { tooltipRoute } from '../route.js';

const TooltipDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Tooltips</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Tooltips display informative text when users hover over, focus on, or tap an element.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Plain Tooltip</CardTitle>
            <p className="air-body-sm">Brief, identifying text for an element.</p>
          </CardHeader>
          <CardBody>
            <div className="flex p-8 items-center justify-center">
              <Button variant="outlined">
                Hover Me
                <Tooltip>Plain tooltip</Tooltip>
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Rich Tooltip</CardTitle>
            <p className="air-body-sm">More detailed information and context.</p>
          </CardHeader>
          <CardBody>
            <div className="flex p-8 items-center justify-center">
              <Button variant="outlined">
                Hover for Rich Info
                <Tooltip rich>
                  <h4 className="air-title-sm mb-1">Rich Tooltip</h4>
                  <p className="air-body-sm">
                    This is a rich tooltip that provides more detailed information and context about an element.
                  </p>
                </Tooltip>
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Positioning</CardTitle>
            <p className="air-body-sm">Tooltips can be positioned relative to their anchor using xPos and yPos.</p>
          </CardHeader>
          <CardBody>
            <div className="overflow-x-auto">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Position</TableHeader>
                    <TableHeader>xPos</TableHeader>
                    <TableHeader>yPos</TableHeader>
                    <TableHeader>Demo</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Top</TableCell>
                    <TableCell>
                      <code className="air-code-sm text-primary">center</code>
                    </TableCell>
                    <TableCell>
                      <code className="air-code-sm text-primary">before</code>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined">
                        Hover Me
                        <Tooltip xPos="center" yPos="before">
                          Top tooltip
                        </Tooltip>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Bottom</TableCell>
                    <TableCell>
                      <code className="air-code-sm text-primary">center</code>
                    </TableCell>
                    <TableCell>
                      <code className="air-code-sm text-primary">after</code>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined">
                        Hover Me
                        <Tooltip xPos="center" yPos="after">
                          Bottom tooltip
                        </Tooltip>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Start (Left)</TableCell>
                    <TableCell>
                      <code className="air-code-sm text-primary">before</code>
                    </TableCell>
                    <TableCell>
                      <code className="air-code-sm text-primary">center</code>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined">
                        Hover Me
                        <Tooltip xPos="before" yPos="center">
                          Start tooltip
                        </Tooltip>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>End (Right)</TableCell>
                    <TableCell>
                      <code className="air-code-sm text-primary">after</code>
                    </TableCell>
                    <TableCell>
                      <code className="air-code-sm text-primary">center</code>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined">
                        Hover Me
                        <Tooltip xPos="after" yPos="center">
                          End tooltip
                        </Tooltip>
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Top Start</TableCell>
                    <TableCell>
                      <code className="air-code-sm text-primary">start</code>
                    </TableCell>
                    <TableCell>
                      <code className="air-code-sm text-primary">before</code>
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined">
                        Hover Me
                        <Tooltip xPos="start" yPos="before">
                          Top Start tooltip
                        </Tooltip>
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'TooltipDemo');

export const TooltipPage = page(tooltipRoute).render(() => <TooltipDemo />);
export default TooltipPage;
