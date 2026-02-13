"use client";

import type { DateParts } from "../types";
import type { RootState } from "../store/store";
import styles from "./CvPreview.module.css";

type CvPreviewProps = {
  cv: RootState["cv"];
  sections: RootState["sections"];
};

export function CvPreview({ cv, sections }: CvPreviewProps) {
  const fullName = [cv.personalData.firstName, cv.personalData.lastName]
    .filter(Boolean)
    .join(" ");

  const locationText = [cv.personalData.city, cv.personalData.country]
    .filter(Boolean)
    .join(", ");

  const linkedInUrl = normalizeUrl(cv.personalData.linkedInUrl);
  const websiteUrl = normalizeUrl(cv.personalData.personalWebsite);
  const phoneValue = cv.personalData.phone
    ? cv.personalData.phone.replace(/[^\d+]/g, "")
    : "";

  return (
    <section className={styles.previewCard}>
      <div className={styles.previewBody}>
        <div className={styles.previewTop}>
          <div className={styles.previewLeft}>
            {cv.personalData.profileImageUrl && (
              <img
                className={styles.previewAvatar}
                src={cv.personalData.profileImageUrl}
                alt="Profile"
              />
            )}
            <div className={styles.previewIdentity}>
              <h3 className={styles.previewName}>
                {fullName || "Your Name"}
              </h3>
              {cv.personalData.desiredJobTitle && (
                <div className={styles.previewRole}>
                  {cv.personalData.desiredJobTitle}
                </div>
              )}
              {cv.personalData.summary && (
                <p className={styles.previewSummary}>{cv.personalData.summary}</p>
              )}
            </div>
          </div>

          <div className={styles.previewMeta}>
            {cv.personalData.email && (
              <div className={styles.previewMetaItem}>
                <span className={styles.previewMetaLabel}>Email:</span>
                <a
                  className={styles.previewMetaValue}
                  href={`mailto:${cv.personalData.email}`}
                >
                  {cv.personalData.email}
                </a>
              </div>
            )}
            {cv.personalData.phone && (
              <div className={styles.previewMetaItem}>
                <span className={styles.previewMetaLabel}>Phone:</span>
                <a
                  className={styles.previewMetaValue}
                  href={phoneValue ? `tel:${phoneValue}` : undefined}
                >
                  {cv.personalData.phone}
                </a>
              </div>
            )}
            {locationText && (
              <div className={styles.previewMetaItem}>
                <span className={styles.previewMetaLabel}>Location:</span>
                <span className={styles.previewMetaValue}>{locationText}</span>
              </div>
            )}
            {linkedInUrl && (
              <div className={styles.previewMetaItem}>
                <span className={styles.previewMetaLabel}>LinkedIn:</span>
                <a
                  className={styles.previewMetaValue}
                  href={linkedInUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {cv.personalData.linkedInUrl}
                </a>
              </div>
            )}
            {websiteUrl && (
              <div className={styles.previewMetaItem}>
                <span className={styles.previewMetaLabel}>Website:</span>
                <a
                  className={styles.previewMetaValue}
                  href={websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {cv.personalData.personalWebsite}
                </a>
              </div>
            )}
          </div>
        </div>

        {sections.experience && (
          <section className={styles.previewSection}>
            <h4>Experience</h4>
            {cv.experienceData.length === 0 ? (
              <p className={styles.previewEmpty}>No experience added.</p>
            ) : (
              <div className={styles.previewList}>
                {cv.experienceData.map((item, index) => (
                  <article key={`${item.companyName}-${index}`}>
                    <div className={styles.previewRow}>
                      <strong>{item.role}</strong>
                      <span>
                        {formatDateValue(item.startDate)} -
                        {item.stillWorkingHere
                          ? " Present"
                          : item.endDate
                            ? ` ${formatDateValue(item.endDate)}`
                            : ""}
                      </span>
                    </div>
                    <div className={styles.previewSubRow}>
                      <span>{item.companyName}</span>
                      {item.location && <span>{item.location}</span>}
                    </div>
                    {item.description && (
                      <p className={styles.previewDescription}>
                        {item.description}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {sections.skills && (
          <section className={styles.previewSection}>
            <h4>Skills</h4>
            {cv.skillsData.length === 0 ? (
              <p className={styles.previewEmpty}>No skills added.</p>
            ) : (
              <div className={styles.previewTags}>
                {cv.skillsData.map((item, index) => (
                  <span key={`${item.name}-${index}`}>
                    {item.proficiencyLevel && item.proficiencyLevel !== "N/A"
                      ? `${item.name} - ${item.proficiencyLevel}`
                      : item.name}
                  </span>
                ))}
              </div>
            )}
          </section>
        )}

        {sections.languages && (
          <section className={styles.previewSection}>
            <h4>Languages</h4>
            {cv.languagesData.length === 0 ? (
              <p className={styles.previewEmpty}>No languages added.</p>
            ) : (
              <ul className={styles.previewListSimple}>
                {cv.languagesData.map((item, index) => (
                  <li key={`${item.language}-${index}`}>
                    {item.language}
                    {formatLanguageDetails(item)}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {sections.education && (
          <section className={styles.previewSection}>
            <h4>Education</h4>
            {cv.educationData.length === 0 ? (
              <p className={styles.previewEmpty}>No education added.</p>
            ) : (
              <div className={styles.previewList}>
                {cv.educationData.map((item, index) => (
                  <article key={`${item.institutionName}-${index}`}>
                    <div className={styles.previewRow}>
                      <strong>{item.institutionName}</strong>
                      <span>
                        {formatDateValue(item.startDate)} -
                        {item.stillStudying
                          ? " Present"
                          : item.endDate
                            ? ` ${formatDateValue(item.endDate)}`
                            : ""}
                      </span>
                    </div>
                    <div className={styles.previewSubRow}>
                      <span>
                        {item.degreeType || item.fieldOfStudy
                          ? [item.degreeType, item.fieldOfStudy]
                              .filter(Boolean)
                              .join(" - ")
                          : ""}
                      </span>
                      {item.location && <span>{item.location}</span>}
                    </div>
                    {item.description && (
                      <p className={styles.previewDescription}>
                        {item.description}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </section>
  );
}

function formatLanguageDetails(item: RootState["cv"]["languagesData"][number]) {
  const levelParts: string[] = [];
  if (item.proficiencyLevel) {
    levelParts.push(item.proficiencyLevel);
  }
  if (item.cefrLevel) {
    levelParts.push(item.cefrLevel);
  }

  const levelText = levelParts.join(" / ");
  const certificateText = formatCertificateDetails(item.certificate);
  const combined = [levelText, certificateText].filter(Boolean).join(" ");

  return combined ? ` - ${combined}` : "";
}

function formatCertificateDetails(
  certificate: RootState["cv"]["languagesData"][number]["certificate"],
) {
  if (!certificate?.name) {
    return "";
  }

  const start = formatDateValue(certificate.date);
  const end = formatDateValue(certificate.expires);
  if (start && end) {
    return `(${certificate.name}, ${start} - ${end})`;
  }
  if (start) {
    return `(${certificate.name}, ${start})`;
  }
  if (end) {
    return `(${certificate.name}, expires ${end})`;
  }

  return `(${certificate.name})`;
}

function normalizeUrl(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function formatDateValue(value: DateParts | string | undefined): string {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }

  const month = String(value.month).padStart(2, "0");
  const year = String(value.year);

  if (value.day === null) {
    return `${month}/${year}`;
  }

  const day = String(value.day).padStart(2, "0");
  return `${day}/${month}/${year}`;
}
