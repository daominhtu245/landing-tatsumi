import { NextResponse } from 'next/server';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import { SITE } from '@/lib/site-config';

/**
 * Nhận お問い合わせ và gửi mail thật về info@ta23.net qua SMTP.
 *
 * CẤU HÌNH (biến môi trường — xem DEPLOY.md §11):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS   ← bắt buộc
 *   SMTP_SECURE   'true' nếu dùng SSL trực tiếp (cổng 465). Mặc định: port===465
 *   CONTACT_TO    địa chỉ nhận. Mặc định: SITE.email
 *   CONTACT_FROM  địa chỉ gửi. Mặc định: SMTP_USER
 *
 * KHI CHƯA CẤU HÌNH: trả 503 kèm code 'not_configured'. Form sẽ hiển thị
 * số điện thoại và email để liên hệ trực tiếp — KHÔNG báo gửi thành công giả.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().max(200).optional().or(z.literal('')),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  subject: z.enum(['coop', 'system', 'other']),
  message: z.string().trim().min(10).max(5000),
  /** Honeypot: bot điền vào, người thật thì không. Nhận mọi giá trị rồi lọc ở dưới. */
  website: z.string().max(500).optional()
});

const SUBJECT_LABEL: Record<string, string> = {
  coop: '組合・共同購買事業について',
  system: '制度に関するお問い合わせ',
  other: 'その他'
};

/** Rate limit đơn giản trong bộ nhớ: 5 lần / 10 phút / IP. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // chặn phình bộ nhớ
  return recent.length > MAX_REQUESTS;
}

function smtpConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT ?? 587);
  return {
    host: SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  };
}

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, code: 'rate_limited' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: 'invalid_json' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, code: 'invalid_input' }, { status: 400 });
  }

  // Honeypot dính → giả vờ thành công, không gửi mail.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const config = smtpConfig();
  if (!config) {
    console.warn('[contact] SMTP chưa được cấu hình — không gửi được mail.');
    return NextResponse.json({ ok: false, code: 'not_configured' }, { status: 503 });
  }

  const d = parsed.data;
  const lines = [
    'ホームページのお問い合わせフォームより送信がありました。',
    '',
    `件名　　　: ${SUBJECT_LABEL[d.subject] ?? d.subject}`,
    `お名前　　: ${d.name}`,
    `会社名　　: ${d.company || '（未記入）'}`,
    `メール　　: ${d.email}`,
    `電話番号　: ${d.phone || '（未記入）'}`,
    '',
    '── お問い合わせ内容 ──',
    d.message,
    '',
    '────────────────',
    `送信日時: ${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}`
  ];

  try {
    const transporter = nodemailer.createTransport(config);
    await transporter.sendMail({
      from: process.env.CONTACT_FROM ?? config.auth.user,
      to: process.env.CONTACT_TO ?? SITE.email,
      replyTo: `${d.name} <${d.email}>`,
      subject: `【お問い合わせ】${SUBJECT_LABEL[d.subject] ?? d.subject} - ${d.name} 様`,
      text: lines.join('\n')
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[contact] gửi mail thất bại:', error);
    return NextResponse.json({ ok: false, code: 'send_failed' }, { status: 502 });
  }
}
