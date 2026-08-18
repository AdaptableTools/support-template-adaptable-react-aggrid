import * as React from 'react';
import { useMemo } from 'react';

import { LicenseManager, GridOptions, themeQuartz } from 'ag-grid-enterprise';
import {
  Adaptable,
  AdaptableApi,
  AdaptableOptions,
  AdaptablePersistentState,
  AdaptableStateFunctionConfig,
  LayoutChangedInfo,
  LayoutState,
} from '@adaptabletools/adaptable-react-aggrid';
import { columnDefs, defaultColDef } from './columnDefs';
import { WebFramework, rowData } from './rowData';
import { agGridModules } from './agGridModules';

LicenseManager.setLicenseKey(import.meta.env.VITE_AG_GRID_LICENSE_KEY);

let lastPersistedLayoutState: LayoutState;

function persistStateInLocalStorage(adaptableStateKey: string, state: AdaptablePersistentState) {
  localStorage.setItem(adaptableStateKey, JSON.stringify(state));
}

function persistAllLayoutChanges(adaptableApi: AdaptableApi) {
  const persistentState = adaptableApi.stateApi.getPersistentState();
  persistStateInLocalStorage(adaptableApi.optionsApi.getAdaptableStateKey(), persistentState);
  lastPersistedLayoutState = persistentState.Layout;
}

function persistCurrentLayoutChanges(adaptableApi: AdaptableApi) {
  const persistentState = adaptableApi.stateApi.getPersistentState();
  const currentLayoutName = persistentState.Layout.CurrentLayout;
  const currentLayout = persistentState.Layout.Layouts.find(
    (layout) => layout.Name === currentLayoutName
  );

  if (!currentLayout) {
    return;
  }

  const layouts = [...lastPersistedLayoutState.Layouts];
  const layoutIndex = layouts.findIndex((layout) => layout.Name === currentLayout.Name);
  if (layoutIndex === -1) {
    layouts.push(currentLayout);
  } else {
    layouts[layoutIndex] = currentLayout;
  }

  lastPersistedLayoutState = {
    ...lastPersistedLayoutState,
    CurrentLayout: currentLayoutName,
    Layouts: layouts as LayoutState['Layouts'],
  };

  persistStateInLocalStorage(adaptableApi.optionsApi.getAdaptableStateKey(), {
    ...persistentState,
    Layout: lastPersistedLayoutState,
  });
}

/**
 * When the user switches away from a layout, discard its unsaved changes by
 * restoring the version from the last persisted snapshot. Layouts which are
 * not in the snapshot (e.g. a freshly cloned layout) are left untouched.
 */
function revertAbandonedLayoutChanges(adaptableApi: AdaptableApi, abandonedLayoutName: string) {
  const persistedLayout = lastPersistedLayoutState.Layouts.find(
    (layout) => layout.Name === abandonedLayoutName
  );
  if (!persistedLayout) {
    return;
  }

  const runningLayout = adaptableApi.layoutApi.getLayoutByName(abandonedLayoutName);
  if (!runningLayout || JSON.stringify(runningLayout) === JSON.stringify(persistedLayout)) {
    return;
  }

  adaptableApi.layoutApi.createOrUpdateLayout(persistedLayout);
}

function onLayoutChanged(adaptableApi: AdaptableApi, layoutChangedInfo: LayoutChangedInfo) {
  if (layoutChangedInfo.actionName !== 'LAYOUT_SELECT') {
    return;
  }

  const abandonedLayoutName = layoutChangedInfo.oldLayoutState?.CurrentLayout;
  if (
    !abandonedLayoutName ||
    abandonedLayoutName === layoutChangedInfo.newLayoutState.CurrentLayout
  ) {
    return;
  }

  // defer so we don't dispatch a state update while the select action is processed
  setTimeout(() => {
    revertAbandonedLayoutChanges(adaptableApi, abandonedLayoutName);
  }, 0);
}

function undoLayoutChanges(adaptableApi: AdaptableApi) {
  const persistentState = adaptableApi.stateApi.getPersistentState();
  persistentState.Layout = lastPersistedLayoutState;
  adaptableApi.stateApi.reloadInitialState(persistentState);
}

function resetLayoutChanges(adaptableApi: AdaptableApi) {
  const persistentState = adaptableApi.stateApi.getPersistentState();
  const initialLayoutState = adaptableApi.stateApi.getInitialState().Layout;
  persistentState.Layout = initialLayoutState;
  lastPersistedLayoutState = initialLayoutState;
  adaptableApi.stateApi.reloadInitialState(persistentState);
}

export const AdaptableAgGrid = () => {
  const gridOptions = useMemo<GridOptions<WebFramework>>(
    () => ({
      defaultColDef,
      columnDefs,
      rowData,
      theme: themeQuartz,
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
      adaptableId: 'Manually Saving Layouts',
      adaptableStateKey: 'custom-layout-save',
      initialState: {
        Dashboard: {
          Tabs: [
            {
              Name: 'Default',
              Toolbars: [
                'Layout',
                'PersistLayoutChanges',
                'UndoLayoutChanges',
                'ResetLayoutChanges',
              ],
            },
          ],
        },
        FormatColumn: {
          FormatColumns: [
            {
              Name: 'formatColumn-github_stars',
              Rule: {
                Predicates: [
                  {
                    PredicateId: 'GreaterThan',
                    Inputs: [1000],
                  },
                ],
              },
              Style: {
                BackColor: 'Yellow',
                ForeColor: 'Black',
              },
              Scope: {
                ColumnIds: ['github_stars'],
              },
            },
          ],
        },
        Layout: {
          CurrentLayout: 'Standard Layout',
          Layouts: [
            {
              Name: 'Standard Layout',
              TableColumns: [
                'name',
                'github_stars',
                'language',
                'github_watchers',
                'updated_at',
                'description',
                'created_at',
                'has_wiki',
                'pushed_at',
                'open_issues_count',
                'open_pr_count',
                'closed_pr_count',
                'has_projects',
                'has_pages',
                'week_issue_change',
              ],
            },
            {
              Name: 'Grouped Layout',
              RowGroupedColumns: ['language'],
              TableColumns: [
                'name',
                'github_stars',
                'github_watchers',
                'updated_at',
                'description',
                'created_at',
                'has_wiki',
                'pushed_at',
                'open_issues_count',
                'open_pr_count',
                'closed_pr_count',
                'has_projects',
                'has_pages',
                'week_issue_change',
              ],
              RowGroupValues: {
                RowGroupDefaultBehavior: 'collapsed',
              },
            },
          ],
        },
        StatusBar: {
          StatusBars: [
            {
              Key: 'Center Panel',
              StatusBarPanels: ['Theme'],
            },
          ],
        },
      },
      stateOptions: {
        persistState: (state, { adaptableStateKey }) => {
          // Layout changes stay local until Persist ALL / CURRENT Layout Changes is clicked.
          // Other objects (e.g. Format Column) still auto-save.
          state.Layout = lastPersistedLayoutState;
          persistStateInLocalStorage(adaptableStateKey, state);
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
      dashboardOptions: {
        customToolbars: [
          {
            name: 'PersistLayoutChanges',
            title: 'Save Changes',
            toolbarButtons: [
              {
                label: 'Persist ALL Layout changes',
                onClick: (_button, context) => persistAllLayoutChanges(context.adaptableApi),
                buttonStyle: {
                  variant: 'raised',
                  tone: 'success',
                },
              },
              {
                label: 'Persist CURRENT Layout changes',
                onClick: (_button, context) => persistCurrentLayoutChanges(context.adaptableApi),
                buttonStyle: {
                  variant: 'raised',
                  tone: 'info',
                },
              },
            ],
          },
          {
            name: 'UndoLayoutChanges',
            title: 'Undo Unsaved Changes',
            toolbarButtons: [
              {
                label: 'Undo Layout Changes',
                onClick: (_button, context) => undoLayoutChanges(context.adaptableApi),
                buttonStyle: {
                  variant: 'raised',
                  tone: 'warning',
                },
              },
            ],
          },
          {
            name: 'ResetLayoutChanges',
            title: 'Reset to Initial State',
            toolbarButtons: [
              {
                label: 'Reset Layout Changes',
                onClick: (_button, context) => resetLayoutChanges(context.adaptableApi),
                buttonStyle: {
                  variant: 'raised',
                  tone: 'error',
                },
              },
            ],
          },
        ],
        customDashboardButtons: [
          {
            tooltip: 'Reset state',
            icon: {
              name: 'refresh',
            },
            buttonStyle: {
              tone: 'error',
            },
            onClick: (_button, context) => {
              context.adaptableApi.stateApi.reloadInitialState();
            },
          },
        ],
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
        adaptableApiRef.current = adaptableApi;
        lastPersistedLayoutState = adaptableApi.layoutApi.getLayoutState();
        adaptableApi.eventApi.on('LayoutChanged', (layoutChangedInfo) =>
          onLayoutChanged(adaptableApi, layoutChangedInfo)
        );
      }}
    >
      <div style={{ display: 'flex', flexFlow: 'column', height: '100vh' }}>
        <Adaptable.UI style={{ flex: 'none' }} />
        <Adaptable.AgGridReact />
      </div>
    </Adaptable.Provider>
  );
};
