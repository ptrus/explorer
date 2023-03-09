import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useHref, useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Link from '@mui/material/Link'
import { Runtime, RuntimeBlock, useGetRuntimeBlockByHeight } from '../../../oasis-indexer/api'
import { StyledDescriptionList } from '../../components/StyledDescriptionList'
import { PageLayout } from '../../components/PageLayout'
import { SubPageCard } from '../../components/SubPageCard'
import { CopyToClipboard } from '../../components/CopyToClipboard'
import { TextSkeleton } from '../../components/Skeleton'
import { useFormattedTimestampString } from '../../hooks/useFormattedTimestamp'
import { TransactionsCard } from './TransactionsCard'
import { AppErrors } from '../../../types/errors'
import { trimLongString } from '../../utils/trimLongString'
import { COLORS } from '../../../styles/theme/colors'
import { blockGasLimit } from '../../../config'
import { transactionsContainerId } from './TransactionsCard'

export const BlockDetailPage: FC = () => {
  const blockHeight = parseInt(useParams().blockHeight!, 10)
  const { isLoading, data } = useGetRuntimeBlockByHeight(Runtime.emerald, blockHeight)
  if (!data && !isLoading) {
    throw AppErrors.NotFoundBlockHeight
  }
  const block = data?.data

  return (
    <PageLayout>
      <BlockDetailView isLoading={isLoading} block={block}></BlockDetailView>
      <TransactionsCard blockHeight={blockHeight} />
    </PageLayout>
  )
}

export const BlockDetailView: FC<{
  isLoading: boolean
  block: RuntimeBlock | undefined
}> = ({ isLoading, block }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const formattedTime = useFormattedTimestampString(block?.timestamp)
  const transactionsAnchor = `${useHref('')}#${transactionsContainerId}`

  return (
    <SubPageCard featured title={t('common.block')}>
      {isLoading && <TextSkeleton numberOfRows={7} />}
      {block && (
        <StyledDescriptionList titleWidth={isMobile ? '100px' : '200px'}>
          <dt>{t('common.height')}</dt>
          <dd>
            <CopyToClipboard
              label={
                <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
                  {block.round.toLocaleString()}
                </Typography>
              }
              value={block.round.toString()}
            />
          </dd>

          <dt>{t('common.hash')}</dt>
          <dd>
            <CopyToClipboard
              label={
                <Typography variant="mono" component="span" sx={{ color: COLORS.brandDark, fontWeight: 700 }}>
                  {isMobile ? trimLongString(block.hash) : block.hash}
                </Typography>
              }
              value={block.hash}
            />
          </dd>

          <dt>{t('common.timestamp')}</dt>
          <dd>{formattedTime}</dd>

          <dt>{t('common.size')}</dt>
          <dd>
            {t('common.bytes', {
              value: block.size,
              formatParams: {
                value: {
                  style: 'unit',
                  unit: 'byte',
                  unitDisplay: 'long',
                } satisfies Intl.NumberFormatOptions,
              },
            })}
          </dd>

          <dt>{t('common.transactions')}</dt>
          <dd>
            <Link href={transactionsAnchor}>
              {t('common.transactionsNumber', { count: block.num_transactions })}
            </Link>
          </dd>

          <dt>{t('common.gasUsed')}</dt>
          <dd>
            {t('block.gasUsed', {
              value: block.gas_used,
              percentage: block.gas_used / blockGasLimit,
              formatParams: {
                percentage: {
                  style: 'percent',
                  maximumFractionDigits: 2,
                } satisfies Intl.NumberFormatOptions,
              },
            })}
          </dd>

          <dt>{t('common.gasLimit')}</dt>
          <dd>{blockGasLimit.toLocaleString()}</dd>
        </StyledDescriptionList>
      )}
    </SubPageCard>
  )
}
