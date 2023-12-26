type NotificationStatus = "success" | "error";
type NotificationMessage = "Notification sent" | "Notification not sent";
type Notification = {
  status: NotificationStatus;
  message: NotificationMessage;
};

type NotificationBody = {
  title?: string;
  content?: string;
};

export const sendNotification = async ({
  title,
  content,
}: NotificationBody): Promise<Notification> => {
  const notificationModule = await import("@tauri-apps/api/notification");

  let isGranted = await notificationModule.requestPermission();

  if (!isGranted) {
    isGranted = await notificationModule.requestPermission();
  }

  if (isGranted) {
    const send = notificationModule.sendNotification({
      title: title || "Notification",
      body: content || "This is a notification",
    });
  }

  return {
    status: isGranted ? "success" : "error",
    message: isGranted ? "Notification sent" : "Notification not sent",
  };
};
