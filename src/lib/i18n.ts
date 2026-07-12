// Worldwide i18n + multi-currency for EmpireLaunch AI onboarding

export type LocaleCode = 'en' | 'fr' | 'es' | 'de' | 'pt' | 'ja' | 'zh' | 'ko';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number; // conversion rate from 1 USD
  locale: string;
}

export const CURRENCIES: Record<LocaleCode, CurrencyInfo> = {
  en: { code: 'usd', symbol: '$', rate: 1, locale: 'en-US' },
  fr: { code: 'eur', symbol: '€', rate: 0.92, locale: 'fr-FR' },
  es: { code: 'eur', symbol: '€', rate: 0.92, locale: 'es-ES' },
  de: { code: 'eur', symbol: '€', rate: 0.92, locale: 'de-DE' },
  pt: { code: 'eur', symbol: '€', rate: 0.92, locale: 'pt-PT' },
  ja: { code: 'jpy', symbol: '¥', rate: 149, locale: 'ja-JP' },
  zh: { code: 'cny', symbol: '¥', rate: 7.2, locale: 'zh-CN' },
  ko: { code: 'krw', symbol: '₩', rate: 1320, locale: 'ko-KR' },
};

export const SUPPORTED_LOCALES: LocaleCode[] = ['en', 'fr', 'es', 'de', 'pt', 'ja', 'zh', 'ko'];

interface Translations {
  subscribe: string;
  perMonth: string;
  startEmpire: string;
  payment: string;
  cardDetails: string;
  subscribeNow: string;
  priceDescription: string;
  fullAccess: string;
  included: string;
  aiAutomation: string;
  multiPlatform: string;
  prioritySupport: string;
  cancelAnytime: string;
  languageLabel: string;
  currencyLabel: string;
  processingError: string;
  successMessage: string;
  securePayment: string;
  empirePlan: string;
  monthlyBilling: string;
}

const TRANSLATIONS: Record<LocaleCode, Translations> = {
  en: {
    subscribe: 'Subscribe',
    perMonth: '/month',
    startEmpire: 'Start Your Empire',
    payment: 'Payment',
    cardDetails: 'Card Details',
    subscribeNow: 'Subscribe Now',
    priceDescription: 'Full access to AI-driven business scaling',
    fullAccess: 'Full Access',
    included: 'What\'s included:',
    aiAutomation: 'AI-powered business automation',
    multiPlatform: 'Multi-platform integration (31+ platforms)',
    prioritySupport: 'Priority support & Neural Handshake',
    cancelAnytime: 'Cancel anytime',
    languageLabel: 'Language',
    currencyLabel: 'Currency',
    processingError: 'Payment processing failed. Please try again.',
    successMessage: 'Payment successful! Welcome to EmpireLaunch AI.',
    securePayment: 'Secure Payment',
    empirePlan: 'Empire Master Plan',
    monthlyBilling: 'Monthly billing',
  },
  fr: {
    subscribe: 'S\'abonner',
    perMonth: '/mois',
    startEmpire: 'Lancez Votre Empire',
    payment: 'Paiement',
    cardDetails: 'Coordonnées bancaires',
    subscribeNow: 'S\'abonner maintenant',
    priceDescription: 'Accès complet à la mise à l\'échelle IA',
    fullAccess: 'Accès complet',
    included: 'Ce qui est inclus:',
    aiAutomation: 'Automatisation IA de votre entreprise',
    multiPlatform: 'Intégration multi-plateforme (31+ plateformes)',
    prioritySupport: 'Support prioritaire & Neural Handshake',
    cancelAnytime: 'Annulable à tout moment',
    languageLabel: 'Langue',
    currencyLabel: 'Devise',
    processingError: 'Le paiement a échoué. Veuillez réessayer.',
    successMessage: 'Paiement réussi ! Bienvenue sur EmpireLaunch AI.',
    securePayment: 'Paiement sécurisé',
    empirePlan: 'Plan Empire Master',
    monthlyBilling: 'Facturation mensuelle',
  },
  es: {
    subscribe: 'Suscribirse',
    perMonth: '/mes',
    startEmpire: 'Comienza Tu Imperio',
    payment: 'Pago',
    cardDetails: 'Detalles de la tarjeta',
    subscribeNow: 'Suscribirse ahora',
    priceDescription: 'Acceso completo a escalado empresarial con IA',
    fullAccess: 'Acceso completo',
    included: 'Incluye:',
    aiAutomation: 'Automatización empresarial con IA',
    multiPlatform: 'Integración multi-plataforma (31+ plataformas)',
    prioritySupport: 'Soporte prioritario & Neural Handshake',
    cancelAnytime: 'Cancela cuando quieras',
    languageLabel: 'Idioma',
    currencyLabel: 'Moneda',
    processingError: 'Error de pago. Intente de nuevo.',
    successMessage: '¡Pago exitoso! Bienvenido a EmpireLaunch AI.',
    securePayment: 'Pago seguro',
    empirePlan: 'Plan Empire Master',
    monthlyBilling: 'Facturación mensual',
  },
  de: {
    subscribe: 'Abonnieren',
    perMonth: '/Monat',
    startEmpire: 'Starten Sie Ihr Imperium',
    payment: 'Zahlung',
    cardDetails: 'Kartendaten',
    subscribeNow: 'Jetzt abonnieren',
    priceDescription: 'Vollzugriff auf KI-gestützte Skalierung',
    fullAccess: 'Vollzugriff',
    included: 'Enthalten:',
    aiAutomation: 'KI-gestützte Geschäftsautomatisierung',
    multiPlatform: 'Multi-Plattform-Integration (31+ Plattformen)',
    prioritySupport: 'Prioritäts-Support & Neural Handshake',
    cancelAnytime: 'Jederzeit kündbar',
    languageLabel: 'Sprache',
    currencyLabel: 'Währung',
    processingError: 'Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    successMessage: 'Zahlung erfolgreich! Willkommen bei EmpireLaunch AI.',
    securePayment: 'Sichere Zahlung',
    empirePlan: 'Empire Master Plan',
    monthlyBilling: 'Monatliche Abrechnung',
  },
  pt: {
    subscribe: 'Assinar',
    perMonth: '/mês',
    startEmpire: 'Inicie Seu Império',
    payment: 'Pagamento',
    cardDetails: 'Detalhes do cartão',
    subscribeNow: 'Assinar agora',
    priceDescription: 'Acesso completo à expansão com IA',
    fullAccess: 'Acesso completo',
    included: 'Inclui:',
    aiAutomation: 'Automação empresarial com IA',
    multiPlatform: 'Integração multi-plataforma (31+ plataformas)',
    prioritySupport: 'Suporte prioritário & Neural Handshake',
    cancelAnytime: 'Cancele quando quiser',
    languageLabel: 'Idioma',
    currencyLabel: 'Moeda',
    processingError: 'Falha no pagamento. Tente novamente.',
    successMessage: 'Pagamento bem-sucedido! Bem-vindo ao EmpireLaunch AI.',
    securePayment: 'Pagamento seguro',
    empirePlan: 'Plano Empire Master',
    monthlyBilling: 'Faturamento mensal',
  },
  ja: {
    subscribe: '登録する',
    perMonth: '/月',
    startEmpire: 'エンパイアを始める',
    payment: 'お支払い',
    cardDetails: 'カード情報',
    subscribeNow: '今すぐ登録',
    priceDescription: 'AIによるビジネス拡大への完全アクセス',
    fullAccess: '完全アクセス',
    included: '含まれるもの:',
    aiAutomation: 'AI搭載ビジネス自動化',
    multiPlatform: 'マルチプラットフォーム統合（31以上のプラットフォーム）',
    prioritySupport: '優先サポート & Neural Handshake',
    cancelAnytime: 'いつでも解約可能',
    languageLabel: '言語',
    currencyLabel: '通貨',
    processingError: '支払い処理に失敗しました。もう一度お試しください。',
    successMessage: 'お支払い完了！EmpireLaunch AIへようこそ。',
    securePayment: '安全なお支払い',
    empirePlan: 'エンパイアマスタープラン',
    monthlyBilling: '月額請求',
  },
  zh: {
    subscribe: '订阅',
    perMonth: '/月',
    startEmpire: '开始您的帝国',
    payment: '支付',
    cardDetails: '卡详情',
    subscribeNow: '立即订阅',
    priceDescription: '完全访问AI驱动的业务扩展',
    fullAccess: '完全访问',
    included: '包含内容:',
    aiAutomation: 'AI驱动的业务自动化',
    multiPlatform: '多平台集成（31+个平台）',
    prioritySupport: '优先支持 & Neural Handshake',
    cancelAnytime: '随时取消',
    languageLabel: '语言',
    currencyLabel: '货币',
    processingError: '支付失败。请重试。',
    successMessage: '支付成功！欢迎使用EmpireLaunch AI。',
    securePayment: '安全支付',
    empirePlan: '帝国大师计划',
    monthlyBilling: '按月计费',
  },
  ko: {
    subscribe: '구독하기',
    perMonth: '/월',
    startEmpire: '제국을 시작하세요',
    payment: '결제',
    cardDetails: '카드 정보',
    subscribeNow: '지금 구독',
    priceDescription: 'AI 기반 비즈니스 확장 전체 액세스',
    fullAccess: '전체 액세스',
    included: '포함 사항:',
    aiAutomation: 'AI 기반 비즈니스 자동화',
    multiPlatform: '멀티 플랫폼 통합 (31+개 플랫폼)',
    prioritySupport: '우선 지원 & Neural Handshake',
    cancelAnytime: '언제든지 취소 가능',
    languageLabel: '언어',
    currencyLabel: '통화',
    processingError: '결제 처리에 실패했습니다. 다시 시도해주세요.',
    successMessage: '결제 성공! EmpireLaunch AI에 오신 것을 환영합니다.',
    securePayment: '안전한 결제',
    empirePlan: '엠파이어 마스터 플랜',
    monthlyBilling: '월별 청구',
  },
};

// Detect browser language and map to supported locale
export function detectLocale(): LocaleCode {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem('empireLocale') as LocaleCode | null;
  if (stored && SUPPORTED_LOCALES.includes(stored)) return stored;

  const lang = navigator.language?.toLowerCase() || '';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('de')) return 'de';
  if (lang.startsWith('pt')) return 'pt';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('ko')) return 'ko';
  return 'en';
}

export function setLocale(locale: LocaleCode): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('empireLocale', locale);
  }
}

export function t(key: keyof Translations, locale?: LocaleCode): string {
  const loc = locale || detectLocale();
  return TRANSLATIONS[loc][key] || TRANSLATIONS['en'][key];
}

export function getCurrencyInfo(locale?: LocaleCode): CurrencyInfo {
  const loc = locale || detectLocale();
  return CURRENCIES[loc] || CURRENCIES['en'];
}

export function formatPrice(amountUSD: number, locale?: LocaleCode): string {
  const loc = locale || detectLocale();
  const currency = CURRENCIES[loc] || CURRENCIES['en'];
  const converted = Math.round(amountUSD * currency.rate);

  if (currency.code === 'jpy' || currency.code === 'krw') {
    return `${currency.symbol}${converted.toLocaleString(currency.locale)}`;
  }
  return `${currency.symbol}${converted.toFixed(2)}`;
}

export function getAmountInCents(amountUSD: number, locale?: LocaleCode): number {
  const loc = locale || detectLocale();
  const currency = CURRENCIES[loc] || CURRENCIES['en'];
  // For zero-decimal currencies (JPY, KRW), amount is already in smallest unit
  if (currency.code === 'jpy' || currency.code === 'krw') {
    return Math.round(amountUSD * currency.rate);
  }
  return Math.round(amountUSD * currency.rate * 100);
}