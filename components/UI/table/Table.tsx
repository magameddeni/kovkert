import React, { useEffect, useRef, useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  TableOptions,
  useReactTable
} from '@tanstack/react-table'
import cx from 'classnames'
import { Text } from 'components/UI'
import { CheckboxCell, Resizer, Sorting } from './elements'
import { featuresListColumn, ITableRowFeatures } from './model'
import { defaultColumnMinWidth, FEATURE_LIST_COLUMN_ID } from './const'
import s from './style.module.scss'

interface ITableProps<T> {
  defaultData: T[]
  defaultColumns: ColumnDef<T>[]
  resize?: boolean
  fluid?: boolean
  sorting?: SortingState | boolean | undefined
  onSorting?: (data: SortingState) => void
  onRowClick?: (data: T) => void
  onSelect?: (rowSelection: Record<number, boolean>, data: (T | undefined)[]) => void
  select?: boolean
  manualSelect?: boolean
  initialSelectedRows?: Record<number, boolean>
  rowFeatures?: (payload?: T) => ITableRowFeatures<T>[]
  className?: string
  bodyTrClassName?: string
  shouldChangeColumnsWhenTabChanges?: boolean
}

const Table = <T,>({
  defaultData,
  defaultColumns,
  resize,
  fluid,
  sorting,
  onSorting,
  onRowClick,
  onSelect,
  select,
  manualSelect,
  initialSelectedRows,
  rowFeatures,
  className,
  bodyTrClassName,
  shouldChangeColumnsWhenTabChanges
}: ITableProps<T>) => {
  const [data, setData] = useState(() => [...defaultData])
  const [columns, setColumns] = useState<typeof defaultColumns>(() => [...defaultColumns])
  const [sortingColumns, setSortingColumns] = useState<SortingState | null>(
    typeof sorting === 'object' ? () => [...sorting] : []
  )
  const [rowSelection, setRowSelection] = React.useState<Record<number, boolean>>(initialSelectedRows || {})
  const [selectedRowsData, setSelectedRowsData] = useState<(T | undefined)[]>([])
  const tableRef = useRef<HTMLDivElement | null>(null)

  const hasRowFeatures = rowFeatures?.()?.length
  const hasSelect = select || manualSelect

  const onSortingChangeHandler = (sortData: SortingState) => {
    setSortingColumns(sortData)
    if (onSorting) onSorting(sortData)
  }

  const getTableSettings = () => {
    const baseSettings: TableOptions<T> | any = {
      data,
      columns,
      defaultColumn: { minSize: defaultColumnMinWidth },
      getCoreRowModel: getCoreRowModel(),
      state: {}
    }

    if (resize) baseSettings.columnResizeMode = 'onChange'
    if (sorting) {
      baseSettings.state.sorting = sortingColumns
      baseSettings.onSortingChange = onSortingChangeHandler
      baseSettings.getSortedRowModel = getSortedRowModel()
    }
    if (hasSelect) {
      baseSettings.state.rowSelection = rowSelection
      baseSettings.onRowSelectionChange = setRowSelection
      baseSettings.enableRowSelection = true

      if (manualSelect) {
        // @ts-ignore
        baseSettings.getRowId = (row: Row<T>) => row._id
      }
    }

    return baseSettings
  }

  const tableData = useReactTable(getTableSettings() as TableOptions<T>)

  useEffect(
    () => {
      if (columns) {
        let initialColumns = [...defaultColumns]

        if (hasSelect) {
          initialColumns.unshift({
            id: 'select',
            size: 24,
            maxSize: 24,
            enableResizing: false,
            header: ({ table }) => (
              <div className={s['checkbox-cell-wrapper']}>
                <CheckboxCell
                  {...{
                    checked: table.getIsAllRowsSelected(),
                    indeterminate: table.getIsSomeRowsSelected(),
                    onChange: table.getToggleAllRowsSelectedHandler()
                  }}
                />
              </div>
            ),
            cell: ({ row }) => (
              <div className={s['checkbox-cell-wrapper']} onClick={(e) => e.stopPropagation()}>
                <CheckboxCell
                  {...{
                    checked: row.getIsSelected(),
                    disabled: !row.getCanSelect(),
                    indeterminate: row.getIsSomeSelected(),
                    onChange: row.getToggleSelectedHandler()
                  }}
                />
              </div>
            )
          })
        }

        if (hasRowFeatures) {
          initialColumns.push(featuresListColumn(rowFeatures))
        }

        if (fluid && tableRef?.current) {
          const clientTableWidth = tableRef?.current?.clientWidth
          let columnsWithoutSizeProps = 0
          const desiredColumns = shouldChangeColumnsWhenTabChanges ? [...defaultColumns] : columns

          desiredColumns.forEach((v: ColumnDef<T>) => {
            if (!v?.size) columnsWithoutSizeProps += 1
          })

          const sumColumnsWithSize = desiredColumns
            .map((v: ColumnDef<T>) =>
              v?.size ? (v.size < defaultColumnMinWidth && defaultColumnMinWidth) || v?.size : 0
            )
            .reduce(
              (acc: number, v: number) => acc + v,
              (hasSelect ? 24 : 0) + (hasRowFeatures ? defaultColumnMinWidth : 0)
            )
          const finallyColumnsWidth = (clientTableWidth - sumColumnsWithSize - 2) / columnsWithoutSizeProps

          initialColumns = initialColumns.map((v: ColumnDef<T>) => (!v?.size ? { ...v, size: finallyColumnsWidth } : v))
        }

        setColumns(initialColumns)
      }
    },
    shouldChangeColumnsWhenTabChanges ? [defaultColumns] : []
  )

  useEffect(() => {
    const newSelectedRowsData: (T | undefined)[] = Object.keys(rowSelection).map(
      (key: string) =>
        tableData.getSelectedRowModel().rowsById?.[key]?.original ||
        // @ts-ignore
        selectedRowsData.find((row: T | undefined) => row?._id === key)
    )

    setSelectedRowsData(newSelectedRowsData || [])
    if (onSelect) onSelect(rowSelection, newSelectedRowsData)
  }, [rowSelection])

  useEffect(() => {
    if (initialSelectedRows && !Object.keys(initialSelectedRows)?.length && Object.keys(rowSelection)?.length) {
      tableData.resetRowSelection()
    }
  }, [initialSelectedRows])

  useEffect(() => {
    if (hasRowFeatures && columns.find((v) => v.id === FEATURE_LIST_COLUMN_ID)) {
      setColumns(
        columns.map((v) => {
          if (v?.id === FEATURE_LIST_COLUMN_ID) return featuresListColumn(rowFeatures)
          return v
        })
      )
    }
  }, [rowFeatures])

  useEffect(() => {
    setData(defaultData)
  }, [defaultData])

  return (
    <div ref={tableRef} className={cx(s.table, className)}>
      <div className={s.thead}>
        {tableData.getHeaderGroups().map((headerGroup) => (
          <div
            {...{
              key: headerGroup.id,
              className: s.tr
            }}
          >
            {headerGroup.headers.map((header, i: number) => (
              <div
                {...{
                  key: header.id,
                  className: cx(s.th, {
                    [s['with-sorting']]: sorting && header.column.getCanSort(),
                    [s['is-sorted']]: header.column.getIsSorted(),
                    [s['checkbox-cell']]: hasSelect && i === 0
                  }),
                  style: {
                    width: header.getSize()
                  },
                  onClick: sorting ? header.column.getToggleSortingHandler() : () => {}
                }}
              >
                {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                {sorting && <Sorting header={header} />}
                {resize && <Resizer table={tableData} header={header} />}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        {...{
          className: s.tbody
        }}
      >
        {data?.length ? (
          tableData.getRowModel().rows.map((row) => (
            <div
              {...{
                key: row.id,
                className: cx(
                  s.tr,
                  {
                    [s['cursor-pointer']]: typeof onRowClick === 'function',
                    [s['with-select']]: hasSelect,
                    [s['is-selected-row']]: row.getIsSelected()
                  },
                  bodyTrClassName
                ),
                onClick: () => (onRowClick ? onRowClick(row.original) : {})
              }}
            >
              {row.getVisibleCells().map((cell, i: number, arr) => (
                <div
                  {...{
                    key: cell.id,
                    className: cx(s.td, {
                      [s['with-resize']]: resize,
                      [s['is-resizing']]: cell.column.getIsResizing(),
                      [s['checkbox-cell']]: hasSelect && i === 0,
                      [s['feature-list-cell']]: hasRowFeatures && i === arr.length - 1
                    }),
                    style: {
                      width: cell.column.getSize()
                    }
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))
        ) : (
          <Text as='p' className={s['not-found']}>
            Данных нет
          </Text>
        )}
      </div>
    </div>
  )
}

export default Table
