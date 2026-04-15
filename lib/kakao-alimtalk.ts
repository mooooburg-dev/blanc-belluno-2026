/**
 * 카카오 알림톡 발송 유틸리티 (Solapi)
 *
 * 사전 준비:
 * 1. Solapi 가입 (https://solapi.com) + API Key/Secret 발급
 * 2. 카카오 비즈니스 채널 개설 (https://business.kakao.com) 후 Solapi와 연동 → 채널 ID(pfId) 발급
 * 3. 알림톡 템플릿 2개(고객용/관리자용) 등록 및 심사 승인
 *
 * 환경변수:
 * - SOLAPI_API_KEY
 * - SOLAPI_API_SECRET
 * - SOLAPI_PFID                   (카카오 채널 ID)
 * - SOLAPI_TEMPLATE_ID_CUSTOMER   (고객 접수 확인용)
 * - SOLAPI_TEMPLATE_ID_ADMIN      (관리자 신규 상담 알림용)
 * - ADMIN_PHONE                   (관리자 수신 번호)
 */

import { SolapiMessageService } from "solapi";

interface InquiryData {
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  eventDate: string;
  location?: string;
  budget?: string;
  message?: string;
}

interface AlimtalkResult {
  success: boolean;
  error?: string;
}

const SENDER_PHONE = process.env.SOLAPI_SENDER_PHONE || "";

function isConfigured(): boolean {
  return !!(
    process.env.SOLAPI_API_KEY &&
    process.env.SOLAPI_API_SECRET &&
    process.env.SOLAPI_PFID
  );
}

function getClient(): SolapiMessageService | null {
  if (!isConfigured()) return null;
  return new SolapiMessageService(
    process.env.SOLAPI_API_KEY!,
    process.env.SOLAPI_API_SECRET!
  );
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

function truncate(text: string | undefined, max = 50, fallback = "없음"): string {
  if (!text) return fallback;
  return text.length > max ? text.slice(0, max) + "..." : text;
}

async function sendAlimtalk(
  templateId: string,
  to: string,
  variables: Record<string, string>
): Promise<AlimtalkResult> {
  const client = getClient();
  if (!client) {
    console.log("[알림톡] Solapi 미설정 - 발송 스킵");
    return { success: false, error: "Solapi가 설정되지 않았습니다." };
  }

  try {
    await client.sendOne({
      to: normalizePhone(to),
      ...(SENDER_PHONE && { from: normalizePhone(SENDER_PHONE) }),
      kakaoOptions: {
        pfId: process.env.SOLAPI_PFID!,
        templateId,
        variables,
      },
    });
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("[알림톡] 발송 실패:", message);
    return { success: false, error: message };
  }
}

/**
 * 고객에게 상담 접수 확인 알림톡 발송
 */
export async function sendInquiryAlimtalkToCustomer(
  data: InquiryData
): Promise<AlimtalkResult> {
  const templateId = process.env.SOLAPI_TEMPLATE_ID_CUSTOMER;
  if (!templateId) {
    return { success: false, error: "고객용 템플릿 ID 미설정" };
  }

  return sendAlimtalk(templateId, data.phone, {
    "#{name}": data.name,
    "#{event_type}": data.eventType,
    "#{event_date}": data.eventDate,
  });
}

/**
 * 관리자에게 신규 상담 접수 알림톡 발송
 */
export async function sendInquiryAlimtalkToAdmin(
  data: InquiryData,
  adminPhone: string
): Promise<AlimtalkResult> {
  const templateId = process.env.SOLAPI_TEMPLATE_ID_ADMIN;
  if (!templateId) {
    return { success: false, error: "관리자용 템플릿 ID 미설정" };
  }

  return sendAlimtalk(templateId, adminPhone, {
    "#{name}": data.name,
    "#{phone}": data.phone,
    "#{event_type}": data.eventType,
    "#{event_date}": data.eventDate,
    "#{location}": data.location || "미정",
    "#{budget}": data.budget || "협의",
    "#{message}": truncate(data.message),
  });
}

export function isAlimtalkConfigured(): boolean {
  return isConfigured();
}
