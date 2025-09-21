'use client'

import { useForm, type Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { applicationSchemaWithRegion as applicationSchema, type ApplicationInput } from '@/lib/schema'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'

const ROLES = ['IGL', 'Entry', 'AWPer', 'Support', 'Lurker', 'Coach'] as const
const MAPS = ['Ancient', 'Train', 'Dust2', 'Inferno', 'Mirage', 'Nuke', 'Overpass'] as const

export default function Home() {
  const [submitted, setSubmitted] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [step, setStep] = useState(0) // 0 Perfil, 1 Setup, 2 Experiencia, 3 Compromiso
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
    trigger,
  } = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      server: 'NA',
      roles: [],
      maps: [],
      microphone: true,
      commitment: 'si',
    },
  })

  const onSubmit = async (values: ApplicationInput) => {
    setServerError(null)
    try {
      setScanning(true)
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Error al enviar')
      setSubmitted(true)
      reset()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Error desconocido'
      setServerError(msg)
    } finally {
      // pequeña pausa para que se aprecie la animación
      await new Promise((r) => setTimeout(r, 600))
      setScanning(false)
    }
  }

  const roles = watch('roles')
  const toggleRole = (r: (typeof ROLES)[number]) => {
    const next = roles.includes(r) ? roles.filter((x) => x !== r) : [...roles, r]
    setValue('roles', next)
  }

  const maps = watch('maps')
  const toggleMap = (m: (typeof MAPS)[number]) => {
    const next = maps.includes(m) ? maps.filter((x) => x !== m) : [...maps, m]
    setValue('maps', next)
  }

  const steps = useMemo(() => ['Perfil', 'Setup', 'Experiencia', 'Compromiso'] as const, [])
  const progress = ((step + 1) / steps.length) * 100
  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1))
  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  const FIELDS_BY_STEP = useMemo(
    () => [
      ['steamLink', 'faceitLink', 'gamersclubLink', 'discordLink', 'hoursPlayed', 'startDate', 'age'] as Path<ApplicationInput>[],
      ['server', 'regionCountry', 'fps', 'ping', 'roles', 'maps'] as Path<ApplicationInput>[],
      ['microphone', 'experience'] as Path<ApplicationInput>[],
      ['schedule', 'commitment', 'commitmentReason'] as Path<ApplicationInput>[],
    ] as ReadonlyArray<ReadonlyArray<Path<ApplicationInput>>>,
    []
  )

  const goNext = async () => {
    const names = FIELDS_BY_STEP[step]
    const ok = await trigger(names, { shouldFocus: true })
    if (ok) nextStep()
  }

  // Region-aware country options
  const server = watch('server')
  const countryOptions = useMemo(() => {
    if (server === 'NA') {
      return [
        { code: 'US', label: 'Estados Unidos (US)' },
        { code: 'CA', label: 'Canadá (CA)' },
        { code: 'MX', label: 'México (MX)' },
      ]
    }
    return [
      { code: 'AR', label: 'Argentina (AR)' },
      { code: 'BR', label: 'Brasil (BR)' },
      { code: 'CL', label: 'Chile (CL)' },
      { code: 'CO', label: 'Colombia (CO)' },
      { code: 'PE', label: 'Perú (PE)' },
      { code: 'UY', label: 'Uruguay (UY)' },
      { code: 'PY', label: 'Paraguay (PY)' },
      { code: 'EC', label: 'Ecuador (EC)' },
      { code: 'BO', label: 'Bolivia (BO)' },
      { code: 'VE', label: 'Venezuela (VE)' },
    ]
  }, [server])

  // Clear country when switching server region
  useEffect(() => {
    setValue('regionCountry', '')
  }, [server, setValue])

  return (
    <div>
      <div className="flex items-center gap-3">
        <Image src="/crosshair.svg" alt="CS2" width={32} height={32} className="opacity-80" />
        <h1 className="title">TRYOUT CS2</h1>
      </div>
      <p className="help mt-1">Postulación para Space Kings</p>

      {/* Progress */}
      <div className="mt-4">
        <div className="progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[13px] text-white/60 mt-1">
          {steps.map((s, i) => (
            <span key={s} className={i === step ? 'text-white/90' : ''}>{s}</span>
          ))}
        </div>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {step === 0 && (
        <>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Link de Steam</label>
              <input className="input" placeholder="https://steamcommunity.com/profiles/..." {...register('steamLink')} />
              {errors.steamLink && <p className="error">{errors.steamLink.message}</p>}
            </div>
            <div>
              <label className="label">Link de Faceit</label>
              <input className="input" placeholder="https://www.faceit.com/..." {...register('faceitLink')} />
              {errors.faceitLink && <p className="error">{String(errors.faceitLink.message)}</p>}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Link de GamersClub</label>
              <input className="input" placeholder="https://gamersclub.com.br/..." {...register('gamersclubLink')} />
              {errors.gamersclubLink && <p className="error">{String(errors.gamersclubLink.message)}</p>}
            </div>
            <div>
              <label className="label">Usuario de Discord</label>
              <input className="input" placeholder="https://discord.gg/..." {...register('discordLink')} />
              {errors.discordLink && <p className="error">{String(errors.discordLink.message)}</p>}
            </div>
          </div>
        </>
        )}

        {step === 0 && (
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label">Horas jugadas</label>
            <input type="number" className="input input-number" placeholder="800" {...register('hoursPlayed', { valueAsNumber: true })} />
            {errors.hoursPlayed && <p className="error">{errors.hoursPlayed.message}</p>}
          </div>
          <div>
            <label className="label">Fecha de inicio</label>
            <input className="input" placeholder="2022" {...register('startDate')} />
            {errors.startDate && <p className="error">{errors.startDate.message}</p>}
          </div>
          <div>
            <label className="label">Edad</label>
            <input type="number" className="input input-number" placeholder="17" {...register('age', { valueAsNumber: true })} />
            {errors.age && <p className="error">{errors.age.message}</p>}
          </div>
        </div>
        )}

        {step === 1 && (
        <div className="grid sm:grid-cols-4 gap-4">
          <div>
            <label className="label">Servidor</label>
            <select className="input select" {...register('server')}>
              <option value="NA">NA</option>
              <option value="SA">SA</option>
            </select>
            {errors.server && <p className="error">{String(errors.server.message)}</p>}
          </div>
          <div>
            <label className="label">País</label>
            <select className="input select" {...register('regionCountry')}>
              <option value="">Selecciona un país…</option>
              {countryOptions.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            {errors.regionCountry && <p className="error">{String(errors.regionCountry.message)}</p>}
          </div>
          <div>
            <label className="label">FPS aprox</label>
            <input type="number" className="input input-number" placeholder="120" {...register('fps', { valueAsNumber: true })} />
            {errors.fps && <p className="error">{errors.fps.message}</p>}
          </div>
          <div>
            <label className="label">Ping aprox</label>
            <input type="number" className="input input-number" placeholder="60" {...register('ping', { valueAsNumber: true })} />
            {errors.ping && <p className="error">{errors.ping.message}</p>}
          </div>
        </div>
        )}

        {step === 1 && (
        <div>
          <label className="label">Roles favoritos (máx 3)</label>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => toggleRole(r)}
                className={`chip ${roles.includes(r) ? 'active' : ''}`}
              >
                {r}
              </button>
            ))}
          </div>
          {errors.roles && <p className="error">{String(errors.roles.message)}</p>}
        </div>
        )}

        {step === 1 && (
        <div>
          <label className="label">Mapas que sabes jugar</label>
          <div className="flex flex-wrap gap-2">
            {MAPS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => toggleMap(m)}
                className={`chip ${maps.includes(m) ? 'active' : ''}`}
              >
                {m}
              </button>
            ))}
          </div>
          {errors.maps && <p className="error">{String(errors.maps.message)}</p>}
        </div>
        )}

        {step === 2 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">¿Tienes micrófono?</label>
            <select className="input select" {...register('microphone', { setValueAs: (v) => v === 'true' })}>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          <div>
            <label className="label">¿Tienes experiencia compitiendo?</label>
            <textarea className="input" rows={3} placeholder="Describe tu experiencia" {...register('experience')} />
            {errors.experience && <p className="error">{errors.experience.message}</p>}
          </div>
        </div>
        )}

        {step === 3 && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label">¿Cuál es tu horario de juego?</label>
            <input className="input" placeholder="6pm - 12am Argentina" {...register('schedule')} />
            {errors.schedule && <p className="error">{errors.schedule.message}</p>}
          </div>
          <div>
            <label className="label">Compromiso</label>
            <select className="input select" {...register('commitment')}>
              <option value="si">Sí</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        )}

        {step === 3 && (
        <div>
          <label className="label">Fundamenta tu respuesta</label>
          <textarea className="input" rows={3} placeholder="Explica brevemente" {...register('commitmentReason')} />
          {errors.commitmentReason && <p className="error">{errors.commitmentReason.message}</p>}
        </div>
        )}

        {/* Honeypot */}
        <input className="hidden" tabIndex={-1} autoComplete="off" {...register('company')} />

        {serverError && <p className="error">{serverError}</p>}
        {submitted && <p className="text-green-400 text-sm">¡Postulación enviada con éxito!</p>}

        <div className="flex items-center gap-2 justify-between pt-2">
          <button type="button" className="chip" onClick={prevStep} disabled={step === 0}>
            Anterior
          </button>
          {step < steps.length - 1 ? (
            <button type="button" className="btn" onClick={goNext}>
              Siguiente
            </button>
          ) : (
            <button className="btn" disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Enviando…' : 'Enviar postulación'}
            </button>
          )}
        </div>
      </form>

      {scanning && (
        <div className="scan-overlay">
          <div className="scan-lines" />
          <div className="scan-glow" />
          <div className="scan-text">Escaneando postulación…</div>
        </div>
      )}
    </div>
  )
}
