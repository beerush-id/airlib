import {
  Card,
  Collapsible,
  CollapsibleContent,
  CollapsibleGroup,
  CollapsibleTrigger,
  Icon,
  ToolButton,
  Toolbar,
  ToolField,
  ToolFieldInput,
  ToolGroup,
  ToolIcon,
  Tooltip,
} from '@airlib/react-ui/components';
import { SearchIcon, UnfoldLess, UnfoldMore } from '@airlib/react-ui/icons';
import { $bind, mutable, setup } from '@airlib/react';

const Controlled = setup(() => {
  const state = mutable({
    src: true,
    components: false,
    utils: false,
  });

  const toggleAll = (expand: boolean) => {
    state.src = expand;
    state.components = expand;
    state.utils = expand;
  };

  return (
    <div className="flex flex-col gap-1">
      <Toolbar>
        <ToolField className={'flex-1'}>
          <ToolIcon>
            <SearchIcon />
          </ToolIcon>
          <ToolFieldInput placeholder={'Search files...'} />
        </ToolField>
        <ToolGroup>
          <ToolButton onClick={() => toggleAll(true)}>
            <UnfoldMore />
            <Tooltip>Expand All</Tooltip>
          </ToolButton>
          <ToolButton onClick={() => toggleAll(false)}>
            <UnfoldLess />
            <Tooltip>Collapse All</Tooltip>
          </ToolButton>
        </ToolGroup>
      </Toolbar>

      <Card className={'p-2'}>
        <CollapsibleGroup className="flex flex-col">
          <Collapsible name="src" expanded={$bind(state, 'src')}>
            <CollapsibleTrigger className="air-link-nav">
              <Icon name={() => (state.src ? 'folder_open' : 'folder')} className="text-primary text-lg shrink-0" />
              <span className="truncate">src/</span>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="flex flex-col pl-3">
                <div className="air-link-nav">
                  <Icon name="insert_drive_file" className="text-lg shrink-0" />
                  <span className="truncate">index.ts</span>
                </div>
                <div className="air-link-nav">
                  <Icon name="insert_drive_file" className="text-lg shrink-0" />
                  <span className="truncate">App.tsx</span>
                </div>

                {/* Nested Collapsible */}
                <Collapsible name="components" expanded={$bind(state, 'components')}>
                  <CollapsibleTrigger className="air-link-nav">
                    <Icon
                      name={() => (state.components ? 'folder_open' : 'folder')}
                      className="text-primary text-lg shrink-0"
                    />
                    <span className="truncate">components/</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="flex flex-col pl-3">
                      <div className="air-link-nav">
                        <Icon name="insert_drive_file" className="text-lg shrink-0" />
                        <span className="truncate">Button.tsx</span>
                      </div>
                      <div className="air-link-nav">
                        <Icon name="insert_drive_file" className="text-lg shrink-0" />
                        <span className="truncate">Card.tsx</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible name="utils" expanded={$bind(state, 'utils')}>
                  <CollapsibleTrigger className="air-link-nav">
                    <Icon
                      name={() => (state.utils ? 'folder_open' : 'folder')}
                      className="text-primary text-lg shrink-0"
                    />
                    <span className="truncate">utils/</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="flex flex-col pl-3">
                      <div className="air-link-nav">
                        <Icon name="insert_drive_file" className="text-lg shrink-0" />
                        <span className="truncate">format.ts</span>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CollapsibleGroup>
      </Card>
    </div>
  );
}, 'Controlled');

export default Controlled;
