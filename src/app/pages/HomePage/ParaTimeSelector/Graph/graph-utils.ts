import { ScaleToOptions } from 'react-quick-pinch-zoom'
import { GraphEndpoint } from './types'

export abstract class GraphUtils {
  static getScaleTo(
    graphEndpoint: GraphEndpoint,
    { width, height }: { width?: number; height?: number },
  ): ScaleToOptions {
    const initialValue = {
      scale: 1,
      x: 0,
      y: 0,
    }

    if (!width || !height) {
      return initialValue
    }

    switch (graphEndpoint) {
      case GraphEndpoint.Emerald:
        return {
          scale: 2,
          x: 0.5 * width,
          y: 0,
        }
      case GraphEndpoint.Cipher:
        return {
          scale: 2,
          x: width,
          y: 0.4 * height,
        }
      case GraphEndpoint.Sapphire:
        return {
          scale: 2,
          x: 0.1 * width,
          y: height,
        }
      case GraphEndpoint.Consensus:
      default:
        return initialValue
    }
  }
}
