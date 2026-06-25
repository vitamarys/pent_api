'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";
import Container from "@/components/ui/Container";
import s from "./ProjectForm.module.scss";

const schema = z.object({
  name:    z.string().min(1, "Name is required"),
  email:   z.string().min(1, "Email is required").email("Invalid email"),
  phone:   z.string().min(1, "Phone is required"),
  consent: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export interface AgentInfo {
  name:  string;
  role:  string;
  image: string;
}

export interface ProjectFormProps {
  sectionTitle?:  string;
  description?:   string;
  submitLabel?:   string;
  privacyNote?:   string;
  consentLabel?:  string;
  agent?:         AgentInfo;
  onSubmit?:      (data: FormValues) => Promise<void> | void;
}

export default function ProjectForm({
  sectionTitle = "Have any questions about this property?",
  description  = "Leave your details, and a project manager will answer all your questions",
  submitLabel  = "Check Availability",
  privacyNote  = "By accepting and providing my personal information i am consenting to Metropolitan Group Privacy Policy, the applicable data protection laws and Terms of Use",
  consentLabel = "I agree to receive information about offers, deals and services from this website (optional)",
  agent,
  onSubmit,
}: ProjectFormProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const consent = watch("consent");

  const submit = async (data: FormValues) => {
    await onSubmit?.(data);
  };

  return (
    <section className={s.section}>
      <Container className={s.inner}>

      {/* Left: form panel */}
      <div className={s.formPanel}>
        <div className={s.formHeader}>
          <h2 className={s.sectionTitle}>{sectionTitle}</h2>
          <p className={s.description}>{description}</p>
        </div>

        <form className={s.form} onSubmit={handleSubmit(submit)} noValidate>
          <div className={s.fields}>

            <div className={s.fieldWrap}>
              <input
                className={`${s.input} ${errors.name ? s.inputError : ""}`}
                placeholder="Full name"
                {...register("name")}
              />
              {errors.name && <span className={s.error}>{errors.name.message}</span>}
            </div>

            <div className={s.fieldWrap}>
              <input
                className={`${s.input} ${errors.email ? s.inputError : ""}`}
                placeholder="Email address"
                type="email"
                {...register("email")}
              />
              {errors.email && <span className={s.error}>{errors.email.message}</span>}
            </div>

            <div className={s.fieldWrap}>
              <input
                className={`${s.input} ${errors.phone ? s.inputError : ""}`}
                placeholder="+1 (000) 000-00-00"
                type="tel"
                {...register("phone")}
              />
              {errors.phone && <span className={s.error}>{errors.phone.message}</span>}
            </div>

            <label className={s.checkboxRow}>
              <button
                type="button"
                className={`${s.checkbox} ${consent ? s.checkboxChecked : ""}`}
                onClick={() => setValue("consent", !consent)}
                aria-checked={!!consent}
                role="checkbox"
              >
                {consent && <Check size={12} strokeWidth={2.5} />}
              </button>
              <span className={s.consentText}>{consentLabel}</span>
            </label>

          </div>

          <div className={s.submitArea}>
            <button className={s.submitBtn} type="submit" disabled={isSubmitting}>
              {submitLabel}
            </button>
            <p className={s.privacyNote}>{privacyNote}</p>
          </div>
        </form>
      </div>

      {/* Right: agent panel */}
      {agent && (
        <div className={s.agentPanel}>
          <div className={s.agentCircle} />
          <img className={s.agentImage} src={agent.image} alt={agent.name} />
          <div className={s.agentInfo}>
            <p className={s.agentName}>{agent.name}</p>
            <p className={s.agentRole}>{agent.role}</p>
            <div className={s.stars}>
              {"★★★★★".split("").map((_, i) => (
                <span key={i} className={s.star}>★</span>
              ))}
            </div>
          </div>
        </div>
      )}

      </Container>
    </section>
  );
}
