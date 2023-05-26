import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchQueries } from './hooks'
import { RouteUtils } from '../../utils/route-utils'
import { HasScope } from '../../../oasis-indexer/api'
import { SearchScope } from '../../../types/searchScope'

/** If search only finds one result then redirect to it */
export function useRedirectIfSingleResult(scope: SearchScope | undefined, queries: SearchQueries) {
  const navigate = useNavigate()

  const isAnyLoading = Object.values(queries).some(query => query.isLoading)

  const allResults = Object.values(queries).flatMap<HasScope>(query => query.results ?? [])

  const hasSingleResult =
    !isAnyLoading && allResults.length === 1 && (!scope?.network || allResults[0].network === scope.network)

  let redirectTo: string | undefined
  const block = queries.blockHeight.results?.[0]
  const tx = queries.txHash.results?.[0]
  const evmAccount = queries.evmBech32Account.results?.[0]
  const oasisAccount = queries.oasisAccount.results?.[0]
  if (hasSingleResult) {
    if (block) {
      redirectTo = RouteUtils.getBlockRoute(block, block.round)
    } else if (tx) {
      redirectTo = RouteUtils.getTransactionRoute(tx, tx.eth_hash || tx.hash)
    } else if (evmAccount) {
      redirectTo = RouteUtils.getAccountRoute(evmAccount, evmAccount.address_eth ?? evmAccount.address)
    } else if (oasisAccount) {
      redirectTo = RouteUtils.getAccountRoute(oasisAccount, oasisAccount.address_eth ?? oasisAccount.address)
    } else {
      // TODO: typescript should ensure all queries are handled
    }
  }

  useEffect(() => {
    if (redirectTo) navigate(redirectTo, { replace: true })
  }, [redirectTo, navigate])
}
