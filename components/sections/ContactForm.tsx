"use client";

import {
  EnvelopeSimple,
  MapPin,
  MapPinArea,
} from "@phosphor-icons/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { contactContent } from "@/lib/homepage-data";
import { cn } from "@/lib/utils";

type FormState = {
  fullName: string;
  email: string;
  company: string;
  message: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  company: "",
  message: "",
};

function FormField({
  label,
  name,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (name: keyof FormState, value: string) => void;
  multiline?: boolean;
}) {
  const sharedClasses =
    "min-h-11 w-full rounded-lg border border-border-default bg-surface-page px-4 text-body-medium text-text-primary placeholder:text-text-tertiary focus:border-border-focus focus:outline-none";

  return (
    <label className="flex flex-col gap-2">
      <span className="sr-only">{label}</span>
      {multiline ? (
        <textarea
          name={name}
          placeholder={label}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          rows={5}
          className={cn(sharedClasses, "h-[148px] resize-none py-3")}
        />
      ) : (
        <input
          type={name === "email" ? "email" : "text"}
          name={name}
          placeholder={label}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={sharedClasses}
        />
      )}
    </label>
  );
}

export function ContactForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <form
      data-testid="contact-form"
      onSubmit={handleSubmit}
      className="relative z-10 flex w-full min-w-0 flex-col gap-6"
    >
      <div className="flex flex-col gap-4 lg:gap-3">
        <FormField
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />
        <FormField
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <FormField
          label="Company"
          name="company"
          value={form.company}
          onChange={handleChange}
        />
        <FormField
          label="Describe your project ..."
          name="message"
          value={form.message}
          onChange={handleChange}
          multiline
        />
      </div>
      <Button type="submit" variant="inverse" className="h-11 min-h-11 w-full justify-center pl-4 pr-3">
        {submitted ? "Request Sent" : contactContent.submitLabel}
      </Button>
    </form>
  );
}

export function ContactInfo() {
  return (
    <div className="relative z-10 flex w-full min-w-0 flex-col gap-8 sm:gap-[60px] lg:max-w-[351px]">
      <div className="flex flex-col gap-3 lg:gap-4">
        <p className="text-code text-text-secondary">
          {contactContent.eyebrow}
        </p>
        <h2 className="text-display-m">
          <span className="text-primary-500 block">
            {contactContent.headline[0]}
          </span>
          <span className="text-text-primary block">
            {contactContent.headline[1]}
          </span>
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <EnvelopeSimple
              size={16}
              weight="duotone"
              color="var(--color-text-tertiary)"
              aria-hidden
            />
            <span className="text-label-medium text-text-tertiary">Email</span>
          </div>
          <a
            href={`mailto:${contactContent.email}`}
            className="text-body-medium text-text-primary hover:text-text-brand inline-flex min-h-11 items-center break-all"
          >
            {contactContent.email}
          </a>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <MapPin
              size={16}
              weight="duotone"
              color="var(--color-text-tertiary)"
              aria-hidden
            />
            <span className="text-label-medium text-text-tertiary">ODC</span>
          </div>
          <p className="text-body-medium text-text-primary">
            {contactContent.odc}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <MapPinArea
              size={16}
              weight="duotone"
              color="var(--color-text-tertiary)"
              aria-hidden
            />
            <span className="text-label-medium text-text-tertiary">
              Head Quarter
            </span>
          </div>
          <p className="text-body-medium text-text-primary">
            {contactContent.hq}
          </p>
        </div>
      </div>
    </div>
  );
}
