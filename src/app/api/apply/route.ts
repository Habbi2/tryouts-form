import { NextResponse } from 'next/server'
import { applicationSchemaWithRegion as applicationSchema, type ApplicationInput } from '@/lib/schema'
import { Resend } from 'resend'

function toEmailHtml(data: ApplicationInput) {
  const roles = (data.roles || []).join(', ')
  const maps = (data.maps || []).join(', ')
  const mic = data.microphone ? 'Sí' : 'No'
  const commit = data.commitment === 'si' ? 'Sí' : 'No'
  const link = (label: string, url?: string) => (url ? `<a href="${url}">${label}</a>` : '—')
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:680px;margin:auto;padding:16px;background:#0e1630;color:#fff">
    <h2 style="margin:0 0 12px">Nueva postulación Tryout CS2</h2>
    <table style="width:100%;border-collapse:separate;border-spacing:0 8px">
      <tr><td><b>Steam</b></td><td><a href="${data.steamLink}">${data.steamLink}</a></td></tr>
      <tr><td><b>Faceit</b></td><td>${link('Perfil Faceit', data.faceitLink)}</td></tr>
      <tr><td><b>GamersClub</b></td><td>${link('Perfil GC', data.gamersclubLink)}</td></tr>
      <tr><td><b>Discord</b></td><td>${data.discordLink}</td></tr>
      <tr><td><b>Horas jugadas</b></td><td>${data.hoursPlayed}</td></tr>
      <tr><td><b>Inicio</b></td><td>${data.startDate}</td></tr>
      <tr><td><b>Edad</b></td><td>${data.age}</td></tr>
      <tr><td><b>Servidor</b></td><td>${data.server}</td></tr>
      <tr><td><b>País</b></td><td>${data.regionCountry}</td></tr>
      <tr><td><b>Roles</b></td><td>${roles}</td></tr>
      <tr><td><b>Mapas</b></td><td>${maps}</td></tr>
      <tr><td><b>FPS</b></td><td>${data.fps}</td></tr>
      <tr><td><b>Ping</b></td><td>${data.ping}</td></tr>
      <tr><td><b>Micrófono</b></td><td>${mic}</td></tr>
      <tr><td><b>Experiencia</b></td><td>${data.experience}</td></tr>
      <tr><td><b>Horario</b></td><td>${data.schedule}</td></tr>
      <tr><td><b>Compromiso</b></td><td>${commit}</td></tr>
      <tr><td><b>Motivo</b></td><td>${data.commitmentReason}</td></tr>
    </table>
  </div>`
}

function extractPlayerName(data: ApplicationInput): string {
  try {
    const takeLast = (url: string, marker: string) => {
      const idx = url.indexOf(marker)
      if (idx === -1) return null
      const rest = url.slice(idx + marker.length)
      const seg = rest.split(/[?#/]/).find(Boolean)
      return seg ? decodeURIComponent(seg) : null
    }
    // Prefer Faceit username
    if (data.faceitLink) {
      const faceit = takeLast(data.faceitLink, '/players/') || takeLast(data.faceitLink, '/player/')
      if (faceit) return faceit
    }
    // Steam vanity id
    if (data.steamLink) {
      const steamVanity = takeLast(data.steamLink, '/id/')
      if (steamVanity) return steamVanity
      const steamNum = takeLast(data.steamLink, '/profiles/')
      if (steamNum) return `steam:${steamNum}`
    }
    // Discord invite code as proxy
    if (data.discordLink) {
      const disc = data.discordLink.split('/').filter(Boolean).pop()
      if (disc) return disc
    }
    // GamersClub numeric id
    if (data.gamersclubLink) {
      const gc = takeLast(data.gamersclubLink, '/player/')
      if (gc) return `gc:${gc}`
    }
  } catch (_e) {
    // ignore parse errors
  }
  return 'Jugador'
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    // Honeypot bot check
    if (body.company) {
      return NextResponse.json({ ok: true }, { status: 200 })
    }

    const parsed = applicationSchema.safeParse({
      ...body,
      hoursPlayed: Number(body.hoursPlayed),
      age: Number(body.age),
      fps: Number(body.fps),
      ping: Number(body.ping),
      microphone: Boolean(body.microphone),
    })
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const data = parsed.data
    const resendKey = process.env.RESEND_API_KEY
    const mailFrom = process.env.MAIL_FROM
    const mailTo = process.env.MAIL_TO
    if (!resendKey || !mailFrom || !mailTo) {
      return NextResponse.json({ ok: true, note: 'Email no configurado (RESEND_API_KEY/MAIL_FROM/MAIL_TO)' }, { status: 200 })
    }

    const resend = new Resend(resendKey)
    const html = toEmailHtml(data)
    const playerName = extractPlayerName(data)
    const subject = `Tryout CS2 - ${playerName}`
    const result = await resend.emails.send({
      from: mailFrom,
      to: mailTo,
      subject,
      html,
    })
    const sendError = (result as any)?.error
    if (sendError) {
      console.error('Resend send error:', sendError)
      const message = typeof sendError === 'string' ? sendError : sendError?.message || 'Error desconocido'
      const isDomainNotVerified =
        (sendError?.statusCode === 403 && sendError?.name === 'validation_error') ||
        (typeof message === 'string' && message.toLowerCase().includes('not verified'))

      // Dev fallback: retry with onboarding@resend.dev to avoid blocking while domain is unverified
      if (isDomainNotVerified) {
        try {
          const fallback = await resend.emails.send({
            from: 'Tryouts <onboarding@resend.dev>',
            to: mailTo,
            subject,
            html,
          })
          const fbErr = (fallback as any)?.error
          if (!fbErr) {
            return NextResponse.json({ ok: true, note: 'Enviado usando onboarding@resend.dev (dominio no verificado)' })
          }
          console.error('Resend fallback error:', fbErr)
        } catch (fallbackErr) {
          console.error('Resend fallback exception:', fallbackErr)
        }
        if (process.env.NODE_ENV !== 'production') {
          return NextResponse.json({ ok: true, note: 'Dev mode: dominio no verificado, email simulado' })
        }
      }
      return NextResponse.json({ error: 'Error enviando email', details: message }, { status: 502 })
    }
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Error desconocido'
    console.error('POST /api/apply error:', e)
    return NextResponse.json({ error: 'Error enviando email', details: message }, { status: 502 })
  }
}
