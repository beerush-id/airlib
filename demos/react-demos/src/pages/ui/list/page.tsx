import { Card, CardBody, CardGroup, CardHeader, CardTitle } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { listRoute } from '../route.js';

const ListDemo = setup(() => {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Lists</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Lists are continuous, vertical indexes of text or images.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Filled List</CardTitle>
            <p className="air-body-sm">A list of items with filled background.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 max-w-lg">
              <div className="air-list-view air-list-view-filled">
                <div role="menuitem" className="air-list-view-item" tabIndex={0}>
                  <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center shrink-0">
                    <span className="air-icon text-on-tertiary-container">person</span>
                  </div>
                  <div className="air-list-view-item-content">
                    <span className="air-title-md text-on-surface">Alex Smith</span>
                    <span className="air-list-view-item-supporting-text">Online</span>
                  </div>
                </div>
                <div role="menuitem" className="air-list-view-item" tabIndex={0}>
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="air-icon text-on-secondary-container">person</span>
                  </div>
                  <div className="air-list-view-item-content">
                    <span className="air-title-md text-on-surface">Jane Doe</span>
                    <span className="air-list-view-item-supporting-text">Away</span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Segmented List</CardTitle>
            <p className="air-body-sm">A list with visually separated segments.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 max-w-lg">
              <div className="air-list-view">
                <div role="menuitem" className="air-list-view-item air-list-view-item-filled" tabIndex={0}>
                  <div className="w-14 h-14 rounded-md bg-primary-container flex items-center justify-center shrink-0">
                    <span className="air-icon text-on-primary-container">description</span>
                  </div>
                  <div className="air-list-view-item-content">
                    <span className="air-title-md text-on-surface">Document.pdf</span>
                    <span className="air-list-view-item-supporting-text">Updated 2 mins ago</span>
                  </div>
                  <button className="air-icon-button ml-4 shrink-0">
                    <span className="air-icon">more_vert</span>
                  </button>
                </div>
                <div role="menuitem" className="air-list-view-item air-list-view-item-filled" tabIndex={0}>
                  <div className="w-14 h-14 rounded-md bg-secondary-container flex items-center justify-center shrink-0">
                    <span className="air-icon text-on-secondary-container">image</span>
                  </div>
                  <div className="air-list-view-item-content">
                    <span className="air-title-md text-on-surface">Image.png</span>
                    <span className="air-list-view-item-supporting-text">Updated 1 hour ago</span>
                  </div>
                  <button className="air-icon-button ml-4 shrink-0">
                    <span className="air-icon">more_vert</span>
                  </button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'ListDemo');

export const ListPage = page(listRoute).render(() => <ListDemo />);

export default ListPage;
