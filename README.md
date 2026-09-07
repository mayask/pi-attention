# pi-attention

A small Pi extension that asks the terminal for attention after the agent finishes working and is ready for input.

It listens to Pi's `agent_settled` event rather than each low-level agent run, so retries, compaction, and queued follow-ups do not produce premature alerts.

## Behavior

The extension uses terminal-native protocols and leaves foreground/background presentation to the terminal and operating system. It does not require macOS Accessibility or Automation permissions.

- Kitty: OSC 99 notification
- Ghostty, WezTerm, iTerm2, and Warp: OSC 9 notification
- tmux: DCS passthrough plus BEL, matching OMP's fallback behavior
- Zellij: terminal notification plus BEL
- Other terminals: BEL

Only interactive Pi sessions emit attention notifications. Set `PI_NOTIFICATIONS=off`, `0`, or `false` to disable them.

## Install

Install the Pi package from GitHub:

```bash
pi install git:github.com/mayask/pi-attention
```

Or install from a local checkout for development:

```bash
pi install ~/src/pi-attention
```

Choose one source to avoid loading the extension twice. Then restart Pi or run `/reload` in an existing session.

The package manifest includes the `pi-package` keyword and declares `./src/index.ts` as its extension entrypoint. No skills, prompts, or themes are bundled. Gallery preview metadata is optional and omitted until a preview image or MP4 video is available.

## Test

```bash
cd ~/src/pi-attention
npm test
```
