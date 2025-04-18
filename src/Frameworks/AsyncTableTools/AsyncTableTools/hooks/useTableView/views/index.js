import React from 'react';
import { ListIcon, TreeviewIcon } from '@patternfly/react-icons';
import { Spinner } from '@patternfly/react-core';
import { treeColumns, getOnTreeSelect } from '../helpers';
import rowsBuilder from './rowsBuilder';
import treeChopper from './treeChopper';

const views = {
  loading: {
    tableProps: (_items, columns) => ({
      rows: [
        {
          cells: [
            {
              title: () => <Spinner />, // eslint-disable-line react/display-name
              props: {
                colSpan: columns.length,
              },
            },
          ],
        },
      ],
    }),
    checkOptions: () => true,
  },
  // TODO implement "Something went wrong" (here or higher up)
  error: {},
  empty: {
    tableProps: (_items, columns) => ({
      rows: [
        {
          cells: [
            {
              title: () => <React.Fragment />, // eslint-disable-line react/display-name
              props: {
                colSpan: columns.length,
              },
            },
          ],
        },
      ],
    }),
    checkOptions: () => true,
  },
  rows: {
    tableProps: (items, columns, options) => {
      const rows = rowsBuilder(items, columns, options);

      return rows ? { rows } : {};
    },
    icon: ListIcon,
    checkOptions: () => true,
  },
  tree: {
    tableProps: (items, columns, options) => {
      const rows = treeChopper(items, columns, options);
      const onSelect = getOnTreeSelect(options);
      const cells = treeColumns(
        columns,
        options.expandable?.onCollapse,
        options.bulkSelect && onSelect
      );

      return rows
        ? {
            cells,
            rows,
            isTreeTable: true,
            onSelect: undefined,
          }
        : {};
    },
    icon: TreeviewIcon,
    toolbarProps: () => ({
      variant: 'compact',
      bulkSelect: undefined,
    }),
    checkOptions: ({ tableTree }) => !!tableTree,
  },
};

export default views;
