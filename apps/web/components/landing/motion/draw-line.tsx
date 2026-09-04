import type { CSSProperties, SVGProps } from "react"

type DrawLineProps = SVGProps<SVGPathElement> & {
  delay?: number
}

export function DrawLine({ delay = 0, style, ...props }: DrawLineProps) {
  return (
    <path
      pathLength="1"
      className="landing-draw-line"
      style={{ "--draw-delay": `${delay}ms`, ...style } as CSSProperties}
      {...props}
    />
  )
}
