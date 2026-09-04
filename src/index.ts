import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { createAttentionSequence, notificationsDisabled } from "./notification.ts";

export default function attentionExtension(pi: ExtensionAPI): void {
  pi.on("agent_settled", (_event, ctx) => {
    if (ctx.mode !== "tui" || !ctx.isIdle() || !process.stdout.isTTY) return;
    if (notificationsDisabled()) return;

    process.stdout.write(createAttentionSequence());
  });
}
