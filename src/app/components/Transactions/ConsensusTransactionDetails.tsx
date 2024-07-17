import { FC } from 'react'
import { TFunction } from 'i18next'
import Box from '@mui/material/Box'
import { ConsensusTxMethod, Transaction } from '../../../oasis-nexus/api'
import { From, LabelValue, Shares, To } from './TransactionDetailsElements'
import { useTranslation } from 'react-i18next'

type ConsensusTransactionDetailsProps = {
  ownAddress?: string
  transaction: Transaction
}

export const ConsensusTransactionDetails: FC<ConsensusTransactionDetailsProps> = ({
  ownAddress,
  transaction,
}) => {
  const { t } = useTranslation()
  const details = getConsensusTransactionDetails(t, transaction, ownAddress)

  return <Box sx={{ display: 'flex', flexWrap: 'no-wrap', gap: '20px' }}>{details}</Box>
}

const getConsensusTransactionDetails = (t: TFunction, transaction: Transaction, ownAddress?: string) => {
  const scope = { layer: transaction.layer, network: transaction.network }

  switch (transaction.method) {
    case ConsensusTxMethod.roothashExecutorCommit:
      return (
        <>
          <From address={transaction.sender} ownAddress={ownAddress} scope={scope} />
          <LabelValue label={t('common.id')} value={transaction.body?.id} trimMobile />
        </>
      )
    case ConsensusTxMethod.stakingAddEscrow:
      return (
        <>
          <From address={transaction.sender} ownAddress={ownAddress} scope={scope} />
          <To address={transaction.to} label={t('validator.title')} scope={scope} />
        </>
      )
    case ConsensusTxMethod.stakingAllow:
      return (
        <>
          <From address={transaction.sender} ownAddress={ownAddress} scope={scope} />
          <To address={transaction.to} label={t('common.recipient')} scope={scope} />
        </>
      )
    case ConsensusTxMethod.stakingReclaimEscrow:
      return (
        <>
          <From address={transaction.sender} ownAddress={ownAddress} scope={scope} />
          <To address={transaction.to} scope={scope} />
          <Shares value={transaction.body.shares} />
        </>
      )
    case ConsensusTxMethod.stakingTransfer:
      return (
        <>
          <From address={transaction.sender} ownAddress={ownAddress} scope={scope} />
          <To address={transaction.to} scope={scope} />
        </>
      )
    default:
      return (
        <From
          address={transaction.sender}
          ownAddress={ownAddress}
          scope={{ layer: transaction.layer, network: transaction.network }}
        />
      )
  }
}
