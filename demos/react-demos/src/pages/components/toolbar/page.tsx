import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
  createToggleGroup,
  ToolButton,
  Toolbar,
  ToolbarGroup,
  ToolbarGroupContent,
  ToolbarGroupLabel,
  ToolbarSeparator,
  ToolField,
  ToolFieldInput,
  ToolGroup,
  ToolIcon,
  ToolIconButton,
  ToolInput,
  Tooltip,
} from '@airlib/react-ui/components';
import { Select, SelectItem, SelectMenu, SelectTrigger } from '@airlib/react-ui/form';
import { $bind, $use, history, mutable, page, setup, template } from '@anchorlib/react';
import { toolbarRoute } from '../route.js';

const ALIGNMENT = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right',
  JUSTIFY: 'justify',
} as const;

type Alignment = (typeof ALIGNMENT)[keyof typeof ALIGNMENT];

const ToolbarDemo = setup(() => {
  const editorState = mutable({
    fontFamily: 'Inter',
    fontSize: '16px',
    lineHeight: '1.5',
    letterSpacing: '0px',
    bold: false,
    italic: true,
    underline: false,
    strikethrough: false,
    align: 'center' as 'left' | 'center' | 'right' | 'justify',
  });
  const editHistory = history(editorState);

  const dataViewState = mutable({
    search: '',
    filterActive: false,
    sortAsc: true,
    viewMode: 'list' as 'grid' | 'list',
  });

  const workspaceState = mutable({
    tool: 'select' as 'select' | 'hand' | 'rect' | 'circle' | 'text',
    zoom: 100,
  });

  const Align = createToggleGroup<Alignment>();

  const CodeView = template<{ state: object }>((props) => (
    <pre className="air-pre rounded-md bg-surface p-4">
      <code className="air-code" dangerouslySetInnerHTML={{ __html: JSON.stringify(props.state, null, 2) }} />
    </pre>
  ));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Toolbar & Grouped Controls</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Toolbars combine compact action buttons (<code className="text-primary font-mono">ToolButton</code>), icon
          buttons (<code className="text-primary font-mono">ToolIconButton</code>), inputs (
          <code className="text-primary font-mono">ToolInput</code>), and group separators (
          <code className="text-primary font-mono">ToolbarSeparator</code>) into seamless control bars for rich text
          editors, data grids, and canvas tools. Every interactive action includes a{' '}
          <code className="text-primary font-mono">Tooltip</code> for clear guidance.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Rich Text Editor Toolbar</CardTitle>
            <p className="air-body-sm">
              A full-featured formatting toolbar utilizing{' '}
              <code className="text-primary font-mono">&lt;Toolbar variant="outlined"&gt;</code>,{' '}
              <code className="text-primary font-mono">&lt;ToolbarSeparator /&gt;</code>, and reactive state bindings
              via <code className="text-primary font-mono">$bind</code>.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              <Toolbar>
                {/* History Group */}
                <ToolGroup>
                  <ToolIconButton
                    onClick={() => editHistory.backward()}
                    disabled={$use(() => !editHistory.canBackward)}
                    aria-label="Undo"
                  >
                    <ToolIcon>undo</ToolIcon>
                    <Tooltip>Undo (Ctrl+Z)</Tooltip>
                  </ToolIconButton>
                  <ToolIconButton
                    onClick={() => editHistory.forward()}
                    disabled={$use(() => !editHistory.canForward)}
                    aria-label="Redo"
                  >
                    <ToolIcon>redo</ToolIcon>
                    <Tooltip>Redo (Ctrl+Y)</Tooltip>
                  </ToolIconButton>
                </ToolGroup>

                <ToolbarSeparator />

                {/* Font Group */}
                <ToolGroup>
                  <Select value={$bind(editorState, 'fontFamily')}>
                    <SelectTrigger>
                      {(state, ref) => (
                        <ToolButton ref={ref}>
                          <span>{state.text ?? 'Font'}</span>
                          <ToolIcon>arrow_drop_down</ToolIcon>
                          <Tooltip>Font Family</Tooltip>
                        </ToolButton>
                      )}
                    </SelectTrigger>
                    <SelectMenu className="air-menu-sm">
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="monospace">Monospace</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                    </SelectMenu>
                  </Select>
                  <ToolInput
                    className="w-[64px] text-center"
                    value={$bind(editorState, 'fontSize')}
                    placeholder="Size"
                  />
                </ToolGroup>

                <ToolbarSeparator />

                {/* Formatting Group */}
                <ToolGroup>
                  <ToolIconButton active={$bind(editorState, 'bold')} aria-label="Bold">
                    <ToolIcon>format_bold</ToolIcon>
                    <Tooltip>Bold (Ctrl+B)</Tooltip>
                  </ToolIconButton>
                  <ToolIconButton active={$bind(editorState, 'italic')} aria-label="Italic">
                    <ToolIcon>format_italic</ToolIcon>
                    <Tooltip>Italic (Ctrl+I)</Tooltip>
                  </ToolIconButton>
                  <ToolIconButton active={$bind(editorState, 'underline')} aria-label="Underline">
                    <ToolIcon>format_underlined</ToolIcon>
                    <Tooltip>Underline (Ctrl+U)</Tooltip>
                  </ToolIconButton>
                  <ToolIconButton active={$bind(editorState, 'strikethrough')} aria-label="Strikethrough">
                    <ToolIcon>strikethrough_s</ToolIcon>
                    <Tooltip>Strikethrough (Ctrl+Shift+X)</Tooltip>
                  </ToolIconButton>
                </ToolGroup>

                <ToolbarSeparator />

                {/* Alignment Group */}
                <Align.Group value={$bind(editorState, 'align')}>
                  <Align.IconButton value={ALIGNMENT.LEFT} aria-label="Align Left">
                    <ToolIcon>format_align_left</ToolIcon>
                    <Tooltip>Align Left (Ctrl+L)</Tooltip>
                  </Align.IconButton>
                  <Align.IconButton value={ALIGNMENT.CENTER} aria-label="Center">
                    <ToolIcon>format_align_center</ToolIcon>
                    <Tooltip>Align Center (Ctrl+E)</Tooltip>
                  </Align.IconButton>
                  <Align.IconButton value={ALIGNMENT.RIGHT} aria-label="Right">
                    <ToolIcon>format_align_right</ToolIcon>
                    <Tooltip>Align Right (Ctrl+R)</Tooltip>
                  </Align.IconButton>
                </Align.Group>

                <ToolbarSeparator />
                <span className="flex-1"></span>

                {/* Insert Group */}
                <ToolGroup>
                  <ToolIconButton aria-label="Insert Link">
                    <ToolIcon>link</ToolIcon>
                    <Tooltip>Insert Link (Ctrl+K)</Tooltip>
                  </ToolIconButton>
                  <ToolIconButton aria-label="Insert Image">
                    <ToolIcon>image</ToolIcon>
                    <Tooltip>Insert Image</Tooltip>
                  </ToolIconButton>
                </ToolGroup>
              </Toolbar>
            </div>
          </CardBody>
          <CardBody>
            <CodeView state={editorState} />
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Filter & Data View Toolbar</CardTitle>
            <p className="air-body-sm">
              A data management toolbar using <code className="text-primary font-mono">&lt;Toolbar&gt;</code> with
              search inputs, filter toggles, action buttons, and informative tooltips.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4">
              <Toolbar className="justify-between">
                <div className="flex items-center gap-3 flex-wrap">
                  <ToolGroup>
                    <ToolInput
                      className="w-[240px]"
                      placeholder="Search keywords..."
                      value={$bind(dataViewState, 'search')}
                    />
                  </ToolGroup>

                  <ToolbarSeparator />

                  <ToolGroup>
                    <ToolButton active={$bind(dataViewState, 'filterActive')} className="px-4">
                      <ToolIcon>filter_list</ToolIcon>
                      <span>Filter</span>
                      <Tooltip>Filter by status or date</Tooltip>
                    </ToolButton>
                    <ToolButton active={$bind(dataViewState, 'sortAsc')} className="px-4">
                      <ToolIcon>sort</ToolIcon>
                      {() => (dataViewState.sortAsc ? <span>Sort: Asc</span> : <span>Sort: Desc</span>)}
                      <Tooltip>Toggle ascending / descending order</Tooltip>
                    </ToolButton>
                  </ToolGroup>
                </div>

                <div className="flex items-center gap-2">
                  <ToolIconButton
                    active={dataViewState.viewMode === 'grid'}
                    onClick={() => {
                      dataViewState.viewMode = 'grid';
                    }}
                    aria-label="Grid View"
                  >
                    <ToolIcon>grid_view</ToolIcon>
                    <Tooltip>Grid View</Tooltip>
                  </ToolIconButton>
                  <ToolIconButton
                    active={dataViewState.viewMode === 'list'}
                    onClick={() => {
                      dataViewState.viewMode = 'list';
                    }}
                    aria-label="List View"
                  >
                    <ToolIcon>view_list</ToolIcon>
                    <Tooltip>List View</Tooltip>
                  </ToolIconButton>
                </div>
              </Toolbar>
            </div>
          </CardBody>
          <CardBody>
            <CodeView state={dataViewState} />
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Floating Workspace Toolbar</CardTitle>
            <p className="air-body-sm">
              A floating pill toolbar (<code className="text-primary font-mono">rounded-full</code>) with coordinated
              mutually exclusive tool selection.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex p-6 items-center justify-center bg-surface-container-low rounded-lg min-h-[140px]">
              <Toolbar className="shadow-lg rounded-full px-4 py-2 gap-2">
                <ToolIconButton
                  active={workspaceState.tool === 'select'}
                  onClick={() => {
                    workspaceState.tool = 'select';
                  }}
                  aria-label="Select Tool"
                >
                  <ToolIcon>near_me</ToolIcon>
                  <Tooltip>Select / Move (V)</Tooltip>
                </ToolIconButton>
                <ToolIconButton
                  active={workspaceState.tool === 'hand'}
                  onClick={() => {
                    workspaceState.tool = 'hand';
                  }}
                  aria-label="Hand Tool"
                >
                  <ToolIcon>pan_tool</ToolIcon>
                  <Tooltip>Pan / Hand Tool (H)</Tooltip>
                </ToolIconButton>

                <ToolbarSeparator />

                <ToolIconButton
                  active={workspaceState.tool === 'rect'}
                  onClick={() => {
                    workspaceState.tool = 'rect';
                  }}
                  aria-label="Draw Rectangle"
                >
                  <ToolIcon>rectangle</ToolIcon>
                  <Tooltip>Rectangle (R)</Tooltip>
                </ToolIconButton>
                <ToolIconButton
                  active={workspaceState.tool === 'circle'}
                  onClick={() => {
                    workspaceState.tool = 'circle';
                  }}
                  aria-label="Draw Circle"
                >
                  <ToolIcon>circle</ToolIcon>
                  <Tooltip>Circle / Ellipse (O)</Tooltip>
                </ToolIconButton>
                <ToolIconButton
                  active={workspaceState.tool === 'text'}
                  onClick={() => {
                    workspaceState.tool = 'text';
                  }}
                  aria-label="Draw Text"
                >
                  <ToolIcon>title</ToolIcon>
                  <Tooltip>Text Box (T)</Tooltip>
                </ToolIconButton>

                <ToolbarSeparator />

                <ToolIconButton
                  onClick={() => {
                    workspaceState.zoom = Math.min(200, workspaceState.zoom + 10);
                  }}
                  aria-label="Zoom In"
                >
                  <ToolIcon>zoom_in</ToolIcon>
                  <Tooltip>Zoom In ({workspaceState.zoom}%)</Tooltip>
                </ToolIconButton>
                <ToolIconButton
                  onClick={() => {
                    workspaceState.zoom = Math.max(10, workspaceState.zoom - 10);
                  }}
                  aria-label="Zoom Out"
                >
                  <ToolIcon>zoom_out</ToolIcon>
                  <Tooltip>Zoom Out ({workspaceState.zoom}%)</Tooltip>
                </ToolIconButton>
              </Toolbar>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Sidebar Inspector & Labeled Groups</CardTitle>
            <p className="air-body-sm">
              Using declarative <code className="text-primary font-mono">&lt;ToolbarGroup&gt;</code>,{' '}
              <code className="text-primary font-mono">&lt;ToolbarGroupLabel&gt;</code>, and{' '}
              <code className="text-primary font-mono">&lt;ToolbarGroupContent&gt;</code> composition.
            </p>
          </CardHeader>
          <CardBody>
            <div className="inline-flex flex-col gap-6 w-fit bg-surface-container-high p-4 rounded-xl">
              <div className="flex flex-col gap-4">
                {/* Typography Section */}
                <ToolbarGroup>
                  <ToolbarGroupLabel>Font Family & Size</ToolbarGroupLabel>
                  <ToolbarGroupContent>
                    <ToolInput className="w-[140px]" value={$bind(editorState, 'fontFamily')} />
                    <ToolInput className="w-[64px] text-center" value={$bind(editorState, 'fontSize')} />
                  </ToolbarGroupContent>
                </ToolbarGroup>

                <div className="air-divider" />

                {/* Line Height & Letter Spacing */}
                <ToolbarGroup>
                  <ToolbarGroupLabel>Spacing & Line Height</ToolbarGroupLabel>
                  <ToolbarGroupContent>
                    <ToolField className="w-[96px]">
                      <ToolIcon>
                        height
                        <Tooltip>Line Height</Tooltip>
                      </ToolIcon>
                      <ToolFieldInput
                        className="text-center w-12"
                        value={$bind(editorState, 'lineHeight')}
                        aria-label="Line Height"
                      />
                    </ToolField>
                    <ToolField className="w-[96px]">
                      <ToolIcon>
                        space_bar
                        <Tooltip>Letter Spacing</Tooltip>
                      </ToolIcon>
                      <ToolFieldInput
                        className="text-center w-12"
                        value={$bind(editorState, 'letterSpacing')}
                        aria-label="Letter Spacing"
                      />
                    </ToolField>
                  </ToolbarGroupContent>
                </ToolbarGroup>

                <div className="air-divider" />

                {/* Alignment */}
                <ToolbarGroup>
                  <ToolbarGroupLabel>Text Alignment</ToolbarGroupLabel>
                  <ToolbarGroupContent>
                    <Align.Group value={$bind(editorState, 'align')}>
                      <Align.IconButton value={ALIGNMENT.LEFT} aria-label="Align Left">
                        <ToolIcon>format_align_left</ToolIcon>
                        <Tooltip>Align Left</Tooltip>
                      </Align.IconButton>
                      <Align.IconButton value={ALIGNMENT.CENTER} aria-label="Align Center">
                        <ToolIcon>format_align_center</ToolIcon>
                        <Tooltip>Align Center</Tooltip>
                      </Align.IconButton>
                      <Align.IconButton value={ALIGNMENT.RIGHT} aria-label="Align Right">
                        <ToolIcon>format_align_right</ToolIcon>
                        <Tooltip>Align Right</Tooltip>
                      </Align.IconButton>
                      <Align.IconButton value={ALIGNMENT.JUSTIFY} aria-label="Justify">
                        <ToolIcon>format_align_justify</ToolIcon>
                        <Tooltip>Justify</Tooltip>
                      </Align.IconButton>
                    </Align.Group>
                  </ToolbarGroupContent>
                </ToolbarGroup>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'ToolbarDemo');

export const ToolbarPage = page(toolbarRoute).render(() => <ToolbarDemo />);
export default ToolbarPage;
