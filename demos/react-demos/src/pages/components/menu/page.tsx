import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
  Menu,
  MenuButton,
  MenuContent,
  MenuItem,
  SubMenu,
  Tooltip,
} from '@airlib/react-ui/components';
import { page, setup } from '@airlib/react';
import { menuRoute } from '../route.js';

const MenuDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Menus & Tooltips</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Self-governing components that teleport to the body and naturally discover their parent triggers.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Standard Menu</CardTitle>
            <p className="air-body-sm">A classic dropdown menu triggered by a button.</p>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4 items-center h-64">
              <Menu open>
                <MenuButton>
                  Open Menu <span className="air-icon ml-2">arrow_drop_down</span>
                </MenuButton>

                <MenuContent>
                  <MenuItem>
                    <span className="air-icon mr-3">content_copy</span>
                    <span className="air-menu-item-text">Copy</span>
                    <span className="air-menu-item-tips">CMD + C</span>
                  </MenuItem>
                  <div className="air-menu-separator"></div>
                  <MenuItem>
                    <span className="air-icon mr-3">edit</span>
                    <span className="air-menu-item-text">Edit</span>
                    <span className="air-menu-item-tips">CMD + E</span>
                  </MenuItem>
                  <SubMenu>
                    <MenuItem>
                      <span className="air-icon mr-3">share</span>
                      <span className="air-menu-item-text">Share</span>
                      <span className="air-menu-item-tips">CMD + S</span>
                    </MenuItem>
                    <MenuContent>
                      <MenuItem>
                        <span className="air-icon mr-3">email</span>
                        <span className="air-menu-item-text">Email</span>
                      </MenuItem>
                      <MenuItem>
                        <span className="air-icon mr-3">sms</span>
                        <span className="air-menu-item-text">SMS</span>
                      </MenuItem>
                    </MenuContent>
                  </SubMenu>
                  <div className="air-menu-separator"></div>
                  <MenuItem>
                    <span className="air-icon mr-3">delete</span>
                    <span className="air-menu-item-text">Delete</span>
                    <span className="air-menu-item-tips">CMD + D</span>
                  </MenuItem>
                </MenuContent>
              </Menu>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Tooltip</CardTitle>
            <p className="air-body-sm">Provides contextual information on hover or focus.</p>
          </CardHeader>
          <CardBody>
            <div className="flex gap-4 items-center h-48">
              <div className="air-icon-button air-icon-button-tonal">
                <span className="air-icon">info</span>
                <Tooltip yPos="after" xPos="center">
                  This is a self-governing tooltip!
                </Tooltip>
              </div>
              <div className="air-icon-button air-icon-button-tonal">
                <span className="air-icon">info</span>
                <Tooltip rich yPos="after" xPos="start">
                  <div className="max-w-sm">
                    <h4 className="air-title-sm mb-1">Rich Tooltip</h4>
                    <p className="air-body-sm">
                      This is a rich tooltip that provides more detailed information and context about an element.
                    </p>
                  </div>
                </Tooltip>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'MenuDemo');

export const MenuPage = page(menuRoute).render(() => <MenuDemo />);

export default MenuPage;
