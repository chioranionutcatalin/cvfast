"use client";

import type { RootState } from "../store/store";
import type { CVType, DateParts } from "../types";
import type { CvLayout } from "../cvConsts";
import styles from "../page.module.css";

type CvLayoutPreviewProps = {
  cv: CVType;
  sections: RootState["sections"];
  layout: CvLayout;
};

export function CvLayoutPreview({ cv, sections, layout }: CvLayoutPreviewProps) {
  const fullName = [cv.personalData.firstName, cv.personalData.lastName]
    .filter(Boolean)
    .join(" ");

  if (layout === "compact") {
    return <CompactPreview cv={cv} sections={sections} fullName={fullName} />;
  }

  return (
    <div className={styles.previewBody}>
      <div className={styles.previewTop}>
        {cv.personalData.profileImageUrl && (
          <img
            className={styles.previewAvatar}
            src={cv.personalData.profileImageUrl}
            alt="Profile"
          />
        )}

        <div className={styles.previewIdentity}>
          <h3 className={styles.previewName}>{fullName || "Your Name"}</h3>
          {cv.personalData.desiredJobTitle && (
            <div className={styles.previewRole}>{cv.personalData.desiredJobTitle}</div>
          )}
        </div>
      </div>

      {cv.personalData.summary && (
        <p className={styles.previewSummary}>{cv.personalData.summary}</p>
      )}

      <PreviewMeta cv={cv} />
      <PreviewSections cv={cv} sections={sections} />
    </div>
  );
}

function CompactPreview({
  cv,
  sections,
  fullName,
}: {
  cv: CVType;
  sections: RootState["sections"];
  fullName: string;
}) {
  return (
    <div className={styles.previewFutureLayout}>
      <div className={styles.previewFutureMain}>
        <div className={styles.previewTop}>
          {cv.personalData.profileImageUrl && (
            <img
              className={`${styles.previewAvatar} ${styles.previewAvatarFuture}`}
              src={cv.personalData.profileImageUrl}
              alt="Profile"
            />
          )}

          <div className={styles.previewIdentity}>
            <h3 className={styles.previewName}>{fullName || "Your Name"}</h3>
            {cv.personalData.desiredJobTitle && (
              <div className={styles.previewRole}>{cv.personalData.desiredJobTitle}</div>
            )}
          </div>
        </div>

        {cv.personalData.summary && (
          <p className={`${styles.previewSummary} ${styles.previewSummaryFuture}`}>
            {cv.personalData.summary}
          </p>
        )}

        {sections.experience && (
          <section className={`${styles.previewSection} ${styles.previewSectionFutureMain}`}>
            <h4>Work Experience</h4>
            {cv.experienceData.length === 0 ? (
              <p className={styles.previewEmpty}>No experience added.</p>
            ) : (
              <div className={`${styles.previewList} ${styles.previewListFuture}`}>
                {cv.experienceData.map((item, index) => (
                  <article
                    key={`${item.companyName}-${index}`}
                    className={`${styles.previewItem} ${styles.previewItemFuture}`}
                  >
                    <div className={styles.previewRow}>
                      <strong>{item.role}</strong>
                      <strong>
                        {formatDateValue(item.startDate)} -
                        {item.stillWorkingHere
                          ? " Present"
                          : item.endDate
                            ? ` ${formatDateValue(item.endDate)}`
                            : ""}
                      </strong>
                    </div>
                    <div className={styles.previewSubRow}>
                      <span>
                        <strong><em>{item.companyName}</em></strong>
                      </span>
                      {item.location && (
                        <span>
                          <strong><em>{item.location}</em></strong>
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className={styles.previewExperienceDesc}>{item.description}</p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>

      <aside className={styles.previewFutureSide}>
        <section className={styles.previewSection}>
          <h4>Personal Info</h4>
          <PreviewMeta cv={cv} future />
        </section>

        {sections.skills && (
          <section className={styles.previewSection}>
            <h4>Skills</h4>
            {cv.skillsData.length === 0 ? (
              <p className={styles.previewEmpty}>No skills added.</p>
            ) : (
              <ul className={styles.previewSkillsList}>
                {cv.skillsData.map((item, index) => (
                  <li key={`${item.name}-${index}`}>
                    {item.name}
                    {item.proficiencyLevel && item.proficiencyLevel !== "N/A"
                      ? ` - ${item.proficiencyLevel}`
                      : ""}
                  </li>
                ))}
              </ul>
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
                    {item.proficiencyLevel ? ` - ${item.proficiencyLevel}` : ""}
                    {item.cefrLevel ? ` (${item.cefrLevel})` : ""}
                    {item.certificate?.name ? ` - ${item.certificate.name}` : ""}
                    {item.certificate?.date
                      ? ` ${formatDateValue(item.certificate.date)}`
                      : ""}
                    {item.certificate?.expires
                      ? ` (expires ${formatDateValue(item.certificate.expires)})`
                      : ""}
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
              <ul className={styles.previewListSimple}>
                {cv.educationData.map((item, index) => (
                  <li key={`${item.institutionName}-${index}`}>
                    {item.institutionName}
                    {item.degreeType ? ` - ${item.degreeType}` : ""}
                    {item.startDate ? ` (${formatDateValue(item.startDate)}` : ""}
                    {item.stillStudying
                      ? " - Present)"
                      : item.endDate
                        ? ` - ${formatDateValue(item.endDate)})`
                        : item.startDate
                          ? ")"
                          : ""}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </aside>
    </div>
  );
}

function PreviewMeta({
  cv,
  future = false,
}: {
  cv: CVType;
  future?: boolean;
}) {
  return (
    <div className={`${styles.previewMeta} ${future ? styles.previewMetaFuture : ""}`}>
      {cv.personalData.email && (
        <span className={styles.previewMetaItem}>
          <span className={styles.previewMetaLabel}>Email:</span>
          {cv.personalData.email}
        </span>
      )}
      {cv.personalData.phone && (
        <span className={styles.previewMetaItem}>
          <span className={styles.previewMetaLabel}>Phone:</span>
          {cv.personalData.phone}
        </span>
      )}
      {(cv.personalData.city || cv.personalData.country) && (
        <span className={styles.previewMetaItem}>
          <span className={styles.previewMetaLabel}>Location:</span>
          {[cv.personalData.city, cv.personalData.country].filter(Boolean).join(", ")}
        </span>
      )}
      {cv.personalData.linkedInUrl && (
        <span className={styles.previewMetaItem}>
          <span className={styles.previewMetaLabel}>LinkedIn:</span>
          {cv.personalData.linkedInUrl}
        </span>
      )}
      {cv.personalData.personalWebsite && (
        <span className={styles.previewMetaItem}>
          <span className={styles.previewMetaLabel}>Website:</span>
          {cv.personalData.personalWebsite}
        </span>
      )}
      {cv.personalData.driverLicenseCategory && (
        <span className={styles.previewMetaItem}>
          <span className={styles.previewMetaLabel}>License:</span>
          {cv.personalData.driverLicenseCategory}
        </span>
      )}
    </div>
  );
}

function PreviewSections({
  cv,
  sections,
}: {
  cv: CVType;
  sections: RootState["sections"];
}) {
  return (
    <>
      {sections.experience && (
        <section className={styles.previewSection}>
          <h4>Experience</h4>
          {cv.experienceData.length === 0 ? (
            <p className={styles.previewEmpty}>No experience added.</p>
          ) : (
            <div className={styles.previewList}>
              {cv.experienceData.map((item, index) => (
                <article key={`${item.companyName}-${index}`} className={styles.previewItem}>
                  <div className={styles.previewRow}>
                    <strong>{item.role}</strong>
                    <strong>
                      {formatDateValue(item.startDate)} -
                      {item.stillWorkingHere
                        ? " Present"
                        : item.endDate
                          ? ` ${formatDateValue(item.endDate)}`
                          : ""}
                    </strong>
                  </div>
                  <div className={styles.previewSubRow}>
                    <span>
                      <strong><em>{item.companyName}</em></strong>
                    </span>
                    {item.location && (
                      <span>
                        <strong><em>{item.location}</em></strong>
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className={styles.previewExperienceDesc}>{item.description}</p>
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
                  {item.name}
                  {item.proficiencyLevel && item.proficiencyLevel !== "N/A"
                    ? ` - ${item.proficiencyLevel}`
                    : ""}
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
                  {item.proficiencyLevel ? ` - ${item.proficiencyLevel}` : ""}
                  {item.cefrLevel ? ` (${item.cefrLevel})` : ""}
                  {item.certificate?.name ? ` - ${item.certificate.name}` : ""}
                  {item.certificate?.date
                    ? ` ${formatDateValue(item.certificate.date)}`
                    : ""}
                  {item.certificate?.expires
                    ? ` (expires ${formatDateValue(item.certificate.expires)})`
                    : ""}
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
                      {item.endDate ? ` ${formatDateValue(item.endDate)}` : ""}
                    </span>
                  </div>
                  <div className={styles.previewSubRow}>
                    <span>
                      {item.degreeType || item.fieldOfStudy
                        ? [item.degreeType, item.fieldOfStudy].filter(Boolean).join(" - ")
                        : ""}
                    </span>
                    {item.location && <span>{item.location}</span>}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
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
