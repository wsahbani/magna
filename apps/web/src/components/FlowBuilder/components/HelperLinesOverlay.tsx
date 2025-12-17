/**
 * Helper lines overlay component for node alignment
 */
interface HelperLinesOverlayProps {
  horizontal?: number
  vertical?: number
}

export function HelperLinesOverlay({ horizontal, vertical }: HelperLinesOverlayProps) {
  if (horizontal === undefined && vertical === undefined) {
    return null
  }

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {horizontal !== undefined && (
        <line
          x1="0"
          y1={horizontal}
          x2="100%"
          y2={horizontal}
          stroke="#ff6b35"
          strokeWidth="1.5"
          strokeDasharray="5,5"
        />
      )}
      {vertical !== undefined && (
        <line
          x1={vertical}
          y1="0"
          x2={vertical}
          y2="100%"
          stroke="#ff6b35"
          strokeWidth="1.5"
          strokeDasharray="5,5"
        />
      )}
    </svg>
  )
}
