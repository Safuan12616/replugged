import type { Promisable } from "type-fest";
import { patchPlaintext } from "../modules/webpack";

import { default as experimentsPlaintext } from "../coremods/experiments/plaintextPatches";
import { default as settingsPlaintext } from "../coremods/settings/plaintextPatches";
import { default as notrackPlaintext } from "../coremods/notrack/plaintextPatches";
import { default as noDevtoolsWarningPlaintext } from "../coremods/noDevtoolsWarning/plaintextPatches";
import { default as messagePopover } from "../coremods/messagePopover/plaintextPatches";
import { default as languagePlaintext } from "../coremods/language/plaintextPatches";

interface Coremod {
  start?: () => Promisable<void>;
  stop?: () => Promisable<void>;
  [x: string]: unknown; // Allow coremods to export anything else they want
}

export namespace coremods {
  export let noDevtoolsWarning: Coremod;
  export let settings: Coremod;
  export let badges: Coremod;
  export let notrack: Coremod;
  export let installer: Coremod;
  export let messagePopover: Coremod;
  export let language: Coremod;
  export let rpc: Coremod;
  export let watcher: Coremod;
}

export async function start(name: keyof typeof coremods): Promise<void> {
  await coremods[name]?.start?.();
}

export async function stop(name: keyof typeof coremods): Promise<void> {
  await coremods[name]?.stop?.();
}

export async function startAll(): Promise<void> {
  coremods.noDevtoolsWarning = await import("../coremods/noDevtoolsWarning");
  coremods.settings = await import("../coremods/settings");
  coremods.badges = await import("../coremods/badges");
  coremods.installer = await import("../coremods/installer");
  coremods.messagePopover = await import("../coremods/messagePopover");
  coremods.language = await import("../coremods/language");
  coremods.rpc = await import("../coremods/rpc");
  coremods.watcher = await import("../coremods/watcher");
  await Promise.allSettled(Object.values(coremods).map((c) => c.start?.()));
}

export async function stopAll(): Promise<void> {
  await Promise.allSettled(Object.values(coremods).map((c) => c.stop?.()));
}

export function runPlaintextPatches(): void {
  [
    experimentsPlaintext,
    settingsPlaintext,
    notrackPlaintext,
    noDevtoolsWarningPlaintext,
    messagePopover,
    languagePlaintext,
  ].forEach(patchPlaintext);
}
