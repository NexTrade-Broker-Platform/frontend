type MessageHandler = (payload: unknown) => void;

const WS_BASE =
  (import.meta.env.VITE_NOTIFICATION_WS_URL as string | undefined) ??
  "ws://localhost:9006";

const RETRY_BASE_MS = 1_000;
const RETRY_MAX_MS = 30_000;

const listeners = new Map<string, Set<MessageHandler>>();

let ws: WebSocket | null = null;
let generation = 0; // incremented on every stop(); stale onclose events are ignored
let retryDelay = RETRY_BASE_MS;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let active = false;

function notify(type: string, payload: unknown) {
  listeners.get(type)?.forEach((fn) => fn(payload));
}

function scheduleReconnect(gen: number) {
  if (!active || gen !== generation) return;
  retryTimer = setTimeout(() => connect(gen), retryDelay);
  retryDelay = Math.min(retryDelay * 2, RETRY_MAX_MS);
}

function connect(gen: number) {
  if (!active || gen !== generation) return;

  const token = localStorage.getItem("jwt_token");
  let url = WS_BASE + "/ws/notifications";
  if (token) url += `?token=${encodeURIComponent(token)}`;

  const socket = new WebSocket(url);
  ws = socket;

  socket.onopen = () => {
    if (gen !== generation) { socket.close(); return; }
    retryDelay = RETRY_BASE_MS;
  };

  socket.onmessage = ({ data }) => {
    if (gen !== generation) return;
    try {
      const msg = JSON.parse(data as string) as { type: string; payload: unknown };
      notify(msg.type, msg.payload);
    } catch {
      // ignore malformed messages
    }
  };

  socket.onclose = () => scheduleReconnect(gen);
  socket.onerror = () => socket.close();
}

function handleVisibilityChange() {
  if (document.hidden) return;
  const state = ws?.readyState;
  if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) return;
  if (retryTimer) clearTimeout(retryTimer);
  retryDelay = RETRY_BASE_MS;
  connect(generation);
}

export const wsClient = {
  start() {
    if (active) return;
    active = true;
    retryDelay = RETRY_BASE_MS;
    connect(generation);
    document.addEventListener("visibilitychange", handleVisibilityChange);
  },

  stop() {
    active = false;
    generation++; // invalidates all callbacks from the previous connection
    if (retryTimer) clearTimeout(retryTimer);
    ws?.close();
    ws = null;
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  },

  subscribe(type: string, fn: MessageHandler) {
    if (!listeners.has(type)) listeners.set(type, new Set());
    listeners.get(type)!.add(fn);
  },

  unsubscribe(type: string, fn: MessageHandler) {
    listeners.get(type)?.delete(fn);
  },
};
