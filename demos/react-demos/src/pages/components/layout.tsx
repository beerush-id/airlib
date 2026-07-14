import { Collapsible, CollapsibleGroup } from '@airlib/react-ui/components';
import { Link, page } from '@anchorlib/react';
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

export const UILayout = page(uiRoute).render(({ children }) => (
  <div className="air-page">
    <aside className="air-sidebar top-[80px] max-h-[calc(100vh-96px)]">
      <nav className="air-nav">
        <Link href={UIPage.route.path} className="air-link-nav">
          <span className="air-list-view-item-content">Overview</span>
        </Link>

        <CollapsibleGroup className="w-full">
          <Collapsible name="layout" label="Layout & Surface" expanded={true}>
            <div className="air-nav-subgroup">
              <Link to={AccordionPage} className="air-link-nav">
                <span className="air-list-view-item-content">Accordion</span>
              </Link>
              <Link to={CardPage} className="air-link-nav">
                <span className="air-list-view-item-content">Card</span>
              </Link>
              <Link to={CollapsiblePage} className="air-link-nav">
                <span className="air-list-view-item-content">Collapsible</span>
              </Link>
              <Link to={DialogPage} className="air-link-nav">
                <span className="air-list-view-item-content">Dialog</span>
              </Link>
              <Link to={SideSheetPage} className="air-link-nav">
                <span className="air-list-view-item-content">Side Sheet</span>
              </Link>
            </div>
          </Collapsible>

          <Collapsible name="actions" label="Actions & Nav" expanded={true}>
            <div className="air-nav-subgroup">
              <Link to={ButtonPage} className="air-link-nav">
                <span className="air-list-view-item-content">Button</span>
              </Link>
              <Link to={FabPage} className="air-link-nav">
                <span className="air-list-view-item-content">Floating Action Button</span>
              </Link>
              <Link to={IconButtonPage} className="air-link-nav">
                <span className="air-list-view-item-content">Icon Button</span>
              </Link>
              <Link to={MenuPage} className="air-link-nav">
                <span className="air-list-view-item-content">Menu</span>
              </Link>
              <Link to={TabPage} className="air-link-nav">
                <span className="air-list-view-item-content">Tabs</span>
              </Link>
              <Link to={ToolbarPage} className="air-link-nav">
                <span className="air-list-view-item-content">Toolbar</span>
              </Link>
            </div>
          </Collapsible>

          <Collapsible name="forms" label="Form Controls" expanded={true}>
            <div className="air-nav-subgroup">
              <Link to={CheckboxPage} className="air-link-nav">
                <span className="air-list-view-item-content">Checkbox</span>
              </Link>
              <Link to={FormPage} className="air-link-nav">
                <span className="air-list-view-item-content">Form</span>
              </Link>
              <Link to={PickerPage} className="air-link-nav">
                <span className="air-list-view-item-content">Picker</span>
              </Link>
              <Link to={RadioPage} className="air-link-nav">
                <span className="air-list-view-item-content">Radio Button</span>
              </Link>
              <Link to={SelectPage} className="air-link-nav">
                <span className="air-list-view-item-content">Select</span>
              </Link>
              <Link to={SliderPage} className="air-link-nav">
                <span className="air-list-view-item-content">Slider</span>
              </Link>
              <Link to={SwitchPage} className="air-link-nav">
                <span className="air-list-view-item-content">Switch</span>
              </Link>
              <Link to={TextFieldPage} className="air-link-nav">
                <span className="air-list-view-item-content">Text Field</span>
              </Link>
              <Link to={TextareaPage} className="air-link-nav">
                <span className="air-list-view-item-content">Textarea</span>
              </Link>
            </div>
          </Collapsible>

          <Collapsible name="data" label="Data & Display" expanded={true}>
            <div className="air-nav-subgroup">
              <Link to={AvatarPage} className="air-link-nav">
                <span className="air-list-view-item-content">Avatar</span>
              </Link>
              <Link to={BadgePage} className="air-link-nav">
                <span className="air-list-view-item-content">Badge</span>
              </Link>
              <Link to={ChipPage} className="air-link-nav">
                <span className="air-list-view-item-content">Chip</span>
              </Link>
              <Link to={CodeBlockPage} className="air-link-nav">
                <span className="air-list-view-item-content">Code Block</span>
              </Link>
              <Link to={TablePage} className="air-link-nav">
                <span className="air-list-view-item-content">Data Table</span>
              </Link>
              <Link to={ListPage} className="air-link-nav">
                <span className="air-list-view-item-content">List</span>
              </Link>
              <Link to={ProgressPage} className="air-link-nav">
                <span className="air-list-view-item-content">Progress</span>
              </Link>
              <Link to={StatusPage} className="air-link-nav">
                <span className="air-list-view-item-content">Status</span>
              </Link>
              <Link to={TypographyPage} className="air-link-nav">
                <span className="air-list-view-item-content">Typography</span>
              </Link>
            </div>
          </Collapsible>

          <Collapsible name="feedback" label="Feedback & Overlays" expanded={true}>
            <div className="air-nav-subgroup">
              <Link to={SnackbarPage} className="air-link-nav">
                <span className="air-list-view-item-content">Snackbar</span>
              </Link>
              <Link to={TooltipPage} className="air-link-nav">
                <span className="air-list-view-item-content">Tooltip</span>
              </Link>
            </div>
          </Collapsible>
        </CollapsibleGroup>
      </nav>
    </aside>
    <div className="air-content">{children}</div>
  </div>
));

export default UILayout;
