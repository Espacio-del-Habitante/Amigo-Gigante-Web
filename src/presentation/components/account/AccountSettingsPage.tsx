"use client";

import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useLocale, useTranslations } from "next-intl";
import NextLink from "next/link";
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
import { AccountFormValues, createAccountValidationSchema } from "@/presentation/components/account/accountValidation";
import { ConfirmDialog } from "@/presentation/components/atoms/ConfirmDialog";

interface ProfileMeta {
  id: string;
  email: string;
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
  const [profileMeta, setProfileMeta] = useState<ProfileMeta>({ id: "", email: "" });
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
      setProfileMeta({ id: profile.id, email: profile.email });
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
          values.phone.trim() !== initialValues.phone.trim();

        let updatedProfile: UserProfile | null = null;

        if (profileChangesDetected) {
          const payload: UserProfile = {
            id: profileMeta.id,
            email: profileMeta.email,
            displayName: values.displayName.trim(),
            phone: values.phone.trim() || null,
          };

          updatedProfile = await updateUserProfileUseCase.execute(payload);
          setProfileMeta({
            id: updatedProfile.id,
            email: updatedProfile.email,
          });
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

  const handleCancel = () => {
    setSubmitSuccess(null);
    setSubmitError(null);

    if (!formik.dirty) {
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
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-72 flex-col border-r border-neutral-200 bg-white px-6 py-8 md:flex">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white">
            <span className="material-symbols-outlined">pets</span>
          </div>
          <div className="text-lg font-extrabold leading-tight text-neutral-900">
            {t("sidebar.brand.name")} <span className="text-brand-500">{t("sidebar.brand.accent")}</span>
          </div>
        </div>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-lg font-semibold text-neutral-700">
            {formik.values.displayName.trim().slice(0, 1).toUpperCase() || "?"}
          </div>
          <div className="min-w-0">
            <Typography variant="subtitle2" className="truncate font-semibold text-neutral-900">
              {formik.values.displayName || t("sidebar.fallbackName")}
            </Typography>
            <Typography variant="caption" className="text-neutral-500">
              {t("sidebar.subtitle")}
            </Typography>
          </div>
        </div>
        <nav className="flex flex-col gap-2">
          <NextLink
            href={`/${locale}/account`}
            className="flex items-center gap-3 rounded-lg bg-brand-50 px-3 py-2 text-brand-600"
          >
            <span className="material-symbols-outlined">person</span>
            <span className="text-sm font-semibold">{t("sidebar.account")}</span>
          </NextLink>
          <NextLink
            href={`/${locale}/account/adoptions`}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
          >
            <span className="material-symbols-outlined">pets</span>
            <span className="text-sm font-medium">{t("sidebar.requests")}</span>
          </NextLink>
        </nav>
      </aside>

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
          <AccountProfilePicture t={t} displayName={formik.values.displayName} />
          <AccountPersonalInfo t={t} formik={formik} isLoading={isLoading} />
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
    </div>
  );
}
