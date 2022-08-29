import * as React from 'react';
// import Adaptable Component and other types
import AdaptableReact, {
  AdaptableOptions,
  AdaptableApi,
} from '@adaptabletools/adaptable-react-aggrid';

// import agGrid Component
import { AgGridReact } from '@ag-grid-community/react';

// import adaptable css and themes
import '@adaptabletools/adaptable-react-aggrid/base.css';
import '@adaptabletools/adaptable-react-aggrid/themes/light.css';
import '@adaptabletools/adaptable-react-aggrid/themes/dark.css';

// import aggrid themes (using new Balham theme)
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine-dark.css';

import {
  AllEnterpriseModules,
  ClientSideRowModelModule,
  GridOptions,
} from '@ag-grid-enterprise/all-modules';
import {ColDef} from "@ag-grid-community/all-modules";

// create ag-Grid Column Definitions
const columnDefs:ColDef[] = [
  {
    colId: 'id',
    hide: true,
    suppressColumnsToolPanel:true,
    suppressFiltersToolPanel:true
  },
  {
    headerName: 'Auto Make',
    field: 'make',
    editable: true,
    filter: true,
    sortable: true,
    type: 'abColDefString',
  },
  {
    headerName: 'Model',
    field: 'model',
    editable: true,
    filter: true,
    sortable: true,
    type: 'abColDefString',
  },
  {
    headerName: 'Price',
    field: 'price',
    editable: true,
    filter: true,
    sortable: true,
    type: 'abColDefNumber',
  },
  {
    headerName: 'Date manufactured',
    field: 'date',
    type: 'abColDefDate',
    filter: true,
    floatingFilter: true,
  },
];

// some dummy data
const rowData = [
  { id: 1, make: 'Toyota', model: 'Celica', price: 35000, date: '2010-01-02' },
  { id: 2, make: 'Ford', model: 'Mondeo', price: 32000, date: '2012-01-02' },
  { id: 3, make: 'Ford', model: 'Fiesta', price: 22000, date: '2014-01-02' },
  { id: 4, make: 'Porsche', model: 'Boxter', price: 72000, date: '2016-01-02' },
];

// let ag-grid know which columns and what data to use and add some other properties
const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,
  sideBar: true,
};

// build the AdaptableOptions object
// in this example we are NOT passing in predefined config but in the real world you will ship the AdapTable with objects and permissions
const adaptableOptions: AdaptableOptions = {
  primaryKey: 'id',
  userName: 'sandbox user',
  adaptableId: 'adaptable react demo',
  predefinedConfig: {
    Dashboard: {
      Tabs: [
        {
          Name: 'Welcome',
          Toolbars: ['Layout'],
        },
      ],
    },
  },
};

const modules = [...AllEnterpriseModules, ClientSideRowModelModule];

// Create the AdapTable inastance by using the AdapTableReact component
// And also create the ag-Grid instance by using the AgGridReact component
// NOTE: we pass the SAME gridOptions object into both
const App: React.FunctionComponent = () => {
  const adaptableApiRef = React.useRef<AdaptableApi>();
  return (
    <div style={{ display: 'flex', flexFlow: 'column', height: '100vh' }}>
      <AdaptableReact
        style={{ flex: 'none' }}
        gridOptions={gridOptions}
        adaptableOptions={adaptableOptions}
        onAdaptableReady={({ adaptableApi }) => {
          // save a reference to adaptable api
          adaptableApiRef.current = adaptableApi;
          console.log('ready!!!');
          adaptableApi.eventApi.on('CellChanged', console.log);
        }}
        modules={modules}
      />
      <div className="ag-theme-alpine" style={{ flex: 1 }}>
        <AgGridReact gridOptions={gridOptions} modules={modules} />
      </div>
    </div>
  );
};

export default App;
