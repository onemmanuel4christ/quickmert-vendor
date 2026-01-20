// Notification sound for new orders
export const playNotificationSound = () => {
  try {
    // Create audio context
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();

    // Create oscillator for notification sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Configure sound - pleasant notification beep
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // High pitch

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5,
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Play a second beep
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();

      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);

      oscillator2.type = "sine";
      oscillator2.frequency.setValueAtTime(1000, audioContext.currentTime);

      gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );

      oscillator2.start(audioContext.currentTime);
      oscillator2.stop(audioContext.currentTime + 0.5);
    }, 200);
  } catch (error) {
    console.error("Error playing notification sound:", error);
  }
};

// Request notification permission
export const requestNotificationPermission =
  async (): Promise<NotificationPermission> => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications");
      return "denied";
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  };

// Show browser notification for new order
export const showOrderNotification = (
  orderNumber: string,
  customerName: string,
  total: number,
) => {
  if (Notification.permission === "granted") {
    const notification = new Notification("New Order Received! 🛒", {
      body: `Order ${orderNumber} from ${customerName} - ₦${total.toLocaleString("en-NG")}`,
      icon: "/icon-192.png", // You can add your app icon here
      badge: "/badge-72.png",
      tag: orderNumber, // Prevent duplicate notifications
      requireInteraction: true, // Keep notification visible
      vibrate: [200, 100, 200], // Vibration pattern for mobile
    });

    notification.onclick = () => {
      window.focus();
      // Navigate to order details
      window.location.href = `/orders/${orderNumber}`;
      notification.close();
    };

    // Auto-close after 10 seconds
    setTimeout(() => notification.close(), 10000);
  }
};

// Play urgent sound for SLA breach
export const playUrgentSound = () => {
  try {
    const audioContext = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();

    // Create more urgent triple beep
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = "square"; // More urgent sound
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);

        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3,
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }, i * 300);
    }
  } catch (error) {
    console.error("Error playing urgent sound:", error);
  }
};
