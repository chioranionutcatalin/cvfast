"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks";
import styles from "../../page.module.css";
import { CvLayoutPreview } from "../../components/CvLayoutPreview";
import type { CvLayout } from "../../cvConsts";

const DOWNLOAD_LAYOUT_KEY = "hero4job_download_layout";
const LEGACY_DOWNLOAD_LAYOUT_KEY = "fastcv_download_layout";
const DOWNLOAD_LAYOUT_EVENT = "hero4job:download-layout";
const LEGACY_DOWNLOAD_LAYOUT_EVENT = "fastcv:download-layout";

export default function PreviewPage() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState<CvLayout>("classic");
  const cv = useAppSelector((state) => state.cv);
  const sections = useAppSelector((state) => state.sections);

  useEffect(() => {
    setIsHydrated(true);

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

    window.addEventListener(DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
    window.addEventListener(LEGACY_DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
    return () => {
      window.removeEventListener(DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
      window.removeEventListener(LEGACY_DOWNLOAD_LAYOUT_EVENT, handleLayoutChange as EventListener);
    };
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
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <section className={styles.previewPageWrapper}>
      <h2 className={styles.previewPageTitle}>Preview My CV</h2>
      <div className={styles.previewPageSelector}>
        <button
          type="button"
          className={`${styles.layoutOption} ${selectedLayout === "classic" ? styles.layoutOptionActive : ""}`}
          onClick={() => applyDownloadLayout("classic")}
        >
          Classic CV
        </button>
        <button
          type="button"
          className={`${styles.layoutOption} ${selectedLayout === "compact" ? styles.layoutOptionActive : ""}`}
          onClick={() => applyDownloadLayout("compact")}
        >
          Compact CV
        </button>
      </div>

      {selectedLayout === "classic" ? (
        <section
          id="cv-preview-classic"
          className={`${styles.previewCard} ${styles.previewClassic} ${styles.previewCardSelected} ${styles.previewSingleCard}`}
        >
          <CvLayoutPreview cv={cv} sections={sections} layout="classic" />
        </section>
      ) : (
        <section
          id="cv-preview-compact"
          className={`${styles.previewCard} ${styles.previewCompact} ${styles.previewCardSelected} ${styles.previewSingleCard}`}
        >
          <CvLayoutPreview cv={cv} sections={sections} layout="compact" />
        </section>
      )}
    </section>
  );
}
