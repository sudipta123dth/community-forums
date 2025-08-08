import { toast } from "react-toastify";

export default function toastNotify(
  message: string,
  type: "success" | "error" | "info" | "warning" = "info"
) {
  const options = {toastId: message}; // use message as id for simplicity

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    default:
      toast.info(message, options);
  }
}
