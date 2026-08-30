import {
  Collapsible,
  CollapsibleGroup,
  ListItemContent,
  ToolField,
  ToolFieldInput,
  ToolIcon,
} from '@airlib/react-ui/components';
import { SearchIcon } from '@airlib/react-ui/icons';
import { $bind, For, Link, mutable, page, Show } from '@airlib/react';
import { AccordionPage } from './accordion/page.js';
import { AvatarPage } from './avatar/page.js';
import { BadgePage } from './badge/page.js';
import { ButtonPage } from './button/page.js';
import { CardPage } from './card/page.js';
import { CheckboxPage } from './checkbox/page.js';
import { ChipPage } from './chip/page.js';
import { CodeBlockPage } from './code-block/page.js';
import { CollapsiblePage } from './collapsible/page.js';
import { DialogPage } from './dialog/page.js';
import { FabPage } from './fab/page.js';
import { FormPage } from './form/page.js';
import { IconButtonPage } from './icon-button/page.js';
import { ListPage } from './list/page.js';
import { MenuPage } from './menu/page.js';
import { UIPage } from './page.js';
import { PickerPage } from './picker/page.js';
import { ProgressPage } from './progress/page.js';
import { RadioPage } from './radio/page.js';
import { uiRoute } from './route.js';
import { SelectPage } from './select/page.js';
import { SideSheetPage } from './side-sheet/page.js';
import { SliderPage } from './slider/page.js';
import { SnackbarPage } from './snackbar/page.js';
import { StatusPage } from './status/page.js';
import { SwitchPage } from './switch/page.js';
import { TabPage } from './tab/page.js';
import { TablePage } from './table/page.js';
import { TextFieldPage } from './text-field/page.js';
import { TextareaPage } from './textarea/page.js';
import { ToolbarPage } from './toolbar/page.js';
import { TooltipPage } from './tooltip/page.js';
import { TypographyPage } from './typography/page.js';

type NavPage = {
  to: ReturnType<typeof page>;
  label: string;
};

type NavGroup = {
  name: string;
  label: string;
  pages: NavPage[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    name: 'layout',
    label: 'Layout & Surface',
    pages: [
      { to: AccordionPage, label: 'Accordion' },
      { to: CardPage, label: 'Card' },
      { to: CollapsiblePage, label: 'Collapsible' },
      { to: DialogPage, label: 'Dialog' },
      { to: SideSheetPage, label: 'Side Sheet' },
    ],
  },
  {
    name: 'actions',
    label: 'Actions & Nav',
    pages: [
      { to: ButtonPage, label: 'Button' },
      { to: FabPage, label: 'Floating Action Button' },
      { to: IconButtonPage, label: 'Icon Button' },
      { to: MenuPage, label: 'Menu' },
      { to: TabPage, label: 'Tabs' },
      { to: ToolbarPage, label: 'Toolbar' },
    ],
  },
  {
    name: 'forms',
    label: 'Form Controls',
    pages: [
      { to: CheckboxPage, label: 'Checkbox' },
      { to: FormPage, label: 'Form' },
      { to: PickerPage, label: 'Picker' },
      { to: RadioPage, label: 'Radio Button' },
      { to: SelectPage, label: 'Select' },
      { to: SliderPage, label: 'Slider' },
      { to: SwitchPage, label: 'Switch' },
      { to: TextFieldPage, label: 'Text Field' },
      { to: TextareaPage, label: 'Textarea' },
    ],
  },
  {
    name: 'data',
    label: 'Data & Display',
    pages: [
      { to: AvatarPage, label: 'Avatar' },
      { to: BadgePage, label: 'Badge' },
      { to: ChipPage, label: 'Chip' },
      { to: CodeBlockPage, label: 'Code Block' },
      { to: TablePage, label: 'Data Table' },
      { to: ListPage, label: 'List' },
      { to: ProgressPage, label: 'Progress' },
      { to: StatusPage, label: 'Status' },
      { to: TypographyPage, label: 'Typography' },
    ],
  },
  {
    name: 'feedback',
    label: 'Feedback & Overlays',
    pages: [
      { to: SnackbarPage, label: 'Snackbar' },
      { to: TooltipPage, label: 'Tooltip' },
    ],
  },
];

export const UILayout = page(uiRoute).render(({ children }) => {
  const filter = mutable('');
  const shouldVisible = (item) => {
    return !filter.value || item.label.toLowerCase().includes(filter.value.toLowerCase());
  };

  return (
    <div className="air-page">
      <aside className="air-sidebar top-20 max-h-[calc(100vh-96px)]">
        <nav className="air-nav">
          <ToolField className="w-full mb-4">
            <ToolIcon>
              <SearchIcon />
            </ToolIcon>
            <ToolFieldInput value={$bind(filter)} placeholder={'Search menu...'} />
          </ToolField>

          <Link to={UIPage} className="air-link-nav">
            <ListItemContent>Overview</ListItemContent>
          </Link>

          <CollapsibleGroup className="w-full">
            <For each={NAV_GROUPS}>
              {(group) => (
                <Collapsible key={group.name} name={group.name} label={group.label} expanded>
                  <div className="air-nav-subgroup">
                    <For each={group.pages}>
                      {(nav) => (
                        <Show when={() => shouldVisible(nav)}>
                          <Link key={nav.label} to={nav.to} className="air-link-nav">
                            <ListItemContent>{nav.label}</ListItemContent>
                          </Link>
                        </Show>
                      )}
                    </For>
                  </div>
                </Collapsible>
              )}
            </For>
          </CollapsibleGroup>
        </nav>
      </aside>
      <div className="air-content">{children}</div>
    </div>
  );
});

export default UILayout;
