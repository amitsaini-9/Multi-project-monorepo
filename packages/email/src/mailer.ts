import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

// Default SMTP configuration
const defaultConfig: EmailConfig = {
  host: process.env.SMTP_HOST || 'smtp.sainiamit.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER || 'noreply@sainiamit.com',
    pass: process.env.SMTP_PASS || '',
  },
}

// Create transporter instance
let transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport(defaultConfig)
  }
  return transporter
}

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  from?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  const transport = getTransporter()

  const from = options.from || process.env.SMTP_FROM || defaultConfig.auth.user

  await transport.sendMail({
    from,
    to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
    cc: options.cc,
    bcc: options.bcc,
  })
}

// App-specific email senders
export const emailSenders = {
  crm: 'crm@sainiamit.com',
  dnsAlerts: 'dns-alerts@sainiamit.com',
  apiAlerts: 'api-alerts@sainiamit.com',
  bookings: 'bookings@sainiamit.com',
  team: 'team@sainiamit.com',
  budget: 'budget@sainiamit.com',
  kindle: 'kindle@sainiamit.com',
  notifications: 'notifications@sainiamit.com',
  support: 'support@sainiamit.com',
  admin: 'admin@sainiamit.com',
  noreply: 'noreply@sainiamit.com',
}

// Verify SMTP connection
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    const transport = getTransporter()
    await transport.verify()
    return true
  } catch (error) {
    console.error('SMTP verification failed:', error)
    return false
  }
}
