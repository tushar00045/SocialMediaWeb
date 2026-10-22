
import { useRef, useState } from "react";

export default function useOptimisticAction() {
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);

  const runAction = async ({
    optimisticUpdate,
    action,
    rollback,
    onSuccess,
    onError,
  }) => {
    // Prevent duplicate clicks while the same action is pending.
    if (pendingRef.current) return;

    pendingRef.current = true;
    setPending(true);

    try {
      // Update the UI immediately.
      optimisticUpdate?.();

      // Perform the actual Appwrite operation.
      const result = await action();

      if (result === false || result == null) {
        throw new Error("The action could not be completed.");
      }

      onSuccess?.(result);
      return result;
    } catch (error) {
      // Restore the UI if the request fails.
      rollback?.();
      onError?.(error);
      return null;
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  return { runAction, pending };
}
