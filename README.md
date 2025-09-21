# Formulario de Tryout CS2 (Vercel)

Aplicación Next.js + Tailwind + Zod para reemplazar el formulario manual de Discord y enviar postulaciones a un Webhook de Discord.

## Características
- Formulario validado (React Hook Form + Zod)
- API serverless que valida y envía a un Discord Webhook
- Honeypot anti-bots (`company`)
- UI limpia con Tailwind
- Preparado para Vercel

## Requisitos
- Node.js 18+
- Cuenta de Vercel (opcional para desplegar)

## Configuración local
1. Instalar dependencias
2. Crear `.env.local` con tu webhook
3. Ejecutar en desarrollo

```cmd
cd c:\Users\javie\Desktop\formulario-cesar
npm install
copy .env.local.example .env.local
REM Edita .env.local y pega tu DISCORD_WEBHOOK_URL
npm run dev
```

Abrir http://localhost:3000

## Despliegue en Vercel
1. Sube este repo a GitHub/GitLab/Bitbucket
2. En Vercel, importa el proyecto
3. Variables de entorno en Project Settings → Environment Variables:
	- `RESEND_API_KEY`
	- `MAIL_FROM` (p.ej. `Tryouts <tryouts@tudominio.com>`)
	- `MAIL_TO` (inbox donde recibes las postulaciones)
4. Deploy

## Cómo configurar Resend
- Crea una cuenta en https://resend.com y genera `RESEND_API_KEY`.
- Verifica un dominio/remitente (para `MAIL_FROM`), o usa un sender verificado.
- Define `MAIL_TO` al correo de destino (puedes poner varios separados por coma).

## Personalización
- Edita el esquema en `src/lib/schema.ts` para ajustar validaciones y opciones (roles, mapas, etc.)
- Edita la UI en `src/app/page.tsx`
- Ajusta estilos en `src/app/globals.css`

## Seguridad y límites
- Honeypot simple evita algunos bots
- Para rate limiting real: usar `@upstash/ratelimit` o Vercel Edge Config (pendiente)

## Licencia
MIT
