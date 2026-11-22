import { expect, test } from 'claude-code/testing'

test('the whole look is accepted at session start, sound and style included', async ($, on) => {
  const sets: Record<string, unknown>[] = []

  on('command.register', () => ({ value: { command: 'astrolabe' } }))
  on('theme.set', (_, e) => {
    sets.push(e as Record<string, unknown>)

    return { value: { isDrawn: true, requestId: 'backdrop' } }
  })
  const logs: string[] = []
  on('ui.log', (_, e) => {
    logs.push(String((e as { text?: unknown }).text))

    return { value: undefined }
  })
  on('session.start', (_, e) => ({ cwd: e.cwd }))

  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })

  expect(logs).toEqual([])
  expect(sets.length).toBe(1)
  expect(Object.keys(sets[0] ?? {}).sort()).toEqual(['backdrop', 'colors', 'sound', 'style'])
})

const run = (args: string) =>
  ({
    command: 'astrolabe',
    args,
    origin: { kind: 'composer' },
    presentation: { isFullscreen: false, columns: 80 },
  }) as const

test('/astrolabe still and plain set simpler looks, and a typo shows usage', async ($, on) => {
  const sets: Record<string, unknown>[] = []

  on('theme.set', (_, e) => {
    sets.push(e as Record<string, unknown>)

    return { value: { isDrawn: true, requestId: 'theme' } }
  })

  const still = await $.command.run(run('still'))
  const plain = await $.command.run(run('plain'))
  const typo = await $.command.run(run('sparkly'))

  expect(still.text).toBe('Astrolabe look: still.')
  expect(plain.text).toBe('Astrolabe look: plain.')
  expect(typo.text).toContain('Usage')
  expect(Object.keys(sets[0] ?? {}).sort()).toEqual(['backdrop', 'colors', 'style'])
  expect(Object.keys(sets[1] ?? {})).toEqual(['colors'])
})

test('the backdrop draws the star chart on desktop and mobile', async $ => {
  for (const surface of ['desktop', 'mobile'] as const) {
    const ui = await $.ui.mount({
      plugin: 'astrolabe-theme',
      component: 'Backdrop',
      requestId: 'backdrop',
      surface,
      props: { scene: 'astrolabe-rete', plugin: 'astrolabe-theme', glass: { blur: 14, opacity: 0.72 } },
    })
    const svg = await ui.find({ type: 'Svg' })

    expect(svg).toBeDefined()
    await ui.unmount()
  }
})
