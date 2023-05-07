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

// import aggrid themes (using new Alpine theme)
import '@ag-grid-community/styles/ag-grid.css';
import '@ag-grid-community/styles/ag-theme-alpine.css';
import { ColDef, GridOptions, Module } from '@ag-grid-community/core';
import {ClientSideRowModelModule} from "@ag-grid-community/client-side-row-model";
import {ColumnsToolPanelModule} from "@ag-grid-enterprise/column-tool-panel";
import {MenuModule} from "@ag-grid-enterprise/menu";
import {SparklinesModule} from "@ag-grid-enterprise/sparklines";
import {GridChartsModule} from "@ag-grid-enterprise/charts";
import {ClipboardModule} from "@ag-grid-enterprise/clipboard";
import {FiltersToolPanelModule} from "@ag-grid-enterprise/filter-tool-panel";
import {StatusBarModule} from "@ag-grid-enterprise/status-bar";
import {RichSelectModule} from "@ag-grid-enterprise/rich-select";
import {SideBarModule} from "@ag-grid-enterprise/side-bar";
import {RowGroupingModule} from "@ag-grid-enterprise/row-grouping";
import {RangeSelectionModule} from "@ag-grid-enterprise/range-selection";
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export';


// create AG Grid Column Definitions
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
    floatingFilter: true,
    sortable: true,
    type: 'abColDefString',
  },
  {
    headerName: 'Model',
    field: 'model',
    editable: true,
    filter: true,
    floatingFilter: true,
    sortable: true,
    type: 'abColDefString',
  },
  {
    headerName: 'Price',
    field: 'price',
    editable: true,
    filter: true,
    floatingFilter: true,
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

// let AG Grid know which columns and what data to use
// here you can add any other properties - all will be available when AdapTable runs
const gridOptions: GridOptions = {
  columnDefs: columnDefs,
  rowData: rowData,
  sideBar: true,
};

// build the AdaptableOptions object
// in this example we are NOT creating any predefined config nor providing any Adaptable Options classes (e.g. filters, entitlements)
// however in the real world you will set up AdapTable Options to fit your requirements and configure your permissions and remote State
// you will also provide Predefined Config so that AdapTable ships for first time use with your required objects
const adaptableOptions: AdaptableOptions = {
  primaryKey: 'id',
  userName: 'support user',
  adaptableId: 'AdapTable React Support Template',
  predefinedConfig: {}
};

const agGridModules: Module[] = [
  ClientSideRowModelModule,
  SideBarModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  StatusBarModule,
  MenuModule,
  RangeSelectionModule,
  RichSelectModule,
  ExcelExportModule,
  GridChartsModule,
  SparklinesModule,
  RowGroupingModule,
  ClipboardModule,
];

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
      />
      <div className="ag-theme-alpine" style={{ flex: 1 }}>
        <AgGridReact gridOptions={gridOptions} modules={agGridModules} />
      </div>
    </div>
  );
};

export default App;
