import type { AppLanguage, ChatErrorCode } from "@/types/chat";

type TranslationDictionary = {
  newChat: string;
  searchChats: string;
  noChats: string;
  settings: string;
  about: string;
  collapse: string;
  expand: string;
  welcomeTitle: string;
  welcomeSubtitle: string;
  modelPreview: string;
  composerPlaceholder: string;
  send: string;
  stop: string;
  copy: string;
  copied: string;
  regenerate: string;
  edit: string;
  delete: string;
  retry: string;
  rename: string;
  exportMarkdown: string;
  exportJson: string;
  clearAll: string;
  clearAllTitle: string;
  clearAllBody: string;
  cancel: string;
  confirm: string;
  save: string;
  close: string;
  language: string;
  theme: string;
  system: string;
  light: string;
  dark: string;
  responseStyle: string;
  concise: string;
  balanced: string;
  detailed: string;
  enterToSend: string;
  timestamps: string;
  privacy: string;
  privacyBody: string;
  version: string;
  publicModel: string;
  infrastructure: string;
  localHistory: string;
  localHistoryBody: string;
  scrollBottom: string;
  deleteMessageTitle: string;
  deleteMessageBody: string;
  poweredBy: string;
  examplePrompts: string[];
  errors: Record<ChatErrorCode, string>;
};

export const translations: Record<AppLanguage, TranslationDictionary> = {
  en: {
    newChat: "New chat",
    searchChats: "Search chats",
    noChats: "No chats found",
    settings: "Settings",
    about: "About",
    collapse: "Collapse sidebar",
    expand: "Expand sidebar",
    welcomeTitle: "How can QIVREN help?",
    welcomeSubtitle: "Ask a question, explore an idea, or work through a problem.",
    modelPreview: "Preview model — responses may contain mistakes.",
    composerPlaceholder: "Message QIVREN",
    send: "Send",
    stop: "Stop generation",
    copy: "Copy",
    copied: "Copied",
    regenerate: "Regenerate",
    edit: "Edit",
    delete: "Delete",
    retry: "Retry",
    rename: "Rename",
    exportMarkdown: "Export Markdown",
    exportJson: "Export JSON",
    clearAll: "Clear all chats",
    clearAllTitle: "Clear local history?",
    clearAllBody: "This permanently removes every locally saved conversation from this browser.",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    close: "Close",
    language: "Language",
    theme: "Theme",
    system: "System",
    light: "Light",
    dark: "Dark",
    responseStyle: "Response style",
    concise: "Concise",
    balanced: "Balanced",
    detailed: "Detailed",
    enterToSend: "Enter to send",
    timestamps: "Show timestamps",
    privacy: "Privacy",
    privacyBody: "Chats are stored locally in your browser. Requests are sent through QIVREN's secure server route and may be processed by third-party AI infrastructure. Do not submit highly sensitive information.",
    version: "App version",
    publicModel: "Public model",
    infrastructure: "Infrastructure",
    localHistory: "Local chat history",
    localHistoryBody: "Conversation titles and messages stay in this browser unless you export or clear them.",
    scrollBottom: "Scroll to bottom",
    deleteMessageTitle: "Delete this message?",
    deleteMessageBody: "The selected message will be removed from this conversation.",
    poweredBy: "Powered by Vireqon Intelligence",
    examplePrompts: [
      "Explain a difficult idea in simple terms",
      "Help me plan a focused study session",
      "Review this code and find possible bugs",
      "Write a professional message in my language"
    ],
    errors: {
      MISSING_API_KEY: "QIVREN is not configured yet. Add the server API key and try again.",
      INVALID_API_KEY: "The server API key is invalid. Update it and try again.",
      RATE_LIMITED: "Too many requests. Please wait a moment and try again.",
      NETWORK_ERROR: "The network connection was interrupted. Check your connection and retry.",
      REQUEST_TIMEOUT: "The request took too long. Please retry with a shorter message.",
      PROVIDER_UNAVAILABLE: "QIVREN is temporarily unavailable. Please try again shortly.",
      EMPTY_RESPONSE: "QIVREN returned an empty response. Please retry.",
      MESSAGE_TOO_LONG: "This message is too long. Shorten it and try again.",
      INVALID_REQUEST: "The request could not be processed. Please refresh and try again.",
      SERVER_ERROR: "Something went wrong on the server. Please try again."
    }
  },
  az: {
    newChat: "Yeni söhbət",
    searchChats: "Söhbətlərdə axtar",
    noChats: "Söhbət tapılmadı",
    settings: "Tənzimləmələr",
    about: "Haqqında",
    collapse: "Yan paneli yığ",
    expand: "Yan paneli aç",
    welcomeTitle: "QIVREN necə kömək edə bilər?",
    welcomeSubtitle: "Sual ver, ideyanı araşdır və ya problemi addım-addım həll et.",
    modelPreview: "İlkin baxış modelidir — cavablarda səhv ola bilər.",
    composerPlaceholder: "QIVREN-ə mesaj yaz",
    send: "Göndər",
    stop: "Cavabı dayandır",
    copy: "Kopyala",
    copied: "Kopyalandı",
    regenerate: "Yenidən yarat",
    edit: "Düzəliş et",
    delete: "Sil",
    retry: "Yenidən yoxla",
    rename: "Adını dəyiş",
    exportMarkdown: "Markdown kimi ixrac et",
    exportJson: "JSON kimi ixrac et",
    clearAll: "Bütün söhbətləri sil",
    clearAllTitle: "Yerli tarixçə silinsin?",
    clearAllBody: "Bu brauzerdə saxlanmış bütün söhbətlər həmişəlik silinəcək.",
    cancel: "Ləğv et",
    confirm: "Təsdiqlə",
    save: "Yadda saxla",
    close: "Bağla",
    language: "Dil",
    theme: "Mövzu",
    system: "Sistem",
    light: "İşıqlı",
    dark: "Qaranlıq",
    responseStyle: "Cavab üslubu",
    concise: "Qısa",
    balanced: "Balanslı",
    detailed: "Ətraflı",
    enterToSend: "Enter ilə göndər",
    timestamps: "Vaxtı göstər",
    privacy: "Məxfilik",
    privacyBody: "Söhbətlər brauzerinizdə yerli saxlanılır. Sorğular QIVREN-in təhlükəsiz server marşrutu ilə göndərilir və üçüncü tərəf AI infrastrukturu tərəfindən emal oluna bilər. Çox həssas məlumat göndərməyin.",
    version: "Tətbiq versiyası",
    publicModel: "İctimai model",
    infrastructure: "İnfrastruktur",
    localHistory: "Yerli söhbət tarixçəsi",
    localHistoryBody: "İxrac etmədikcə və ya silmədikcə söhbətlər bu brauzerdə qalır.",
    scrollBottom: "Aşağı keç",
    deleteMessageTitle: "Bu mesaj silinsin?",
    deleteMessageBody: "Seçilmiş mesaj söhbətdən silinəcək.",
    poweredBy: "Powered by Vireqon Intelligence",
    examplePrompts: [
      "Çətin mövzunu sadə dillə izah et",
      "Mənə fokuslu dərs planı hazırla",
      "Bu kodu yoxla və mümkün xətaları tap",
      "Dilimizdə peşəkar mesaj yaz"
    ],
    errors: {
      MISSING_API_KEY: "QIVREN hələ konfiqurasiya edilməyib. Server API açarını əlavə edib yenidən yoxlayın.",
      INVALID_API_KEY: "Server API açarı yanlışdır. Açarı yeniləyib yenidən yoxlayın.",
      RATE_LIMITED: "Çox sayda sorğu göndərildi. Bir az gözləyib yenidən yoxlayın.",
      NETWORK_ERROR: "Şəbəkə bağlantısı kəsildi. İnterneti yoxlayıb yenidən cəhd edin.",
      REQUEST_TIMEOUT: "Sorğu çox uzun çəkdi. Daha qısa mesajla yenidən yoxlayın.",
      PROVIDER_UNAVAILABLE: "QIVREN müvəqqəti əlçatan deyil. Bir qədər sonra yenidən yoxlayın.",
      EMPTY_RESPONSE: "QIVREN boş cavab qaytardı. Yenidən cəhd edin.",
      MESSAGE_TOO_LONG: "Mesaj çox uzundur. Qısaldıb yenidən göndərin.",
      INVALID_REQUEST: "Sorğu emal olunmadı. Səhifəni yeniləyib yenidən yoxlayın.",
      SERVER_ERROR: "Serverdə xəta baş verdi. Yenidən cəhd edin."
    }
  },
  tr: {
    newChat: "Yeni sohbet",
    searchChats: "Sohbetlerde ara",
    noChats: "Sohbet bulunamadı",
    settings: "Ayarlar",
    about: "Hakkında",
    collapse: "Kenar çubuğunu daralt",
    expand: "Kenar çubuğunu aç",
    welcomeTitle: "QIVREN nasıl yardımcı olabilir?",
    welcomeSubtitle: "Bir soru sor, bir fikri keşfet veya bir problemi birlikte çöz.",
    modelPreview: "Önizleme modeli — yanıtlar hata içerebilir.",
    composerPlaceholder: "QIVREN'e mesaj gönder",
    send: "Gönder",
    stop: "Yanıtı durdur",
    copy: "Kopyala",
    copied: "Kopyalandı",
    regenerate: "Yeniden oluştur",
    edit: "Düzenle",
    delete: "Sil",
    retry: "Tekrar dene",
    rename: "Yeniden adlandır",
    exportMarkdown: "Markdown dışa aktar",
    exportJson: "JSON dışa aktar",
    clearAll: "Tüm sohbetleri temizle",
    clearAllTitle: "Yerel geçmiş temizlensin mi?",
    clearAllBody: "Bu tarayıcıda kayıtlı tüm konuşmalar kalıcı olarak silinir.",
    cancel: "İptal",
    confirm: "Onayla",
    save: "Kaydet",
    close: "Kapat",
    language: "Dil",
    theme: "Tema",
    system: "Sistem",
    light: "Açık",
    dark: "Koyu",
    responseStyle: "Yanıt stili",
    concise: "Kısa",
    balanced: "Dengeli",
    detailed: "Detaylı",
    enterToSend: "Enter ile gönder",
    timestamps: "Zaman damgalarını göster",
    privacy: "Gizlilik",
    privacyBody: "Sohbetler tarayıcınızda yerel olarak saklanır. İstekler QIVREN'in güvenli sunucu rotasından iletilir ve üçüncü taraf AI altyapısı tarafından işlenebilir. Çok hassas bilgi göndermeyin.",
    version: "Uygulama sürümü",
    publicModel: "Genel model",
    infrastructure: "Altyapı",
    localHistory: "Yerel sohbet geçmişi",
    localHistoryBody: "Dışa aktarmadığınız veya temizlemediğiniz sürece konuşmalar bu tarayıcıda kalır.",
    scrollBottom: "En alta git",
    deleteMessageTitle: "Bu mesaj silinsin mi?",
    deleteMessageBody: "Seçilen mesaj bu konuşmadan kaldırılacak.",
    poweredBy: "Powered by Vireqon Intelligence",
    examplePrompts: [
      "Zor bir konuyu basitçe açıkla",
      "Odaklı bir çalışma planı hazırla",
      "Bu kodu incele ve olası hataları bul",
      "Profesyonel bir mesaj yaz"
    ],
    errors: {
      MISSING_API_KEY: "QIVREN henüz yapılandırılmamış. Sunucu API anahtarını ekleyip tekrar deneyin.",
      INVALID_API_KEY: "Sunucu API anahtarı geçersiz. Anahtarı güncelleyip tekrar deneyin.",
      RATE_LIMITED: "Çok fazla istek gönderildi. Biraz bekleyip tekrar deneyin.",
      NETWORK_ERROR: "Ağ bağlantısı kesildi. Bağlantınızı kontrol edip tekrar deneyin.",
      REQUEST_TIMEOUT: "İstek çok uzun sürdü. Daha kısa bir mesajla tekrar deneyin.",
      PROVIDER_UNAVAILABLE: "QIVREN geçici olarak kullanılamıyor. Kısa süre sonra tekrar deneyin.",
      EMPTY_RESPONSE: "QIVREN boş bir yanıt döndürdü. Tekrar deneyin.",
      MESSAGE_TOO_LONG: "Bu mesaj çok uzun. Kısaltıp tekrar gönderin.",
      INVALID_REQUEST: "İstek işlenemedi. Sayfayı yenileyip tekrar deneyin.",
      SERVER_ERROR: "Sunucuda bir sorun oluştu. Lütfen tekrar deneyin."
    }
  },
  ru: {
    newChat: "Новый чат",
    searchChats: "Поиск по чатам",
    noChats: "Чаты не найдены",
    settings: "Настройки",
    about: "О приложении",
    collapse: "Свернуть боковую панель",
    expand: "Развернуть боковую панель",
    welcomeTitle: "Чем QIVREN может помочь?",
    welcomeSubtitle: "Задайте вопрос, изучите идею или разберите проблему.",
    modelPreview: "Предварительная версия — ответы могут содержать ошибки.",
    composerPlaceholder: "Сообщение для QIVREN",
    send: "Отправить",
    stop: "Остановить ответ",
    copy: "Копировать",
    copied: "Скопировано",
    regenerate: "Создать заново",
    edit: "Изменить",
    delete: "Удалить",
    retry: "Повторить",
    rename: "Переименовать",
    exportMarkdown: "Экспорт Markdown",
    exportJson: "Экспорт JSON",
    clearAll: "Очистить все чаты",
    clearAllTitle: "Очистить локальную историю?",
    clearAllBody: "Все разговоры, сохранённые в этом браузере, будут удалены навсегда.",
    cancel: "Отмена",
    confirm: "Подтвердить",
    save: "Сохранить",
    close: "Закрыть",
    language: "Язык",
    theme: "Тема",
    system: "Системная",
    light: "Светлая",
    dark: "Тёмная",
    responseStyle: "Стиль ответа",
    concise: "Кратко",
    balanced: "Сбалансированно",
    detailed: "Подробно",
    enterToSend: "Enter для отправки",
    timestamps: "Показывать время",
    privacy: "Конфиденциальность",
    privacyBody: "Чаты хранятся локально в вашем браузере. Запросы отправляются через защищённый серверный маршрут QIVREN и могут обрабатываться сторонней AI-инфраструктурой. Не отправляйте особо конфиденциальные данные.",
    version: "Версия приложения",
    publicModel: "Публичная модель",
    infrastructure: "Инфраструктура",
    localHistory: "Локальная история чатов",
    localHistoryBody: "Разговоры остаются в этом браузере, пока вы не экспортируете или не удалите их.",
    scrollBottom: "Прокрутить вниз",
    deleteMessageTitle: "Удалить сообщение?",
    deleteMessageBody: "Выбранное сообщение будет удалено из разговора.",
    poweredBy: "Powered by Vireqon Intelligence",
    examplePrompts: [
      "Объясни сложную идею простыми словами",
      "Составь план продуктивной учёбы",
      "Проверь код и найди возможные ошибки",
      "Напиши профессиональное сообщение"
    ],
    errors: {
      MISSING_API_KEY: "QIVREN ещё не настроен. Добавьте серверный API-ключ и повторите попытку.",
      INVALID_API_KEY: "Серверный API-ключ недействителен. Обновите его и повторите попытку.",
      RATE_LIMITED: "Слишком много запросов. Подождите немного и повторите попытку.",
      NETWORK_ERROR: "Сетевое соединение прервано. Проверьте подключение и повторите попытку.",
      REQUEST_TIMEOUT: "Запрос выполнялся слишком долго. Попробуйте отправить более короткое сообщение.",
      PROVIDER_UNAVAILABLE: "QIVREN временно недоступен. Повторите попытку немного позже.",
      EMPTY_RESPONSE: "QIVREN вернул пустой ответ. Повторите попытку.",
      MESSAGE_TOO_LONG: "Сообщение слишком длинное. Сократите его и отправьте снова.",
      INVALID_REQUEST: "Не удалось обработать запрос. Обновите страницу и повторите попытку.",
      SERVER_ERROR: "На сервере произошла ошибка. Повторите попытку."
    }
  }
};

export function t(language: AppLanguage) {
  return translations[language];
}
