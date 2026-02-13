"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { updatePersonalData } from "../../store/cvSlice";
import { PersonalDataType } from "../../../app/types";
import styles from "./page.module.css";

export default function PersonalPage() {
  const dispatch = useAppDispatch();
  const personalData = useAppSelector((state) => state.cv.personalData);
  const [isHydrated, setIsHydrated] = useState(false);

  const {
    register,
    getValues,
    getFieldState,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<PersonalDataType>({
    defaultValues: personalData,
    mode: "onSubmit",
    reValidateMode: "onChange",
    shouldFocusError: false,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isFieldValid = useCallback(
    (name: keyof PersonalDataType) => {
      const fieldState = getFieldState(name);
      const value = getValues(name);
      const hasValue = typeof value === "string" ? value.trim() !== "" : Boolean(value);
      return isSubmitted && !fieldState.invalid && !fieldState.error && !errors[name] && hasValue;
    },
    [errors, getFieldState, getValues, isSubmitted],
  );

  const handleImageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        dispatch(updatePersonalData({ profileImageUrl: undefined }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        dispatch(updatePersonalData({ profileImageUrl: result || undefined }));
      };
      reader.readAsDataURL(file);
    },
    [dispatch],
  );

  const handleRemoveImage = useCallback(() => {
    dispatch(updatePersonalData({ profileImageUrl: undefined }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [dispatch]);

  const handleSave = useCallback(() => {
    const data = getValues();
    dispatch(updatePersonalData({
      ...data,
      profileImageUrl: personalData.profileImageUrl,
    }));
  }, [dispatch, getValues, personalData.profileImageUrl]);

  const handleInvalid = useCallback(() => {
    const data = getValues();
    dispatch(updatePersonalData({
      ...data,
      profileImageUrl: personalData.profileImageUrl,
    }));
  }, [dispatch, getValues, personalData.profileImageUrl]);

  return (
    <form
      noValidate
      className={styles.form}
      onSubmit={handleSubmit(handleSave, handleInvalid)}
    >
      <fieldset className={styles.personalWrapper}>
        <legend className={styles.legend}>Personal Info</legend>
        <div className={styles.cardBody}>
          <div className={styles.detailsCard}>
            <div className={styles.formColumn}>
              <div className={styles.inlineFields}>
                <label className={styles.field}>
                  First Name *
                  <input
                    className={`${styles.customInput} ${errors.firstName ? styles.inputError : ""}`}
                    placeholder="First Name"
                    {...register("firstName", {
                      required: "First name is required",
                      pattern: {
                        value: /^[A-Za-z][A-Za-z '.-]*$/,
                        message: "Letters only",
                      },
                    })}
                  />
                  <div className={styles.validationSlot}>
                    {errors.firstName && (
                      <span className={styles.errorText}>{errors.firstName.message}</span>
                    )}
                    {!errors.firstName && isFieldValid("firstName") && (
                      <span className={styles.validText}>OK</span>
                    )}
                    {!errors.firstName && !isFieldValid("firstName") && (
                      <span className={styles.placeholderText}>OK</span>
                    )}
                  </div>
                </label>
                <label className={styles.field}>
                  Last Name *
                  <input
                    className={`${styles.customInput} ${errors.lastName ? styles.inputError : ""}`}
                    placeholder="Last Name"
                    {...register("lastName", {
                      required: "Last name is required",
                      pattern: {
                        value: /^[A-Za-z][A-Za-z '.-]*$/,
                        message: "Letters only",
                      },
                    })}
                  />
                  <div className={styles.validationSlot}>
                    {errors.lastName && (
                      <span className={styles.errorText}>{errors.lastName.message}</span>
                    )}
                    {!errors.lastName && isFieldValid("lastName") && (
                      <span className={styles.validText}>OK</span>
                    )}
                    {!errors.lastName && !isFieldValid("lastName") && (
                      <span className={styles.placeholderText}>OK</span>
                    )}
                  </div>
                </label>
              </div>

              <label className={styles.field}>
                Desired Job Title
                <input
                  className={styles.customInput}
                  placeholder="Role"
                  {...register("desiredJobTitle", {
                    required: false,
                  })}
                />
              </label>

              <label className={styles.field}>
                Professional Summary / Objective
                <textarea
                  className={styles.customInput}
                  placeholder="Summary"
                  rows={4}
                  {...register("summary", {
                    required: false,
                  })}
                />
              </label>

              <div className={styles.inlineFields}>
                <label className={styles.field}>
                  Email *
                  <input
                    type="email"
                    className={`${styles.customInput} ${errors.email ? styles.inputError : ""}`}
                    placeholder="Email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /.+@.+\..+/, 
                        message: "Enter a valid email",
                      },
                    })}
                  />
                  <div className={styles.validationSlot}>
                    {errors.email && (
                      <span className={styles.errorText}>{errors.email.message}</span>
                    )}
                    {!errors.email && isFieldValid("email") && (
                      <span className={styles.validText}>OK</span>
                    )}
                    {!errors.email && !isFieldValid("email") && (
                      <span className={styles.placeholderText}>OK</span>
                    )}
                  </div>
                </label>
                <label className={styles.field}>
                  Phone
                  <input
                    type="tel"
                    className={`${styles.customInput} ${errors.phone ? styles.inputError : ""}`}
                    placeholder="Phone"
                    {...register("phone", {
                      required: "Phone is required",
                      validate: value =>
                        value === "" || /^\d+$/.test(value) || "Numbers only",
                    })}
                  />
                  <div className={styles.validationSlot}>
                    {errors.phone && (
                      <span className={styles.errorText}>{errors.phone.message}</span>
                    )}
                    {!errors.phone && isFieldValid("phone") && (
                      <span className={styles.validText}>OK</span>
                    )}
                    {!errors.phone && !isFieldValid("phone") && (
                      <span className={styles.placeholderText}>OK</span>
                    )}
                  </div>
                </label>
              </div>

              <div className={styles.inlineFields}>
                <label className={styles.field}>
                  Country *
                  <input
                    className={`${styles.customInput} ${errors.country ? styles.inputError : ""}`}
                    placeholder="Country"
                    {...register("country", {
                      required: "Country is required",
                    })}
                  />
                  <div className={styles.validationSlot}>
                    {errors.country && (
                      <span className={styles.errorText}>{errors.country.message}</span>
                    )}
                    {!errors.country && isFieldValid("country") && (
                      <span className={styles.validText}>OK</span>
                    )}
                    {!errors.country && !isFieldValid("country") && (
                      <span className={styles.placeholderText}>OK</span>
                    )}
                  </div>
                </label>
                <label className={styles.field}>
                  City *
                  <input
                    className={`${styles.customInput} ${errors.city ? styles.inputError : ""}`}
                    placeholder="City"
                    {...register("city", {
                      required: "City is required",
                    })}
                  />
                  <div className={styles.validationSlot}>
                    {errors.city && (
                      <span className={styles.errorText}>{errors.city.message}</span>
                    )}
                    {!errors.city && isFieldValid("city") && (
                      <span className={styles.validText}>OK</span>
                    )}
                    {!errors.city && !isFieldValid("city") && (
                      <span className={styles.placeholderText}>OK</span>
                    )}
                  </div>
                </label>
              </div>

              <label className={styles.field}>
                LinkedIn URL
                <input
                  type="url"
                  className={`${styles.customInput} ${errors.linkedInUrl ? styles.inputError : ""}`}
                  placeholder="LinkedIn URL"
                  {...register("linkedInUrl", {
                    required: false,
                    validate: value =>
                      !value ||
                      /^(https?:\/\/|www\.)/.test(value) ||
                      "Must start with https:// or www.",
                  })}
                />
                <div className={styles.validationSlot}>
                  {errors.linkedInUrl && (
                    <span className={styles.errorText}>{errors.linkedInUrl.message}</span>
                  )}
                  {!errors.linkedInUrl && isFieldValid("linkedInUrl") && (
                    <span className={styles.validText}>OK</span>
                  )}
                  {!errors.linkedInUrl && !isFieldValid("linkedInUrl") && (
                    <span className={styles.placeholderText}>OK</span>
                  )}
                </div>
              </label>

              <label className={styles.field}>
                Personal Website
                <input
                  type="url"
                  className={styles.customInput}
                  placeholder="Personal Website"
                  {...register("personalWebsite", {
                    required: false,
                  })}
                />
              </label>

              <label className={styles.field}>
                Driver License Category
                <input
                  className={styles.customInput}
                  placeholder="Driver License Category"
                  {...register("driverLicenseCategory", {
                    required: false,
                  })}
                />
              </label>
            </div>
          </div>
          <div className={styles.divider} />
          <aside className={styles.photoColumn}>
            <div className={styles.rightBox}>
              <div className={styles.photoCard}>
                <div className={styles.photoTitle}>Profile Photo</div>
                <div className={styles.photoPreview}>
                  {isHydrated && personalData.profileImageUrl ? (
                    <img
                      className={styles.photoImage}
                      src={personalData.profileImageUrl}
                      alt="Profile"
                    />
                  ) : (
                    <div className={styles.photoPlaceholder}>No image</div>
                  )}
                </div>
                <div className={styles.photoActions}>
                  <label className={styles.uploadButton}>
                    Upload photo
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={handleImageChange}
                    />
                  </label>

                  {personalData.profileImageUrl && (
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </button>
                  )}
                  <div className={styles.validationSlot}>
                    {isFieldValid("profileImageUrl") && (
                      <span className={styles.validText}>OK</span>
                    )}
                    {!isFieldValid("profileImageUrl") && (
                      <span className={styles.placeholderText}>OK</span>
                    )}
                  </div>
                </div>
                <p className={styles.photoHint}>
                  Recommended: square image at least 400x400px.
                </p>
              </div>
              <button type="submit">
                Save Information
              </button>
            </div>
          </aside>
        </div>
      </fieldset>
    </form>
  );
}


