import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "vanguard_user_avatar";
const DISABLED_KEY = "vanguard_user_avatar_disabled";
const MAX_BYTES = 1.5 * 1024 * 1024;

function readStoredAvatar() {
  try {
    return localStorage.getItem(STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

function readAvatarDisabled() {
  try {
    return localStorage.getItem(DISABLED_KEY) === "true";
  } catch {
    return false;
  }
}

/** User-chosen profile photo (stored locally as a data URL). */
export function useProfileAvatar() {
  const [avatarSrc, setAvatarSrc] = useState(() => readStoredAvatar());
  const [avatarDisabled, setAvatarDisabled] = useState(() => readAvatarDisabled());
  const fileInputRef = useRef(null);

  useEffect(() => {
    const sync = () => {
      setAvatarSrc(readStoredAvatar());
      setAvatarDisabled(readAvatarDisabled());
    };
    window.addEventListener("vanguard-avatar-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("vanguard-avatar-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const hasCustomAvatar = !!avatarSrc && !avatarDisabled;
  const displaySrc = hasCustomAvatar ? avatarSrc : null;

  const onFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > MAX_BYTES) {
      window.alert("Please choose an image under 1.5 MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const data = reader.result;
      try {
        localStorage.setItem(STORAGE_KEY, data);
        localStorage.setItem(DISABLED_KEY, "false");
      } catch {
        window.alert("Could not save photo (storage full or blocked).");
        e.target.value = "";
        return;
      }
      setAvatarSrc(data);
      setAvatarDisabled(false);
      window.dispatchEvent(new Event("vanguard-avatar-change"));
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const openPicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const disableAvatar = useCallback(() => {
    try {
      localStorage.setItem(DISABLED_KEY, "true");
    } catch {
      // ignore
    }
    setAvatarDisabled(true);
    window.dispatchEvent(new Event("vanguard-avatar-change"));
  }, []);

  const enableAvatar = useCallback(() => {
    try {
      localStorage.setItem(DISABLED_KEY, "false");
    } catch {
      // ignore
    }
    setAvatarDisabled(false);
    window.dispatchEvent(new Event("vanguard-avatar-change"));
  }, []);

  const clearAvatar = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setAvatarSrc("");
    window.dispatchEvent(new Event("vanguard-avatar-change"));
  }, []);

  return {
    displaySrc,
    hasCustomAvatar,
    avatarDisabled,
    fileInputRef,
    onFileChange,
    openPicker,
    disableAvatar,
    enableAvatar,
    clearAvatar,
  };
}
