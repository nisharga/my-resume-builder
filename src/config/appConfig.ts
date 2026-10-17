import { colors } from "@/styles/colors";
import { Briefcase, FileText, LayoutTemplate, type LucideIcon } from "lucide-react-native";

// ─── App ──────────────────────────────────────────────────────────────────────

export const APP_NAME = "My Resume Builder";
export const SPLASH_TITLE = "CV Builder";
export const SPLASH_TAGLINE = "Create Professional CVs in Minutes";

// ─── Onboarding ───────────────────────────────────────────────────────────────

export type Slide = {
  Icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
};

export const ONBOARDING_SLIDES: Slide[] = [
  {
    Icon: FileText,
    iconBg: colors.accent,
    iconColor: colors.primary,
    title: "Build Your CV",
    description: "Create stunning professional resumes in minutes with our easy-to-use builder.",
  },
  {
    Icon: LayoutTemplate,
    iconBg: "#FFF7ED",
    iconColor: colors.warning,
    title: "Choose a Template",
    description: "Pick from professionally designed templates that make you stand out.",
  },
  {
    Icon: Briefcase,
    iconBg: "#F0FDF4",
    iconColor: colors.success,
    title: "Get Hired",
    description: "Download and share your CV to land your dream job.",
  },
];

export const ONBOARDING_BTN_NEXT = "Next";
export const ONBOARDING_BTN_GET_STARTED = "Get Started";
export const ONBOARDING_BTN_SKIP = "Skip";

// ─── Auth shared ──────────────────────────────────────────────────────────────

export const AUTH_EMAIL_LABEL = "Email";
export const AUTH_EMAIL_PLACEHOLDER = "Enter your email";
export const AUTH_PASSWORD_LABEL = "Password";
export const AUTH_PASSWORD_PLACEHOLDER = "Enter your password";
export const AUTH_OR = "Or";
export const AUTH_SOCIAL_GOOGLE = "Google";
export const AUTH_SOCIAL_APPLE = "Apple";

// ─── Login ────────────────────────────────────────────────────────────────────

export const LOGIN_TITLE = "Welcome Back";
export const LOGIN_SUBTITLE = "Login to access your resume builder.";
export const LOGIN_BTN = "Log In";
export const LOGIN_FORGOT_PASSWORD = "Forgot Password?";
export const LOGIN_NO_ACCOUNT = "Don't have an account?";
export const LOGIN_CREATE_ACCOUNT = "Create one";

// ─── Sign Up ──────────────────────────────────────────────────────────────────

export const SIGNUP_TITLE = "Create Account";
export const SIGNUP_SUBTITLE = "Create your account to get started.";
export const SIGNUP_CONFIRM_PASSWORD_LABEL = "Confirm Password";
export const SIGNUP_CONFIRM_PASSWORD_PLACEHOLDER = "Confirm your password";
export const SIGNUP_BTN = "Create Account";
export const SIGNUP_TERMS_PREFIX = "I agree to the ";
export const SIGNUP_TERMS_LABEL = "Terms and Conditions";
export const SIGNUP_TERMS_URL = "https://example.com/terms";
export const SIGNUP_PRIVACY_AND = " and ";
export const SIGNUP_PRIVACY_LABEL = "Privacy Policy";
export const SIGNUP_PRIVACY_URL = "https://example.com/privacy";
export const SIGNUP_HAS_ACCOUNT = "Already have an account?";
export const SIGNUP_LOGIN_LINK = "Log in";

// ─── Forgot Password ─────────────────────────────────────────────────────────

export const FORGOT_EMAIL_TITLE = "Sign In";
export const FORGOT_EMAIL_SUBTITLE = "Enter your email and we'll send you a login code.";
export const FORGOT_BTN_SEND = "Send Code";
export const FORGOT_BTN_SENDING = "Sending...";
export const FORGOT_OTP_TITLE = "Enter Code";
export const FORGOT_OTP_SUBTITLE = "We sent a 6-digit code to";
export const FORGOT_BTN_VERIFY = "Verify Code";
export const FORGOT_BTN_VERIFYING = "Verifying...";
export const FORGOT_CHANGE_EMAIL = "Change Email";
export const FORGOT_RESEND_CODE = "Resend Code";
export const FORGOT_OTP_ERROR = "Please enter the complete 4-digit code";
export const FORGOT_TOAST_CODE_SENT = (email: string) => `A login code was sent to ${email}`;
export const FORGOT_TOAST_SEND_FAILED = "Failed to send code. Please try again.";
export const FORGOT_TOAST_LOGIN_SUCCESS = "You have successfully logged in.";
export const FORGOT_TOAST_VERIFY_FAILED = "Invalid code. Please try again.";
