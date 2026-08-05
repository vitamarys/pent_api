'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, ChevronRight } from 'lucide-react';
import PhoneInput, { type Country } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Container from '@/components/ui/Container';
import { submitLead } from '@/api/leads';
import { getLeadExtraData } from '@/lib/leadAnalytics';
import s from './ContactHero.module.scss';

const schema = z.object({
  name:    z.string().min(1, 'Name is required'),
  email:   z.string().min(1, 'Email is required').email('Invalid email'),
  phone:   z.string().min(1, 'Phone is required'),
  message: z.string().optional(),
  consent: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const PHONE    = '+971 52 222 2105';
const EMAIL    = 'team@metropolitan.realestate';
const WA_HREF  = 'https://wa.me/97152222105';

export default function ContactHero() {
  const [defaultCountry, setDefaultCountry] = useState<Country>('AE');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetch('https://api.country.is/')
      .then(r => r.json())
      .then(d => { if (d?.country) setDefaultCountry(d.country as Country); })
      .catch(() => {});
  }, []);

  const {
    register, handleSubmit, watch, setValue, control, reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const consent = watch('consent');

  const onSubmit = async (data: FormValues) => {
    setSubmitStatus('idle');
    try {
      await submitLead({
        name:      data.name,
        email:     data.email,
        phone:     data.phone,
        message:   data.message,
        entity:    'contact',
        extraData: getLeadExtraData(),
      });
      reset();
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <section className={s.wrap}>
      <Container className={s.inner}>

        {/* Breadcrumbs */}
        <nav className={s.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/" className={s.breadcrumbHome} aria-label="Home">
            <Image src="/icons/icon-home-b.svg" alt="Home" width={16} height={16} />
          </Link>
          <span className={s.breadcrumbItem}>
            <ChevronRight size={16} strokeWidth={1.5} className={s.breadcrumbSep} />
            <span className={s.breadcrumbCurrent}>Contact Us</span>
          </span>
        </nav>

        {/* Two-column layout */}
        <div className={s.grid}>

          {/* Left — contact info */}
          <div className={s.infoCol}>
            <div className={s.titleGroup}>
              <h1 className={s.title}>Contact Us</h1>
              <p className={s.desc}>
                Get in touch with Dubai's award-winning real estate specialists
                for elite services, luxury listings, and professional advice.
              </p>
            </div>

            <div className={s.contacts}>
              <div className={s.contactItem}>
                <span className={s.contactLabel}>Phone</span>
                <a href={`tel:${PHONE.replace(/\s/g, '')}`} className={s.contactValue}>
                  {PHONE}
                </a>
              </div>
              <div className={s.contactItem}>
                <span className={s.contactLabel}>Email</span>
                <a href={`mailto:${EMAIL}`} className={s.contactValue}>
                  {EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className={s.formCol}>
            <div className={s.formHeader}>
              <h2 className={s.formTitle}>Drop Us a Message</h2>
              <p className={s.formDesc}>Send us your query and our agents will respond promptly.</p>
            </div>

            {submitStatus === 'success' ? (
              <div className={s.successBlock}>
                <div className={s.successIcon}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <path d="M6 16L13 23L26 9" stroke="#0c5744" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className={s.successText}>
                  <p className={s.successTitle}>Thank you for your message!</p>
                  <p className={s.successDesc}>Our agents will be in touch with you shortly.</p>
                </div>
              </div>
            ) : (
              <form className={s.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={s.fields}>

                  <div className={s.inputRow}>
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

                  <div className={s.fieldWrap}>
                    <textarea
                      className={s.textarea}
                      placeholder="Message"
                      {...register('message')}
                    />
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
                  <button className={s.submitBtn} type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending…' : 'Get in touch'}
                  </button>
                  {submitStatus === 'error' && (
                    <p className={s.errorBlock}>Oops! Something went wrong. Please try again.</p>
                  )}
                  <p className={s.privacyNote}>
                    By accepting and providing my personal information i am consenting to Metropolitan Group Privacy Policy,
                    the applicable data protection laws and Terms of Use
                  </p>
                </div>

                <div className={s.whatsappSection}>
                  <div className={s.orDivider}>
                    <span className={s.orLine} />
                    <span className={s.orText}>OR</span>
                    <span className={s.orLine} />
                  </div>
                  <p className={s.whatsappText}>
                    Prefer direct contact? Chat with us on{' '}
                    <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className={s.whatsappLink}>
                      WhatsApp →
                    </a>
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
