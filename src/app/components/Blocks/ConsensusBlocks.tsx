import { useTranslation } from 'react-i18next'
import { Block } from '../../../oasis-nexus/api'
import { Table, TableCellAlign, TableColProps } from '../../components/Table'
import { TablePaginationProps } from '../Table/TablePagination'
import { BlockHashLink, BlockLink } from './BlockLink'
import { useScreenSize } from '../../hooks/useScreensize'
import { FC } from 'react'
import { BlocksTableType } from './index'
import { Age } from '../Age'

export type TableConsensusBlock = Block & {
  markAsNew?: boolean
}

export type TableConsensusBlockList = {
  blocks: TableConsensusBlock[]
  total_count: number
  is_total_count_clipped: boolean
}

type ConsensusBlocksProps = {
  blocks?: TableConsensusBlock[]
  isLoading: boolean
  limit: number
  type?: BlocksTableType
  pagination: false | TablePaginationProps
}

export const ConsensusBlocks: FC<ConsensusBlocksProps> = ({
  isLoading,
  blocks,
  type = BlocksTableType.Desktop,
  pagination,
  limit,
}) => {
  const { t } = useTranslation()
  const { isLaptop } = useScreenSize()
  const tableColumns: TableColProps[] = [
    { key: 'height', content: t('common.height'), align: TableCellAlign.Left },
    ...(type === BlocksTableType.Desktop ? [{ key: 'hash', content: t('common.hash') }] : []),
    ...(type === BlocksTableType.Desktop || type === BlocksTableType.DesktopLite
      ? [
          {
            key: 'transaction',
            content: isLaptop ? t('common.transactionAbbreviation') : t('common.transactions'),
            align: TableCellAlign.Right,
          },
        ]
      : []),
    { key: 'proposer', content: t('common.proposer'), align: TableCellAlign.Left },
    { key: 'age', content: t('common.age'), align: TableCellAlign.Right },
  ]

  const tableRows = blocks?.map(block => {
    return {
      key: block.hash,
      data: [
        {
          align: TableCellAlign.Left,
          content: <BlockLink scope={block} height={block.height} />,
          key: 'block',
        },
        ...(type === BlocksTableType.Desktop
          ? [
              {
                content: <BlockHashLink scope={block} hash={block.hash} height={block.height} alwaysTrim />,
                key: 'hash',
              },
            ]
          : []),

        ...(type === BlocksTableType.Desktop || type === BlocksTableType.DesktopLite
          ? [
              {
                align: TableCellAlign.Right,
                content: block.num_transactions.toLocaleString(),
                key: 'txs',
              },
            ]
          : []),
        {
          key: 'proposer',
          content:
            'The Validator Who Has Mined This Block Who Might Actually Have A Really Really Annoyingly Long Name',
        },
        {
          align: TableCellAlign.Right,
          content: <Age sinceTimestamp={block.timestamp} />,
          key: 'timestamp',
        },
      ],
      highlight: block.markAsNew,
    }
  })

  return (
    <Table
      columns={tableColumns}
      rows={tableRows}
      rowsNumber={limit}
      name={t('blocks.latest')}
      isLoading={isLoading}
      pagination={pagination}
    />
  )
}
