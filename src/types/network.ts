import { TFunction } from 'i18next'

export type Network = (typeof Network)[keyof typeof Network]

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Network = {
  mainnet: 'mainnet',
  testnet: 'testnet',
} as const

export const getNetworkNames = (t: TFunction): Record<Network, string> => ({
  [Network.mainnet]: t('common.mainnet'),
  [Network.testnet]: t('common.testnet'),
})

interface HasNetwork {
  network: Network
}

export const getFilterForNetwork = (network: Network) => (item: HasNetwork) => item.network === network
export const getInverseFilterForNetwork = (network: Network) => (item: HasNetwork) => item.network !== network

export const isOnMainnet = getFilterForNetwork(Network.mainnet)
export const isOnTestnet = getFilterForNetwork(Network.testnet)
