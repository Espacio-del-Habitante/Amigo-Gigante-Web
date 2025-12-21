import * as Yup from "yup";

export interface RegisterFormValues {
  foundationName: string;
  officialEmail: string;
  taxId: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export const registerValidationSchema = Yup.object().shape({
  foundationName: Yup.string()
    .trim()
    .required("El nombre de la fundación es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  officialEmail: Yup.string()
    .trim()
    .required("El email oficial es requerido")
    .email("El email debe tener un formato válido"),
  taxId: Yup.string()
    .trim()
    .notRequired()
    .test(
      "tax-id-format",
      "El Tax ID solo puede incluir letras, números y guiones",
      (value) => {
        if (!value) return true;
        return /^[A-Za-z0-9-]+$/.test(value);
      },
    ),
  password: Yup.string()
    .required("La contraseña es requerida")
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  confirmPassword: Yup.string()
    .required("Debes confirmar la contraseña")
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden"),
  acceptTerms: Yup.boolean()
    .required("Debes aceptar los términos y condiciones")
    .oneOf([true], "Debes aceptar los términos y condiciones"),
});
