const ESC = "\x1b";
const BEL = "\x07";
const STRING_TERMINATOR = `${ESC}\\`;

type Environment = Record<string, string | undefined>;

type NotificationProtocol = "bell" | "osc9" | "osc99";

export function notificationsDisabled(env: Environment = process.env): boolean {
  const value = env.PI_NOTIFICATIONS?.trim().toLowerCase();
  return value === "off" || value === "0" || value === "false";
}

export function detectNotificationProtocol(env: Environment = process.env): NotificationProtocol {
  if (env.KITTY_WINDOW_ID) return "osc99";

  const terminalProgram = env.TERM_PROGRAM?.toLowerCase();
  if (
    env.GHOSTTY_RESOURCES_DIR ||
    env.WEZTERM_PANE ||
    env.ITERM_SESSION_ID ||
    terminalProgram === "ghostty" ||
    terminalProgram === "wezterm" ||
    terminalProgram === "iterm.app" ||
    terminalProgram === "warpterminal" ||
    env.TERM?.toLowerCase().includes("ghostty")
  ) {
    return "osc9";
  }

  return "bell";
}

export function wrapTmuxPassthrough(payload: string): string {
  return `${ESC}Ptmux;${payload.replaceAll(ESC, `${ESC}${ESC}`)}${STRING_TERMINATOR}`;
}

export function createAttentionSequence(
  message = "Pi: Ready for input",
  env: Environment = process.env,
): string {
  const protocol = detectNotificationProtocol(env);
  if (protocol === "bell") return BEL;

  const notification =
    protocol === "osc99"
      ? `${ESC}]99;;${message}${STRING_TERMINATOR}`
      : `${ESC}]9;${message}${STRING_TERMINATOR}`;

  if (env.TMUX) return `${wrapTmuxPassthrough(notification)}${BEL}`;
  if (env.ZELLIJ) return `${notification}${BEL}`;
  return notification;
}
