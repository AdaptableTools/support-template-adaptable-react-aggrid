import * as React from 'react';
import { useMemo } from 'react';

import masterDetailAgGridPlugin from '@adaptabletools/adaptable-plugin-master-detail-aggrid';

import { LicenseManager, GridOptions, ColDef } from 'ag-grid-enterprise';
import { Adaptable, AdaptableApi, AdaptableOptions } from '@adaptabletools/adaptable-react-aggrid';
import { columnDefs as detailColumnDefs, defaultColDef } from './columnDefs';
import { WebFramework, rowData as detailRowData } from './rowData';
import { agGridModules } from './agGridModules';

LicenseManager.setLicenseKey(import.meta.env.VITE_AG_GRID_LICENSE_KEY);

const CONFIG_REVISION = 2;

type RowType = {
  id: number;
  language: string;
  year: number;
  author: string;
  version: string;
  maintainer: string;
  fileExtension: string;
};

const rowData: RowType[] = [
  {
    id: 1,
    language: 'TypeScript',
    year: 2012,
    author: 'Anders Hejlsberg',
    version: '4.5.5',
    maintainer: 'Microsoft',
    fileExtension: '.ts',
  },
  {
    id: 2,
    language: 'JavaScript',
    year: 1995,
    author: 'Brendan Eich',
    version: 'ES 2015',
    maintainer: 'ECMA',
    fileExtension: '.js',
  },
  {
    id: 3,
    language: 'HTML',
    year: 1993,
    author: 'Tim Berners-Lee',
    version: '5.2',
    maintainer: 'W3C',
    fileExtension: '.html',
  },
];

const columnDefs: ColDef<RowType>[] = [
  {
    field: 'id',
    hide: true,
  },
  {
    field: 'language',
    cellRenderer: 'agGroupCellRenderer',
  },
  {
    field: 'year',
  },
  {
    field: 'version',
  },
  {
    field: 'author',
  },
  {
    field: 'maintainer',
  },
  {
    field: 'fileExtension',
  },
];
export const AdaptableAgGrid = () => {
  const gridOptions = useMemo<GridOptions<RowType>>(
    () => ({
      defaultColDef,
      columnDefs,
      rowData,
      sideBar: true,
      statusBar: {
        statusPanels: [
          { statusPanel: 'agTotalRowCountComponent', align: 'left' },
          { statusPanel: 'agFilteredRowCountComponent' },
          {
            key: 'Center Panel',
            statusPanel: 'AdaptableStatusPanel',
            align: 'center',
          },
        ],
      },

      suppressMenuHide: true,
      cellSelection: true,
      enableCharts: true,
      masterDetail: true,

      detailCellRendererParams: {
        detailGridOptions: {
          columnDefs: detailColumnDefs,
        },

        getDetailRowData(params: any) {
          const language = params.data.language;
          const details = detailRowData.filter((details) => details.language === language);

          if (details) {
            setTimeout(() => {
              // simulate async call
              params?.successCallback?.(details);
            }, 1000);
          }
        },
      },
    }),
    []
  );
  const adaptableOptions = useMemo<AdaptableOptions<WebFramework>>(
    () => ({
      licenseKey: import.meta.env.VITE_ADAPTABLE_LICENSE_KEY,
      primaryKey: 'id',
      userName: 'Test User',
      adaptableId: 'Adaptable React Support Template',
      adaptableStateKey: 'adaptable_react_support_template',

      plugins: [
        masterDetailAgGridPlugin({
          detailAdaptableOptions: {
            adaptableId: 'Language Details',
            primaryKey: 'id',
            predefinedConfig: {
              Layout: {
                Revision: CONFIG_REVISION,
                CurrentLayout: 'Default',
                Layouts: [
                  {
                    Name: 'Default',
                    TableColumns: [
                      'id',
                      'name',
                      'github_stars',
                      'license',
                      'week_issue_change',
                      'created_at',
                      'has_wiki',
                      'updated_at',
                    ],
                  },
                ],
              },
            },
          },
        }),
      ],
      predefinedConfig: {
        Dashboard: {
          Revision: CONFIG_REVISION,
          Tabs: [
            {
              Name: 'Welcome',
              Toolbars: ['Layout'],
            },
          ],
        },
        Layout: {
          Revision: CONFIG_REVISION,
          CurrentLayout: 'Default',
          Layouts: [
            {
              Name: 'Default',
              TableColumns: [
                'id',
                'language',
                'year',
                'author',
                'version',
                'maintainer',
                'fileExtension',
              ],
            },
          ],
        },
        StatusBar: {
          Revision: CONFIG_REVISION,
          StatusBars: [
            {
              Key: 'Center Panel',
              StatusBarPanels: ['Theme'],
            },
          ],
        },
      },
    }),
    []
  );

  const adaptableApiRef = React.useRef<AdaptableApi>(null);
  gridOptions.theme = 'legacy';
  return (
    <Adaptable.Provider
      gridOptions={gridOptions}
      adaptableOptions={adaptableOptions}
      modules={[...agGridModules]}
      onAdaptableReady={({ adaptableApi }) => {
        // save a reference to adaptable api
        adaptableApiRef.current = adaptableApi;
      }}
    >
      <div style={{ display: 'flex', flexFlow: 'column', height: '100vh' }}>
        <Adaptable.UI style={{ flex: 'none' }} />
        <Adaptable.AgGridReact className="ag-theme-alpine" />
      </div>
    </Adaptable.Provider>
  );
};
