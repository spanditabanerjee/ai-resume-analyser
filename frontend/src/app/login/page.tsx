import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in | Resume Analyzer",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <LoginForm />
    </div>
  );
}
