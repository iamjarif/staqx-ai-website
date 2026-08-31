"use client";

import { CheckCircle } from "@phosphor-icons/react/dist/ssr/CheckCircle";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr/EnvelopeSimple";
import { MapPin } from "@phosphor-icons/react/dist/ssr/MapPin";
import { MapPinArea } from "@phosphor-icons/react/dist/ssr/MapPinArea";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
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
          maxLength={name === "message" ? 5000 : undefined}
          className={cn(sharedClasses, "h-[148px] resize-none py-3")}
        />
      ) : (
        <input
          type={name === "email" ? "email" : "text"}
          name={name}
          placeholder={label}
          value={value}
          maxLength={name === "email" ? 254 : name === "company" ? 200 : 120}
          onChange={(e) => onChange(name, e.target.value)}
          className={sharedClasses}
        />
      )}
    </label>
  );
}

const formPanelTransition = {
  duration: 0.45,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function ContactForm() {
  const shouldReduceMotion = useReducedMotion();
  const [form, setForm] = useState<FormState>(initialState);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  const panelMotion = shouldReduceMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
      }
    : {
        initial: { opacity: 0, y: 16, filter: "blur(8px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -12, filter: "blur(8px)" },
      };

  const handleChange = (name: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (status === "error") {
      setStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });

      const data = (await response.json().catch(() => null)) as
        | { error?: string; code?: string; debug?: string }
        | null;

      if (!response.ok) {
        console.error("[contact-form] submission failed", {
          status: response.status,
          code: data?.code,
          debug: data?.debug,
        });
        setStatus("error");
        setErrorMessage(
          data?.error ?? "Unable to send your message. Please try again."
        );
        return;
      }

      setStatus("success");
      setForm(initialState);
      setWebsite("");
    } catch {
      setStatus("error");
      setErrorMessage("Unable to send your message. Please try again.");
    }
  };

  const handleSendAnother = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  return (
    <div className="relative z-10 w-full min-w-0">
      <AnimatePresence mode="wait" initial={false}>
        {status === "success" ? (
          <motion.div
            key="contact-success"
            role="status"
            aria-live="polite"
            className="flex min-h-[384px] flex-col justify-center gap-8"
            transition={formPanelTransition}
            {...panelMotion}
          >
            <div className="flex flex-col gap-5">
              <div className="flex size-14 items-center justify-center rounded-full bg-border-subtle">
                <CheckCircle
                  size={28}
                  weight="duotone"
                  color="var(--color-primary-500)"
                  aria-hidden
                />
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-heading-h4 text-text-primary">
                  Thank you.
                </h3>
                <p className="text-body-medium text-text-tertiary max-w-[420px] leading-[1.7]">
                  Your message is on its way. We’ll review your project details
                  and get back to you shortly.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="inverse"
              className="h-11 min-h-11 w-full justify-center pl-4 pr-3"
              onClick={handleSendAnother}
            >
              Send another email
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="contact-form"
            data-testid="contact-form"
            onSubmit={handleSubmit}
            className="flex min-h-[384px] w-full flex-col gap-6"
            transition={formPanelTransition}
            {...panelMotion}
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
              <div aria-hidden className="absolute -left-[10000px] h-px w-px overflow-hidden">
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                  />
                </label>
              </div>
            </div>
            <Button
              type="submit"
              variant="inverse"
              className="h-11 min-h-11 w-full justify-center pl-4 pr-3"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : contactContent.submitLabel}
            </Button>
            {status === "error" ? (
              <p className="text-body-small text-error-text" role="alert">
                {errorMessage}
              </p>
            ) : null}
          </motion.form>
        )}
      </AnimatePresence>
    </div>
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
