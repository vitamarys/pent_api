'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Check, X } from 'lucide-react'
import PhoneInput, { type Country } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import type { AgentInfo } from '@/components/sections/ProjectForm'
import s from './PopConsultation.module.scss'

const schema = z.object({
  name:    z.string().min(1, 'Name is required'),
  email:   z.string().min(1, 'Email is required').email('Invalid email'),
  phone:   z.string().min(1, 'Phone is required'),
  consent: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

export interface PopConsultationProps {
  open:           boolean
  onClose:        () => void
  headerLabel?:   string
  sectionTitle?:  string
  description?:   string
  submitLabel?:   string
  privacyNote?:   string
  consentLabel?:  string
  whatsappHref?:  string
  agent?:         AgentInfo
  onSubmit?:      (data: FormValues) => Promise<void> | void
}

export default function PopConsultation({
  open,
  onClose,
  headerLabel  = 'Consultation',
  sectionTitle = 'Get professional property guidance',
  description  = 'Leave your details, and an advisor will help you choose the right property.',
  submitLabel  = 'Send Request',
  privacyNote  = 'By accepting and providing my personal information i am consenting to Metropolitan Group Privacy Policy, the applicable data protection laws and Terms of Use',
  consentLabel = 'I agree to receive information about offers, deals and services from this website (optional)',
  whatsappHref,
  agent,
  onSubmit,
}: PopConsultationProps) {
  const [defaultCountry, setDefaultCountry] = useState<Country>('AE')

  useEffect(() => {
    fetch('https://api.country.is/')
      .then(r => r.json())
      .then(d => { if (d?.country) setDefaultCountry(d.country as Country) })
      .catch(() => {})
  }, [])

  // Body scroll lock
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const { register, handleSubmit, watch, setValue, control, reset, formState: { errors, isSubmitting, isSubmitSuccessful } } =
    useForm<FormValues>({ resolver: zodResolver(schema) })

  const consent = watch('consent')

  const submit = async (data: FormValues) => {
    await onSubmit?.(data)
    reset()
  }

  if (!open) return null

  return (
    <div className={s.backdrop} onClick={onClose}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className={s.header}>
          <span className={s.headerLabel}>{headerLabel}</span>
          <button className={s.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <div className={s.body}>

          {/* ── Agent section (tablet/mobile: top; desktop: right) ── */}
          {agent && (
            <div className={s.agentSection}>
              <div className={s.agentDetails}>
                <p className={s.agentName}>{agent.name}</p>
                <p className={s.agentRole}>{agent.role}</p>
                <div className={s.stars}>
                  {[1,2,3,4,5].map(i => <span key={i} className={s.star}>★</span>)}
                </div>
              </div>
              <div className={s.agentCircle} />
              {agent.image && (
                <img src={agent.image} alt={agent.name} className={s.agentImage} />
              )}
            </div>
          )}

          {/* ── Form section ── */}
          <div className={s.formSection}>
            <div className={s.intro}>
              <h2 className={s.title}>{sectionTitle}</h2>
              <p className={s.desc}>{description}</p>
            </div>

            <div className={s.formContent}>
              <form className={s.form} onSubmit={handleSubmit(submit)} noValidate>
                <div className={s.fields}>

                  <div className={s.row}>
                    <div className={s.fieldWrap}>
                      <input
                        className={`${s.input} ${errors.name ? s.inputError : ''}`}
                        placeholder="Full name"
                        {...register('name')}
                      />
                      {errors.name && <span className={s.error}>{errors.name.message}</span>}
                    </div>
                    <div className={s.fieldWrap}>
                      <input
                        className={`${s.input} ${errors.email ? s.inputError : ''}`}
                        placeholder="Email address"
                        type="email"
                        {...register('email')}
                      />
                      {errors.email && <span className={s.error}>{errors.email.message}</span>}
                    </div>
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
                          className={`${s.phoneInput} ${errors.phone ? s.phoneInputError : ''}`}
                          numberInputProps={{ placeholder: '+1 (000) 000-00-00' }}
                        />
                      )}
                    />
                    {errors.phone && <span className={s.error}>{errors.phone.message}</span>}
                  </div>

                  <label className={s.checkboxRow}>
                    <button
                      type="button"
                      className={`${s.checkbox} ${consent ? s.checkboxChecked : ''}`}
                      onClick={() => setValue('consent', !consent)}
                      aria-checked={!!consent}
                      role="checkbox"
                    >
                      {consent && <Check size={12} strokeWidth={2.5} />}
                    </button>
                    <span className={s.consentText}>{consentLabel}</span>
                  </label>

                </div>

                <div className={s.submitArea}>
                  {isSubmitSuccessful ? (
                    <p className={s.successMsg}>Thank you! We will contact you shortly.</p>
                  ) : (
                    <button className={s.submitBtn} type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending…' : submitLabel}
                    </button>
                  )}
                  <p className={s.privacyNote}>{privacyNote}</p>
                </div>
              </form>

              {whatsappHref && (
                <div className={s.whatsapp}>
                  <div className={s.orDivider}>
                    <span className={s.orLine} />
                    <span className={s.orText}>OR</span>
                    <span className={s.orLine} />
                  </div>
                  <p className={s.whatsappText}>
                    Prefer direct contact? Chat with us on{' '}
                    <a href={whatsappHref} className={s.whatsappLink} target="_blank" rel="noopener noreferrer">
                      WhatsApp →
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
