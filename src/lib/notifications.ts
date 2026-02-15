// Notification service: in-app toast + browser push notifications
import { toast } from 'sonner';

export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function sendBrowserNotification(title: string, body: string, icon?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  
  try {
    new Notification(title, {
      body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'kuriergo-order',
    } as NotificationOptions);
  } catch (e) {
    // SW notification fallback for mobile
    navigator.serviceWorker?.ready?.then(reg => {
      reg.showNotification(title, { body, icon: icon || '/favicon.ico' });
    }).catch(() => {});
  }
}

export function notifyStatusChange(title: string, body: string) {
  // Always show in-app toast
  toast(title, { description: body, duration: 5000 });

  // Also send browser push if document is hidden (background)
  if (document.hidden) {
    sendBrowserNotification(title, body);
  }
}
