// --- Global Variables ---
let currentCategory = 'morning';
let currentAzkarIndex = 0;
let currentRepeatCount = 0;
let azkarData = {}; // Will hold all azkar categories
let customAzkar = loadCustomAzkar(); // Load custom azkar from localStorage
let deferredPrompt; // For PWA install prompt

// --- DOM Elements ---
// يتم تعريف عناصر DOM الثابتة الموجودة في index.html هنا
// Ensure DOM is loaded before running anything
document.addEventListener('DOMContentLoaded', () => {
    // Safely get DOM elements
    const themeSelector = document.getElementById('themeSelector');
    const azkarDisplay = document.getElementById('azkarDisplay');
    const azkarCount = document.getElementById('azkarCount');
    const counterButton = document.getElementById('counterButton');
    const nextButton = document.getElementById('nextButton');
    const prevButton = document.getElementById('prevButton');
    const resetButton = document.getElementById('resetButton');
    const languageSelector = document.getElementById('languageSelector');
    const fontSizeSelector = document.getElementById('fontSizeSelector');
    const currentFontSizeSpan = document.getElementById('currentFontSize');
    const customAzkarBtn = document.getElementById('customAzkarBtn');
    const addAzkarBtn = document.getElementById('addAzkarBtn');
    const customAzkarInput = document.getElementById('customAzkarInput');
    const customAzkarList = document.getElementById('customAzkarList');
    const copyButton = document.getElementById('copyButton');
    const modal = document.getElementById('modal');
    const modalText = document.getElementById('modalText');
    const modalConfirm = document.getElementById('modalConfirm');
    const modalCancel = document.getElementById('modalCancel');

    // Check if all critical elements exist
    if (!themeSelector || !azkarDisplay || !azkarCount || !counterButton || !nextButton ||
        !prevButton || !resetButton || !languageSelector || !fontSizeSelector ||
        !currentFontSizeSpan || !customAzkarBtn || !addAzkarBtn || !customAzkarInput ||
        !customAzkarList || !copyButton || !modal || !modalText || !modalConfirm || !modalCancel) {
        console.error('One or more required DOM elements are missing.');
        return;
    }

    // Settings and state
    let currentAzkarIndex = 0;
    let currentCount = 0;
    let azkarList = [];
    let customAzkar = [];
    let language = localStorage.getItem('language') || 'ar';
    let theme = localStorage.getItem('theme') || 'light';
    let fontSize = parseFloat(localStorage.getItem('fontSize'));
    fontSize = fontSize || 1.1;

    // --- Settings Variables (Loaded from localStorage or default) ---
    let isDarkMode = localStorage.getItem('darkMode') === 'true';
    let selectedTheme = localStorage.getItem('selectedTheme') || 'default';
    let selectedFont = localStorage.getItem('selectedFont') || 'Amiri';
    let fontSizeSetting = parseFloat(localStorage.getItem('fontSize')) || 1.1;
    let autoSkip = localStorage.getItem('autoSkip') === 'true';
    let notificationEnabled = localStorage.getItem('notificationEnabled') === 'true';
    let customAzkarReminder = localStorage.getItem('customAzkarReminder') === 'true';
    let currentLanguage = localStorage.getItem('currentLanguage') || 'ar'; // New: Current language

    // (Translation object starts next, do not include it in this copy.)
});

// --- Translations Object ---
// Object to hold all translatable strings in the application
const translations = {
    'ar': {
        'appTitle': 'تطبيق الفزازي للأذكار',
        'home': 'الرئيسية',
        'settings': 'الإعدادات',
        'stats': 'إحصاءاتي',
        'contactUs': 'تواصل معنا',
        'about': 'عن التطبيق',
        'darkMode': 'الوضع الليلي:',
        'theme': 'السمة:',
        'defaultTheme': 'افتراضي (أخضر)',
        'blueTheme': 'أزرق',
        'brownTheme': 'بني',
        'font': 'الخط:',
        'fontSize': 'حجم الخط:',
        'autoSkip': 'تخطي الذكر تلقائياً:',
        'enableNotifications': 'تفعيل الإشعارات:',
        'customAzkarReminder': 'تذكير أذكاري الخاصة:',
        'resetApp': 'إعادة تعيين التطبيق وتحديثه',
        'installApp': 'تثبيت التطبيق',
        'azkarEnded': 'انتهت أذكار هذه الفئة! يمكنك البدء من جديد أو اختيار فئة أخرى.',
        'noAzkar': 'لا يوجد أذكار لعرضها في هذه الفئة.',
        'counter': 'العداد:',
        'tapHere': 'اضغط هنا',
        'prevAzkar': 'الذكر السابق',
        'shareAzkar': 'مشاركة الذكر',
        'skip': 'تخطي',
        'nextAzkar': 'الذكر التالي',
        'addCustomAzkar': 'إضافة ذكر جديد',
        'manageCustomAzkar': 'إدارة أذكاري الخاصة',
        'noCustomAzkar': 'لا يوجد أذكار مخصصة بعد. أضف بعض الأذكار!',
        'startCustomSession': 'بدء جلسة أذكار مخصصة',
        'azkarTextPlaceholder': 'نص الذكر',
        'repeatCountPlaceholder': 'عدد التكرار',
        'save': 'حفظ',
        'cancel': 'إلغاء',
        'saveEdits': 'حفظ التعديلات',
        'delete': 'حذف',
        'confirmDeleteTitle': 'تأكيد الحذف',
        'confirmDeleteMessage': 'هل أنت متأكد أنك تريد حذف هذا الذكر المخصص؟',
        'copySuccess': 'تم نسخ الذكر بنجاح!',
        'shareFailed': 'فشل في المشاركة، قد لا يدعم جهازك هذه الميزة.',
        'browserNoShare': 'متصفحك لا يدعم ميزة المشاركة المباشرة. يمكنك نسخ النص يدوياً.',
        'noInfo': 'لا توجد معلومات متاحة لهذا الذكر.',
        'infoTitle': 'معلومات الذكر',
        'meaning': 'المعنى:',
        'virtue': 'الفضل:',
        'source': 'المصدر:',
        'hadithNumber': 'رقم الحديث:',
        'additionalInfo': 'معلومات إضافية:',
        'focusModeOn': 'تم تفعيل وضع التركيز. سيتم إخفاء بعض العناصر.',
        'focusModeOff': 'تم إلغاء وضع التركيز.',
        'alert': 'تنبيه',
        'close': 'إغلاق',
        'confirm': 'تأكيد',
        'resetConfirmTitle': 'إعادة تعيين التطبيق وتحديثه',
        'resetConfirmMessage': 'هل أنت متأكد أنك تريد إعادة تعيين التطبيق؟ سيتم حذف جميع أذكارك المخصصة وإعادة تعيين الإعدادات، ثم سيتم تحديث التطبيق إلى أحدث إصدار.',
        'resetSuccess': 'تم إعادة تعيين التطبيق بنجاح. سيتم إعادة تحميل الصفحة الآن لتطبيق التحديثات.',
        'notificationsEnabled': 'تم تفعيل الإشعارات بنجاح!',
        'notificationsDenied': 'تم رفض تفعيل إذن الإشعارات.',
        'notificationsBlocked': 'الإشعارات محظورة لمتصفحك. الرجاء تغيير الإعدادات في متصفحك للسماح بالإشعارات لهذا الموقع.',
        'browserNoNotifications': 'المتصفح لا يدعم الإشعارات.',
        'pwaInstallPromptFailed': 'لا يمكن عرض نافذة التثبيت في الوقت الحالي. ربما تم تثبيت التطبيق بالفعل، أو أن المتصفح لا يدعم هذه الميزة.',
        'noShareContent': 'لا يوجد ذكر لمشاركته حالياً.',
        'statsPageTitle': 'إحصاءاتي',
        'statsPageDescription': 'هنا يمكنك عرض إحصائيات استخدامك للتطبيق.',
        'completedAzkarToday': 'عدد الأذكار المكتملة اليوم:',
        'totalCompletedAzkar': 'إجمالي الأذكار المكتملة:',
        'lastSessionDate': 'آخر جلسة:',
        'noLastSession': 'لا توجد',
        'viewDetailedReport': 'عرض تقرير مفصل',
        'featureUnderDevelopment': 'هذه الميزة قيد التطوير!',
        'contactUsPageTitle': 'تواصل معنا',
        'contactUsPageDescription': 'يسعدنا تواصلكم معنا لأي استفسارات أو اقتراحات.',
        'contactWhatsapp': 'تواصل عبر واتساب',
        'contactEmail': 'أرسل بريد إلكتروني',
        'aboutPageTitle': 'عن التطبيق',
        'aboutPageP1': 'تطبيق الأذكار هو رفيقك اليومي لتذكيرك بالأذكار والأدعية المهمة في حياتك.',
        'aboutPageP2': 'يهدف التطبيق إلى تسهيل قراءة الأذكار والمحافظة عليها، مع توفير خيارات تخصيص لتناسب احتياجاتك.',
        'version': 'الإصدار:',
        'developedBy': 'تم التطوير بواسطة:',
        'hopeMessage': 'نأمل أن يكون هذا التطبيق عوناً لنا ولكم في ذكر الله.',
        'allRightsReserved': 'جميع الحقوق محفوظة.',
        'designedWithLove': 'صممناه بحب ليساعدنا واياكم على ذكر الله.',
        'morningAzkar': 'أذكار الصباح',
        'eveningAzkar': 'أذكار المساء',
        'sleepAzkar': 'أذكار النوم',
        'wakeUpAzkar': 'أذكار الاستيقاظ',
        'prayerAzkar': 'أذكار الصلاة',
        'fortressBook': 'حصن المسلم',
        'generalAzkar': 'أذكار متنوعة',
        'dailyDuaa': 'أدعية يومية',
        'dailyQuran': 'آيات من القرآن',
        'customAzkar': 'أذكاري الخاصة',
        'moveUp': 'تحريك لأعلى',
        'moveDown': 'تحريك لأسفل',
        'edit': 'تعديل',
        'editDhikr': 'تعديل الذكر',
        'enterValidAzkarInfo': 'الرجاء إدخال نص الذكر وعدد تكرار صحيح.',
        'customDhikr': 'ذكر مخصص',
        'times': 'مرات',
        'inquirySubject': 'استفسار بخصوص تطبيق الأذكار',
        'copy': 'نسخ',
        'share': 'مشاركة'
    },
    'en': {
        'appTitle': 'Fazazi Azkar App',
        'home': 'Home',
        'settings': 'Settings',
        'stats': 'My Stats',
        'contactUs': 'Contact Us',
        'about': 'About',
        'darkMode': 'Dark Mode:',
        'theme': 'Theme:',
        'defaultTheme': 'Default (Green)',
        'blueTheme': 'Blue',
        'brownTheme': 'Brown',
        'font': 'Font:',
        'fontSize': 'Font Size:',
        'autoSkip': 'Auto Skip Dhikr:',
        'enableNotifications': 'Enable Notifications:',
        'customAzkarReminder': 'Custom Azkar Reminder:',
        'resetApp': 'Reset App & Update',
        'installApp': 'Install App',
        'azkarEnded': 'This category\'s Azkar have ended! You can start again or choose another category.',
        'noAzkar': 'No Azkar to display in this category.',
        'counter': 'Counter:',
        'tapHere': 'Tap Here',
        'prevAzkar': 'Previous Dhikr',
        'shareAzkar': 'Share Dhikr',
        'skip': 'Skip',
        'nextAzkar': 'Next Dhikr',
        'addCustomAzkar': 'Add New Dhikr',
        'manageCustomAzkar': 'Manage My Custom Azkar',
        'noCustomAzkar': 'No custom Azkar yet. Add some!',
        'startCustomSession': 'Start Custom Azkar Session',
        'azkarTextPlaceholder': 'Dhikr Text',
        'repeatCountPlaceholder': 'Repeat Count',
        'save': 'Save',
        'cancel': 'Cancel',
        'saveEdits': 'Save Edits',
        'delete': 'Delete',
        'confirmDeleteTitle': 'Confirm Deletion',
        'confirmDeleteMessage': 'Are you sure you want to delete this custom Dhikr?',
        'copySuccess': 'Dhikr copied successfully!',
        'shareFailed': 'Share failed, your device may not support this feature.',
        'browserNoShare': 'Your browser does not support direct sharing. You can copy the text manually.',
        'noInfo': 'No information available for this Dhikr.',
        'infoTitle': 'Dhikr Information',
        'meaning': 'Meaning:',
        'virtue': 'Virtue:',
        'source': 'Source:',
        'hadithNumber': 'Hadith Number:',
        'additionalInfo': 'Additional Info:',
        'focusModeOn': 'Focus mode enabled. Some elements will be hidden.',
        'focusModeOff': 'Focus mode disabled.',
        'alert': 'Alert',
        'close': 'Close',
        'confirm': 'Confirm',
        'resetConfirmTitle': 'Reset App & Update',
        'resetConfirmMessage': 'Are you sure you want to reset the app? All your custom Azkar and settings will be deleted, then the app will update to the latest version.',
        'resetSuccess': 'App reset successfully. The page will reload now to apply updates.',
        'notificationsEnabled': 'Notifications enabled successfully!',
        'notificationsDenied': 'Notification permission denied.',
        'notificationsBlocked': 'Notifications are blocked for your browser. Please change your browser settings to allow notifications for this site.',
        'browserNoNotifications': 'Your browser does not support notifications.',
        'pwaInstallPromptFailed': 'Cannot show install prompt at this time. The app might already be installed, or your browser does not support this feature.',
        'noShareContent': 'No Dhikr to share currently.',
        'statsPageTitle': 'My Statistics',
        'statsPageDescription': 'Here you can view your app usage statistics.',
        'completedAzkarToday': 'Azkar Completed Today:',
        'totalCompletedAzkar': 'Total Azkar Completed:',
        'lastSessionDate': 'Last Session:',
        'noLastSession': 'None',
        'viewDetailedReport': 'View Detailed Report',
        'featureUnderDevelopment': 'This feature is under development!',
        'contactUsPageTitle': 'Contact Us',
        'contactUsPageDescription': 'We are happy to hear from you for any inquiries or suggestions.',
        'contactWhatsapp': 'Contact via WhatsApp',
        'contactEmail': 'Send Email',
        'aboutPageTitle': 'About the App',
        'aboutPageP1': 'Azkar App is your daily companion to remind you of important Azkar and supplications in your life.',
        'aboutPageP2': 'The app aims to facilitate reading and maintaining Azkar, while providing customization options to suit your needs.',
        'version': 'Version:',
        'developedBy': 'Developed by:',
        'hopeMessage': 'We hope this app will be a help to you in remembering Allah.',
        'allRightsReserved': 'All rights reserved.',
        'designedWithLove': 'Designed with love to help you remember Allah.',
        'morningAzkar': 'Morning Azkar',
        'eveningAzkar': 'Evening Azkar',
        'sleepAzkar': 'Sleep Azkar',
        'wakeUpAzkar': 'Wake Up Azkar',
        'prayerAzkar': 'Prayer Azkar',
        'fortressBook': 'Fortress of the Muslim',
        'generalAzkar': 'General Azkar',
        'dailyDuaa': 'Daily Duas',
        'dailyQuran': 'Quranic Verses',
        'customAzkar': 'My Custom Azkar',
        'moveUp': 'Move Up',
        'moveDown': 'Move Down',
        'edit': 'Edit',
        'editDhikr': 'Edit Dhikr',
        'enterValidAzkarInfo': 'Please enter valid Dhikr text and repeat count.',
        'customDhikr': 'Custom Dhikr',
        'times': 'times',
        'inquirySubject': 'Azkar App Inquiry',
        'copy': 'Copy',
        'share': 'Share'
    },
    'ur': {
        'appTitle': 'اذکار ایپ',
        'home': 'ہوم',
        'settings': 'ترتیبات',
        'stats': 'میری شماریات',
        'contactUs': 'ہم سے رابطہ کریں',
        'about': 'کے بارے میں',
        'darkMode': 'ڈارک موڈ:',
        'theme': 'تھیم:',
        'defaultTheme': 'پہلے سے طے شدہ (سبز)',
        'blueTheme': 'نیلا',
        'brownTheme': 'بھورا',
        'font': 'فونٹ:',
        'fontSize': 'فونٹ سائز:',
        'autoSkip': 'ذکر خودکار چھوڑ دیں:',
        'enableNotifications': 'اطلاعات فعال کریں:',
        'customAzkarReminder': 'اپنی مرضی کے اذکار یاد دہانی:',
        'resetApp': 'ایپ ری سیٹ کریں اور اپ ڈیٹ کریں',
        'installApp': 'ایپ انسٹال کریں',
        'azkarEnded': 'اس زمرے کے اذکار ختم ہو گئے ہیں! آپ دوبارہ شروع کر سکتے ہیں یا کوئی اور زمرہ منتخب کر سکتے ہیں۔',
        'noAzkar': 'اس زمرے میں کوئی اذکار ظاہر کرنے کے لیے نہیں ہیں۔',
        'counter': 'کاؤنٹر:',
        'tapHere': 'یہاں ٹیپ کریں',
        'prevAzkar': 'پچھلا ذکر',
        'shareAzkar': 'ذکر شیئر کریں',
        'skip': 'چھوڑ دیں',
        'nextAzkar': 'اگلا ذکر',
        'addCustomAzkar': 'نیا ذکر شامل کریں',
        'manageCustomAzkar': 'میرے حسب ضرورت اذکار کا انتظام کریں',
        'noCustomAzkar': 'ابھی تک کوئی حسب ضرورت اذکار نہیں ہے۔ کچھ شامل کریں!',
        'startCustomSession': 'حسب ضرورت اذکار سیشن شروع کریں',
        'azkarTextPlaceholder': 'ذکر کا متن',
        'repeatCountPlaceholder': 'تکرار کی گنتی',
        'save': 'محفوظ کریں',
        'cancel': 'منسوخ کریں',
        'saveEdits': 'ترمیمات محفوظ کریں',
        'delete': 'حذف کریں',
        'confirmDeleteTitle': 'حذف کی تصدیق کریں',
        'confirmDeleteMessage': 'کیا آپ واقعی اس حسب ضرورت ذکر کو حذف کرنا چاہتے ہیں؟',
        'copySuccess': 'ذکر کامیابی سے کاپی ہو گیا!',
        'shareFailed': 'شیئر ناکام ہو گیا، ہو سکتا ہے آپ کا آلہ اس خصوصیت کو سپورٹ نہ کرتا ہو۔',
        'browserNoShare': 'آپ کا براؤزر براہ راست شیئرنگ کی خصوصیت کو سپورٹ نہیں کرتا ہے۔ آپ متن کو دستی طور پر کاپی کر سکتے ہیں۔',
        'noInfo': 'اس ذکر کے لیے کوئی معلومات دستیاب نہیں ہے۔',
        'infoTitle': 'ذکر کی معلومات',
        'meaning': 'معنی:',
        'virtue': 'فضیلت:',
        'source': 'ماخذ:',
        'hadithNumber': 'حدیث نمبر:',
        'additionalInfo': 'اضافی معلومات:',
        'focusModeOn': 'فوکس موڈ فعال ہو گیا ہے۔ کچھ عناصر چھپ جائیں گے۔',
        'focusModeOff': 'فوکس موڈ غیر فعال ہو گیا ہے۔',
        'alert': 'انتباہ',
        'close': 'بند کریں',
        'confirm': 'تصدیق کریں',
        'resetConfirmTitle': 'ایپ ری سیٹ کریں اور اپ ڈیٹ کریں',
        'resetConfirmMessage': 'کیا آپ واقعی ایپ کو ری سیٹ کرنا چاہتے ہیں؟ آپ کے تمام حسب ضرورت اذکار اور ترتیبات حذف ہو جائیں گی، پھر ایپ تازہ ترین ورژن پر اپ ڈیٹ ہو جائے گا۔',
        'resetSuccess': 'ایپ کامیابی سے ری سیٹ ہو گئی۔ اپ ڈیٹس لاگو کرنے کے لیے صفحہ اب ری لوڈ ہو گا۔',
        'notificationsEnabled': 'اطلاعات کامیابی سے فعال ہو گئیں!',
        'notificationsDenied': 'اطلاعات کی اجازت مسترد کر دی گئی۔',
        'notificationsBlocked': 'آپ کے براؤزر کے لیے اطلاعات مسدود ہیں۔ براہ کرم اس سائٹ کے لیے اطلاعات کی اجازت دینے کے لیے اپنے براؤزر کی ترتیبات تبدیل کریں۔',
        'browserNoNotifications': 'آپ کا براؤزر اطلاعات کو سپورٹ نہیں کرتا ہے۔',
        'pwaInstallPromptFailed': 'اس وقت انسٹال پرامپٹ نہیں دکھایا جا سکتا۔ ہو سکتا ہے ایپ پہلے سے انسٹال ہو، یا آپ کا براؤزر اس خصوصیت کو سپورٹ نہیں کرتا ہے۔',
        'noShareContent': 'فی الحال شیئر کرنے کے لیے کوئی ذکر نہیں ہے۔',
        'statsPageTitle': 'میری شماریات',
        'statsPageDescription': 'یہاں آپ اپنے ایپ کے استعمال کی شماریات دیکھ سکتے ہیں۔',
        'completedAzkarToday': 'آج مکمل ہونے والے اذکار:',
        'totalCompletedAzkar': 'کل مکمل ہونے والے اذکار:',
        'lastSessionDate': 'آخری سیشن:',
        'noLastSession': 'کوئی نہیں',
        'viewDetailedReport': 'تفصیلی رپورٹ دیکھیں',
        'featureUnderDevelopment': 'یہ خصوصیت زیرِ ترقی ہے!',
        'contactUsPageTitle': 'ہم سے رابطہ کریں',
        'contactUsPageDescription': 'ہم آپ کے کسی بھی سوال یا تجاویز کے لیے آپ سے رابطہ کرنے میں خوش ہیں۔',
        'contactWhatsapp': 'واٹس ایپ کے ذریعے رابطہ کریں',
        'contactEmail': 'ای میل بھیجیں',
        'aboutPageTitle': 'ایپ کے بارے میں',
        'aboutPageP1': 'اذکار ایپ آپ کی روزمرہ کی زندگی میں اہم اذکار اور دعاؤں کی یاد دلانے کے لیے آپ کا روزمرہ کا ساتھی ہے۔',
        'aboutPageP2': 'ایپ کا مقصد اذکار کو پڑھنے اور برقرار رکھنے میں آسانی فراہم کرنا ہے، جبکہ آپ کی ضروریات کے مطابق تخصیص کے اختیارات بھی فراہم کرنا ہے۔',
        'version': 'ورژن:',
        'developedBy': 'تیار کردہ از:',
        'hopeMessage': 'ہم امید کرتے ہیں کہ یہ ایپ آپ کو اللہ کو یاد کرنے میں مددگار ثابت ہو گی۔',
        'allRightsReserved': 'تمام حقوق محفوظ ہیں۔',
        'designedWithLove': 'اللہ کو یاد کرنے میں آپ کی مدد کے لیے محبت سے ڈیزائن کیا گیا ہے۔',
        'morningAzkar': 'صبح کے اذکار',
        'eveningAzkar': 'شام کے اذکار',
        'sleepAzkar': 'سونے کے اذکار',
        'wakeUpAzkar': 'جاگنے کے اذکار',
        'prayerAzkar': 'نماز کے اذکار',
        'fortressBook': 'حصن المسلم',
        'generalAzkar': 'متفرق اذکار',
        'dailyDuaa': 'روزانہ کی دعائیں',
        'dailyQuran': 'قرآنی آیات',
        'customAzkar': 'میرے حسب ضرورت اذکار',
        'moveUp': 'اوپر منتقل کریں',
        'moveDown': 'نیچے منتقل کریں',
        'edit': 'ترمیم کریں',
        'editDhikr': 'ذکر میں ترمیم کریں',
        'enterValidAzkarInfo': 'براہ کرم درست ذکر کا متن اور تکرار کی گنتی درج کریں۔',
        'customDhikr': 'حسب ضرورت ذکر',
        'times': 'بار',
        'inquirySubject': 'اذکار ایپ انکوائری',
        'copy': 'کاپی کریں',
        'share': 'شیئر کریں'
    }
};

function getTranslation(key) {
        return translations[language][key] || key;
    }

    function loadCustomAzkar() {
        try {
            return JSON.parse(localStorage.getItem('customAzkar')) || [];
        } catch {
            return [];
        }
    }

    function saveCustomAzkar(list) {
        localStorage.setItem('customAzkar', JSON.stringify(list));
    }

    function renderCustomAzkar() {
        customAzkarList.innerHTML = '';
        customAzkar.forEach((azkar, idx) => {
            const li = document.createElement('li');
            li.textContent = azkar;
            const delBtn = document.createElement('button');
            delBtn.textContent = '❌';
            delBtn.onclick = () => showModal(getTranslation('confirmDelete'), () => {
                customAzkar.splice(idx, 1);
                saveCustomAzkar(customAzkar);
                renderCustomAzkar();
            });
            li.appendChild(delBtn);
            customAzkarList.appendChild(li);
        });
    }

    function showModal(text, onConfirm) {
        modalText.textContent = text;
        modal.style.display = 'block';
        const confirmHandler = () => {
            modal.style.display = 'none';
            onConfirm();
            modalConfirm.removeEventListener('click', confirmHandler);
        };
        modalConfirm.addEventListener('click', confirmHandler);
        modalCancel.onclick = () => {
            modal.style.display = 'none';
            modalConfirm.removeEventListener('click', confirmHandler);
        };
    }

    function renderAzkar() {
        if (currentAzkarIndex >= azkarList.length) {
            azkarDisplay.innerHTML = `<p>${getTranslation('azkarEnded')}</p>`;
            azkarCount.textContent = '';
            counterButton.style.display = 'none';
            currentAzkarIndex = 0;
            return;
        }
        const currentAzkar = azkarList[currentAzkarIndex];
        azkarDisplay.textContent = currentAzkar.text;
        azkarCount.textContent = `${currentCount} / ${currentAzkar.count}`;
        counterButton.style.display = 'inline-block';
    }

    function updateFontSize() {
        document.body.style.fontSize = `${fontSize}em`;
        currentFontSizeSpan.textContent = fontSize.toFixed(2);
    }

// --- Azkar Data (Your full azkar data will go here) ---
// بيانات أذكار الصباح (يمكن إضافة التشكيل يدوياً هنا)
azkarData = {
    "morning": [
        { text: "آيَةُ الكُرْسِيِّ:\nاللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
        repeat: 1,
        meaning: "الآية الكريمة تبين عظمة الله تعالى، وأنه المتفرد بالألوهية، الحي الذي لا يموت، القائم على تدبير كل شيء، لا يغفل ولا ينام، وهو مالك كل شيء، ولا يشفع أحد عنده إلا بإذنه، وعلمه محيط بكل شيء، ولا يعجزه حفظ السماوات والأرض.",
        virtue: "فضلها: من قرأها حين يصبح أجير من الجن حتى يمسي، ومن قرأها حين يمسي أجير منهم حتى يصبح.",
        source: "رواه النسائي", hadith_number: "لا يوجد رقم حديث محدد في النسخة الأصلية للنسائي، يُعرف بالحديث في فضائل آية الكرسي."
      },
      { text: "سُورَةُ الإِخْلَاصِ:\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ (1)\nاللَّهُ الصَّمَدُ (2)\nلَمْ يَلِدْ وَلَمْ يُولَدْ (3)\nوَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (4)",
        repeat: 3,
        meaning: "تعلن السورة توحيد الله المطلق، وأنه واحد لا شريك له، وهو الصمد الذي تقصده المخلوقات في حوائجها، لم يلد ولم يولد، وليس له مثيل ولا نظير.",
        virtue: "فضلها: تعدل ثلث القرآن في الأجر، ومن قرأها ثلاث مرات في الصباح والمساء كفته من كل شيء.",
        source: "رواه الترمذي وصححه الألباني", hadith_number: "2903"
      },
      { text: "سُورَةُ الْفَلَقِ:\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (1)\nمِن شَرِّ مَا خَلَقَ (2)\nوَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ (3)\nوَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (4)\nوَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (5)",
        repeat: 3,
        meaning: "يطلب المسلم من الله تعالى الحماية من كل المخلوقات الشريرة، ومن شر الليل إذا أقبل بظلامه، ومن شر السحر والسحرة، ومن شر الحاسدين.",
        virtue: "فضلها: حرز للمسلم وحصن له من كل شرور الدنيا، وقد أوصى بها النبي صلى الله عليه وسلم.",
        source: "رواه الترمذي وصححه الألباني", hadith_number: "3367"
      },
      { text: "سُورَةُ النَّاسِ:\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ (1)\nمَلِكِ النَّاسِ (2)\nإِلَٰهِ النَّاسِ (3)\nمِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (4)\nالَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (5)\nمِنَ الْجِنَّةِ وَالنَّاسِ (6)",
        repeat: 3,
        meaning: "يتعوذ المسلم بالله رب الناس وملكهم وإلههم من شر وسوسة الشيطان، سواء كان من الجن أو من الإنس، الذي يلقي الشكوك والشر في القلوب.",
        virtue: "فضلها: حرز للمسلم وحصن له من وسوسة الشياطين من الجن والإنس، وهي من المعوذات التي تقي المسلم من الشرور.",
        source: "رواه الترمذي وصححه الألباني", hadith_number: "3367"
      },
      { text: "أذكار الصباح\n\nأَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ. رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
        repeat: 1,
        meaning: "يقر المسلم بأن ملك الكون كله لله تعالى في هذا الصباح، ويثني عليه بالحمد، ويشهد بوحدانيته، ويسأله خير اليوم وما بعده من أيام، ويستعيذ به من شر هذا اليوم وما بعده، ومن الكسل الذي يعيق عن الطاعة، ومن كبر السن الذي يؤدي إلى ضعف العبادة، ومن عذاب النار والقبر.",
        virtue: "يقوله المسلم كل صباح ليفتتح يومه بالخير ويطلب الحماية من الشرور، وهو من أذكار الصباح الأساسية التي تعكس التوكل على الله والاستعانة به في أمور الدنيا والآخرة.",
        source: "رواه مسلم", hadith_number: "2723"
      },
      { text: "أذكار الصباح\n\nاللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ.",
        repeat: 1,
        meaning: "دعاء يجدد فيه المسلم توكله على الله في كل شؤون حياته ومماته، ويقر بأن البقاء والوجود بيد الله وحده، وإليه المصير والبعث يوم القيامة.",
        virtue: "من الأذكار الجامعة التي تبين كمال التوكل على الله في بداية اليوم، وأن الأمر كله بيده.",
        source: "رواه الترمذي", hadith_number: "3391"
      },
      { text: "أذكار الصباح\n\nاللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
        repeat: 1,
        meaning: "يُعرف هذا الذكر بـ 'سيد الاستغفار'، وفيه يقر المسلم بتوحيد الله وربوبيته، وبأنه خلقه وهو عبده، وأنه يسعى جاهدًا للوفاء بعهد الله ووعده ما استطعتُ، ويستعيذ بالله من شر أعماله، ويعترف بإنعام الله عليه وبذنوبه، ويطلب المغفرة من الله وحده.",
        virtue: "فضلها: سيد الاستغفار، من قاله موقناً به حين يصبح فمات من يومه دخل الجنة، ومن قاله موقناً به حين يمسي فمات من ليلته دخل الجنة.",
        source: "رواه البخاري", hadith_number: "6306"
      },
      { text: "أذكار الصباح\n\nاللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.",
        repeat: 4,
        meaning: "يستشهد المسلم الله وملائكته وحملة عرشه وجميع خلقه على توحيد الله وربوبيته وإلهيته، وعلى نبوة محمد صلى الله عليه وسلم، تأكيدًا لإيمانه ويقينه.",
        virtue: "فضلها: من قالها أربع مرات حين يصبح أو يمسي أعتقه الله من النار.",
        source: "رواه أبو داود", hadith_number: "5071"
      },
      { text: "أذكار الصباح\n\nاللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
        repeat: 1,
        meaning: "يقر المسلم بأن كل نعمة وصلت إليه أو إلى غيره من الخلق هي من الله وحده لا شريك له في ذلك، ويحمده ويشكره عليها.",
        virtue: "فضلها: من قالها حين يصبح فقد أدى شكر يومه، ومن قالها حين يمسي فقد أدى شكر ليلته.",
        source: "رواه أبو داود", hadith_number: "5073"
      },
      { text: "أذكار الصباح\n\nاللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ.",
        repeat: 3,
        meaning: "دعاء جامع يطلب فيه المسلم من الله تعالى أن يعافيه في صحته الجسدية، وفي حواس السمع والبصر، مؤكدًا على توحيد الله.",
        virtue: "من الأذكار التي تطلب من الله العافية في الجسد والحواس، وهي من جوامع الدعاء.",
        source: "رواه أبو داود", hadith_number: "5090"
      },
      { text: "أذكار الصباح\n\nاللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ.",
        repeat: 3,
        meaning: "يستعيذ المسلم بالله من الكفر الذي هو أشد الضلال، ومن الفقر الذي قد يجر إلى الكفر، ومن عذاب القبر.",
        virtue: "دعاء جامع لطلب الحماية من أعظم الشرور في الدنيا والآخرة.",
        source: "رواه أبو داود", hadith_number: "5090"
      },
      { text: "أذكار الصباح\n\nحَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.",
        repeat: 7,
        meaning: "يؤكد المسلم أن الله وحده يكفيه ويحميه، لا معبود بحق سواه، وعليه وحده توكل في جميع أموره، وهو رب العرش العظيم، أي مالك كل شيء.",
        virtue: "فضلها: من قالها سبع مرات حين يصبح أو يمسي كفاه الله ما أهمه من أمر الدنيا والآخرة.",
        source: "رواه أبو داود", hadith_number: "5081"
      },
      { text: "أذكار الصباح\n\nاللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي.",
        repeat: 1,
        meaning: "دعاء شامل لطلب العفو والعافية في كل جوانب الحياة الدينية والدنيوية، وللأهل والمال، وستر العيوب، وتأمين المخاوف، وطلب الحفظ من كل الجهات، والاستعاذة من الموت غدرًا.",
        virtue: "من أجمع الأدعية لطلب خير الدنيا والآخرة والحماية من كل الشرور.",
        source: "رواه أبو داود", hadith_number: "5074"
      },
      { text: "أذكار الصباح\n\nيَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.",
        repeat: 1,
        meaning: "دعاء يتوجه فيه المسلم إلى الله بأسمائه الحسنى 'الحي' الذي لا يموت، 'القيوم' القائم على تدبير كل شيء، مستغيثًا برحمته ليُصلح له كل أموره، وطلبًا لعدم تركه لنفسه أبدًا.",
        virtue: "من الأدعية العظيمة التي تطلب من الله التوفيق في كل الأمور، وعدم التخلي عن العبد لحظة.",
        source: "رواه الحاكم وصححه الذهبي", hadith_number: "1/545"
      },
      { text: "أذكار الصباح\n\nأَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.",
        repeat: 1,
        meaning: "يجدد المسلم في هذا الذكر عهد إسلامه، وإخلاص توحيده لله، وتمسكه بدين النبي محمد صلى الله عليه وسلم، وملة أبيه إبراهيم عليه السلام التي هي الحنيفية السمحة، براءً من الشرك وأهله.",
        virtue: "تأكيد على الثبات على الإسلام والتوحيد والسنة، واعتزاز بالدين.",
        source: "رواه أحمد", hadith_number: "15360"
      },
      { text: "أذكار الصباح\n\nسُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ.",
        repeat: 3,
        meaning: "تسبيح لله تعالى بصفات الكمال والجمال، وتقديسه بحمد لا يحصيه أحد إلا هو، بقدر عدد مخلوقاته، وبقدر ما يرضي ذاته العلية، وبوزن عرشه العظيم، وبقدر كلمات علمه وحكمته التي لا تنتهي.",
        virtue: "كلمات يسيرة لكنها تحمل أجرًا عظيمًا ومضاعفًا لعظم القدر الذي يذكره المسلم بها، وهي تعدل أضعافًا مضاعفة من الذكر العادي.",
        source: "رواه مسلم", hadith_number: "2726"
      },
      { text: "أذكار الصباح\n\nاللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.",
        repeat: 10,
        meaning: "طلب من الله تعالى أن يثني على نبيه محمد صلى الله عليه وسلم في الملأ الأعلى، وأن يحفظه من كل سوء، وأن ينزل عليه الرحمة والبركة والسلام.",
        virtue: "فضل الصلاة على النبي صلى الله عليه وسلم عظيم، فمن صلى عليه صلاة واحدة صلى الله عليه بها عشراً.",
        source: "رواه مسلم", hadith_number: "384"
      },
      { text: "أذكار الصباح\n\nاللَّهُمَّ إِنَّا نَعُوذُ بِكَ مِنْ أَنْ نُشْرِكَ بِكَ شَيْئًا نَعْلَمُهُ، وَنَسْتَغْفِرُكَ لِمَا لَا نَعْلَمُهُ.",
        repeat: 1,
        meaning: "دعاء يطلب فيه المسلم من الله أن يحميه من الوقوع في الشرك، سواء كان الشرك الأكبر أو الأصغر، سواء كان يعلمه أو يقع فيه بغير قصد أو علم، ويسأل الله المغفرة لما قد يكون وقع فيه من شرك خفي لا يعلمه.",
        virtue: "حماية من الشرك الخفي والشرك الجلي، وتجديد للتوبة والرجوع إلى الله.",
        source: "رواه أحمد", hadith_number: "4/403"
      },
      { text: "أذكار الصباح\n\nسُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
        repeat: 100,
        meaning: "تنـزيه لله عن كل نقص، واعتراف بفضله وكماله، مقروناً بالثناء عليه.",
        virtue: "فضلها: من قالها مائة مرة في اليوم غفرت خطاياه وإن كانت مثل زبد البحر.",
        source: "رواه البخاري ومسلم", hadith_number: "البخاري: 6405، مسلم: 2691"
      },
      { text: "أذكار الصباح\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
        repeat: 100,
        meaning: "إقرار بالتوحيد الخالص لله، وأنه لا معبود بحق سواه، وهو المتفرد بالملك والتصرف في الكون، وله الثناء والحمد، وهو ذو القدرة المطلقة على كل شيء.",
        virtue: "فضلها: من قالها مائة مرة في يوم كانت له عدل عشر رقاب (تحرير عشر عبيد)، وكتبت له مائة حسنة، ومحيت عنه مائة سيئة، وكانت له حرزاً من الشيطان يومه ذلك حتى يمسي، ولم يأت أحد بأفضل مما جاء به إلا رجل عمل أكثر منه.",
        source: "رواه البخاري ومسلم", hadith_number: "البخاري: 6403، مسلم: 2691"
      },
      // أذكار إضافية (أمثلة)
      { text: "أذكار الصباح\nرَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.",
        repeat: 3,
        meaning: "أرضى وأطمئن بالله ربًّا لي ومدبرًا لجميع أموري، وبالإسلام دينًا كاملاً وشاملاً لطريقتي في الحياة، وبمحمد صلى الله عليه وسلم نبيًّا ورسولاً أقتدي به.",
        virtue: "فضلها: من قالها حين يصبح وحين يمسي كان حقًا على الله أن يرضيه يوم القيامة.",
        source: "رواه الترمذي", hadith_number: "3389"
      }
    ],
    "evening": [
        { text: "آيَةُ الكُرْسِيِّ:\nاللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
          repeat: 1,
          meaning: "الآية الكريمة تبين عظمة الله تعالى، وأنه المتفرد بالألوهية، الحي الذي لا يموت، القائم على تدبير كل شيء، لا يغفل ولا ينام، وهو مالك كل شيء، ولا يشفع أحد عنده إلا بإذنه، وعلمه محيط بكل شيء، ولا يعجزه حفظ السماوات والأرض.",
          virtue: "فضلها: من قرأها حين يمسي أجير من الجن حتى يصبح، ومن قرأها حين يصبح أجير منهم حتى يمسي.",
          source: "رواه النسائي", hadith_number: "لا يوجد رقم حديث محدد في النسخة الأصلية للنسائي، يُعرف بالحديث في فضائل آية الكرسي."
        },
        { text: "سُورَةُ الإِخْلَاصِ:\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ هُوَ اللَّهُ أَحَدٌ (1)\nاللَّهُ الصَّمَدُ (2)\nلَمْ يَلِدْ وَلَمْ يُولَدْ (3)\nوَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ (4)",
          repeat: 3,
          meaning: "تعلن السورة توحيد الله المطلق، وأنه واحد لا شريك له، وهو الصمد الذي تقصده المخلوقات في حوائجها، لم يلد ولم يولد، وليس له مثيل ولا نظير.",
          virtue: "فضلها: تعدل ثلث القرآن في الأجر، ومن قرأها ثلاث مرات في الصباح والمساء كفته من كل شيء.",
          source: "رواه الترمذي وصححه الألباني", hadith_number: "2903"
        },
        { text: "سُورَةُ الْفَلَقِ:\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ (1)\nمِن شَرِّ مَا خَلَقَ (2)\nوَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ (3)\nوَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ (4)\nوَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ (5)",
          repeat: 3,
          meaning: "يطلب المسلم من الله تعالى الحماية من كل المخلوقات الشريرة، ومن شر الليل إذا أقبل بظلامه، ومن شر السحر والسحرة، ومن شر الحاسدين.",
          virtue: "فضلها: حرز للمسلم وحصن له من كل شرور الدنيا، وقد أوصى بها النبي صلى الله عليه وسلم.",
          source: "رواه الترمذي وصححه الألباني", hadith_number: "3367"
        },
        { text: "سُورَةُ النَّاسِ:\nبِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ (1)\nمَلِكِ النَّاسِ (2)\nإِلَٰهِ النَّاسِ (3)\nمِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ (4)\nالَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ (5)\nمِنَ الْجِنَّةِ وَالنَّاسِ (6)",
          repeat: 3,
          meaning: "يتعوذ المسلم بالله رب الناس وملكهم وإلههم من شر وسوسة الشيطان، سواء كان من الجن أو من الإنس، الذي يلقي الشكوك والشر في القلوب.",
          virtue: "فضلها: حرز للمسلم وحصن له من وسوسة الشياطين من الجن والإنس، وهي من المعوذات التي تقي المسلم من الشرور.",
          source: "رواه الترمذي وصححه الألباني", hadith_number: "3367"
        },
        { text: "أذكار المساء\n\nأَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا. رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.",
          repeat: 1,
          meaning: "دعاء المسلم عند المساء يقر فيه بأن ملك الكون كله لله تعالى، ويثني عليه بالحمد، ويشهد بوحدانيته، ويسأله خير هذه الليلة وما بعدها، ويستعيذ به من شر هذه الليلة وما بعدها، ومن الكسل الذي يعيق عن الطاعة، ومن كبر السن الذي يؤدي إلى ضعف العبادة، ومن عذاب النار والقبر.",
          virtue: "يقوله المسلم كل مساء ليختتم يومه بالخير ويطلب الحماية من الشرور، وهو من أذكار المساء الأساسية التي تعكس التوكل على الله والاستعانة به في أمور الدنيا والآخرة.",
          source: "رواه مسلم", hadith_number: "2723"
        },
        { text: "أذكار المساء\n\nاللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ.",
          repeat: 1,
          meaning: "دعاء يجدد فيه المسلم توكله على الله في كل شؤون حياته ومماته، ويقر بأن البقاء والوجود بيد الله وحده، وإليه المصير والبعث يوم القيامة.",
          virtue: "من الأذكار الجامعة التي تبين كمال التوكل على الله في بداية الليل، وأن الأمر كله بيده.",
          source: "رواه الترمذي", hadith_number: "3391"
        },
        { text: "أذكار المساء\n\nاللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ.",
          repeat: 1,
          meaning: "يُعرف هذا الذكر بـ 'سيد الاستغفار'، وفيه يقر المسلم بتوحيد الله وربوبيته، وبأنه خلقه وهو عبده، وأنه يسعى جاهدًا للوفاء بعهد الله ووعده ما استطعتُ، ويستعيذ بالله من شر أعماله، ويعترف بإنعام الله عليه وبذنوبه، ويطلب المغفرة من الله وحده.",
          virtue: "فضلها: سيد الاستغفار، من قاله موقناً به حين يصبح فمات من يومه دخل الجنة، ومن قاله موقناً به حين يمسي فمات من ليلته دخل الجنة.",
          source: "رواه البخاري", hadith_number: "6306"
        },
        { text: "أذكار المساء\n\nاللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ وَحْدَكَ لَا شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.",
          repeat: 4,
          meaning: "يستشهد المسلم الله وملائكته وحملة عرشه وجميع خلقه على توحيد الله وربوبيته وإلهيته، وعلى نبوة محمد صلى الله عليه وسلم، تأكيدًا لإيمانه ويقينه.",
          virtue: "فضلها: من قالها أربع مرات حين يصبح أو يمسي أعتقه الله من النار.",
          source: "رواه أبو داود", hadith_number: "5071"
        },
        { text: "أذكار المساء\n\nاللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.",
          repeat: 1,
          meaning: "يقر المسلم بأن كل نعمة وصلت إليه أو إلى غيره من الخلق هي من الله وحده لا شريك له في ذلك، ويحمده ويشكره عليها.",
          virtue: "فضلها: من قالها حين يصبح فقد أدى شكر يومه، ومن قالها حين يمسي فقد أدى شكر ليلته.",
          source: "رواه أبو داود", hadith_number: "5073"
        },
        { text: "أذكار المساء\n\nاللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ.",
          repeat: 3,
          meaning: "دعاء جامع يطلب فيه المسلم من الله تعالى أن يعافيه في صحته الجسدية، وفي حواس السمع والبصر، مؤكدًا على توحيد الله.",
          virtue: "من الأذكار التي تطلب من الله العافية في الجسد والحواس، وهي من جوامع الدعاء.",
          source: "رواه أبو داود", hadith_number: "5090"
        },
        { text: "أذكار المساء\n\nاللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ.",
          repeat: 3,
          meaning: "يستعيذ المسلم بالله من الكفر الذي هو أشد الضلال، ومن الفقر الذي قد يجر إلى الكفر، ومن عذاب القبر.",
          virtue: "دعاء جامع لطلب الحماية من أعظم الشرور في الدنيا والآخرة.",
          source: "رواه أبو داود", hadith_number: "5090"
        },
        { text: "أذكار المساء\n\nحَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.",
          repeat: 7,
          meaning: "يؤكد المسلم أن الله وحده يكفيه ويحميه، لا معبود بحق سواه، وعليه وحده توكل في جميع أموره، وهو رب العرش العظيم، أي مالك كل شيء.",
          virtue: "فضلها: من قالها سبع مرات حين يصبح أو يمسي كفاه الله ما أهمه من أمر الدنيا والآخرة.",
          source: "رواه أبو داود", hadith_number: "5081"
        },
        { text: "أذكار المساء\n\nاللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ، اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي دِينِي وَدُنْيَايَ وَأَهْلِي وَمَالِي، اللَّهُمَّ اسْتُرْ عَوْرَاتِي، وَآمِنْ رَوْعَاتِي، اللَّهُمَّ احْفَظْنِي مِنْ بَيْنِ يَدَيَّ وَمِنْ خَلْفِي وَعَنْ يَمِينِي وَعَنْ شِمَالِي وَمِنْ فَوْقِي، وَأَعُوذُ بِعَظَمَتِكَ أَنْ أُغْتَالَ مِنْ تَحْتِي.",
          repeat: 1,
          meaning: "دعاء شامل لطلب العفو والعافية في كل جوانب الحياة الدينية والدنيوية، وللأهل والمال، وستر العيوب، وتأمين المخاوف، وطلب الحفظ من كل الجهات، والاستعاذة من الموت غدرًا.",
          virtue: "من أجمع الأدعية لطلب خير الدنيا والآخرة والحماية من كل الشرور.",
          source: "رواه أبو داود", hadith_number: "5074"
        },
        { text: "أذكار المساء\n\nيَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ، وَلَا تَكِلْنِي إِلَى نَفْسِي طَرْفَةَ عَيْنٍ.",
          repeat: 1,
          meaning: "دعاء يتوجه فيه المسلم إلى الله بأسمائه الحسنى 'الحي' الذي لا يموت، 'القيوم' القائم على تدبير كل شيء، مستغيثًا برحمته ليُصلح له كل أموره، وطلبًا لعدم تركه لنفسه أبدًا.",
          virtue: "من الأدعية العظيمة التي تطلب من الله التوفيق في كل الأمور، وعدم التخلي عن العبد لحظة.",
          source: "رواه الحاكم وصححه الذهبي", hadith_number: "1/545"
        },
        { text: "أذكار المساء\n\nأَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ وَكَلِمَةِ الْإِخْلَاصِ وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا وَمَا كَانَ مِنَ الْمُشْرِكِينَ.",
          repeat: 1,
          meaning: "يجدد المسلم في هذا الذكر عهد إسلامه، وإخلاص توحيده لله، وتمسكه بدين النبي محمد صلى الله عليه وسلم، وملة أبيه إبراهيم عليه السلام التي هي الحنيفية السمحة، براءً من الشرك وأهله.",
          virtue: "تأكيد على الثبات على الإسلام والتوحيد والسنة، واعتزاز بالدين.",
          source: "رواه أحمد", hadith_number: "15360"
        },
        { text: "أذكار المساء\n\nسُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ.",
          repeat: 3,
          meaning: "تسبيح لله تعالى بصفات الكمال والجمال، وتقديسه بحمد لا يحصيه أحد إلا هو، بقدر عدد مخلوقاته، وبقدر ما يرضي ذاته العلية، وبوزن عرشه العظيم، وبقدر كلمات علمه وحكمته التي لا تنتهي.",
          virtue: "كلمات يسيرة لكنها تحمل أجرًا عظيمًا ومضاعفًا لعظم القدر الذي يذكره المسلم بها، وهي تعدل أضعافًا مضاعفة من الذكر العادي.",
          source: "رواه مسلم", hadith_number: "2726"
        },
                { text: "أذكار المساء\n\nاللَّهُمَّ إِنَّا نَعُوذُ بِكَ مِنْ أَنْ نُشْرِكَ بِكَ شَيْئًا نَعْلَمُهُ، وَنَسْتَغْفِرُكَ لِمَا لَا نَعْلَمُهُ.",
          repeat: 1,
          meaning: "دعاء يطلب فيه المسلم من الله أن يحميه من الوقوع في الشرك، سواء كان الشرك الأكبر أو الأصغر، سواء كان يعلمه أو يقع فيه بغير قصد أو علم، ويسأل الله المغفرة لما قد يكون وقع فيه من شرك خفي لا يعلمه.",
          virtue: "حماية من الشرك الخفي والشرك الجلي، وتجديد للتوبة والرجوع إلى الله.",
          source: "رواه أحمد", hadith_number: "4/403"
        },
        { text: "أذكار المساء\n\nسُبْحَانَ اللَّهِ وَبِحَمْدِهِ.",
          repeat: 100,
          meaning: "تنـزيه لله عن كل نقص، واعتراف بفضله وكماله، مقروناً بالثناء عليه.",
          virtue: "فضلها: من قالها مائة مرة في اليوم غفرت خطاياه وإن كانت مثل زبد البحر.",
          source: "رواه البخاري ومسلم", hadith_number: "البخاري: 6405، مسلم: 2691"
        },
        { text: "أذكار المساء\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
          repeat: 100,
          meaning: "إقرار بالتوحيد الخالص لله، وأنه لا معبود بحق سواه، وهو المتفرد بالملك والتصرف في الكون، وله الثناء والحمد، وهو ذو القدرة المطلقة على كل شيء.",
          virtue: "فضلها: من قالها مائة مرة في يوم كانت له عدل عشر رقاب (تحرير عشر عبيد)، وكتبت له مائة حسنة، ومحيت عنه مائة سيئة، وكانت له حرزاً من الشيطان يومه ذلك حتى يمسي، ولم يأت أحد بأفضل مما جاء به إلا رجل عمل أكثر منه.",
          source: "رواه البخاري ومسلم", hadith_number: "البخاري: 6403، مسلم: 2691"
        },
	{ text: "أذكار المساء\n\nاللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.",
          repeat: 10,
          meaning: "طلب من الله تعالى أن يثني على نبيه محمد صلى الله عليه وسلم في الملأ الأعلى، وأن يحفظه من كل سوء، وأن ينزل عليه الرحمة والبركة والسلام.",
          virtue: "فضل الصلاة على النبي صلى الله عليه وسلم عظيم، فمن صلى عليه صلاة واحدة صلى الله عليه بها عشراً.",
          source: "رواه مسلم", hadith_number: "384"
        },
        // أذكار إضافية (أمثلة)
        { text: "أذكار المساء\n\nرَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا.",
          repeat: 3,
          meaning: "أرضى وأطمئن بالله ربًّا لي ومدبرًا لجميع أموري، وبالإسلام دينًا كاملاً وشاملاً لطريقتي في الحياة، وبمحمد صلى الله عليه وسلم نبيًّا ورسولاً أقتدي به.",
          virtue: "فضلها: من قالها حين يصبح وحين يمسي كان حقًا على الله أن يرضيه يوم القيامة.",
          source: "رواه الترمذي", hadith_number: "3389"
        }
    ],
    "sleep": [
        { text: "أذكار النوم\n\nبِاسْمِكَ رَبِّي وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.",
          repeat: 1,
          meaning: "أدعو باسمك يا ربي عند نومي واستيقاظي، فإن توفيت نفسي فلتشملها رحمتك، وإن أبقيتها فاحفظها برعايتك التي تحفظ بها عبادك الصالحين.",
          virtue: "فضله: إذا قالها المسلم عند النوم، فإن مات في ليلته مات على الفطرة، وإن قام فإنه يقوم على خير.",
          source: "رواه البخاري ومسلم", hadith_number: "البخاري: 6320، مسلم: 2714"
        },
        { text: "أذكار النوم\n\nاللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ.",
          repeat: 3,
          meaning: "اللهم احفظني من عذابك يوم القيامة، يوم تقوم الأرواح وتُبعث الأجساد للحساب.",
          virtue: "فضله: كان النبي صلى الله عليه وسلم يقول هذا الدعاء إذا أراد أن ينام.",
          source: "رواه الترمذي", hadith_number: "3398"
        },
        { text: "أذكار النوم\n\nسُبْحَانَ اللَّهِ (33) وَالْحَمْدُ لِلَّهِ (33) وَاللَّهُ أَكْبَرُ (34).",
          repeat: 1,
          meaning: "تنـزيه لله عن كل نقص، والثناء عليه بجميع المحامد، وتكبير له سبحانه.",
          virtue: "فضله: كان النبي صلى الله عليه وسلم يوصي فاطمة وعليًا رضي الله عنهما بهذه التسبيحات قبل النوم، وقال: 'هو خير لكما من خادم'.",
          source: "رواه البخاري ومسلم", hadith_number: "البخاري: 5362، مسلم: 2727"
        },
        { text: "أذكار النوم\n\nاللَّهُمَّ أَسْلَمْتُ نَفْسِي إِلَيْكَ، وَفَوَّضْتُ أَمْرِي إِلَيْكَ، وَوَجَّهْتُ وَجْهِي إِلَيْكَ، وَأَلْجَأْتُ ظَهْرِي إِلَيْكَ، رَغْبَةً وَرَهْبَةً إِلَيْكَ، لَا مَلْجَأَ وَلَا مَنْجَى مِنْكَ إِلَّا إِلَيْكَ، آمَنْتُ بِكِتَابِكَ الَّذِي أَنْزَلْتَ، وَبِنَبِيِّكَ الَّذِي أَرْسَلْتَ.",
          repeat: 1,
          meaning: "أسلمت نفسي وحياتي وتدبير أموري إليك يا رب، وتوجهت بكليتي إليك، واعتمدت عليك في كل أمري، رغبة في ثوابك وخوفًا من عقابك، فلا مفر ولا خلاص إلا باللجوء إليك، وأنا مؤمن بكتابك المنزل (القرآن) ونبيك المرسل (محمد صلى الله عليه وسلم).",
          virtue: "فضله: من قالهن ومات من ليلته مات على الفطرة.",
          source: "رواه البخاري ومسلم", hadith_number: "البخاري: 6311، مسلم: 2710"
        },
        { text: "أذكار النوم\n\nالْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَكَفَانَا وَآوَانَا، فَكَمْ مِمَّنْ لَا كَافِيَ لَهُ وَلَا مُؤْوِيَ.",
          repeat: 1,
          meaning: "أحمد الله الذي رزقنا الطعام والشراب، وحفظنا من كل سوء، وجعل لنا مأوى نأوي إليه، فكم من الناس لا يجدون من يكفيهم أو يؤويهم.",
          virtue: "شكر لله على نعمه العظيمة في الرزق والمأوى والحفظ.",
          source: "رواه مسلم", hadith_number: "2715"
        },
        { text: "أذكار النوم\n\nقُلْ يَا أَيُّهَا الْكَافِرُونَ...",
          repeat: 1,
          meaning: "إعلان البراءة من الشرك والمشركين، وتأكيد على التوحيد الخالص لله تعالى.",
          virtue: "فضله: براءة من الشرك.",
          source: "رواه الترمذي", hadith_number: "3400"
        },
        { text: "أذكار النوم\n\nبِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.",
          repeat: 1,
          meaning: "أنام باسمك اللهم، وأستيقظ باسمك، أي بتقديرك وإرادتك تتم حياتي ومماتي.",
          virtue: "من الأدعية التي وردت عن النبي صلى الله عليه وسلم عند النوم.",
          source: "رواه البخاري ومسلم", hadith_number: "البخاري: 6324، مسلم: 2711"
        },
        { text: "أذكار النوم\n\nيَجْمَعُ كَفَّيْهِ ثُمَّ يَنْفُثُ فِيهِمَا فَيَقْرَأُ فِيهِمَا قُلْ هُوَ اللَّهُ أَحَدٌ وَقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ وَقُلْ أَعُوذُ بِرَبِّ النَّاسِ ثُمَّ يَمْسَحُ بِهِمَا مَا اسْتَطَاعَ مِنْ جَسَدِهِ، يَبْدَأُ بِهِمَا عَلَى رَأْسِهِ وَوَجْهِهِ وَمَا أَقْبَلَ مِنْ جَسَدِهِ، يَفْعَلُ ذَلِكَ ثَلَاثَ مَرَّاتٍ.",
          repeat: 1,
          meaning: "يجمع المسلم كفيه، وينفث فيهما (نفث خفيف بلا ريق)، ثم يقرأ سورة الإخلاص والفلق والناس، ثم يمسح بهما وجهه وما استطاع من جسده، ويكرر ذلك ثلاث مرات، كتحصين ودعاء بالبركة والحفظ.",
          virtue: "فضله: كان النبي صلى الله عليه وسلم يفعل ذلك كل ليلة عند نومه، وهذا يدل على أهمية هذه السور في التحصين والحفظ من الشرور.",
          source: "رواه البخاري", hadith_number: "5017"
        },
    ],
    "prayer": [
        { text: "أذكار بعد الصلوات\n\nأَسْتَغْفِرُ اللَّهَ.",
          repeat: 3,
          meaning: "أطلب المغفرة من الله تعالى، تعبيرًا عن التوبة والرجوع إليه من كل ذنب أو تقصير.",
          virtue: "من السنن الثابتة بعد الانتهاء من الصلاة، وفيه جبر للتقصير الذي قد يحدث في الصلاة.",
          source: "رواه مسلم", hadith_number: "591"
        },
        { text: "أذكار بعد الصلوات\n\nاللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.",
          repeat: 1,
          meaning: "اللهم أنت السلام (الذي لا عيب فيه ولا نقص)، ومنك السلامة والأمان، تعظمت وتكرمت يا صاحب العظمة والكرم.",
          virtue: "من الأذكار التي كان النبي صلى الله عليه وسلم يقولها بعد السلام من الصلاة.",
          source: "رواه مسلم", hadith_number: "591"
        },
        { text: "أذكار بعد الصلوات\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. اللَّهُمَّ لَا مَانِعَ لِمَا أَعْطَيْتَ، وَلَا مُعْطِيَ لِمَا مَنَعْتَ، وَلَا يَنْفَعُ ذَا الْجَدِّ مِنْكَ الْجَدُّ.",
          repeat: 1,
          meaning: "إقرار بالتوحيد لله، وبأنه المالك والمدبر لكل شيء، لا يملك أحد منع ما أعطاه الله، ولا إعطاء ما منعه الله، ولا ينفع صاحب الحظ والغنى حظه وغناه من عذاب الله إذا أراد به سوءًا.",
          virtue: "من الأذكار الجامعة التي تُقال بعد الصلاة، وتؤكد على توحيد الله وكمال قدرته وتصرفه في الملك.",
          source: "رواه البخاري ومسلم", hadith_number: "البخاري: 6615، مسلم: 593"
        },
        { text: "أذكار بعد الصلوات\n\nسُبْحَانَ اللَّهِ (33) وَالْحَمْدُ لِلَّهِ (33) وَاللَّهُ أَكْبَرُ (33).",
          repeat: 1,
          meaning: "تنـزيه لله عن كل نقص، والثناء عليه بجميع المحامد، وتكبير له سبحانه.",
          virtue: "فضلها: من قالها بعد كل صلاة غفرت خطاياه وإن كانت مثل زبد البحر.",
          source: "رواه مسلم", hadith_number: "597"
        },
        { text: "أذكار بعد الصلوات\n\nلَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيتُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ.",
          repeat: 10,
          meaning: "إقرار بالتوحيد الخالص لله، وأنه لا معبود بحق سواه، المتفرد بالملك والحمد، والذي بيده الحياة والموت، وهو ذو القدرة المطلقة على كل شيء.",
          virtue: "تقال بعد صلاة المغرب والفجر، وقد ورد في فضلها أنها تُعدل عتق أربع رقاب، وتُكتب له عشر حسنات، وتُمحى عنه عشر سيئات.",
          source: "رواه الترمذي", hadith_number: "3470"
        },
        { text: "آيَةُ الْكُرْسِيِّ (بعد كل صلاة).",
          repeat: 1,
          meaning: "تبين الآية عظمة الله ووحدانيته وحياته وقيوميته وعلمه وقدرته المطلقة على حفظ السماوات والأرض.",
          virtue: "فضلها: من قرأها دبر كل صلاة مكتوبة لم يمنعه من دخول الجنة إلا أن يموت.",
          source: "رواه النسائي", hadith_number: "100/1"
        },
        // أذكار إضافية (أمثلة)
        { text: "أذكار بعد الصلوات\n\nاللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ، وَشُكْرِكَ، وَحُسْنِ عِبَادَتِكَ.",
          repeat: 1,
          meaning: "اللهم اجعلني قادراً على الإكثار من ذكرك، والشكر على نعمك، وأداء العبادات على أكمل وجه وأحسن حال.",
          virtue: "وصية نبوية جامعة من النبي صلى الله عليه وسلم لمعاذ بن جبل رضي الله عنه.",
          source: "رواه أبو داود والنسائي", hadith_number: "أبو داود: 1522"
        }
    ],
    "fortressBook": [
	        { "text": "رضيت بالله رباً، وبالإسلام ديناً، وبمحمد صلى الله عليه وسلم نبياً.", "repeat": 3, "info": "حصن المسلم" }
    ],
    "general": [
		{ text: "أذكار متنوعة\n\nبِسْمِ اللَّهِ.",
          repeat: 1,
          meaning: "أي: أبدأ كل عمل باسم الله، طلبًا للبركة والاستعانة به.",
          virtue: "البركة في كل عمل يبدأ به، وحماية من الشيطان. (أحاديث عامة في التسمية)"
        },
        { text: "أذكار متنوعة\n\nالْحَمْدُ لِلَّهِ.",
          repeat: 1,
          meaning: "الثناء على الله بصفاته الحميدة، وشكره على نعمه الظاهرة والباطنة.",
          virtue: "تملأ الميزان، وهي من أحب الكلمات إلى الله. (رواه مسلم)."
        },
        { text: "أذكار متنوعة\n\nاللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَعَافِنِي وَارْزُقْنِي.",
          repeat: 1,
          meaning: "دعاء جامع يطلب فيه المسلم من الله المغفرة لذنوبه، والرحمة التي تشمل كل خير، والعافية في الدين والدنيا، والرزق الحلال الطيب.",
          virtue: "من جوامع الدعاء التي كان النبي صلى الله عليه وسلم يداوم عليها.",
          source: "رواه مسلم", hadith_number: "2697"
        },
        { text: "سبحان الله وبحمده، سبحان الله العظيم.", repeat: 100, info: "ذكر عام" }
    ],
    "dailyDuaa": [
        { "text": "اللهم آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار.", "repeat": 1, "info": "دعاء يومي" }
    ],
    "dailyQuran": [
        { "text": "قل هو الله أحد (سورة الإخلاص)", "repeat": 3, "info": "قراءة سورة الإخلاص" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
  applySettings();
  initializeNotifications();
  openTab('mainContentTab-main', false);

  // Selector event bindings
  bindSelector(languageSelector, value => {
    setLanguage(value);
    renderAzkar();
    renderCustomAzkar();
  });

  bindSelector(themeSelector, value => {
    document.body.className = value;
    localStorage.setItem('theme', value);
  });

  bindSelector(fontSizeSelector, value => {
    fontSize = parseFloat(value);
    localStorage.setItem('fontSize', fontSize);
    updateFontSize();
  });

  // Button bindings
  bindButton(counterButton, () => handleCounter());
  bindButton(nextButton, () => handleNav(1));
  bindButton(prevButton, () => handleNav(-1));
  bindButton(resetButton, () => resetAzkar());

  bindButton(customAzkarBtn, () => {
    customAzkarInput.value = '';
    customAzkarInput.style.display = addAzkarBtn.style.display = 'block';
  });

  bindButton(addAzkarBtn, () => {
    const text = customAzkarInput.value.trim();
    if (text) {
      customAzkar.push(text);
      saveCustomAzkar(customAzkar);
      renderCustomAzkar();
      customAzkarInput.value = '';
      customAzkarInput.style.display = addAzkarBtn.style.display = 'none';
    }
  });

  bindButton(copyButton, async () => {
    try {
      await navigator.clipboard.writeText(azkarDisplay.textContent);
      copyButton.textContent = getTranslation('copied');
      setTimeout(() => (copyButton.textContent = '📋'), 1500);
    } catch {
      alert('Copy failed!');
    }
  });

  // Initial render
  loadAzkar();
  renderAzkar();
  renderCustomAzkar();
  updateFontSize();

  themeSelector.value = theme;
  languageSelector.value = language;
  fontSizeSelector.value = fontSize;
  modal.style.display = 'none';
});

// --- Utility Functions ---
function bindSelector(selector, callback) {
  if (selector) selector.onchange = () => callback(selector.value);
}

function bindButton(button, handler) {
  if (button) button.onclick = handler;
}

function handleCounter() {
  if (currentAzkarIndex < azkarList.length) {
    currentCount++;
    if (currentCount >= azkarList[currentAzkarIndex].count) {
      currentCount = 0;
      currentAzkarIndex++;
    }
    renderAzkar();
  }
}

function handleNav(direction) {
  currentAzkarIndex += direction;
  currentAzkarIndex = Math.max(0, Math.min(currentAzkarIndex, azkarList.length - 1));
  currentCount = 0;
  renderAzkar();
}

function resetAzkar() {
  currentAzkarIndex = currentCount = 0;
  renderAzkar();
}