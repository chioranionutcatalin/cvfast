"use client";

import { useCallback, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { FieldErrors, FieldPath } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setEducationData } from "../../store/cvSlice";
import { DateParts, EducationType } from "../../types";
import styles from "./page.module.css";

type EducationFormEntry = {
  institutionName: string;
  degreeType?: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  stillStudying?: boolean;
  description?: string;
};

type EducationFormValues = {
  educationData: EducationFormEntry[];
};

type EducationFieldPath = FieldPath<EducationFormValues>;

const emptyEducation: EducationFormEntry = {
  institutionName: "",
  degreeType: "",
  fieldOfStudy: "",
  location: "",
  startDate: "",
  endDate: "",
  stillStudying: false,
  description: "",
};

export default function EducationPage() {
  const dispatch = useAppDispatch();
  const educationData = useAppSelector((state) => state.cv.educationData);

  const defaultValues = useMemo<EducationFormValues>(() => {
    return {
      educationData: educationData.length
        ? educationData.map((entry) => ({
            ...entry,
            startDate: formatDateValue(entry.startDate as DateParts | string),
            endDate: entry.endDate
              ? formatDateValue(entry.endDate as DateParts | string)
              : "",
          }))
        : [emptyEducation],
    };
  }, [educationData]);

  const {
    register,
    control,
    getValues,
    getFieldState,
    setValue,
    watch,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<EducationFormValues>({
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: false,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "educationData",
  });

  const isFieldValid = useCallback(
    (path: EducationFieldPath, requireValue = true) => {
      const fieldState = getFieldState(path);
      const value = getValues(path) as unknown;
      const hasValue =
        !requireValue ||
        (typeof value === "string" ? value.trim() !== "" : Boolean(value));
      return (
        isSubmitted &&
        !fieldState.invalid &&
        !fieldState.error &&
        !getFieldError(path, errors) &&
        hasValue
      );
    },
    [errors, getFieldState, getValues, isSubmitted],
  );

  const handleSave = useCallback(
    (data: EducationFormValues) => {
      const mapped: EducationType[] = data.educationData
        .map((entry) => ({
          ...entry,
          institutionName: entry.institutionName.trim(),
          degreeType: entry.degreeType?.trim() || "",
          fieldOfStudy: entry.fieldOfStudy?.trim() || "",
          location: entry.location?.trim() || "",
          description: entry.description?.trim() || "",
          startDate: parseDateInput(entry.startDate) as DateParts,
          endDate: entry.endDate ? parseDateInput(entry.endDate) : undefined,
        }))
        .filter((entry) => entry.institutionName);

      dispatch(setEducationData(mapped));
    },
    [dispatch],
  );

  return (
    <form className={styles.form} onSubmit={handleSubmit(handleSave)}>
      <fieldset className={styles.educationWrapper}>
        <legend className={styles.legend}>Education</legend>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>
            Add your education history. At least one entry is required.
          </p>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => append({ ...emptyEducation })}
          >
            + Add education
          </button>
        </div>

        <div className={styles.educationList}>
          {fields.map((field, index) => {
            const institutionPath = `educationData.${index}.institutionName` as EducationFieldPath;
            const degreePath = `educationData.${index}.degreeType` as EducationFieldPath;
            const fieldPath = `educationData.${index}.fieldOfStudy` as EducationFieldPath;
            const locationPath = `educationData.${index}.location` as EducationFieldPath;
            const startPath = `educationData.${index}.startDate` as EducationFieldPath;
            const endPath = `educationData.${index}.endDate` as EducationFieldPath;
            const presentPath = `educationData.${index}.stillStudying` as EducationFieldPath;
            const descriptionPath = `educationData.${index}.description` as EducationFieldPath;

            const isPresent = Boolean(watch(presentPath));

            return (
              <section key={field.id} className={styles.educationCard}>
                <header className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>Education #{index + 1}</h3>
                  {fields.length > 1 && (
                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => remove(index)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </header>

                <div className={styles.inlineFields}>
                  <label className={styles.field}>
                    Degree / Program *
                    <input
                      className={`${styles.customInput} ${getFieldError(degreePath, errors) ? styles.inputError : ""}`}
                      placeholder="Bachelor's degree"
                      {...register(degreePath, {
                        required: "Degree or program is required",
                      })}
                    />
                    <div className={styles.validationSlot}>
                      {getFieldError(degreePath, errors) && (
                        <span className={styles.errorText}>
                          {getFieldError(degreePath, errors)}
                        </span>
                      )}
                      {!getFieldError(degreePath, errors) && isFieldValid(degreePath) && (
                        <span className={styles.validText}>OK</span>
                      )}
                      {!getFieldError(degreePath, errors) && !isFieldValid(degreePath) && (
                        <span className={styles.placeholderText}>OK</span>
                      )}
                    </div>
                  </label>
                  <label className={styles.field}>
                    Institution *
                    <input
                      className={`${styles.customInput} ${getFieldError(institutionPath, errors) ? styles.inputError : ""}`}
                      placeholder="Technical University of Cluj Napoca"
                      {...register(institutionPath, {
                        required: "Institution is required",
                      })}
                    />
                    <div className={styles.validationSlot}>
                      {getFieldError(institutionPath, errors) && (
                        <span className={styles.errorText}>
                          {getFieldError(institutionPath, errors)}
                        </span>
                      )}
                      {!getFieldError(institutionPath, errors) && isFieldValid(institutionPath) && (
                        <span className={styles.validText}>OK</span>
                      )}
                      {!getFieldError(institutionPath, errors) && !isFieldValid(institutionPath) && (
                        <span className={styles.placeholderText}>OK</span>
                      )}
                    </div>
                  </label>
                </div>

                <div className={styles.inlineFields}>
                  <label className={styles.field}>
                    Location
                    <input
                      className={styles.customInput}
                      placeholder="Romania, Cluj-Napoca"
                      {...register(locationPath)}
                    />
                    <div className={styles.validationSlot}>
                      <span className={styles.placeholderText}>OK</span>
                    </div>
                  </label>
                  <label className={styles.field}>
                    Field of Study
                    <input
                      className={styles.customInput}
                      placeholder="Automation and Applied Informatics"
                      {...register(fieldPath)}
                    />
                    <div className={styles.validationSlot}>
                      <span className={styles.placeholderText}>OK</span>
                    </div>
                  </label>
                </div>

                <div className={styles.inlineFields}>
                  <div className={styles.field}>
                    <label>
                      Start Month *
                      <input
                        className={`${styles.customInput} ${getFieldError(startPath, errors) ? styles.inputError : ""}`}
                        placeholder="MM/YYYY or DD/MM/YYYY"
                        {...register(startPath, {
                          required: "Start date is required",
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/\d{4}$|^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/,
                            message: "Use MM/YYYY or DD/MM/YYYY",
                          },
                        })}
                      />
                    </label>
                    <small>Format: MM/YYYY or DD/MM/YYYY</small>
                    <div className={styles.validationSlot}>
                      {getFieldError(startPath, errors) && (
                        <span className={styles.errorText}>
                          {getFieldError(startPath, errors)}
                        </span>
                      )}
                      {!getFieldError(startPath, errors) && isFieldValid(startPath) && (
                        <span className={styles.validText}>OK</span>
                      )}
                      {!getFieldError(startPath, errors) && !isFieldValid(startPath) && (
                        <span className={styles.placeholderText}>OK</span>
                      )}
                    </div>
                  </div>
                  <div className={styles.field}>
                    <label>
                      End Month
                      <input
                        className={styles.customInput}
                        placeholder="MM/YYYY or DD/MM/YYYY"
                        disabled={isPresent}
                        {...register(endPath, {
                          validate: (value) => {
                            if (watch(presentPath)) {
                              return true;
                            }
                            if (typeof value !== "string" || value.trim() === "") {
                              return "End date is required";
                            }
                            return (
                              /^(0[1-9]|1[0-2])\/\d{4}$|^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(
                                value,
                              ) || "Use MM/YYYY or DD/MM/YYYY"
                            );
                          },
                        })}
                      />
                    </label>
                    <small>Format: MM/YYYY or DD/MM/YYYY</small>
                    <div className={styles.validationSlot}>
                      {getFieldError(endPath, errors) && (
                        <span className={styles.errorText}>
                          {getFieldError(endPath, errors)}
                        </span>
                      )}
                      {!getFieldError(endPath, errors) && isFieldValid(endPath, false) && (
                        <span className={styles.validText}>OK</span>
                      )}
                      {!getFieldError(endPath, errors) && !isFieldValid(endPath, false) && (
                        <span className={styles.placeholderText}>OK</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className={styles.inlineFields}>
                  <div className={`${styles.field} ${styles.fullRow}`}>
                    <div className={styles.switchRow}>
                      <span>Still here</span>
                      <label className={styles.switch}>
                        <input
                          type="checkbox"
                          {...register(presentPath, {
                            onChange: (event) => {
                              const checked = event.target.checked;
                              if (checked) {
                                setValue(endPath, "", { shouldDirty: true });
                              }
                            },
                          })}
                        />
                        <span className={styles.slider} />
                      </label>
                    </div>
                  </div>
                </div>

                <label className={styles.field}>
                  Description
                  <textarea
                    className={styles.customInput}
                    placeholder="Thesis, key subjects, or honors (optional)"
                    rows={4}
                    {...register(descriptionPath)}
                  />
                  <div className={styles.validationSlot}>
                    <span className={styles.placeholderText}>OK</span>
                  </div>
                </label>
              </section>
            );
          })}
        </div>

        <button type="submit" className={styles.saveButton}>
          Save Education
        </button>
      </fieldset>
    </form>
  );
}

function getFieldError(
  path: EducationFieldPath,
  errors: FieldErrors<EducationFormValues>,
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

function formatDateValue(value: DateParts | string): string {
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
