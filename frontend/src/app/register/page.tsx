import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register | Resume Analyzer",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <RegisterForm />
    </div>
  );
}
