import * as React from 'react';
import { useMemo } from 'react';

import { LicenseManager, GridOptions } from 'ag-grid-enterprise';
import {
  Adaptable,
  AdaptableApi,
  AdaptableOptions,
  AdaptableStateFunctionConfig,
} from '@adaptabletools/adaptable-react-aggrid';
import { columnDefs, defaultColDef } from './columnDefs';
import { WebFramework, rowData } from './rowData';
import { agGridModules } from './agGridModules';

LicenseManager.setLicenseKey(import.meta.env.VITE_AG_GRID_LICENSE_KEY);

const CONFIG_REVISION = 2;

export const AdaptableAgGrid = () => {
  const gridOptions = useMemo<GridOptions<WebFramework>>(
    () => ({
      defaultColDef,
      columnDefs,
      rowData,
      theme: 'legacy',
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
      // Typically you will store State remotely; here we simply leverage local storage for convenience
      stateOptions: {
        persistState: (state, adaptableStateFunctionConfig) => {
          localStorage.setItem(
            adaptableStateFunctionConfig.adaptableStateKey,
            JSON.stringify(state)
          );
          return Promise.resolve(true);
        },
        loadState: (config: AdaptableStateFunctionConfig) => {
          return new Promise((resolve) => {
            let state = {};
            try {
              state = JSON.parse(localStorage.getItem(config.adaptableStateKey) as string) || {};
            } catch (err) {
              console.log('Error loading state', err);
            }
            resolve(state);
          });
        },
      },
      initialState: {
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
                'name',
                'language',
                'github_stars',
                'license',
                'week_issue_change',
                'created_at',
                'has_wiki',
                'updated_at',
                'pushed_at',
                'github_watchers',
                'description',
                'open_issues_count',
                'closed_issues_count',
                'open_pr_count',
                'closed_pr_count',
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
