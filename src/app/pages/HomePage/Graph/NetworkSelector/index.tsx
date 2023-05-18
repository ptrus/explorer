import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import RemoveIcon from '@mui/icons-material/Remove'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { COLORS } from '../../../../../styles/theme/colors'
import { Network } from '../../../../../types/network'
import Collapse from '@mui/material/Collapse'

const StyledNetworkSelector = styled(Box)(() => ({
  position: 'absolute',
  bottom: 0,
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
}))

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: COLORS.brandExtraDark,
  border: `solid 3px ${COLORS.aqua}`,
  borderRadius: '45px',
  padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
  display: 'inline-flex',
  alignItems: 'center',
}))

const StyledButton = styled(Button, {
  shouldForwardProp: prop => prop !== 'isSelectedNetwork',
})<{ isSelectedNetwork: boolean }>(({ isSelectedNetwork, theme }) => ({
  height: '30px',
  padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
  textTransform: 'capitalize',
  fontSize: '16px',
  borderRadius: '9px',
  backgroundColor: isSelectedNetwork ? COLORS.brandExtraDark : COLORS.brandDark,
  borderColor: isSelectedNetwork ? COLORS.white : COLORS.brandDark,
  borderWidth: theme.spacing(1),
  color: COLORS.white,
  '&:hover': {
    borderWidth: theme.spacing(1),
    borderColor: COLORS.white,
  },
}))

type NetworkSelectorProps = {
  network: Network
  setNetwork: (network: Network) => void
}

const getLabels = (t: TFunction): { [key in Network]: string } => ({
  mainnet: t('common.mainnet'),
  testnet: t('common.testnet'),
})

export const NetworkSelector: FC<NetworkSelectorProps> = ({ network, setNetwork }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(false)
  const options: Network[] = ['mainnet', 'testnet']
  const labels = getLabels(t)

  return (
    <StyledNetworkSelector>
      <StyledBox>
        {!isMobile && (
          <Typography component="span" sx={{ fontSize: '12px', color: COLORS.white }}>
            {t('home.selectNetwork')}
          </Typography>
        )}
        <Box sx={{ height: 30, display: 'flex' }}>
          {options.map(option => (
            <Collapse orientation="horizontal" in={open || network === option} key={option}>
              <StyledButton
                onClick={() => setNetwork(option)}
                size="small"
                variant="outlined"
                sx={{ ml: 4 }}
                isSelectedNetwork={option === network}
              >
                {labels[option]}
              </StyledButton>
            </Collapse>
          ))}
        </Box>
        <IconButton aria-label={t('home.selectNetworkAria')} onClick={() => setOpen(!open)}>
          {open ? (
            <RemoveIcon fontSize="medium" sx={{ color: 'white', fontSize: '18px' }} />
          ) : (
            <AddIcon fontSize="medium" sx={{ color: 'white', fontSize: '18px' }} />
          )}
        </IconButton>
      </StyledBox>
    </StyledNetworkSelector>
  )
}