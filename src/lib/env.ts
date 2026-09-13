export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  /** 운영팀 문의가 도착할 메일 주소 (mailto). 문의 API가 생기면 그쪽으로 교체 */
  supportEmail: (import.meta.env.VITE_SUPPORT_EMAIL as string | undefined) ?? '',
} as const;

if (!env.apiBaseUrl) {
  throw new Error('VITE_API_BASE_URL이 설정되지 않았습니다. .env.local을 확인하세요.');
}
