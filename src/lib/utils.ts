const checkIfImage = (file: FileType) => {
  const allowedContentTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/svg+xml",
  ];

  if (allowedContentTypes.includes(file.type)) {
    return true;
  } else {
    return false;
  }
};

const checkIfVideo = (file: FileType) => {
  const allowedContentTypes = ["video/mp4", "video/webm"];

  if (allowedContentTypes.includes(file.type)) {
    return true;
  } else {
    return false;
  }
};

const truncateString = (str: string, len: number): string => {
  const string = str.length > len ? str.slice(0, len) + "..." : str;
  return string;
};

const bytesToString = (bytes: number): string => {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;
  const terabyte = gigabyte * 1024;

  let byteString = "";
  if (bytes < kilobyte) {
    byteString = `${bytes} bytes`;
  } else if (bytes < megabyte) {
    byteString = `${(bytes / kilobyte).toFixed(2)} Kb`;
  } else if (bytes < gigabyte) {
    byteString = `${(bytes / megabyte).toFixed(2)} Mb`;
  } else if (bytes < terabyte) {
    byteString = `${(bytes / gigabyte).toFixed(2)} Gb`;
  } else {
    byteString = `${(bytes / terabyte).toFixed(2)} Tb`;
  }

  return byteString;
};

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

const sendNotification = async ({
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

export {
  checkIfImage,
  checkIfVideo,
  truncateString,
  bytesToString,
  sendNotification,
};
