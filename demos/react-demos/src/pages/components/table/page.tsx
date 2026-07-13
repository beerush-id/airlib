import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardTitle,
  createTable,
  IconButton,
  Toolbar,
  ToolbarSeparator,
  ToolButton,
  ToolField,
  ToolFieldInput,
  ToolGroup,
  ToolIcon,
  Tooltip,
} from '@airlib/react-ui/components';
import { $bind, $use, derived, effect, mutable, page, setup, snippet } from '@anchorlib/react';
import { tableRoute } from '../route.js';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Offline';
};

const UserTable = createTable<User>();

const BASE_DATA: User[] = [
  { id: '1', name: 'Alex Smith', email: 'alex@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Jane Doe', email: 'jane@example.com', role: 'Editor', status: 'Offline' },
  { id: '3', name: 'John Doe', email: 'john.d@example.com', role: 'Viewer', status: 'Offline' },
  { id: '4', name: 'Sarah Connor', email: 'sarah.c@example.com', role: 'Manager', status: 'Active' },
  { id: '5', name: 'Michael Scott', email: 'm.scott@example.com', role: 'Admin', status: 'Active' },
  { id: '6', name: 'Jim Halpert', email: 'jim.h@example.com', role: 'Editor', status: 'Offline' },
  { id: '7', name: 'Pam Beesly', email: 'pam.b@example.com', role: 'Editor', status: 'Active' },
  { id: '8', name: 'Dwight Schrute', email: 'dwight.s@example.com', role: 'Admin', status: 'Active' },
  { id: '9', name: 'Angela Martin', email: 'angela.m@example.com', role: 'Manager', status: 'Offline' },
  { id: '10', name: 'Kevin Malone', email: 'kevin.m@example.com', role: 'Viewer', status: 'Active' },
  { id: '11', name: 'Oscar Martinez', email: 'oscar.m@example.com', role: 'Admin', status: 'Active' },
  { id: '12', name: 'Stanley Hudson', email: 'stanley.h@example.com', role: 'Viewer', status: 'Offline' },
  { id: '13', name: 'Phyllis Vance', email: 'phyllis.v@example.com', role: 'Editor', status: 'Active' },
  { id: '14', name: 'Meredith Palmer', email: 'meredith.p@example.com', role: 'Viewer', status: 'Offline' },
  { id: '15', name: 'Creed Bratton', email: 'creed.b@example.com', role: 'Admin', status: 'Active' },
  { id: '16', name: 'Ryan Howard', email: 'ryan.h@example.com', role: 'Manager', status: 'Offline' },
  { id: '17', name: 'Kelly Kapoor', email: 'kelly.k@example.com', role: 'Editor', status: 'Active' },
  { id: '18', name: 'Toby Flenderson', email: 'toby.f@example.com', role: 'Viewer', status: 'Offline' },
  { id: '19', name: 'Darryl Philbin', email: 'darryl.p@example.com', role: 'Manager', status: 'Active' },
  { id: '20', name: 'Erin Hannon', email: 'erin.h@example.com', role: 'Editor', status: 'Active' },
  { id: '21', name: 'Gabe Lewis', email: 'gabe.l@example.com', role: 'Admin', status: 'Offline' },
  { id: '22', name: 'Holly Flax', email: 'holly.f@example.com', role: 'Manager', status: 'Active' },
  { id: '23', name: 'Jan Levinson', email: 'jan.l@example.com', role: 'Admin', status: 'Offline' },
  { id: '24', name: 'Roy Anderson', email: 'roy.a@example.com', role: 'Viewer', status: 'Offline' },
  { id: '25', name: 'David Wallace', email: 'david.w@example.com', role: 'Admin', status: 'Active' },
  { id: '26', name: 'Leslie Knope', email: 'leslie.k@example.com', role: 'Manager', status: 'Active' },
  { id: '27', name: 'Ron Swanson', email: 'ron.s@example.com', role: 'Admin', status: 'Active' },
  { id: '28', name: 'Tom Haverford', email: 'tom.h@example.com', role: 'Editor', status: 'Offline' },
  { id: '29', name: 'April Ludgate', email: 'april.l@example.com', role: 'Viewer', status: 'Active' },
  { id: '30', name: 'Andy Dwyer', email: 'andy.d@example.com', role: 'Viewer', status: 'Offline' },
  { id: '31', name: 'Ben Wyatt', email: 'ben.w@example.com', role: 'Manager', status: 'Active' },
  { id: '32', name: 'Chris Traeger', email: 'chris.t@example.com', role: 'Admin', status: 'Active' },
  { id: '33', name: 'Ann Perkins', email: 'ann.p@example.com', role: 'Editor', status: 'Offline' },
  { id: '34', name: 'Donna Meagle', email: 'donna.m@example.com', role: 'Viewer', status: 'Active' },
  { id: '35', name: 'Jerry Gergich', email: 'jerry.g@example.com', role: 'Viewer', status: 'Offline' },
  { id: '36', name: 'Jake Peralta', email: 'jake.p@example.com', role: 'Editor', status: 'Active' },
  { id: '37', name: 'Amy Santiago', email: 'amy.s@example.com', role: 'Manager', status: 'Active' },
  { id: '38', name: 'Rosa Diaz', email: 'rosa.d@example.com', role: 'Editor', status: 'Offline' },
  { id: '39', name: 'Terry Jeffords', email: 'terry.j@example.com', role: 'Admin', status: 'Active' },
  { id: '40', name: 'Charles Boyle', email: 'charles.b@example.com', role: 'Viewer', status: 'Offline' },
  { id: '41', name: 'Raymond Holt', email: 'raymond.h@example.com', role: 'Admin', status: 'Active' },
  { id: '42', name: 'Gina Linetti', email: 'gina.l@example.com', role: 'Viewer', status: 'Active' },
  { id: '43', name: 'Eleanor Shellstrop', email: 'eleanor.s@example.com', role: 'Editor', status: 'Offline' },
  { id: '44', name: 'Chidi Anagonye', email: 'chidi.a@example.com', role: 'Manager', status: 'Active' },
  { id: '45', name: 'Tahani Al-Jamil', email: 'tahani.a@example.com', role: 'Editor', status: 'Offline' },
  { id: '46', name: 'Jason Mendoza', email: 'jason.m@example.com', role: 'Viewer', status: 'Active' },
  { id: '47', name: 'Michael Dawson', email: 'michael.d@example.com', role: 'Admin', status: 'Offline' },
  { id: '48', name: 'Jack Shephard', email: 'jack.s@example.com', role: 'Manager', status: 'Active' },
  { id: '49', name: 'Kate Austen', email: 'kate.a@example.com', role: 'Editor', status: 'Offline' },
  { id: '50', name: 'James Ford', email: 'james.f@example.com', role: 'Viewer', status: 'Active' },
  { id: '51', name: 'John Locke', email: 'john.l@example.com', role: 'Admin', status: 'Offline' },
  { id: '52', name: 'Hugo Reyes', email: 'hugo.r@example.com', role: 'Manager', status: 'Active' },
  { id: '53', name: 'Sayid Jarrah', email: 'sayid.j@example.com', role: 'Editor', status: 'Offline' },
  { id: '54', name: 'Desmond Hume', email: 'desmond.h@example.com', role: 'Viewer', status: 'Active' },
  { id: '55', name: 'Charlie Pace', email: 'charlie.p@example.com', role: 'Viewer', status: 'Offline' },
  { id: '56', name: 'Juliet Burke', email: 'juliet.b@example.com', role: 'Editor', status: 'Active' },
  { id: '57', name: 'Benjamin Linus', email: 'benjamin.l@example.com', role: 'Admin', status: 'Offline' },
  { id: '58', name: 'Ted Mosby', email: 'ted.m@example.com', role: 'Manager', status: 'Active' },
  { id: '59', name: 'Marshall Eriksen', email: 'marshall.e@example.com', role: 'Editor', status: 'Offline' },
  { id: '60', name: 'Lily Aldrin', email: 'lily.a@example.com', role: 'Viewer', status: 'Active' },
  { id: '61', name: 'Barney Stinson', email: 'barney.s@example.com', role: 'Admin', status: 'Offline' },
  { id: '62', name: 'Robin Scherbatsky', email: 'robin.s@example.com', role: 'Manager', status: 'Active' },
  { id: '63', name: 'Homer Simpson', email: 'homer.s@example.com', role: 'Viewer', status: 'Offline' },
  { id: '64', name: 'Marge Simpson', email: 'marge.s@example.com', role: 'Editor', status: 'Active' },
  { id: '65', name: 'Bart Simpson', email: 'bart.s@example.com', role: 'Viewer', status: 'Offline' },
  { id: '66', name: 'Lisa Simpson', email: 'lisa.s@example.com', role: 'Manager', status: 'Active' },
  { id: '67', name: 'Maggie Simpson', email: 'maggie.s@example.com', role: 'Viewer', status: 'Offline' },
  { id: '68', name: 'Sheldon Cooper', email: 'sheldon.c@example.com', role: 'Admin', status: 'Active' },
  { id: '69', name: 'Leonard Hofstadter', email: 'leonard.h@example.com', role: 'Manager', status: 'Offline' },
  { id: '70', name: 'Penny Hofstadter', email: 'penny.h@example.com', role: 'Editor', status: 'Active' },
  { id: '71', name: 'Howard Wolowitz', email: 'howard.w@example.com', role: 'Viewer', status: 'Offline' },
  { id: '72', name: 'Raj Koothrappali', email: 'raj.k@example.com', role: 'Editor', status: 'Active' },
  { id: '73', name: 'Bernadette Rostenkowski', email: 'bernadette.r@example.com', role: 'Viewer', status: 'Offline' },
  { id: '74', name: 'Amy Farrah Fowler', email: 'amy.f@example.com', role: 'Manager', status: 'Active' },
  { id: '75', name: 'Walter White', email: 'walter.w@example.com', role: 'Admin', status: 'Offline' },
  { id: '76', name: 'Jesse Pinkman', email: 'jesse.p@example.com', role: 'Editor', status: 'Active' },
  { id: '77', name: 'Skyler White', email: 'skyler.w@example.com', role: 'Viewer', status: 'Offline' },
  { id: '78', name: 'Hank Schrader', email: 'hank.s@example.com', role: 'Manager', status: 'Active' },
  { id: '79', name: 'Marie Schrader', email: 'marie.s@example.com', role: 'Viewer', status: 'Offline' },
  { id: '80', name: 'Saul Goodman', email: 'saul.g@example.com', role: 'Admin', status: 'Active' },
  { id: '81', name: 'Gustavo Fring', email: 'gustavo.f@example.com', role: 'Manager', status: 'Offline' },
  { id: '82', name: 'Mike Ehrmantraut', email: 'mike.e@example.com', role: 'Editor', status: 'Active' },
  { id: '83', name: 'Jon Snow', email: 'jon.s@example.com', role: 'Admin', status: 'Offline' },
  { id: '84', name: 'Daenerys Targaryen', email: 'daenerys.t@example.com', role: 'Manager', status: 'Active' },
  { id: '85', name: 'Tyrion Lannister', email: 'tyrion.l@example.com', role: 'Editor', status: 'Offline' },
  { id: '86', name: 'Arya Stark', email: 'arya.s@example.com', role: 'Viewer', status: 'Active' },
  { id: '87', name: 'Sansa Stark', email: 'sansa.s@example.com', role: 'Manager', status: 'Offline' },
  { id: '88', name: 'Cersei Lannister', email: 'cersei.l@example.com', role: 'Admin', status: 'Active' },
  { id: '89', name: 'Jaime Lannister', email: 'jaime.l@example.com', role: 'Viewer', status: 'Offline' },
  { id: '90', name: 'Joffrey Baratheon', email: 'joffrey.b@example.com', role: 'Viewer', status: 'Offline' },
  { id: '91', name: 'Rick Grimes', email: 'rick.g@example.com', role: 'Manager', status: 'Active' },
  { id: '92', name: 'Daryl Dixon', email: 'daryl.d@example.com', role: 'Editor', status: 'Offline' },
  { id: '93', name: 'Carol Peletier', email: 'carol.p@example.com', role: 'Viewer', status: 'Active' },
  { id: '94', name: 'Michonne Hawthorne', email: 'michonne.h@example.com', role: 'Admin', status: 'Offline' },
  { id: '95', name: 'Glenn Rhee', email: 'glenn.r@example.com', role: 'Manager', status: 'Active' },
  { id: '96', name: 'Maggie Greene', email: 'maggie.g@example.com', role: 'Viewer', status: 'Offline' },
  { id: '97', name: 'Carl Grimes', email: 'carl.g@example.com', role: 'Editor', status: 'Active' },
  { id: '98', name: 'Negan Smith', email: 'negan.s@example.com', role: 'Admin', status: 'Offline' },
  { id: '99', name: 'Dexter Morgan', email: 'dexter.m@example.com', role: 'Manager', status: 'Active' },
  { id: '100', name: 'Debra Morgan', email: 'debra.m@example.com', role: 'Viewer', status: 'Offline' },
];

const TableDemo = setup(() => {
  const state = mutable({
    rows: [] as User[],
    query: '',
    selected: [] as User[],
    page: 1,
    pageSize: 25,
    total: BASE_DATA.length,
  });

  const filteredUsers = derived(() => {
    if (!state.query) return BASE_DATA;
    const q = state.query.toLocaleLowerCase();
    return BASE_DATA.filter(
      (item) =>
        item.name.toLocaleLowerCase().includes(q) ||
        item.email.toLocaleLowerCase().includes(q) ||
        item.role.toLocaleLowerCase().includes(q) ||
        item.status.toLocaleLowerCase().includes(q)
    );
  });

  effect(() => {
    const source = filteredUsers.value;
    state.total = source.length;

    const maxPage = Math.ceil(state.total / state.pageSize) || 1;
    if (state.page > maxPage) {
      state.page = 1;
    }

    const start = (state.page - 1) * state.pageSize;
    state.rows = source.slice(start, start + state.pageSize);
  });

  const handleNext = () => {
    const maxPage = Math.ceil(state.total / state.pageSize) || 1;
    if (state.page < maxPage) state.page++;
  };

  const handlePrev = () => {
    if (state.page > 1) state.page--;
  };

  const Pagination = snippet(() => {
    const maxPage = Math.ceil(state.total / state.pageSize) || 1;
    const start = state.total === 0 ? 0 : (state.page - 1) * state.pageSize + 1;
    const end = Math.min(state.page * state.pageSize, state.total);

    return (
      <Toolbar className="w-full pl-4 rounded-full">
        <div className="air-body-sm text-on-surface-variant flex-1">
          Showing {start} to {end} of {state.total} users
        </div>
        <ToolGroup>
          <ToolButton disabled={state.page <= 1} onClick={handlePrev}>
            Prev
          </ToolButton>
          <ToolButton disabled={state.page >= maxPage} onClick={handleNext}>
            Prev
          </ToolButton>
        </ToolGroup>
      </Toolbar>
    );
  }, 'Pagination');

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Data Table</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Data tables display sets of data. They can be fully customized using CSS utilities to create rich, interactive
          table views.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <div className="flex items-center justify-between w-full gap-6">
              <div className="flex-1">
                <CardTitle>Segmented Data Table</CardTitle>
                <p className="air-card-subtitle">A table displaying rows of data.</p>
              </div>
              <Toolbar className="justify-between flex-1 rounded-full">
                <ToolField className="flex-1 rounded-full">
                  <ToolIcon>search</ToolIcon>
                  <ToolFieldInput placeholder="Search keywords..." value={$bind(() => state, 'query')} />
                </ToolField>

                <ToolbarSeparator />

                <ToolButton className="rounded-full">
                  <ToolIcon>filter_list</ToolIcon>
                  <span>Filter</span>
                  <Tooltip>Filter by status or date</Tooltip>
                </ToolButton>
              </Toolbar>
            </div>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            <UserTable rows={$use(state, 'rows')} selection={$use(state, 'selected')}>
              <UserTable.Head>
                <UserTable.HeaderRow>
                  <UserTable.Header>
                    <UserTable.Sort value="name" label="Name" />
                  </UserTable.Header>
                  <UserTable.Header>
                    <UserTable.Sort value="role" label="Role" />
                  </UserTable.Header>
                  <UserTable.Header>
                    <UserTable.Sort value="status" label="Status" />
                  </UserTable.Header>
                  <UserTable.Header className="text-right">
                    <span>Actions</span>
                  </UserTable.Header>
                </UserTable.HeaderRow>
              </UserTable.Head>
              <UserTable.Body>
                {(item) => (
                  <UserTable.Row item={item} variant="filled" key={item.id}>
                    <UserTable.Cell>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                          <span className="air-icon text-on-primary-container">person</span>
                        </div>
                        <div>
                          <h3 className="air-title-sm">{item.name}</h3>
                          <span className="air-body-sm text-on-surface-variant">{item.email}</span>
                        </div>
                      </div>
                    </UserTable.Cell>
                    <UserTable.Cell>
                      <span>{item.role}</span>
                    </UserTable.Cell>
                    <UserTable.Cell>
                      <span
                        className={`air-chip air-chip-sm border-0 ${
                          item.status === 'Active'
                            ? 'bg-tertiary-container text-on-tertiary-container'
                            : 'bg-surface-container text-on-surface'
                        }`}
                      >
                        {item.status}
                      </span>
                    </UserTable.Cell>
                    <UserTable.Cell className="text-right">
                      <IconButton>
                        <span className="air-icon">more_vert</span>
                      </IconButton>
                    </UserTable.Cell>
                  </UserTable.Row>
                )}
              </UserTable.Body>
            </UserTable>
            <Pagination />
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'TableDemo');

export const TablePage = page(tableRoute).render(() => <TableDemo />);

export default TablePage;
