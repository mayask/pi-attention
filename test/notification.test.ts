import assert from "node:assert/strict";
import test from "node:test";
import {
  createAttentionSequence,
  detectNotificationProtocol,
  notificationsDisabled,
  wrapTmuxPassthrough,
} from "../src/notification.ts";

const ESC = "\x1b";
const BEL = "\x07";
const ST = `${ESC}\\`;

test("detects supported terminal notification protocols", () => {
  assert.equal(detectNotificationProtocol({ GHOSTTY_RESOURCES_DIR: "/ghostty" }), "osc9");
  assert.equal(detectNotificationProtocol({ TERM_PROGRAM: "iTerm.app" }), "osc9");
  assert.equal(detectNotificationProtocol({ KITTY_WINDOW_ID: "1" }), "osc99");
  assert.equal(detectNotificationProtocol({ TERM_PROGRAM: "Apple_Terminal" }), "bell");
});

test("wraps OSC notifications for tmux and appends a bell", () => {
  const notification = `${ESC}]9;Pi: Ready for input${ST}`;
  const expected = `${ESC}Ptmux;${notification.replaceAll(ESC, `${ESC}${ESC}`)}${ST}${BEL}`;

  assert.equal(
    createAttentionSequence("Pi: Ready for input", {
      GHOSTTY_RESOURCES_DIR: "/ghostty",
      TMUX: "/tmp/tmux/default,1,0",
    }),
    expected,
  );
});

test("uses a plain bell as the portable fallback", () => {
  assert.equal(createAttentionSequence("done", {}), BEL);
});

test("wrapTmuxPassthrough doubles embedded escape bytes", () => {
  assert.equal(wrapTmuxPassthrough(`${ESC}]9;done${ST}`), `${ESC}Ptmux;${ESC}${ESC}]9;done${ESC}${ESC}\\${ST}`);
});

test("honors PI_NOTIFICATIONS opt-out values", () => {
  assert.equal(notificationsDisabled({ PI_NOTIFICATIONS: "off" }), true);
  assert.equal(notificationsDisabled({ PI_NOTIFICATIONS: "FALSE" }), true);
  assert.equal(notificationsDisabled({ PI_NOTIFICATIONS: "1" }), false);
  assert.equal(notificationsDisabled({}), false);
});
