import { styled } from '@mui/material/styles'
import { FC, MouseEvent } from 'react'
import Box from '@mui/material/Box'
import { COLORS } from '../../../../../styles/theme/colors'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import Typography from '@mui/material/Typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { useScreenSize } from '../../../../hooks/useScreensize'
import { useTranslation } from 'react-i18next'
import { TFunction } from 'i18next'
import { Layer } from '../../../../../oasis-nexus/api'
import { Network } from '../../../../../types/network'
import { useRuntimeFreshness } from '../../../../components/OfflineBanner/hook'
import { getNetworkIcons } from '../../../../utils/content'
import { useNavigate } from 'react-router-dom'
import { RouteUtils } from '../../../../utils/route-utils'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { zIndexHomePage } from '../../index'

interface GraphTooltipStyledProps {
  isMobile: boolean
  disabled?: boolean
}

const GraphTooltipStyled = styled(Box, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['isMobile', 'disabled'] as (keyof GraphTooltipStyledProps)[]).includes(
      prop as keyof GraphTooltipStyledProps,
    ),
})<GraphTooltipStyledProps>(({ isMobile, disabled }) => ({
  display: 'flex',
  height: '100%',
  border: `2px solid ${COLORS.aqua}`,
  borderRadius: isMobile ? '12px 12px 0 0' : '0 12px 12px 0',
  cursor: disabled ? 'default' : 'pointer',
}))

interface GraphTooltipIconProps {
  isMobile: boolean
}

const GraphTooltipIcon = styled(Box, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['isMobile'] as (keyof GraphTooltipIconProps)[]).includes(prop as keyof GraphTooltipIconProps),
})<GraphTooltipIconProps>(({ isMobile }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  flex: '0 0 120px',
  height: '100%',
  borderRight: `2px solid ${COLORS.aqua}`,
  backgroundColor: COLORS.brandExtraDark + (isMobile ? 'c7' : ''),
  borderRadius: isMobile ? '12px 0 0 12px' : '0 0 0 0',
  color: COLORS.white,
}))

interface GraphTooltipTextProps {
  disabled?: boolean
  isMobile: boolean
}

const GraphTooltipText = styled(Box, {
  shouldForwardProp: (prop: PropertyKey) =>
    !(['disabled', 'isMobile'] as (keyof GraphTooltipTextProps)[]).includes(
      prop as keyof GraphTooltipTextProps,
    ),
})<GraphTooltipTextProps>(({ theme, disabled, isMobile }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: '0 1 100%',
  padding: theme.spacing(4),
  backgroundColor: (disabled ? COLORS.shadowBlue : COLORS.brandExtraDark) + (isMobile ? 'c7' : ''),
  borderRadius: isMobile ? '0 12px 0 0' : '0 12px 12px 0',
}))

const GraphTooltipHeaderText = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flex: '0 0',
}))

const GraphTooltipDescriptionText = styled(Box)(() => ({
  flex: '0 1 100%',
  display: 'flex',
  alignItems: 'center',
}))

const MobileBackdrop = styled(Box)(() => ({
  position: 'fixed',
  inset: 0,
  backgroundColor: COLORS.black,
  opacity: 0.3,
  zIndex: zIndexHomePage.mobileTooltip,
}))

const MobileGraphTooltip = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  height: 120,
  zIndex: zIndexHomePage.mobileTooltip,
  '> button': {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: 125,
  },
}))

interface GraphTooltipMobileProps {
  network: Network
  layer: Layer
  onClose: (e?: MouseEvent) => void
}

type TooltipInfo = {
  disabled: boolean
  failing?: boolean
  enableNavigation?: boolean
  body: GraphTooltipBodyProps
}

const useLayerTooltipMap = (network: Network): Record<Layer, TooltipInfo> => {
  const isEmeraldOutOfDate = useRuntimeFreshness({ network, layer: Layer.emerald }).outOfDate
  const isSapphireOutOfDate = useRuntimeFreshness({ network, layer: Layer.sapphire }).outOfDate
  return {
    [Layer.sapphire]: {
      disabled: false,
      failing: isSapphireOutOfDate,
      enableNavigation: true,
      body: {
        title: (t: TFunction) => t('common.sapphire'),
        caption: (t: TFunction) =>
          isSapphireOutOfDate ? t('common.paraTimeOutOfDate') : t('common.paraTimeOnline'),
        body: (t: TFunction) => t('home.tooltip.sapphireParaTimeDesc'),
      },
    },
    [Layer.emerald]: {
      disabled: false,
      failing: isEmeraldOutOfDate,
      enableNavigation: true,
      body: {
        title: (t: TFunction) => t('common.emerald'),
        caption: (t: TFunction) =>
          isEmeraldOutOfDate ? t('common.paraTimeOutOfDate') : t('common.paraTimeOnline'),
        body: (t: TFunction) => t('home.tooltip.emeraldParaTimeDesc'),
      },
    },
    [Layer.cipher]: {
      disabled: true,
      body: {
        title: (t: TFunction) => t('common.cipher'),
        caption: (t: TFunction) => t('home.tooltip.coming'),
        body: (t: TFunction) => t('home.tooltip.cipherParaTimeDesc'),
      },
    },
    [Layer.consensus]: {
      disabled: true,
      body: {
        title: (t: TFunction) => t('common.consensus'),
        caption: (t: TFunction) => t('home.tooltip.coming'),
        body: (t: TFunction) => t('home.tooltip.consensusDesc'),
      },
    },
  }
}

interface GraphTooltipHeaderProps {
  disabled: boolean
  network: Network
}

const GraphTooltipHeader: FC<GraphTooltipHeaderProps> = ({ disabled, network }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const icons = getNetworkIcons({ size: 38 })

  return (
    <GraphTooltipIcon isMobile={isMobile}>
      {disabled ? (
        <AccessTimeIcon sx={{ color: COLORS.aqua, fontSize: 33 }} />
      ) : (
        <>
          {icons[network]}
          <Typography
            component="span"
            color={COLORS.white}
            sx={{ fontSize: '10px', position: 'absolute', bottom: '10px' }}
          >
            {t('home.tooltip.openParatime')}
          </Typography>
        </>
      )}
    </GraphTooltipIcon>
  )
}

interface GraphTooltipBodyProps {
  title: (t: TFunction) => string
  caption: (t: TFunction) => string
  body: (t: TFunction) => string
  disabled?: boolean
  failing?: boolean
}

const GraphTooltipBody: FC<GraphTooltipBodyProps> = ({ title, caption, body, disabled, failing }) => {
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  return (
    <GraphTooltipText isMobile={isMobile} disabled={disabled}>
      <GraphTooltipHeaderText>
        <Typography variant="body2" color={COLORS.white}>
          {title(t)}
        </Typography>

        <Typography
          component="span"
          sx={{ display: 'flex', fontSize: '12px', opacity: disabled ? 0.5 : 1 }}
          color={COLORS.white}
        >
          {caption(t)}
          {!(disabled || failing) && (
            <CheckCircleIcon sx={{ marginLeft: 2 }} color="success" fontSize="small" />
          )}
          {failing && <ErrorIcon sx={{ marginLeft: 2 }} color="error" fontSize="small" />}
        </Typography>
      </GraphTooltipHeaderText>
      <GraphTooltipDescriptionText>
        <Typography variant="caption" color={COLORS.white}>
          {body(t)}
        </Typography>
      </GraphTooltipDescriptionText>
    </GraphTooltipText>
  )
}

export const GraphTooltipMobile: FC<GraphTooltipMobileProps> = ({ network, layer, onClose }) => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isMobile } = useScreenSize()
  const { body, disabled, failing, enableNavigation } = useLayerTooltipMap(network)[layer]

  const navigateTo = () => {
    if (!enableNavigation) {
      return
    }

    navigate(RouteUtils.getDashboardRoute({ network, layer }))
  }

  return (
    <>
      <MobileBackdrop onClick={onClose} />
      <Fade in>
        <MobileGraphTooltip>
          <IconButton color="inherit" onClick={onClose}>
            <CloseIcon fontSize="medium" sx={{ color: COLORS.white }} aria-label={t('home.tooltip.close')} />
          </IconButton>
          <GraphTooltipStyled disabled={disabled} isMobile={isMobile} onClick={navigateTo}>
            <GraphTooltipHeader disabled={disabled} network={network} />
            <GraphTooltipBody {...body} disabled={disabled} failing={failing} />
          </GraphTooltipStyled>
        </MobileGraphTooltip>
      </Fade>
    </>
  )
}