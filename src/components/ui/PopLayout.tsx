'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, X } from 'lucide-react';
import PhoneInput, { type Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { submitLead } from '@/api/leads';
import { getLeadExtraData } from '@/lib/leadAnalytics';
import s from './PopLayout.module.scss';

const schema = z.object({
  name:    z.string().min(1, 'Name is required'),
  email:   z.string().min(1, 'Email is required').email('Invalid email'),
  phone:   z.string().min(1, 'Phone is required'),
  consent: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export interface PopLayoutProps {
  open:           boolean;
  onClose:        () => void;
  image?:         string;
  title?:         string;
  entity?:        string;
  projectId?:     string;
  pageBitrixId?:  string;
  onSubmit?:      (data: FormValues) => Promise<void> | void;
}

export default function PopLayout({
  open,
  onClose,
  image,
  title,
  entity = 'pent_entity',
  projectId,
  pageBitrixId,
  onSubmit,
}: PopLayoutProps) {
  const [defaultCountry, setDefaultCountry] = useState<Country>('AE');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('https://api.country.is/')
      .then(r => r.json())
      .then(d => { if (d?.country) setDefaultCountry(d.country as Country); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const consent = watch('consent');

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
          extraData: getLeadExtraData(),
        });
      }
      reset();
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    }
  };

  if (!open) return null;

  return (
    <div className={s.backdrop} onClick={onClose}>
      <div className={s.modal} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className={s.header}>
          <span className={s.headerLabel}>Layout</span>
          <button className={s.closeBtn} onClick={onClose} aria-label="Close">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Main content */}
        <div className={s.body}>

          {/* Form panel */}
          <div className={s.formPanel}>
            <div className={s.intro}>
              <h2 className={s.title}>Request Updated Layouts &amp; Availability</h2>
              <p className={s.desc}>
                Layouts shown on the website may vary by configuration and sales status. Submit a request to receive updated availability and suitable options.
              </p>
            </div>

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
                  <span className={s.consentText}>
                    I agree to receive information about offers, deals and services from this website (optional)
                  </span>
                </label>

              </div>

              <div className={s.submitArea}>
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
                  <>
                    <button className={s.submitBtn} type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Sending…' : 'Check Current Availability'}
                    </button>
                    {submitStatus === 'error' && (
                      <div className={s.errorBlock}>
                        <span>Oops! Something went wrong while submitting the form.</span>
                      </div>
                    )}
                    <p className={s.privacyNote}>
                      By accepting and providing my personal information i am consenting to Metropolitan Group Privacy Policy, the applicable data protection laws and Terms of Use
                    </p>
                  </>
                )}
              </div>
            </form>
          </div>

          {/* Image panel */}
          <div className={s.imagePanel}>
            <img
              src={image || '/images/floorplan.png'}
              alt={title ?? 'Layout'}
              className={s.floorImage}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
