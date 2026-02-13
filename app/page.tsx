"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { CvLayoutPreview } from "./components/CvLayoutPreview";
import { HOME_MODEL_CVS, type CvLayout } from "./cvConsts";
import { useAppSelector } from "./store/hooks";

const DOWNLOAD_LAYOUT_KEY = "hero4job_download_layout";
const LEGACY_DOWNLOAD_LAYOUT_KEY = "fastcv_download_layout";
const DOWNLOAD_LAYOUT_EVENT = "hero4job:download-layout";
const LEGACY_DOWNLOAD_LAYOUT_EVENT = "fastcv:download-layout";

export default function HomePage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<CvLayout>("classic");
  const sections = useAppSelector((state) => state.sections);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const applyDownloadLayout = (next: CvLayout) => {
    setSelectedLayout(next);
    window.localStorage.setItem(DOWNLOAD_LAYOUT_KEY, next);
    window.localStorage.setItem(LEGACY_DOWNLOAD_LAYOUT_KEY, next);
    window.dispatchEvent(
      new CustomEvent(DOWNLOAD_LAYOUT_EVENT, {
        detail: next,
      }),
    );
    window.dispatchEvent(
      new CustomEvent(LEGACY_DOWNLOAD_LAYOUT_EVENT, {
        detail: next,
      }),
    );
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: DOWNLOAD_LAYOUT_KEY,
        newValue: next,
      }),
    );
  };

  useEffect(() => {
    const stored =
      window.localStorage.getItem(DOWNLOAD_LAYOUT_KEY) ??
      window.localStorage.getItem(LEGACY_DOWNLOAD_LAYOUT_KEY);
    if (stored === "classic" || stored === "compact") {
      setSelectedLayout(stored);
    } else if (stored) {
      setSelectedLayout("compact");
      window.localStorage.setItem(DOWNLOAD_LAYOUT_KEY, "compact");
      window.localStorage.setItem(LEGACY_DOWNLOAD_LAYOUT_KEY, "compact");
    }

    const handleLayoutChange = (event: Event) => {
      const customEvent = event as CustomEvent<CvLayout>;
      if (customEvent.detail === "classic" || customEvent.detail === "compact") {
        setSelectedLayout(customEvent.detail);
      }
    };

    const handleStorage = (event: StorageEvent) => {
      if (event.key !== DOWNLOAD_LAYOUT_KEY && event.key !== LEGACY_DOWNLOAD_LAYOUT_KEY) {
        return;
      }
      if (event.newValue === "classic" || event.newValue === "compact") {
        setSelectedLayout(event.newValue);
      } else if (event.newValue) {
        setSelectedLayout("compact");
        window.localStorage.setItem(DOWNLOAD_LAYOUT_KEY, "compact");
        window.localStorage.setItem(LEGACY_DOWNLOAD_LAYOUT_KEY, "compact");
      }
    };

    window.addEventListener(DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
    window.addEventListener(LEGACY_DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
      window.removeEventListener(LEGACY_DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return (
      <>
        {isHydrated && (
          <section className={styles.homeModelsSection}>
            <h2 className={styles.homeModelsTitle}>Pick your hero for the job.</h2>
            <div className={styles.previewGrid}>
              <section
                id="cv-preview-classic"
                className={`${styles.previewCard} ${styles.previewClassic} ${styles.previewModelCard} ${selectedLayout === "classic" ? styles.previewCardSelected : styles.previewCardMuted}`}
                onClick={() => applyDownloadLayout("classic")}
              >
                <CvLayoutPreview
                  cv={HOME_MODEL_CVS.classic}
                  sections={sections}
                  layout="classic"
                />
              </section>

              <section
                id="cv-preview-compact"
                className={`${styles.previewCard} ${styles.previewCompact} ${styles.previewModelCard} ${selectedLayout === "compact" ? styles.previewCardSelected : styles.previewCardMuted}`}
                onClick={() => applyDownloadLayout("compact")}
              >
                <CvLayoutPreview
                  cv={HOME_MODEL_CVS.compact}
                  sections={sections}
                  layout="compact"
                />
              </section>
            </div>
          </section>
        )}
    </>
  );
}
