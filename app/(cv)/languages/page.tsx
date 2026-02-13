"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { FieldErrors, FieldPath } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setLanguagesData } from "../../store/cvSlice";
import type { DateParts, LanguageType } from "../../types";
import styles from "./page.module.css";

type LanguageFormEntry = {
  language: string;
  proficiencyLevel?: LanguageType["proficiencyLevel"] | "";
  cefrLevel?: LanguageType["cefrLevel"] | "";
  certificateName?: string;
  certificateDate?: string;
  certificateExpires?: string;
};

type LanguageFormValues = {
  languages: LanguageFormEntry[];
};

type LanguageFieldPath = FieldPath<LanguageFormValues>;

const proficiencyOptions: NonNullable<LanguageType["proficiencyLevel"]>[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Fluent",
  "Native",
];

const cefrOptions: NonNullable<LanguageType["cefrLevel"]>[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
];

const emptyLanguage: LanguageFormEntry = {
  language: "",
  proficiencyLevel: "",
  cefrLevel: "",
  certificateName: "",
  certificateDate: "",
  certificateExpires: "",
};

export default function LanguagesPage() {
  const dispatch = useAppDispatch();
  const languagesData = useAppSelector((state) => state.cv.languagesData);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const defaultValues = useMemo<LanguageFormValues>(() => ({
    languages: languagesData.length
      ? languagesData.map((entry) => ({
          language: entry.language,
          proficiencyLevel: entry.proficiencyLevel ?? "",
          cefrLevel: entry.cefrLevel ?? "",
          certificateName: entry.certificate?.name ?? "",
          certificateDate: formatDateValue(entry.certificate?.date) ?? "",
          certificateExpires: formatDateValue(entry.certificate?.expires) ?? "",
        }))
      : [emptyLanguage, { ...emptyLanguage }],
  }), [languagesData]);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LanguageFormValues>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "languages",
  });

  const handleSave = useCallback(
    (data: LanguageFormValues) => {
      const mapped: LanguageType[] = data.languages.reduce<LanguageType[]>((acc, entry) => {
        const language = entry.language.trim();
        if (!language) {
          return acc;
        }

        const certificateName = entry.certificateName?.trim() || "";
        const certificateDate = entry.certificateDate?.trim() || "";
        const certificateExpires = entry.certificateExpires?.trim() || "";
        const parsedCertificateDate = certificateDate
          ? parseDateInput(certificateDate)
          : undefined;
        const parsedCertificateExpires = certificateExpires
          ? parseDateInput(certificateExpires)
          : undefined;

        const certificate = certificateName
          ? {
              name: certificateName,
              date: parsedCertificateDate || undefined,
              expires: parsedCertificateExpires || undefined,
            }
          : undefined;

        acc.push({
          language,
          proficiencyLevel: entry.proficiencyLevel || undefined,
          cefrLevel: entry.cefrLevel || undefined,
          certificate,
        });

        return acc;
      }, []);

      dispatch(setLanguagesData(mapped));
    },
    [dispatch],
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleSave)}>
      <fieldset className={styles.languagesWrapper}>
        <legend className={styles.legend}>Languages</legend>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>
            Add the languages you speak and optional CEFR or certificates.
          </p>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => append({ ...emptyLanguage })}
          >
            + Add language
          </button>
        </div>

        {isHydrated && (
          <div className={styles.languagesList}>
            {fields.map((field, index) => {
              const languagePath = `languages.${index}.language` as LanguageFieldPath;
              const levelPath = `languages.${index}.proficiencyLevel` as LanguageFieldPath;
              const cefrPath = `languages.${index}.cefrLevel` as LanguageFieldPath;
              const certNamePath = `languages.${index}.certificateName` as LanguageFieldPath;
              const certDatePath = `languages.${index}.certificateDate` as LanguageFieldPath;
              const certExpiresPath = `languages.${index}.certificateExpires` as LanguageFieldPath;

              return (
                <section key={field.id} className={styles.languageCard}>
                  <header className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>Language #{index + 1}</h3>
                    {fields.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    )}
                  </header>

                  <div className={styles.formRow}>
                    <label className={styles.field}>
                      Language *
                      <input
                        className={`${styles.customInput} ${getFieldError(languagePath, errors) ? styles.inputError : ""}`}
                        placeholder="English, Spanish, German"
                        {...register(languagePath, {
                          required: "Language is required",
                          pattern: {
                            value: /^[A-Za-z][A-Za-z '\-]*$/,
                            message: "Letters only",
                          },
                        })}
                      />
                      <div className={styles.validationSlot}>
                        {getFieldError(languagePath, errors) && (
                          <span className={styles.errorText}>
                            {getFieldError(languagePath, errors)}
                          </span>
                        )}
                        {!getFieldError(languagePath, errors) && (
                          <span className={styles.placeholderText}>OK</span>
                        )}
                      </div>
                    </label>
                    <label className={styles.field}>
                      Proficiency Label *
                      <select
                        className={styles.selectInput}
                        {...register(levelPath, {
                          required: "Proficiency is required",
                        })}
                      >
                        <option value="">Select (required)</option>
                        {proficiencyOptions.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      <div className={styles.validationSlot}>
                        {getFieldError(levelPath, errors) && (
                          <span className={styles.errorText}>
                            {getFieldError(levelPath, errors)}
                          </span>
                        )}
                        {!getFieldError(levelPath, errors) && (
                          <span className={styles.placeholderText}>OK</span>
                        )}
                      </div>
                    </label>
                  </div>

                  <div className={styles.secondarySection}>
                    <div className={styles.secondaryTitle}>Optional details</div>
                    <div className={styles.formRow}>
                      <label className={styles.field}>
                        CEFR Level
                        <select className={styles.selectInput} {...register(cefrPath)}>
                          <option value="">Select (optional)</option>
                          {cefrOptions.map((level) => (
                            <option key={level} value={level}>
                              {level}
                            </option>
                          ))}
                        </select>
                        <div className={styles.validationSlot}>
                          <span className={styles.placeholderText}>OK</span>
                        </div>
                      </label>
                      <label className={styles.field}>
                        Certificate Name
                        <input
                          className={styles.customInput}
                          placeholder="IELTS, TOEFL iBT (optional)"
                          {...register(certNamePath)}
                        />
                        <div className={styles.validationSlot}>
                          <span className={styles.placeholderText}>OK</span>
                        </div>
                      </label>
                    </div>

                    <div className={styles.formRow}>
                      <label className={styles.field}>
                        Certificate Date
                        <input
                          className={styles.customInput}
                          placeholder="MM/YYYY or DD/MM/YYYY (optional)"
                          {...register(certDatePath, {
                            validate: (value) => {
                              const dateValue = typeof value === "string" ? value : "";
                              return (
                                !dateValue ||
                                /^(0[1-9]|1[0-2])\/\d{4}$|^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(
                                  dateValue,
                                ) || "Use MM/YYYY or DD/MM/YYYY"
                              );
                            },
                          })}
                        />
                        <div className={styles.validationSlot}>
                          {getFieldError(certDatePath, errors) && (
                            <span className={styles.errorText}>
                              {getFieldError(certDatePath, errors)}
                            </span>
                          )}
                          {!getFieldError(certDatePath, errors) && (
                            <span className={styles.placeholderText}>OK</span>
                          )}
                        </div>
                      </label>
                      <label className={styles.field}>
                        Certificate Expiry
                        <input
                          className={styles.customInput}
                          placeholder="MM/YYYY or DD/MM/YYYY (optional)"
                          {...register(certExpiresPath, {
                            validate: (value) => {
                              const dateValue = typeof value === "string" ? value : "";
                              return (
                                !dateValue ||
                                /^(0[1-9]|1[0-2])\/\d{4}$|^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(
                                  dateValue,
                                ) || "Use MM/YYYY or DD/MM/YYYY"
                              );
                            },
                          })}
                        />
                        <div className={styles.validationSlot}>
                          {getFieldError(certExpiresPath, errors) && (
                            <span className={styles.errorText}>
                              {getFieldError(certExpiresPath, errors)}
                            </span>
                          )}
                          {!getFieldError(certExpiresPath, errors) && (
                            <span className={styles.placeholderText}>OK</span>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
        )}

        <button type="submit" className={styles.saveButton}>
          Save Languages
        </button>
      </fieldset>
    </form>
  );
}

function getFieldError(
  path: LanguageFieldPath,
  errors: FieldErrors<LanguageFormValues>,
) {
  const parts = path.split(".");
  let current: unknown = errors;
  for (const part of parts) {
    if (!current || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  if (current && typeof current === "object") {
    return (current as { message?: string }).message;
  }

  return undefined;
}

function parseDateInput(value: string): DateParts | undefined {
  const trimmed = value.trim();
  const monthYear = /^(0[1-9]|1[0-2])\/(\d{4})$/;
  const dayMonthYear = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;

  const monthYearMatch = trimmed.match(monthYear);
  if (monthYearMatch) {
    return {
      day: null,
      month: Number(monthYearMatch[1]),
      year: Number(monthYearMatch[2]),
    };
  }

  const dayMonthYearMatch = trimmed.match(dayMonthYear);
  if (dayMonthYearMatch) {
    return {
      day: Number(dayMonthYearMatch[1]),
      month: Number(dayMonthYearMatch[2]),
      year: Number(dayMonthYearMatch[3]),
    };
  }

  return undefined;
}

function formatDateValue(value: DateParts | string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  if (typeof value === "string") {
    const parsed = parseDateInput(value);
    return parsed ? formatDateValue(parsed) : value;
  }

  const month = String(value.month).padStart(2, "0");
  const year = String(value.year);

  if (value.day === null) {
    return `${month}/${year}`;
  }

  const day = String(value.day).padStart(2, "0");
  return `${day}/${month}/${year}`;
}
