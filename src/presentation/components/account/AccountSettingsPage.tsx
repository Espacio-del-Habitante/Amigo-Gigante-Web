"use client";

import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { UserProfile } from "@/domain/models/UserProfile";
import { ChangePasswordUseCase } from "@/domain/usecases/account/ChangePasswordUseCase";
import { DeleteUserAccountUseCase } from "@/domain/usecases/account/DeleteUserAccountUseCase";
import { GetUserProfileUseCase } from "@/domain/usecases/account/GetUserProfileUseCase";
import { UpdateUserProfileUseCase } from "@/domain/usecases/account/UpdateUserProfileUseCase";
import { appContainer } from "@/infrastructure/ioc/container";
import { USE_CASE_TYPES } from "@/infrastructure/ioc/usecases/usecases.types";
import { AccountDeleteSection } from "@/presentation/components/account/AccountDeleteSection";
import { AccountPersonalInfo } from "@/presentation/components/account/AccountPersonalInfo";
import { AccountProfilePicture } from "@/presentation/components/account/AccountProfilePicture";
import { AccountSecurity } from "@/presentation/components/account/AccountSecurity";
import {
  AccountFormValues,
  createAccountValidationSchema,
  validateAvatarFile,
} from "@/presentation/components/account/accountValidation";
import { ConfirmDialog } from "@/presentation/components/atoms/ConfirmDialog";

interface ProfileMeta {
  id: string;
  email: string;
  avatarUrl: string | null;
}

const emptyProfileValues: AccountFormValues = {
  displayName: "",
  phone: "",
  email: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const errorMessageKeyList = [
  "account.errors.unauthorized",
  "account.errors.profileLoadFailed",
  "account.errors.profileUpdateFailed",
  "account.errors.passwordUpdateFailed",
  "account.errors.currentPasswordInvalid",
  "account.errors.deleteFailed",
  "account.photo.errors.invalidFormat",
  "account.photo.errors.tooLarge",
  "account.photo.errors.tooSmall",
  "account.photo.errors.uploadFailed",
  "account.photo.errors.removeFailed",
] as const;

type AccountErrorMessageKey = (typeof errorMessageKeyList)[number];

const errorMessageKeys = new Set<AccountErrorMessageKey>(errorMessageKeyList);

export function AccountSettingsPage() {
  const t = useTranslations("account");
  const locale = useLocale();
  const router = useRouter();

  const getUserProfileUseCase = useMemo(
    () => appContainer.get<GetUserProfileUseCase>(USE_CASE_TYPES.GetUserProfileUseCase),
    [],
  );
  const updateUserProfileUseCase = useMemo(
    () => appContainer.get<UpdateUserProfileUseCase>(USE_CASE_TYPES.UpdateUserProfileUseCase),
    [],
  );
  const changePasswordUseCase = useMemo(
    () => appContainer.get<ChangePasswordUseCase>(USE_CASE_TYPES.ChangePasswordUseCase),
    [],
  );
  const deleteUserAccountUseCase = useMemo(
    () => appContainer.get<DeleteUserAccountUseCase>(USE_CASE_TYPES.DeleteUserAccountUseCase),
    [],
  );

  const [initialValues, setInitialValues] = useState<AccountFormValues>(emptyProfileValues);
  const [profileMeta, setProfileMeta] = useState<ProfileMeta>({ id: "", email: "", avatarUrl: null });
  const [initialAvatarUrl, setInitialAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const resolveErrorMessage = (error: unknown) => {
    if (error instanceof Error) {
      const key = error.message as AccountErrorMessageKey;
      if (errorMessageKeys.has(key)) {
        return t(key.replace("account.", ""));
      }
    }

    return t("errors.generic");
  };

  const loadProfile = async () => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const profile = await getUserProfileUseCase.execute();
      setInitialValues({
        displayName: profile.displayName,
        phone: profile.phone ?? "",
        email: profile.email,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setProfileMeta({ id: profile.id, email: profile.email, avatarUrl: profile.avatarUrl });
      setInitialAvatarUrl(profile.avatarUrl);
      setAvatarFile(null);
      setAvatarError(null);
    } catch (error) {
      setSubmitError(resolveErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadProfile();
  }, []);

  const formik = useFormik<AccountFormValues>({
    initialValues,
    validationSchema: createAccountValidationSchema(t),
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: async (values, helpers) => {
      setSubmitError(null);
      setSubmitSuccess(null);

      try {
        const profileChangesDetected =
          values.displayName.trim() !== initialValues.displayName.trim() ||
          values.phone.trim() !== initialValues.phone.trim() ||
          Boolean(avatarFile) ||
          profileMeta.avatarUrl !== initialAvatarUrl;

        let updatedProfile: UserProfile | null = null;

        if (profileChangesDetected) {
          const payload: UserProfile & { avatarFile?: File | null } = {
            id: profileMeta.id,
            email: profileMeta.email,
            displayName: values.displayName.trim(),
            phone: values.phone.trim() || null,
            avatarUrl: profileMeta.avatarUrl,
            avatarFile,
          };

          updatedProfile = await updateUserProfileUseCase.execute(payload);
          setProfileMeta({
            id: updatedProfile.id,
            email: updatedProfile.email,
            avatarUrl: updatedProfile.avatarUrl,
          });
          setInitialAvatarUrl(updatedProfile.avatarUrl);
          setAvatarFile(null);
        }

        const wantsPasswordChange = Boolean(
          values.currentPassword || values.newPassword || values.confirmPassword,
        );

        if (wantsPasswordChange) {
          await changePasswordUseCase.execute({
            currentPassword: values.currentPassword,
            newPassword: values.newPassword,
          });
        }

        const nextValues: AccountFormValues = {
          displayName: updatedProfile?.displayName ?? values.displayName,
          phone: updatedProfile?.phone ?? values.phone,
          email: updatedProfile?.email ?? values.email,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        };

        setInitialValues(nextValues);
        helpers.resetForm({ values: nextValues });

        if (profileChangesDetected && wantsPasswordChange) {
          setSubmitSuccess(t("feedback.saveAndPasswordSuccess"));
        } else if (profileChangesDetected) {
          setSubmitSuccess(t("feedback.saveSuccess"));
        } else if (wantsPasswordChange) {
          setSubmitSuccess(t("feedback.passwordSuccess"));
        }
      } catch (error) {
        setSubmitError(resolveErrorMessage(error));
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const handleAvatarSelect = async (file: File) => {
    setAvatarError(null);

    const errorKey = await validateAvatarFile(file);

    if (errorKey) {
      setAvatarError(t(`photo.errors.${errorKey}`));
      setAvatarFile(null);
      return;
    }

    setAvatarFile(file);
  };

  const handleAvatarRemove = () => {
    setAvatarError(null);
    setAvatarFile(null);
    setProfileMeta((current) => ({ ...current, avatarUrl: null }));
  };

  const handleCancel = () => {
    setSubmitSuccess(null);
    setSubmitError(null);

    if (!formik.dirty && !avatarFile && profileMeta.avatarUrl === initialAvatarUrl) {
      return;
    }

    setShowDiscardDialog(true);
  };

  const handleDiscardConfirm = async () => {
    setShowDiscardDialog(false);
    await loadProfile();
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setSubmitError(null);

    try {
      await deleteUserAccountUseCase.execute();
      router.replace(`/${locale}`);
    } catch (error) {
      setSubmitError(resolveErrorMessage(error));
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <header>
        <Typography variant="h4" className="font-black text-neutral-900">
          {t("title")}
        </Typography>
        <Typography variant="body1" className="mt-2 text-neutral-600">
          {t("subtitle")}
        </Typography>
      </header>

      {isLoading && (
        <Box className="flex items-center gap-3 text-neutral-600">
          <CircularProgress size={20} />
          <Typography variant="body2">{t("status.loading")}</Typography>
        </Box>
      )}

      {submitError && (
        <Alert severity="error" className="font-semibold">
          {submitError}
        </Alert>
      )}

      {submitSuccess && (
        <Alert severity="success" className="font-semibold">
          {submitSuccess}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
        <AccountPersonalInfo t={t} formik={formik} isLoading={isLoading} />
        <AccountProfilePicture
          t={t}
          displayName={formik.values.displayName}
          avatarUrl={profileMeta.avatarUrl}
          isLoading={formik.isSubmitting || isLoading}
          errorMessage={avatarError}
          onSelect={handleAvatarSelect}
          onRemove={handleAvatarRemove}
        />
        <AccountSecurity t={t} formik={formik} isLoading={isLoading} />

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outlined"
            className="border-neutral-300 text-neutral-700 hover:border-neutral-400"
            type="button"
            fullWidth
            disabled={formik.isSubmitting || isLoading}
            onClick={handleCancel}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            variant="contained"
            className="bg-brand-500 text-white hover:bg-brand-600"
            type="submit"
            fullWidth
            disabled={formik.isSubmitting || isLoading}
            startIcon={formik.isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {formik.isSubmitting ? t("buttons.saving") : t("buttons.save")}
          </Button>
        </div>
      </form>

      <AccountDeleteSection
        t={t}
        onDelete={() => setShowDeleteDialog(true)}
        isLoading={formik.isSubmitting || isLoading || isDeleting}
      />

      <ConfirmDialog
        open={showDiscardDialog}
        title={t("dialog.discard.title")}
        description={t("dialog.discard.description")}
        confirmLabel={t("dialog.discard.confirm")}
        cancelLabel={t("dialog.discard.cancel")}
        onConfirm={handleDiscardConfirm}
        onClose={() => setShowDiscardDialog(false)}
      />

      <ConfirmDialog
        open={showDeleteDialog}
        title={t("dialog.delete.title")}
        description={t("dialog.delete.description")}
        confirmLabel={t("dialog.delete.confirm")}
        cancelLabel={t("dialog.delete.cancel")}
        onConfirm={handleDeleteConfirm}
        onClose={() => setShowDeleteDialog(false)}
      />
    </div>
  );
}
