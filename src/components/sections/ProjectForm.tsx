'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check } from "lucide-react";
import PhoneInput, { type Country } from 'react-phone-number-input/min';
import 'react-phone-number-input/style.css';
import Container from "@/components/ui/Container";
import { submitLead } from '@/api/leads';
import { getLeadExtraData } from '@/lib/leadAnalytics';
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
  sectionTitle?:        string;
  description?:         string;
  submitLabel?:         string;
  privacyNote?:         string;
  consentLabel?:        string;
  agent?:               AgentInfo;
  entity?:              string;
  projectId?:           string;
  pageBitrixId?:        string;
  agentLeadId?:         string;
  onSubmit?:            (data: FormValues) => Promise<void> | void;
  onConsultationOpen?:  () => void;
}

export default function ProjectForm({
  sectionTitle = "Have any questions about this property?",
  description  = "Leave your details, and a project manager will answer all your questions",
  submitLabel  = "Check Availability",
  privacyNote  = "By accepting and providing my personal information i am consenting to Metropolitan Group Privacy Policy, the applicable data protection laws and Terms of Use",
  consentLabel = "I agree to receive information about offers, deals and services from this website (optional)",
  agent,
  entity = '73687',
  projectId,
  pageBitrixId,
  agentLeadId,
  onSubmit,
}: ProjectFormProps) {
  const [defaultCountry, setDefaultCountry] = useState<Country>('AE');

  useEffect(() => {
    fetch('https://api.country.is/')
      .then((r) => r.json())
      .then((data) => {
        if (data?.country) setDefaultCountry(data.country as Country);
      })
      .catch(() => {/* fallback to AE */});
  }, []);

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const consent = watch("consent");

  const submit = async (data: FormValues) => {
    setSubmitStatus('idle');
    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        await submitLead({
          name: data.name,
          email: data.email,
          phone: data.phone,
          entity,
          projectId,
          pageBitrixId,
          extraData: {
            ...getLeadExtraData(),
            ...(agentLeadId ? { agent_id: agentLeadId } : {}),
          },
        });
      }
      reset();
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    }
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

        {submitStatus === 'success' ? (
          <div className={s.successBlock}>
            <div className={s.successIcon}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 16L13 23L26 9" stroke="#0c5744" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className={s.successText}>
              <p className={s.successTitle}>Thank you for your interest!</p>
              <p className={s.successDesc}>We've sent you a confirmation email and will be in touch soon.</p>
            </div>
          </div>
        ) : (
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
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      international
                      defaultCountry={defaultCountry}
                      value={field.value}
                      onChange={field.onChange}
                      className={`${s.phoneInput} ${errors.phone ? s.phoneInputError : ""}`}
                      numberInputProps={{
                        placeholder: '+1 (000) 000-00-00',
                      }}
                    />
                  )}
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
                {isSubmitting ? 'Sending…' : submitLabel}
              </button>
              {submitStatus === 'error' && (
                <div className={s.errorBlock}>
                  <span>Oops! Something went wrong while submitting the form.</span>
                </div>
              )}
              <p className={s.privacyNote}>{privacyNote}</p>
            </div>
          </form>
        )}

      </div>

      {/* Right: agent panel */}
      {agent && (
        <div className={s.agentPanel}>
          <div className={s.agentCircle} />
          {agent.image && <Image className={s.agentImage} src={agent.image} alt={agent.name} width={446} height={597} />}
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
