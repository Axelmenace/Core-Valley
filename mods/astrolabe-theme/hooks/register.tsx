import type { EngineInterface, Register, ThemeSetArgs, ThemeSound, ThemeStyle } from 'claude-code'

import { COLORS, PROBLEMS } from './palette.js'
import { SCENE } from './scene.js'

// Distinctive enough that no other mod's backdrop is mistaken for this one.
const SCENE_NAME = 'astrolabe-rete'
const PLUGIN = 'astrolabe-theme'

// Headings engraved in serif, the person's words in a brass-rimmed bubble,
// and tool rows on a solid plate so they stay legible over the sky.
const STYLE: ThemeStyle = {
  Heading: { fontFamily: ['serif'], fontWeight: 'semibold', letterSpacing: 0.6 },
  UserMessage: {
    backgroundColor: 'surface-2',
    borderColor: 'border-accent',
    borderWidth: 1,
    radius: [14, 14, 4, 14],
    paddingX: 14,
    paddingY: 10,
  },
  ToolUse: { backgroundColor: 'surface-1', borderColor: 'border', radius: 6, paddingX: 8 },
}

// The observatory at night: a low hum, and now and then a far-off star rings.
// Silent until the speaker in the title bar is pressed.
const SOUND: ThemeSound = {
  ambience: {
    reverb: 0.5,
    layers: [
      {
        wave: 'sine',
        notes: ['A2', 'E3'],
        drone: true,
        gain: 0.1,
        filter: { type: 'lowpass', hz: 500 },
        tremolo: { hz: 0.07, depth: 0.3 },
      },
      {
        wave: 'bell',
        notes: ['E6', 'F#6', 'A5', 'B5', 'C#6'],
        scatter: 0.05,
        gain: 0.06,
        release: 2.5,
        pan: -0.5,
      },
      {
        wave: 'bell',
        notes: ['A6', 'B5', 'E6', 'C#6'],
        scatter: 0.04,
        gain: 0.05,
        release: 2.5,
        pan: 0.5,
      },
    ],
  },
  cues: {
    send: { layers: [{ wave: 'triangle', notes: ['E5'], gain: 0.16, attack: 0.004, release: 0.25 }] },
    tool: {
      layers: [{ wave: 'white', gain: 0.07, release: 0.03, filter: { type: 'bandpass', hz: 3200 } }],
    },
    done: { reverb: 0.4, layers: [{ wave: 'bell', notes: ['E5', 'A5', 'C#6'], step: 0.12, gain: 0.2, release: 1.4 }] },
    ask: { reverb: 0.3, layers: [{ wave: 'bell', notes: ['C#6', 'A5'], step: 0.18, gain: 0.2, release: 1 }] },
    error: {
      layers: [
        { wave: 'triangle', notes: ['E4', 'C4'], step: 0.2, gain: 0.18, release: 0.6, filter: { type: 'lowpass', hz: 1200 } },
      ],
    },
    compact: {
      layers: [{ wave: 'pink', gain: 0.12, attack: 0.2, release: 1.2, filter: { type: 'bandpass', hz: 900, to: 220 } }],
    },
    click: {
      reverb: 0.25,
      layers: [{ wave: 'bell', notes: ['A4', 'C#5', 'E5', 'F#5', 'A5', 'C#6', 'E6'], gain: 0.18, release: 0.9 }],
    },
  },
}

const SCENE_LOOK: ThemeSetArgs = {
  colors: COLORS,
  backdrop: { scene: SCENE_NAME, glass: { blur: 14, opacity: 0.72 } },
  style: STYLE,
  sound: SOUND,
}

// The same chart, held still: a soft wash from the page to the panel colour.
const STILL_LOOK: ThemeSetArgs = {
  colors: COLORS,
  backdrop: { gradient: { stops: ['surface-0', 'surface-1'], angle: 200 } },
  style: STYLE,
}

const PLAIN_LOOK: ThemeSetArgs = { colors: COLORS }

type Variant = 'scene' | 'still' | 'plain'

const LOOKS: Record<Variant, ThemeSetArgs> = { scene: SCENE_LOOK, still: STILL_LOOK, plain: PLAIN_LOOK }

// Sets a look, stepping down to a simpler one if this build refuses a part
// of it (an older build may not take `sound` or `style`).
async function apply($: EngineInterface, variant: Variant): Promise<string> {
  const ladder: ThemeSetArgs[] = [LOOKS[variant]]

  if (variant === 'scene') {
    ladder.push({ colors: COLORS, backdrop: SCENE_LOOK.backdrop, style: STYLE })
    ladder.push({ colors: COLORS, backdrop: SCENE_LOOK.backdrop })
  }
  if (variant !== 'plain') {
    ladder.push(PLAIN_LOOK)
  }

  for (const look of ladder) {
    try {
      const set = await $.theme.set(look)

      if (!set.isDrawn) {
        $.ui.status(`Astrolabe: ${set.reason}`)
      }

      return look === ladder[0] ? variant : `${variant} (simplified: ${Object.keys(look).join(', ')})`
    } catch (error) {
      $.ui.log(`${PLUGIN}: ${String(error)}`)
    }
  }

  return 'not set'
}

const USAGE = 'Usage: /astrolabe [scene | still | plain | off]'

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    // While building: the one kind of contrast line that would stop Desktop painting.
    const unpainted = PROBLEMS.find(line => line.startsWith("Desktop won't paint"))

    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    await $.command.register({
      name: 'astrolabe',
      description: 'Astrolabe look: scene (default), still, plain, or off',
    })
    await apply($, 'scene')

    return next(e)
  })

  on('command.run', { command: 'astrolabe' }, async ($, e) => {
    const arg = e.args.trim().toLowerCase() || 'scene'

    if (arg === 'off') {
      await $.theme.clear()

      return { text: 'Astrolabe look cleared. Run /astrolabe to bring it back.', isTextDisplayOnly: true }
    }
    if (arg !== 'scene' && arg !== 'still' && arg !== 'plain') {
      return { text: USAGE, isTextDisplayOnly: true }
    }
    const result = await apply($, arg)

    return { text: `Astrolabe look: ${result}.`, isTextDisplayOnly: true }
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if ((e.surface !== 'desktop' && e.surface !== 'mobile') || e.props.scene !== SCENE_NAME) {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)

    return (
      <Svg
        source={SCENE}
        alt="A star chart with a brass astrolabe in the top-right corner, its rete turning slowly"
        isInteractive
      />
    )
  })
}
