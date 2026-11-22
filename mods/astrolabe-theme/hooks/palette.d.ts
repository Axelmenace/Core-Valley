import type { ThemeColors } from 'claude-code'

export declare const NIGHT: {
  readonly sky: string
  readonly brass: string
  readonly brassBright: string
  readonly glow: string
  readonly star: string
  readonly ink: string
}
export declare const DAY: { readonly vellum: string; readonly brass: string; readonly glow: string; readonly ink: string }
/** The Astrolabe palette for both modes, built by makeColors. */
export declare const COLORS: ThemeColors
/** makeColors' contrast notes; none of them starts "Desktop won't paint". */
export declare const PROBLEMS: string[]
