import type { useTranslations } from "next-intl";
import * as Yup from "yup";

export interface AccountFormValues {
  displayName: string;
  phone: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type AccountTranslator = ReturnType<typeof useTranslations>;

const AVATAR_ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/gif"]);
const AVATAR_ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif"];
const AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024;
const AVATAR_MIN_DIMENSION = 400;

export type AvatarValidationErrorKey =
  | "invalidFormat"
  | "tooLarge"
  | "tooSmall"
  | "readError";

const hasAllowedExtension = (fileName: string): boolean => {
  const lowerName = fileName.toLowerCase();
  return AVATAR_ALLOWED_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
};

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    const url = URL.createObjectURL(file);

    image.onload = () => {
      resolve({ width: image.width, height: image.height });
      URL.revokeObjectURL(url);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("readError"));
    };

    image.src = url;
  });

export const validateAvatarFile = async (file: File): Promise<AvatarValidationErrorKey | null> => {
  const hasValidMimeType = AVATAR_ALLOWED_MIME_TYPES.has(file.type);
  const hasValidExtension = hasAllowedExtension(file.name);

  if (!hasValidMimeType && !hasValidExtension) {
    return "invalidFormat";
  }

  if (file.size > AVATAR_MAX_SIZE_BYTES) {
    return "tooLarge";
  }

  try {
    const { width, height } = await getImageDimensions(file);

    if (width < AVATAR_MIN_DIMENSION || height < AVATAR_MIN_DIMENSION) {
      return "tooSmall";
    }
  } catch (error) {
    return "readError";
  }

  return null;
};

export const createAccountValidationSchema = (t: AccountTranslator) =>
  Yup.object().shape({
    displayName: Yup.string()
      .trim()
      .required(t("validation.displayName.required"))
      .min(2, t("validation.displayName.minLength")),
    phone: Yup.string()
      .trim()
      .notRequired()
      .test("phone-format", t("validation.phone.invalid"), (value) => {
        if (!value) return true;
        return /^[+()\d\s-]+$/.test(value);
      }),
    email: Yup.string().trim().notRequired(),
    currentPassword: Yup.string()
      .test("current-required", t("validation.password.currentRequired"), (value, context) => {
        const { newPassword, confirmPassword } = context.parent as AccountFormValues;
        if (!newPassword && !confirmPassword) {
          return true;
        }
        return Boolean(value);
      }),
    newPassword: Yup.string()
      .test("new-required", t("validation.password.newRequired"), (value, context) => {
        const { currentPassword, confirmPassword } = context.parent as AccountFormValues;
        if (!currentPassword && !confirmPassword) {
          return true;
        }
        return Boolean(value);
      })
      .test("new-min", t("validation.password.minLength"), (value) => {
        if (!value) return true;
        return value.length >= 8;
      })
      .test("new-format", t("validation.password.letterNumber"), (value) => {
        if (!value) return true;
        return /^(?=.*[A-Za-z])(?=.*\d).+$/.test(value);
      }),
    confirmPassword: Yup.string()
      .test("confirm-required", t("validation.password.confirmRequired"), (value, context) => {
        const { newPassword } = context.parent as AccountFormValues;
        if (!newPassword) {
          return true;
        }
        return Boolean(value);
      })
      .test("confirm-match", t("validation.password.mismatch"), (value, context) => {
        const { newPassword } = context.parent as AccountFormValues;
        if (!newPassword) {
          return true;
        }
        return value === newPassword;
      }),
  });
