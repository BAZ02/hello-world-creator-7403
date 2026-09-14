import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BookOpen, FileText, ClipboardList, Upload, Camera, LogOut, User, Users,
  Lock, Trash2, Eye, Download, Plus, X, ChevronLeft, Settings,
  Building2, Check, AlertCircle, Loader2, ChevronRight, Shield, UserPlus
} from "lucide-react";

/* ============================== i18n ============================== */

const LANGS = [
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "en", label: "English", dir: "ltr" },
  { code: "tr", label: "Türkçe", dir: "ltr" },
  { code: "pt", label: "Português", dir: "ltr" },
  { code: "es", label: "Español", dir: "ltr" },
  { code: "prs", label: "دری", dir: "rtl" },
  { code: "fa", label: "فارسی", dir: "rtl" },
  { code: "ru", label: "Русский", dir: "ltr" },
  { code: "uk", label: "Українська", dir: "ltr" },
  { code: "ku", label: "کوردی", dir: "rtl" },
  { code: "krl", label: "Kurdî (Latînî)", dir: "ltr" },
  { code: "zh", label: "中文", dir: "ltr" },
];

const STR = {
  appTitle: { fr: "Espace Stagiaires", ar: "فضاء المتدربين", en: "Trainee Space", tr: "Stajyer Alanı", pt: "Espaço de Estagiários", es: "Espacio de Aprendices", prs: "فضای کارآموزان", fa: "فضای کارآموزان", ru: "Пространство стажёров", uk: "Простір стажерів", ku: "بۆشایی فێرخوازان", zh: "学员空间" , krl: "Qada Stajyeran"},
  appTagline: { fr: "Règles, documents et suivi quotidien", ar: "القواعد والوثائق والمتابعة اليومية", en: "Rules, documents and daily follow-up", tr: "Kurallar, belgeler ve günlük takip", pt: "Regras, documentos e acompanhamento diário", es: "Reglas, documentos y seguimiento diario", prs: "قواعد، اسناد و پیگیری روزانه", fa: "قوانین، اسناد و پیگیری روزانه", ru: "Правила, документы и ежедневный учёт", uk: "Правила, документи та щоденний облік", ku: "یاسا، بەڵگەنامە و بەدواداچوونی ڕۆژانە", zh: "规则、文件和每日跟踪" , krl: "Rêgez, belge û şopandina rojane"},
  selectLanguage: { fr: "Choisissez votre langue", ar: "اختر لغتك", en: "Choose your language", tr: "Dilinizi seçin", pt: "Escolha o seu idioma", es: "Elige tu idioma", prs: "زبان خود را انتخاب کنید", fa: "زبان خود را انتخاب کنید", ru: "Выберите язык", uk: "Виберіть мову", ku: "زمانەکەت هەڵبژێرە", zh: "选择您的语言" , krl: "Zimanê xwe hilbijêre"},
  continueBtn: { fr: "Continuer", ar: "متابعة", en: "Continue", tr: "Devam et", pt: "Continuar", es: "Continuar", prs: "ادامه", fa: "ادامه", ru: "Продолжить", uk: "Продовжити", ku: "بەردەوامبوون", zh: "继续" , krl: "Berdewam bike"},
  roleQuestion: { fr: "Qui êtes-vous ?", ar: "من أنت؟", en: "Who are you?", tr: "Kimsiniz?", pt: "Quem é você?", es: "¿Quién eres?", prs: "شما کی هستید؟", fa: "شما کی هستید؟", ru: "Кто вы?", uk: "Хто ви?", ku: "تۆ کێیت؟", zh: "您是谁？" , krl: "Tu kî yî?"},
  roleTrainee: { fr: "Je suis stagiaire", ar: "أنا متدرب", en: "I am a trainee", tr: "Ben bir stajyerim", pt: "Sou estagiário", es: "Soy aprendiz", prs: "من کارآموز هستم", fa: "من کارآموز هستم", ru: "Я стажёр", uk: "Я стажер", ku: "من فێرخوازم", zh: "我是学员" , krl: "Ez stajyer im"},
  roleTrainer: { fr: "Je suis formateur", ar: "أنا المدرب", en: "I am the trainer", tr: "Ben eğitmenim", pt: "Sou o formador", es: "Soy el formador", prs: "من آموزگار هستم", fa: "من مربی هستم", ru: "Я наставник", uk: "Я наставник", ku: "من ڕاهێنەرم", zh: "我是培训师" , krl: "Ez perwerdekar im"},
  newAccount: { fr: "Nouveau compte", ar: "حساب جديد", en: "New account", tr: "Yeni hesap", pt: "Nova conta", es: "Cuenta nueva", prs: "حساب نو", fa: "حساب جدید", ru: "Новый аккаунт", uk: "Новий акаунт", ku: "هەژماری نوێ", zh: "新账户" , krl: "Hesabê nû"},
  haveAccount: { fr: "J'ai déjà un compte", ar: "لدي حساب مسبق", en: "I already have an account", tr: "Zaten hesabım var", pt: "Já tenho uma conta", es: "Ya tengo una cuenta", prs: "من حساب دارم", fa: "من حساب دارم", ru: "У меня уже есть аккаунт", uk: "У мене вже є акаунт", ku: "پێشتر هەژمارم هەیە", zh: "我已有账户" , krl: "Hesabê min ê xwedî heye"},
  fullNameLabel: { fr: "Nom complet", ar: "الاسم الكامل", en: "Full name", tr: "Ad soyad", pt: "Nome completo", es: "Nombre completo", prs: "نام کامل", fa: "نام کامل", ru: "Полное имя", uk: "Повне ім'я", ku: "ناوی تەواو", zh: "全名" , krl: "Navê temamî"},
  groupLabel: { fr: "Groupe", ar: "القروب", en: "Group", tr: "Grup", pt: "Grupo", es: "Grupo", prs: "گروپ", fa: "گروه", ru: "Группа", uk: "Група", ku: "گرووپ", zh: "小组" , krl: "Kome"},
  pinLabel: { fr: "Code (4 chiffres)", ar: "الرمز (4 أرقام)", en: "PIN (4 digits)", tr: "Kod (4 hane)", pt: "Código (4 dígitos)", es: "Código (4 dígitos)", prs: "کوډ (۴ رقم)", fa: "کد (۴ رقم)", ru: "Код (4 цифры)", uk: "Код (4 цифри)", ku: "کۆد (٤ ژمارە)", zh: "密码（4位数字）" , krl: "Kod (4 hejmar)"},
  pinHint: { fr: "Choisissez un code à 4 chiffres facile à retenir", ar: "اختر رمزاً من 4 أرقام سهل التذكر", en: "Choose a 4-digit PIN you will remember", tr: "Kolay hatırlanır bir kod seçin", pt: "Escolha um código fácil de lembrar", es: "Elige un código fácil de recordar", prs: "یک کوډ آسان انتخاب کنید", fa: "یک کد آسان به یاد داشتنی انتخاب کنید", ru: "Выберите код, который легко запомнить", uk: "Виберіть код, який легко запам'ятати", ku: "کۆدێک هەڵبژێرە کە ئاسان بێت بیرت بێت", zh: "选择一个容易记住的密码" , krl: "Kodekê hilbijêre ku hêsan bîra te bibe"},
  createAccountBtn: { fr: "Créer mon compte", ar: "إنشاء الحساب", en: "Create account", tr: "Hesap oluştur", pt: "Criar conta", es: "Crear cuenta", prs: "ایجاد حساب", fa: "ایجاد حساب", ru: "Создать аккаунт", uk: "Створити акаунт", ku: "دروستکردنی هەژمار", zh: "创建账户" , krl: "Hesabê min biafirîne"},
  loginBtn: { fr: "Se connecter", ar: "دخول", en: "Log in", tr: "Giriş yap", pt: "Entrar", es: "Entrar", prs: "ننوت", fa: "ورود", ru: "Войти", uk: "Увійти", ku: "چوونەژوورەوە", zh: "登录" , krl: "Têkeve"},
  backBtn: { fr: "Retour", ar: "رجوع", en: "Back", tr: "Geri", pt: "Voltar", es: "Atrás", prs: "شاته", fa: "بازگشت", ru: "Назад", uk: "Назад", ku: "گەڕانەوە", zh: "返回" , krl: "Vegere"},
  trainerPinLabel: { fr: "Code formateur", ar: "رمز المدرب", en: "Trainer PIN", tr: "Eğitmen kodu", pt: "Código do formador", es: "Código del formador", prs: "کوډ آموزګار", fa: "کد مربی", ru: "Код наставника", uk: "Код наставника", ku: "کۆدی ڕاهێنەر", zh: "培训师密码" , krl: "Koda perwerdekar"},
  trainerLoginBtn: { fr: "Entrer", ar: "دخول", en: "Enter", tr: "Gir", pt: "Entrar", es: "Entrar", prs: "ننوت", fa: "ورود", ru: "Войти", uk: "Увійти", ku: "چوونەژوورەوە", zh: "进入" , krl: "Têkeve"},
  errorWrongPin: { fr: "Code incorrect", ar: "الرمز غير صحيح", en: "Incorrect PIN", tr: "Kod yanlış", pt: "Código incorreto", es: "Código incorrecto", prs: "کوډ غلط دی", fa: "کد اشتباه است", ru: "Неверный код", uk: "Неправильний код", ku: "کۆد هەڵەیە", zh: "密码错误" , krl: "Koda şaş"},
  errorNotFound: { fr: "Compte introuvable", ar: "لم يتم العثور على الحساب", en: "Account not found", tr: "Hesap bulunamadı", pt: "Conta não encontrada", es: "Cuenta no encontrada", prs: "حساب پیدا نشد", fa: "حساب پیدا نشد", ru: "Аккаунт не найден", uk: "Акаунт не знайдено", ku: "هەژمار نەدۆزرایەوە", zh: "未找到账户" , krl: "Hesab nehat dîtin"},
  errorNameTaken: { fr: "Ce nom existe déjà dans ce groupe", ar: "هذا الاسم موجود مسبقاً في هذا القروب", en: "This name already exists in this group", tr: "Bu isim bu grupta zaten var", pt: "Este nome já existe neste grupo", es: "Este nombre ya existe en este grupo", prs: "دا نوم دمخه شته", fa: "این نام قبلاً وجود دارد", ru: "Это имя уже существует в этой группе", uk: "Це ім'я вже існує в цій групі", ku: "ئەم ناوە پێشتر لەم گرووپەدا هەیە", zh: "此姓名在该小组中已存在" , krl: "Vî navî di vê komê de jixwe heye"},
  errorFillFields: { fr: "Veuillez remplir tous les champs", ar: "الرجاء تعبئة كل الحقول", en: "Please fill in all fields", tr: "Lütfen tüm alanları doldurun", pt: "Preencha todos os campos", es: "Complete todos los campos", prs: "لطفاً ټول ساحې ډک کړئ", fa: "لطفاً همه فیلدها را پر کنید", ru: "Пожалуйста, заполните все поля", uk: "Будь ласка, заповніть всі поля", ku: "تکایە هەموو خانەکان پڕبکەرەوە", zh: "请填写所有字段" , krl: "Ji kerema xwe hemû qadan tije bike"},
  logoutBtn: { fr: "Déconnexion", ar: "تسجيل الخروج", en: "Log out", tr: "Çıkış yap", pt: "Sair", es: "Cerrar sesión", prs: "وتل", fa: "خروج", ru: "Выйти", uk: "Вийти", ku: "چوونەدەرەوە", zh: "退出" , krl: "Derkeve"},
  navRules: { fr: "Règles", ar: "القواعد", en: "Rules", tr: "Kurallar", pt: "Regras", es: "Reglas", prs: "قواعد", fa: "قوانین", ru: "Правила", uk: "Правила", ku: "یاسا", zh: "规则" , krl: "Rêgez"},
  navDocuments: { fr: "Documents", ar: "الوثائق", en: "Documents", tr: "Belgeler", pt: "Documentos", es: "Documentos", prs: "اسناد", fa: "اسناد", ru: "Документы", uk: "Документи", ku: "بەڵگەنامەکان", zh: "文件" , krl: "Belge"},
  navActivity: { fr: "Activité du jour", ar: "النشاط اليومي", en: "Daily activity", tr: "Günlük etkinlik", pt: "Atividade diária", es: "Actividad diaria", prs: "فعالیت روزانه", fa: "فعالیت روزانه", ru: "Активность дня", uk: "Активність дня", ku: "چالاکی ڕۆژانە", zh: "每日活动" , krl: "Çalakiya rojane"},
  rulesHeading: { fr: "Règles générales", ar: "القواعد العامة", en: "General rules", tr: "Genel kurallar", pt: "Regras gerais", es: "Reglas generales", prs: "قواعد عمومی", fa: "قوانین عمومی", ru: "Общие правила", uk: "Загальні правила", ku: "یاسا گشتییەکان", zh: "通用规则" , krl: "Rêgezên giştî"},
  rulesEmptyTrainee: { fr: "Le formateur n'a pas encore ajouté de règles.", ar: "لم يقم المدرب بإضافة القواعد بعد.", en: "The trainer has not added rules yet.", tr: "Eğitmen henüz kural eklemedi.", pt: "O formador ainda não adicionou regras.", es: "El formador aún no ha añadido reglas.", prs: "آموزګار تر اوسه قواعد نه دي اضافه کړي.", fa: "مربی هنوز قوانینی اضافه نکرده است.", ru: "Наставник ещё не добавил правила.", uk: "Наставник ще не додав правила.", ku: "ڕاهێنەر هێشتا یاسای زیاد نەکردووە.", zh: "培训师尚未添加规则。" , krl: "Perwerdekar hîn rêgez nebirîne."},
  documentsHeading: { fr: "Mes documents", ar: "وثائقي", en: "My documents", tr: "Belgelerim", pt: "Meus documentos", es: "Mis documentos", prs: "اسناد زما", fa: "اسناد من", ru: "Мои документы", uk: "Мої документи", ku: "بەڵگەنامەکانم", zh: "我的文件" , krl: "Belgeyên min"},
  documentsEmptyTrainee: { fr: "Aucun document pour le moment.", ar: "لا توجد وثائق حالياً.", en: "No documents yet.", tr: "Henüz belge yok.", pt: "Ainda não há documentos.", es: "Aún no hay documentos.", prs: "تر اوسه سند نشته.", fa: "هنوز سندی نیست.", ru: "Документов пока нет.", uk: "Документів поки немає.", ku: "بەڵگەنامە نییە.", zh: "暂无文件。" , krl: "Belge tune."},
  addDocumentBtn: { fr: "Ajouter un document", ar: "إضافة وثيقة", en: "Add a document", tr: "Belge ekle", pt: "Adicionar documento", es: "Añadir documento", prs: "اضافه کول سند", fa: "افزودن سند", ru: "Добавить документ", uk: "Додати документ", ku: "زیادکردنی بەڵگەنامە", zh: "添加文件" , krl: "Belgeyekê tevlî bike"},
  documentNameLabel: { fr: "Nom du document (ex: contrat de stage)", ar: "اسم الوثيقة (مثال: عقد التدريب)", en: "Document name (e.g. internship contract)", tr: "Belge adı (örn. staj sözleşmesi)", pt: "Nome do documento (ex: contrato de estágio)", es: "Nombre del documento (ej. contrato de prácticas)", prs: "نوم سند", fa: "نام سند", ru: "Название документа (напр. договор о стажировке)", uk: "Назва документа (напр. договір про стажування)", ku: "ناوی بەڵگەنامە", zh: "文件名称（例如：实习合同）" , krl: "Navê belgeyê (mînak: peymana stajê)"},
  chooseFileBtn: { fr: "Choisir un fichier", ar: "اختر ملفاً", en: "Choose a file", tr: "Dosya seç", pt: "Escolher ficheiro", es: "Elegir archivo", prs: "دوتنه غوره کړئ", fa: "انتخاب فایل", ru: "Выбрать файл", uk: "Вибрати файл", ku: "هەڵبژاردنی فایل", zh: "选择文件" , krl: "Pelê hilbijêre"},
  uploadBtn: { fr: "Téléverser", ar: "رفع", en: "Upload", tr: "Yükle", pt: "Enviar", es: "Subir", prs: "پورته کول", fa: "بارگذاری", ru: "Загрузить", uk: "Завантажити", ku: "بارکردن", zh: "上传" , krl: "Bar bike"},
  viewBtn: { fr: "Voir", ar: "عرض", en: "View", tr: "Görüntüle", pt: "Ver", es: "Ver", prs: "کتل", fa: "مشاهده", ru: "Просмотр", uk: "Переглянути", ku: "بینین", zh: "查看" , krl: "Binêre"},
  downloadBtn: { fr: "Télécharger", ar: "تنزيل", en: "Download", tr: "İndir", pt: "Transferir", es: "Descargar", prs: "ډاونلوډ", fa: "دانلود", ru: "Скачать", uk: "Завантажити", ku: "داگرتن", zh: "下载" , krl: "Daxîne"},
  deleteBtn: { fr: "Supprimer", ar: "حذف", en: "Delete", tr: "Sil", pt: "Eliminar", es: "Eliminar", prs: "ړنګول", fa: "حذف", ru: "Удалить", uk: "Видалити", ku: "سڕینەوە", zh: "删除" , krl: "Jê bibe"},
  confirmDeleteMsg: { fr: "Confirmer la suppression ?", ar: "تأكيد الحذف؟", en: "Confirm delete?", tr: "Silmeyi onaylıyor musunuz?", pt: "Confirmar eliminação?", es: "¿Confirmar eliminación?", prs: "ړنګول تایید کړئ؟", fa: "حذف تأیید شود؟", ru: "Подтвердить удаление?", uk: "Підтвердити видалення?", ku: "سڕینەوە پشتڕاست بکەرەوە؟", zh: "确认删除？" , krl: "Jêbirinê piştrast bike?"},
  uploadedOn: { fr: "Ajouté le", ar: "أُضيف في", en: "Added on", tr: "Eklenme", pt: "Adicionado em", es: "Añadido el", prs: "اضافه شوی په", fa: "افزوده شده در", ru: "Добавлено", uk: "Додано", ku: "زیادکرا لە", zh: "添加于" , krl: "Hat tevlîkirin"},
  activityHeading: { fr: "Mon activité quotidienne", ar: "نشاطي اليومي", en: "My daily activity", tr: "Günlük etkinliğim", pt: "Minha atividade diária", es: "Mi actividad diaria", prs: "فعالیت روزانه زما", fa: "فعالیت روزانه من", ru: "Моя ежедневная активность", uk: "Моя щоденна активність", ku: "چالاکی ڕۆژانەی من", zh: "我的每日活动" , krl: "Çalakiya min a rojane"},
  activityEmptyTrainee: { fr: "Aucune activité enregistrée.", ar: "لا يوجد نشاط مسجل.", en: "No activity recorded.", tr: "Kayıtlı etkinlik yok.", pt: "Nenhuma atividade registada.", es: "Ninguna actividad registrada.", prs: "هیڅ فعالیت ثبت نشوی.", fa: "هیچ فعالیتی ثبت نشده.", ru: "Нет записей активности.", uk: "Немає записів активності.", ku: "هیچ چالاکییەک تۆمار نەکراوە.", zh: "暂无活动记录。" , krl: "Çalakî nehat tomarkirin."},
  addEntryBtn: { fr: "Ajouter une activité", ar: "إضافة نشاط", en: "Add an entry", tr: "Kayıt ekle", pt: "Adicionar registo", es: "Añadir registro", prs: "اضافه کول", fa: "افزودن ثبت", ru: "Добавить запись", uk: "Додати запис", ku: "زیادکردنی تۆمار", zh: "添加记录" , krl: "Çalakiyekê tevlî bike"},
  entryDateLabel: { fr: "Date", ar: "التاريخ", en: "Date", tr: "Tarih", pt: "Data", es: "Fecha", prs: "نیټه", fa: "تاریخ", ru: "Дата", uk: "Дата", ku: "بەروار", zh: "日期" , krl: "Dîrok"},
  entryTextLabel: { fr: "Ce que j'ai fait", ar: "ما قمت به", en: "What I did", tr: "Ne yaptım", pt: "O que fiz", es: "Lo que hice", prs: "زه څه وکړل", fa: "کاری که انجام دادم", ru: "Что я сделал", uk: "Що я зробив", ku: "چیم کرد", zh: "我做了什么" , krl: "Min çi kir"},
  entryTextPlaceholder: { fr: "Décrivez votre journée...", ar: "اكتب وصفاً ليومك...", en: "Describe your day...", tr: "Gününüzü anlatın...", pt: "Descreva o seu dia...", es: "Describe tu día...", prs: "ورځ خپله بیان کړئ...", fa: "روز خود را توضیح دهید...", ru: "Опишите свой день...", uk: "Опишіть свій день...", ku: "ڕۆژەکەت وەسف بکە...", zh: "描述您的一天..." , krl: "Roja xwe binivîsîne..."},
  attachPhotoLabel: { fr: "Ajouter une photo (facultatif)", ar: "إضافة صورة (اختياري)", en: "Attach a photo (optional)", tr: "Fotoğraf ekle (isteğe bağlı)", pt: "Anexar foto (opcional)", es: "Adjuntar foto (opcional)", prs: "انځور اضافه کړئ (اختیاري)", fa: "افزودن عکس (اختیاری)", ru: "Добавить фото (необязательно)", uk: "Додати фото (необов'язково)", ku: "زیادکردنی وێنە (ئارەزوومەندانە)", zh: "添加照片（可选）" , krl: "Wêneyekê tevlî bike (ne mecbûrî)"},
  saveEntryBtn: { fr: "Enregistrer", ar: "حفظ", en: "Save", tr: "Kaydet", pt: "Guardar", es: "Guardar", prs: "خوندي کول", fa: "ذخیره", ru: "Сохранить", uk: "Зберегти", ku: "پاشەکەوتکردن", zh: "保存" , krl: "Tomar bike"},
  cancelBtn: { fr: "Annuler", ar: "إلغاء", en: "Cancel", tr: "İptal", pt: "Cancelar", es: "Cancelar", prs: "لغوه کول", fa: "لغو", ru: "Отмена", uk: "Скасувати", ku: "هەڵوەشاندنەوە", zh: "取消" , krl: "Betal bike"},
  entriesListHeading: { fr: "Historique", ar: "السجل", en: "History", tr: "Geçmiş", pt: "Histórico", es: "Historial", prs: "تاریخچه", fa: "تاریخچه", ru: "История", uk: "Історія", ku: "مێژوو", zh: "历史记录" , krl: "Dîrok"},
  trainerDashboardHeading: { fr: "Tableau de bord formateur", ar: "لوحة المدرب", en: "Trainer dashboard", tr: "Eğitmen paneli", pt: "Painel do formador", es: "Panel del formador", prs: "پاڼه آموزګار", fa: "داشبورد مربی", ru: "Панель наставника", uk: "Панель наставника", ku: "داشبۆردی ڕاهێنەر", zh: "培训师面板" , krl: "Panela perwerdekar"},
  groupsHeading: { fr: "Groupes", ar: "القروبات", en: "Groups", tr: "Gruplar", pt: "Grupos", es: "Grupos", prs: "ګروپونه", fa: "گروه‌ها", ru: "Группы", uk: "Групи", ku: "گرووپەکان", zh: "小组" , krl: "Kom"},
  noGroupsMsg: { fr: "Aucun stagiaire inscrit pour le moment.", ar: "لا يوجد متدربون مسجلون بعد.", en: "No trainees registered yet.", tr: "Henüz kayıtlı stajyer yok.", pt: "Ainda não há estagiários registados.", es: "Aún no hay aprendices registrados.", prs: "تر اوسه کارآموز نشته.", fa: "هنوز کارآموزی ثبت نشده.", ru: "Зарегистрированных стажёров пока нет.", uk: "Зареєстрованих стажерів поки немає.", ku: "هێشتا هیچ فێرخوازێک تۆمار نەکراوە.", zh: "尚无注册学员。" , krl: "Stajyerên qeydkirî tune."},
  traineesInGroup: { fr: "stagiaire(s)", ar: "متدرب(ين)", en: "trainee(s)", tr: "stajyer", pt: "estagiário(s)", es: "aprendiz(es)", prs: "کارآموزان", fa: "کارآموز", ru: "стажёр(ов)", uk: "стажер(ів)", ku: "فێرخواز", zh: "名学员" , krl: "stajyer"},
  selectTraineeMsg: { fr: "Sélectionnez un stagiaire pour voir son dossier.", ar: "اختر متدرباً لعرض ملفه.", en: "Select a trainee to view their file.", tr: "Dosyasını görmek için bir stajyer seçin.", pt: "Selecione um estagiário para ver o seu ficheiro.", es: "Selecciona un aprendiz para ver su expediente.", prs: "یو کارآموز غوره کړئ.", fa: "یک کارآموز را برای مشاهده پرونده انتخاب کنید.", ru: "Выберите стажёра для просмотра досье.", uk: "Виберіть стажера для перегляду досьє.", ku: "فێرخوازێک هەڵبژێرە بۆ بینینی فایلەکەی.", zh: "选择一位学员查看其档案。" , krl: "Ji bo dîtina dosyeyê stajyerekê hilbijêre."},
  traineeProfileHeading: { fr: "Dossier du stagiaire", ar: "ملف المتدرب", en: "Trainee file", tr: "Stajyer dosyası", pt: "Ficheiro do estagiário", es: "Expediente del aprendiz", prs: "دوسیه کارآموز", fa: "پرونده کارآموز", ru: "Досье стажёра", uk: "Досьє стажера", ku: "فایلی فێرخواز", zh: "学员档案" , krl: "Dosyeya stajyer"},
  editRulesHeading: { fr: "Modifier les règles générales", ar: "تعديل القواعد العامة", en: "Edit general rules", tr: "Genel kuralları düzenle", pt: "Editar regras gerais", es: "Editar reglas generales", prs: "سمون قواعد", fa: "ویرایش قوانین عمومی", ru: "Редактировать общие правила", uk: "Редагувати загальні правила", ku: "دەستکاری یاسا گشتییەکان", zh: "编辑通用规则" , krl: "Rêgezên giştî biguherîne"},
  saveRulesBtn: { fr: "Enregistrer les règles", ar: "حفظ القواعد", en: "Save rules", tr: "Kuralları kaydet", pt: "Guardar regras", es: "Guardar reglas", prs: "خوندي کول قواعد", fa: "ذخیره قوانین", ru: "Сохранить правила", uk: "Зберегти правила", ku: "پاشەکەوتکردنی یاسا", zh: "保存规则" , krl: "Rêgez tomar bike"},
  rulesSavedMsg: { fr: "Règles enregistrées", ar: "تم حفظ القواعد", en: "Rules saved", tr: "Kurallar kaydedildi", pt: "Regras guardadas", es: "Reglas guardadas", prs: "قواعد خوندي شول", fa: "قوانین ذخیره شد", ru: "Правила сохранены", uk: "Правила збережено", ku: "یاسا پاشەکەوتکرا", zh: "规则已保存" , krl: "Rêgez hatin tomarkirin"},
  settingsHeading: { fr: "Paramètres", ar: "الإعدادات", en: "Settings", tr: "Ayarlar", pt: "Definições", es: "Configuración", prs: "تنظیمات", fa: "تنظیمات", ru: "Настройки", uk: "Налаштування", ku: "ڕێکخستنەکان", zh: "设置" , krl: "Mîheng"},
  changeTrainerPinHeading: { fr: "Changer le code formateur", ar: "تغيير رمز المدرب", en: "Change trainer PIN", tr: "Eğitmen kodunu değiştir", pt: "Alterar código do formador", es: "Cambiar código del formador", prs: "بدلول کوډ", fa: "تغییر کد مربی", ru: "Изменить код наставника", uk: "Змінити код наставника", ku: "گۆڕینی کۆدی ڕاهێنەر", zh: "更改培训师密码" , krl: "Koda perwerdekar biguherîne"},
  currentPinLabel: { fr: "Code actuel", ar: "الرمز الحالي", en: "Current PIN", tr: "Mevcut kod", pt: "Código atual", es: "Código actual", prs: "اوسنی کوډ", fa: "کد فعلی", ru: "Текущий код", uk: "Поточний код", ku: "کۆدی ئێستا", zh: "当前密码" , krl: "Koda niha"},
  newPinLabel: { fr: "Nouveau code", ar: "الرمز الجديد", en: "New PIN", tr: "Yeni kod", pt: "Novo código", es: "Código nuevo", prs: "نوی کوډ", fa: "کد جدید", ru: "Новый код", uk: "Новий код", ku: "کۆدی نوێ", zh: "新密码" , krl: "Koda nû"},
  savePinBtn: { fr: "Enregistrer", ar: "حفظ", en: "Save", tr: "Kaydet", pt: "Guardar", es: "Guardar", prs: "خوندي کول", fa: "ذخیره", ru: "Сохранить", uk: "Зберегти", ku: "پاشەکەوتکردن", zh: "保存" , krl: "Tomar bike"},
  pinChangedMsg: { fr: "Code modifié avec succès", ar: "تم تغيير الرمز بنجاح", en: "PIN changed successfully", tr: "Kod başarıyla değiştirildi", pt: "Código alterado com sucesso", es: "Código cambiado con éxito", prs: "کوډ بریالیتوب سره بدل شو", fa: "کد با موفقیت تغییر کرد", ru: "Код успешно изменён", uk: "Код успішно змінено", ku: "کۆد بە سەرکەوتوویی گۆڕدرا", zh: "密码更改成功" , krl: "Kod bi serkeftin hat guhertin"},
  backToGroupsBtn: { fr: "Retour aux groupes", ar: "رجوع إلى القروبات", en: "Back to groups", tr: "Gruplara dön", pt: "Voltar aos grupos", es: "Volver a los grupos", prs: "شاته ګروپونو ته", fa: "بازگشت به گروه‌ها", ru: "Назад к группам", uk: "Назад до груп", ku: "گەڕانەوە بۆ گرووپەکان", zh: "返回小组" , krl: "Vegeriyan ser kom"},
  fileTooLargeMsg: { fr: "Fichier trop volumineux (max 3 Mo)", ar: "الملف كبير جداً (الحد الأقصى 3 ميجا)", en: "File too large (max 3 MB)", tr: "Dosya çok büyük (maks. 3 MB)", pt: "Ficheiro demasiado grande (máx. 3 MB)", es: "Archivo demasiado grande (máx. 3 MB)", prs: "دوتنه ډیره لویه ده", fa: "فایل خیلی بزرگ است", ru: "Файл слишком большой (макс. 3 МБ)", uk: "Файл занадто великий (макс. 3 МБ)", ku: "فایل زۆر گەورەیە (زۆرترین ٣ مێگابایت)", zh: "文件过大（最大3 MB）" , krl: "Pel pir mezin e (herî zêde 3 MB)"},
  loadingMsg: { fr: "Chargement...", ar: "جاري التحميل...", en: "Loading...", tr: "Yükleniyor...", pt: "A carregar...", es: "Cargando...", prs: "بارول کیږي...", fa: "در حال بارگذاری...", ru: "Загрузка...", uk: "Завантаження...", ku: "بارکردن...", zh: "加载中..." , krl: "Tê barkirin..."},
  rulesEditHint: { fr: "Rédigez le texte pour chaque langue. Les stagiaires verront la version dans leur langue.", ar: "اكتب النص لكل لغة. سيرى المتدربون النسخة الخاصة بلغتهم.", en: "Write the text for each language. Trainees will see the version in their own language.", tr: "Her dil için metni yazın. Stajyerler kendi dillerindeki sürümü görecek.", pt: "Escreva o texto para cada idioma. Os estagiários verão a versão no seu idioma.", es: "Escriba el texto para cada idioma. Los aprendices verán la versión en su idioma.", prs: "متن د هر ژبی لیکئ.", fa: "متن هر زبان را بنویسید.", ru: "Напишите текст для каждого языка. Стажёры увидят версию на своём языке.", uk: "Напишіть текст для кожної мови. Стажери побачать версію своєю мовою.", ku: "بۆ هەموو زمانێک دەق بنووسە. فێرخوازان وەشانی زمانی خۆیان دەبینن.", zh: "为每种语言编写文本。学员将看到自己语言的版本。" , krl: "Ji bo her zimanî nivîsê binivîsîne. Stajyer guhertoya zimanê xwe dibînin."},
  yourAccountId: { fr: "Identifiant à conserver", ar: "بيانات الدخول التي يجب حفظها", en: "Login details to keep", tr: "Saklanacak giriş bilgileri", pt: "Dados de acesso a guardar", es: "Datos de acceso para guardar", prs: "معلومات ننوتلو وساتئ", fa: "اطلاعات ورود را نگه دارید", ru: "Сохраните учётные данные", uk: "Збережіть облікові дані", ku: "زانیاری چوونەژوورەوە پاشەکەوت بکە", zh: "请保存登录信息" , krl: "Zanyariyên têketinê biparêze"},
  formationLabel: { fr: "Formation", ar: "التكوين", en: "Training", tr: "Eğitim", pt: "Formação", es: "Formación", prs: "زده کاري", fa: "آموزش", ru: "Обучение", uk: "Навчання", ku: "فێرکاری", zh: "培训" , krl: "Perwerde"},
  professionnelleLabel: { fr: "Professionnelle", ar: "التدريب المهني", en: "Workplace", tr: "Mesleki", pt: "Profissional", es: "Profesional", prs: "مسلکي", fa: "حرفه‌ای", ru: "Профессиональная", uk: "Професійна", ku: "پیشەیی", zh: "实习" , krl: "Karkirin"},
  attachFileLabel: { fr: "Ajouter une photo ou un PDF (facultatif)", ar: "إضافة صورة أو ملف PDF (اختياري)", en: "Attach a photo or PDF (optional)", tr: "Fotoğraf veya PDF ekle (isteğe bağlı)", pt: "Anexar foto ou PDF (opcional)", es: "Adjuntar foto o PDF (opcional)", prs: "انځور یا PDF اضافه کړئ", fa: "افزودن عکس یا PDF (اختیاری)", ru: "Добавить фото или PDF (необязательно)", uk: "Додати фото або PDF (необов'язково)", ku: "زیادکردنی وێنە یان PDF (ئارەزوومەندانە)", zh: "添加照片或PDF（可选）" , krl: "Wêne yan PDF tevlî bike (ne mecbûrî)"},
  archiveBtn: { fr: "Archiver", ar: "أرشفة", en: "Archive", tr: "Arşivle", pt: "Arquivar", es: "Archivar", prs: "آرشیف", fa: "بایگانی", ru: "Архивировать", uk: "Архівувати", ku: "ئەرشیفکردن", zh: "归档" , krl: "Arşîv bike"},
  unarchiveBtn: { fr: "Désarchiver", ar: "إلغاء الأرشفة", en: "Unarchive", tr: "Arşivden çıkar", pt: "Desarquivar", es: "Desarchivar", prs: "له آرشیف نه راوباسه", fa: "خروج از بایگانی", ru: "Разархивировать", uk: "Розархівувати", ku: "دەرهێنانی ئەرشیف", zh: "取消归档" , krl: "Ji arşîvê derxîne"},
  deleteForeverBtn: { fr: "Supprimer définitivement", ar: "حذف نهائي", en: "Delete permanently", tr: "Kalıcı olarak sil", pt: "Eliminar definitivamente", es: "Eliminar definitivamente", prs: "همیشه لپاره ړنګول", fa: "حذف همیشگی", ru: "Удалить навсегда", uk: "Видалити назавжди", ku: "هەمیشەیی سڕینەوە", zh: "永久删除" , krl: "Herdemî jê bibe"},
  confirmArchiveMsg: { fr: "Archiver ce stagiaire ? Ses données restent conservées mais il disparaît du groupe actif.", ar: "أرشفة هذا المتدرب؟ بياناته تبقى محفوظة لكنه يختفي من القروب النشط.", en: "Archive this trainee? Their data stays saved but they disappear from the active group.", tr: "Bu stajyeri arşivle? Verileri saklanır ama aktif gruptan kaybolur.", pt: "Arquivar este estagiário? Os dados ficam guardados, mas desaparece do grupo ativo.", es: "¿Archivar a este aprendiz? Sus datos se conservan, pero desaparece del grupo activo.", prs: "دا کارآموز آرشیف کړئ؟", fa: "این کارآموز بایگانی شود؟ اطلاعاتش می‌ماند اما از گروه فعال حذف می‌شود.", ru: "Архивировать этого стажёра? Его данные сохранятся, но он исчезнет из активной группы.", uk: "Архівувати цього стажера? Його дані збережуться, але він зникне з активної групи.", ku: "ئەم فێرخوازە ئەرشیف بکرێت؟ داتاکانی پاشەکەوت دەمێننەوە بەڵام لە گرووپی چالاک دەردەکەوێت.", zh: "归档此学员？其数据将保留，但会从活跃小组中消失。" , krl: "Vê stajyerê arşîv bike? Daneyên wî dimîn lê ji koma çalak winda dibe."},
  confirmDeleteForeverMsg: { fr: "Supprimer définitivement ce stagiaire ainsi que tous ses documents et activités ? Cette action est irréversible.", ar: "حذف هذا المتدرب نهائياً مع كل وثائقه ونشاطه؟ هذا الإجراء لا يمكن التراجع عنه.", en: "Permanently delete this trainee along with all their documents and activity? This cannot be undone.", tr: "Bu stajyeri tüm belgeleri ve etkinlikleriyle birlikte kalıcı olarak sil? Bu geri alınamaz.", pt: "Eliminar definitivamente este estagiário com todos os seus documentos e atividades? Isto não pode ser desfeito.", es: "¿Eliminar definitivamente a este aprendiz junto con todos sus documentos y actividades? Esta acción no se puede deshacer.", prs: "دا کارآموز د اسنادو سره یو ځای همیشه لپاره ړنګ کړئ؟", fa: "این کارآموز همراه با همه اسناد و فعالیت‌هایش برای همیشه حذف شود؟ این کار قابل بازگشت نیست.", ru: "Навсегда удалить этого стажёра вместе со всеми документами и активностью? Это действие необратимо.", uk: "Назавжди видалити цього стажера разом із усіма документами та активністю? Це неможливо скасувати.", ku: "ئەم فێرخوازە لەگەڵ هەموو بەڵگەنامە و چالاکییەکانی هەمیشەیی بسڕدرێتەوە؟ ئەمە ناتوانرێت گەڕێنرێتەوە.", zh: "永久删除此学员及其所有文件和活动？此操作无法撤销。" , krl: "Vê stajyerê bi hemû belge û çalakiyên wî herdemî jê bibe? Ev nayê vegerandin."},
  archivedHeading: { fr: "Archive", ar: "الأرشيف", en: "Archive", tr: "Arşiv", pt: "Arquivo", es: "Archivo", prs: "آرشیف", fa: "بایگانی", ru: "Архив", uk: "Архів", ku: "ئەرشیف", zh: "归档" , krl: "Arşîv"},
  archivedEmptyMsg: { fr: "Aucun stagiaire archivé.", ar: "لا يوجد متدربون مؤرشفون.", en: "No archived trainees.", tr: "Arşivlenmiş stajyer yok.", pt: "Nenhum estagiário arquivado.", es: "Ningún aprendiz archivado.", prs: "هیڅ آرشیف شوی کارآموز نشته.", fa: "کارآموز بایگانی‌شده‌ای نیست.", ru: "Нет архивированных стажёров.", uk: "Немає архівованих стажерів.", ku: "هیچ فێرخوازی ئەرشیفکراو نییە.", zh: "无归档学员。" , krl: "Stajyerên arşîvkirî tune."},
  archivedBadge: { fr: "Archivé", ar: "مؤرشف", en: "Archived", tr: "Arşivlendi", pt: "Arquivado", es: "Archivado", prs: "آرشیف شوی", fa: "بایگانی‌شده", ru: "В архиве", uk: "В архіві", ku: "ئەرشیفکراو", zh: "已归档" , krl: "Arşîvkirî"},
  traineeActionsHeading: { fr: "Gestion du dossier", ar: "إدارة الملف", en: "File management", tr: "Dosya yönetimi", pt: "Gestão do processo", es: "Gestión del expediente", prs: "د دوسیې مدیریت", fa: "مدیریت پرونده", ru: "Управление досье", uk: "Управління досьє", ku: "بەڕێوەبردنی فایل", zh: "档案管理" , krl: "Rêveberiya dosyeyê"},
  doneMsg: { fr: "Fait", ar: "تم", en: "Done", tr: "Tamam", pt: "Feito", es: "Hecho", prs: "بشپړ شو", fa: "انجام شد", ru: "Готово", uk: "Готово", ku: "تەواوبوو", zh: "完成" , krl: "Qediya"},
  handbookTitle: { fr: "Livret du stagiaire", ar: "كتيب المتدرب", en: "Trainee handbook", tr: "Stajyer kitabı", pt: "Livro do estagiário", es: "Manual del aprendiz", prs: "کتابچه کارآموز", fa: "کتابچه کارآموز", ru: "Брошюра стажёра", uk: "Брошура стажера", ku: "کتێبچەی فێرخواز", zh: "学员手册", krl: "Pirtûka stajyer" },
  handbookOpen: { fr: "Ouvrir le livret", ar: "فتح الكتيب", en: "Open handbook", tr: "Kitabı aç", pt: "Abrir livro", es: "Abrir manual", prs: "باز کردن کتابچه", fa: "باز کردن کتابچه", ru: "Открыть брошюру", uk: "Відкрити брошуру", ku: "کردنەوەی کتێبچە", zh: "打开手册", krl: "Pirtûkê veke" },
  handbookReadonly: { fr: "Lecture seule", ar: "قراءة فقط", en: "Read only", tr: "Sadece oku", pt: "Só leitura", es: "Solo lectura", prs: "فقط خواندن", fa: "فقط خواندن", ru: "Только чтение", uk: "Лише читання", ku: "تەنها خوێندنەوە", zh: "只读", krl: "Tenê xwendin" },
  handbookPage: { fr: "Page", ar: "صفحة", en: "Page", tr: "Sayfa", pt: "Página", es: "Página", prs: "صفحه", fa: "صفحه", ru: "Страница", uk: "Сторінка", ku: "پەڕە", zh: "页", krl: "Rûpel" },
  handbookOf: { fr: "sur", ar: "من", en: "of", tr: "/", pt: "de", es: "de", prs: "از", fa: "از", ru: "из", uk: "з", ku: "لە", zh: "共", krl: "ji" },

  noGroupsYetMsg: { fr: "Aucun groupe n'a encore été créé. Contactez l'administrateur du centre.", ar: "لم يتم إنشاء أي قروب بعد. الرجاء التواصل مع مسؤول المركز.", en: "No group has been created yet. Please contact the center administrator." },
  selectGroupPlaceholder: { fr: "Choisissez un groupe", ar: "اختر القروب", en: "Choose a group" },
  managementHeading: { fr: "Administration", ar: "الإدارة", en: "Administration" },
  trainersHeading: { fr: "Formateurs", ar: "المدربون", en: "Trainers" },
  addTrainerBtn: { fr: "Ajouter un formateur", ar: "إضافة مدرب", en: "Add a trainer" },
  trainerNameLabel: { fr: "Nom du formateur", ar: "اسم المدرب", en: "Trainer name" },
  newTrainerPinLabel: { fr: "Code du formateur (4 chiffres)", ar: "رمز المدرب (4 أرقام)", en: "Trainer PIN (4 digits)" },
  roleLabel: { fr: "Rôle", ar: "الصلاحية", en: "Role" },
  adminRoleLabel: { fr: "Administrateur (accès total)", ar: "مسؤول (صلاحية كاملة)", en: "Administrator (full access)" },
  trainerRoleLabel: { fr: "Formateur", ar: "مدرب", en: "Trainer" },
  assignGroupsLabel: { fr: "Groupes assignés", ar: "القروبات المسندة إليه", en: "Assigned groups" },
  noGroupsToAssignMsg: { fr: "Créez d'abord un groupe pour pouvoir l'assigner.", ar: "أنشئ قروباً أولاً حتى تتمكن من إسناده.", en: "Create a group first so you can assign it." },
  addBtn: { fr: "Ajouter", ar: "إضافة", en: "Add" },
  groupsManagementHeading: { fr: "Groupes", ar: "القروبات", en: "Groups" },
  addGroupBtn: { fr: "Ajouter un groupe", ar: "إضافة قروب", en: "Add a group" },
  groupNameLabel: { fr: "Nom du groupe", ar: "اسم القروب", en: "Group name" },
  noTrainersMsg: { fr: "Aucun formateur pour le moment.", ar: "لا يوجد مدربون حالياً.", en: "No trainers yet." },
  confirmDeleteTrainerMsg: { fr: "Supprimer ce compte formateur ?", ar: "حذف حساب هذا المدرب؟", en: "Delete this trainer account?" },
  confirmDeleteGroupMsg: { fr: "Supprimer ce groupe ? Les stagiaires déjà inscrits dans ce groupe ne sont pas supprimés.", ar: "حذف هذا القروب؟ المتدربون المسجلون فيه لن يتم حذفهم.", en: "Delete this group? Trainees already registered in it will not be deleted." },
  cannotDeleteLastAdminMsg: { fr: "Impossible de supprimer le dernier compte administrateur.", ar: "لا يمكن حذف آخر حساب مسؤول.", en: "You cannot delete the last administrator account." },
  trainerAddedMsg: { fr: "Formateur ajouté avec succès", ar: "تمت إضافة المدرب بنجاح", en: "Trainer added successfully" },
  groupAddedMsg: { fr: "Groupe ajouté avec succès", ar: "تمت إضافة القروب بنجاح", en: "Group added successfully" },
  adminBadge: { fr: "Administrateur", ar: "مسؤول", en: "Administrator" },
  trainerBadge: { fr: "Formateur", ar: "مدرب", en: "Trainer" },
  allGroupsLabel: { fr: "Tous les groupes", ar: "كل القروبات", en: "All groups" },
  loggedInAsLabel: { fr: "Connecté en tant que", ar: "مسجّل الدخول باسم", en: "Logged in as" },

  rulesAcceptHeading: { fr: "Règlement intérieur", ar: "النظام الداخلي", en: "Internal regulations" },
  acceptRulesLabel: { fr: "J'ai lu et j'accepte le règlement intérieur.", ar: "لقد قرأت النظام الداخلي وأوافق عليه.", en: "I have read and accept the internal regulations." },
  signatureLabel: { fr: "Votre signature", ar: "توقيعك", en: "Your signature" },
  clearSignatureBtn: { fr: "Effacer", ar: "مسح", en: "Clear" },
  mustAcceptRulesMsg: { fr: "Merci de cocher la case et de signer avant de continuer.", ar: "يرجى تفعيل المربع والتوقيع قبل المتابعة.", en: "Please check the box and sign before continuing." },
  firstNameLabel: { fr: "Prénom", ar: "الاسم الأول", en: "First name" },
  lastNameLabel: { fr: "Nom", ar: "الكنية", en: "Last name" },
  birthDateLabel: { fr: "Date de naissance", ar: "تاريخ الميلاد", en: "Date of birth" },
  rulesSignedHeading: { fr: "Règlement signé", ar: "النظام موقّع", en: "Signed regulations" },
  signedOnLabel: { fr: "Signé le", ar: "تم التوقيع بتاريخ", en: "Signed on" },
  downloadSignedRulesBtn: { fr: "Télécharger (PDF)", ar: "تحميل (PDF)", en: "Download (PDF)" },
  noSignedRulesMsg: { fr: "Aucun règlement signé pour ce stagiaire.", ar: "لا يوجد نظام موقّع لهذا المتدرب.", en: "No signed regulations for this trainee." },

  proHeading: { fr: "Partie Pro", ar: "الجزء المهني", en: "Professional Part" },
  proIntro: { fr: "Ces fiches sont personnelles : vous seul(e) pouvez les remplir. Votre formateur peut les consulter mais pas les modifier.", ar: "هذه الأوراق شخصية: أنت فقط من يستطيع تعبئتها. يمكن لمدربك الاطلاع عليها لكن لا يمكنه تعديلها.", en: "These sheets are personal: only you can fill them in. Your trainer can view them but not edit them." },
  proBilanTitle: { fr: "Fiche de synthèse du bilan personnel et professionnel", ar: "ورقة تلخيص الحصيلة الشخصية والمهنية", en: "Personal and professional summary sheet" },
  proReseauTitle: { fr: "Constitution de mon réseau d'entreprises", ar: "تكوين شبكة مؤسساتي", en: "Building my network of companies" },
  proProjetTitle: { fr: "Projet professionnel", ar: "المشروع المهني", en: "Professional project" },
  proStageTitle: { fr: "Stage en entreprise", ar: "التدريب في مؤسسة", en: "Company internship" },
  proComparatifTitle: { fr: "Comparatif avec vos savoir-faire, qualités et la piste", ar: "مقارنة مع مهاراتك وصفاتك والمسار", en: "Comparison with your skills, qualities and lead" },
  proPisteLabel: { fr: "Piste", ar: "المسار", en: "Lead" },
  proSourcesTitle: { fr: "Les sources et lieux d'information et de documentation", ar: "مصادر وأماكن المعلومات والتوثيق", en: "Information and documentation sources and places" },
  saveBtn: { fr: "Enregistrer", ar: "حفظ", en: "Save" },
  savedMsg: { fr: "Enregistré", ar: "تم الحفظ", en: "Saved" },
  addRowBtn: { fr: "Ajouter une ligne", ar: "إضافة سطر", en: "Add a row" },
  readOnlyBadge: { fr: "Lecture seule", ar: "قراءة فقط", en: "Read only" },
  noEntryYetMsg: { fr: "Ce stagiaire n'a encore rien rempli ici.", ar: "لم يقم هذا المتدرب بتعبئة أي شيء هنا بعد.", en: "This trainee hasn't filled this in yet." },
};

function useT(lang) {
  return useCallback((key) => (STR[key] && (STR[key][lang] || STR[key].fr)) || key, [lang]);
}

/* ============================== storage helpers (localStorage) ============================== */


const PREFIX = "tsapp:";

function ls() {
  return typeof window === "undefined" ? null : window.localStorage;
}

async function sGet(key) {
  const store = ls();
  if (!store) return null;
  const raw = store.getItem(PREFIX + key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
async function sSet(key, value) {
  const store = ls();
  if (!store) return false;
  store.setItem(PREFIX + key, JSON.stringify(value));
  return true;
}
async function sDelete(key) {
  const store = ls();
  if (store) store.removeItem(PREFIX + key);
}
async function sList(prefix) {
  const store = ls();
  const keys = [];
  if (!store) return keys;
  for (let i = 0; i < store.length; i++) {
    const k = store.key(i);
    if (k && k.startsWith(PREFIX) && k.slice(PREFIX.length).startsWith(prefix)) {
      keys.push(k.slice(PREFIX.length));
    }
  }
  return keys;
}


/* ============================== crypto (end-to-end encryption) ============================== */

function b64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}
function unb64(str) {
  const bin = atob(str);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr.buffer;
}
function randomB64(n) {
  return b64(crypto.getRandomValues(new Uint8Array(n)));
}

async function deriveAesKeyFromPin(pin, saltB64) {
  const salt = unb64(saltB64);
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pin), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function aesEncryptBytes(key, bytes) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, bytes);
  return { iv: b64(iv), data: b64(ct) };
}
async function aesDecryptBytes(key, obj) {
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: new Uint8Array(unb64(obj.iv)) }, key, unb64(obj.data));
  return pt;
}
async function aesEncryptStr(key, str) {
  return aesEncryptBytes(key, new TextEncoder().encode(str));
}
async function aesDecryptStr(key, obj) {
  return new TextDecoder().decode(await aesDecryptBytes(key, obj));
}
async function aesEncryptJSON(key, obj) {
  return aesEncryptStr(key, JSON.stringify(obj));
}
async function aesDecryptJSON(key, obj) {
  return JSON.parse(await aesDecryptStr(key, obj));
}
async function importDataKey(rawBytes) {
  return crypto.subtle.importKey("raw", rawBytes, "AES-GCM", true, ["encrypt", "decrypt"]);
}

/* ---- Multi-trainer / admin account model -------------------------------
   A single organization-level RSA keypair is used to protect trainee data
   ("trainer_public_key" holds the public JWK). Each trainer/admin account
   (stored in "trainers_index") holds its own PIN-wrapped copy of the
   organization's private key, so any trainer can decrypt trainee data
   while each person keeps their own PIN. Only accounts with role "admin"
   can create/remove trainer accounts and manage groups.
------------------------------------------------------------------------- */

async function importTrainerPublicKey(jwk) {
  return crypto.subtle.importKey("jwk", jwk, { name: "RSA-OAEP", hash: "SHA-256" }, true, ["encrypt"]);
}
async function unlockTrainerRecord(pin, record) {
  const pinKey = await deriveAesKeyFromPin(pin, record.saltPin);
  const pkcs8Buf = await aesDecryptBytes(pinKey, record.wrappedByPin);
  // extractable: true so an admin can re-wrap this same private key for a new trainer account
  return crypto.subtle.importKey("pkcs8", pkcs8Buf, { name: "RSA-OAEP", hash: "SHA-256" }, true, ["decrypt"]);
}
async function rsaEncryptBytes(publicKey, bytes) {
  return b64(await crypto.subtle.encrypt({ name: "RSA-OAEP" }, publicKey, bytes));
}
async function rsaDecryptBytes(privateKey, b64str) {
  return crypto.subtle.decrypt({ name: "RSA-OAEP" }, privateKey, unb64(b64str));
}

async function ensureBootstrap() {
  // Migrate/repair the groups list from any legacy free-text trainee groups.
  const existingGroups = (await sGet("groups_index")) || [];
  if (!existingGroups.length) {
    const trainees = (await sGet("trainees_index")) || [];
    const names = [...new Set(trainees.map((x) => x.group).filter(Boolean))];
    if (names.length) {
      await sSet("groups_index", names.map((name) => ({ id: genId(), name, createdAt: Date.now() })));
    }
  }

  let trainers = (await sGet("trainers_index")) || [];
  if (trainers.length) return;

  let pub = await sGet("trainer_public_key");
  const legacyMeta = await sGet("trainer_meta");

  if (pub && legacyMeta) {
    // Upgrading from the single-trainer version: keep the existing PIN/keys
    // working by turning it into the first "Admin" account.
    await sSet("trainers_index", [
      { id: genId(), name: "Admin", role: "admin", groupNames: [], saltPin: legacyMeta.salt, wrappedByPin: legacyMeta.wrapped, createdAt: Date.now() },
    ]);
    return;
  }

  // Fresh install: generate the organization keypair and a default admin (PIN 1234).
  const kp = await crypto.subtle.generateKey(
    { name: "RSA-OAEP", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["encrypt", "decrypt"]
  );
  const pubJwk = await crypto.subtle.exportKey("jwk", kp.publicKey);
  const privPkcs8 = await crypto.subtle.exportKey("pkcs8", kp.privateKey);
  const salt = randomB64(16);
  const pinKey = await deriveAesKeyFromPin("1234", salt);
  const wrapped = await aesEncryptBytes(pinKey, new Uint8Array(privPkcs8));
  await sSet("trainer_public_key", pubJwk);
  await sSet("trainers_index", [
    { id: genId(), name: "Admin", role: "admin", groupNames: [], saltPin: salt, wrappedByPin: wrapped, createdAt: Date.now() },
  ]);
}

async function findTrainerSessionByPin(pin) {
  const trainers = (await sGet("trainers_index")) || [];
  for (const rec of trainers) {
    try {
      const privateKey = await unlockTrainerRecord(pin, rec);
      return { trainer: rec, privateKey };
    } catch (e) {
      // wrong PIN for this account, try the next one
    }
  }
  return null;
}

async function addTrainerAccount(adminPrivateKey, { name, pin, role, groupNames }) {
  const privPkcs8 = await crypto.subtle.exportKey("pkcs8", adminPrivateKey);
  const salt = randomB64(16);
  const pinKey = await deriveAesKeyFromPin(pin, salt);
  const wrapped = await aesEncryptBytes(pinKey, new Uint8Array(privPkcs8));
  const rec = {
    id: genId(),
    name: name.trim(),
    role: role === "admin" ? "admin" : "trainer",
    groupNames: role === "admin" ? [] : (groupNames || []),
    saltPin: salt,
    wrappedByPin: wrapped,
    createdAt: Date.now(),
  };
  const idx = (await sGet("trainers_index")) || [];
  const next = [...idx, rec];
  await sSet("trainers_index", next);
  return next;
}

async function updateTrainerAccount(trainerId, patch) {
  const idx = (await sGet("trainers_index")) || [];
  const next = idx.map((x) => (x.id === trainerId ? { ...x, ...patch } : x));
  await sSet("trainers_index", next);
  return next;
}

async function removeTrainerAccount(trainerId) {
  const idx = (await sGet("trainers_index")) || [];
  const target = idx.find((x) => x.id === trainerId);
  if (!target) return idx;
  const remainingAdmins = idx.filter((x) => x.role === "admin" && x.id !== trainerId);
  if (target.role === "admin" && remainingAdmins.length === 0) {
    throw new Error("LAST_ADMIN");
  }
  const next = idx.filter((x) => x.id !== trainerId);
  await sSet("trainers_index", next);
  return next;
}

async function changeOwnTrainerPin(trainerId, oldPin, newPin) {
  const idx = (await sGet("trainers_index")) || [];
  const rec = idx.find((x) => x.id === trainerId);
  if (!rec) throw new Error("NOT_FOUND");
  const oldKey = await deriveAesKeyFromPin(oldPin, rec.saltPin);
  const pkcs8Buf = await aesDecryptBytes(oldKey, rec.wrappedByPin);
  const newSalt = randomB64(16);
  const newKey = await deriveAesKeyFromPin(newPin, newSalt);
  const wrapped = await aesEncryptBytes(newKey, new Uint8Array(pkcs8Buf));
  const next = idx.map((x) => (x.id === trainerId ? { ...x, saltPin: newSalt, wrappedByPin: wrapped } : x));
  await sSet("trainers_index", next);
  return next;
}

/* ---- Groups (admin-managed) --------------------------------------------- */

async function addGroupRecord(name) {
  const trimmed = (name || "").trim();
  const idx = (await sGet("groups_index")) || [];
  if (!trimmed || idx.find((g) => g.name.trim().toLowerCase() === trimmed.toLowerCase())) return idx;
  const next = [...idx, { id: genId(), name: trimmed, createdAt: Date.now() }];
  await sSet("groups_index", next);
  return next;
}
async function removeGroupRecord(groupId) {
  const idx = (await sGet("groups_index")) || [];
  const next = idx.filter((g) => g.id !== groupId);
  await sSet("groups_index", next);
  return next;
}

async function createTraineeCrypto(pin) {
  const dkBytes = crypto.getRandomValues(new Uint8Array(32));
  const saltPin = randomB64(16);
  const pinKey = await deriveAesKeyFromPin(pin, saltPin);
  const wrappedByPin = await aesEncryptBytes(pinKey, dkBytes);
  const pub = await sGet("trainer_public_key");
  const trainerPubKey = await importTrainerPublicKey(pub);
  const wrappedByTrainer = await rsaEncryptBytes(trainerPubKey, dkBytes);
  const dk = await importDataKey(dkBytes);
  return { saltPin, wrappedByPin, wrappedByTrainer, dk };
}
async function unlockTraineeDataKey(pin, record) {
  const pinKey = await deriveAesKeyFromPin(pin, record.saltPin);
  const dkBuf = await aesDecryptBytes(pinKey, record.wrappedByPin);
  return importDataKey(dkBuf);
}
async function unlockTraineeDataKeyForTrainer(trainerPrivateKey, record) {
  const dkBuf = await rsaDecryptBytes(trainerPrivateKey, record.wrappedByTrainer);
  return importDataKey(dkBuf);
}

async function archiveTrainee(traineeId, archived) {
  const idx = (await sGet("trainees_index")) || [];
  const next = idx.map((x) => (x.id === traineeId ? { ...x, archived, archivedAt: archived ? Date.now() : null } : x));
  await sSet("trainees_index", next);
  return next;
}

async function deleteTraineeCompletely(traineeId) {
  const docFileKeys = await sList(`doc_file:${traineeId}:`);
  for (const k of docFileKeys) await sDelete(k);
  await sDelete(`docs_index:${traineeId}`);

  const activityFileKeys = await sList(`activity_file:${traineeId}:`);
  for (const k of activityFileKeys) await sDelete(k);
  const legacyPhotoKeys = await sList(`activity_photo:${traineeId}:`);
  for (const k of legacyPhotoKeys) await sDelete(k);
  await sDelete(`activity_index:${traineeId}`);
  await sDelete(`rules_ack:${traineeId}`);

  const idx = (await sGet("trainees_index")) || [];
  const next = idx.filter((x) => x.id !== traineeId);
  await sSet("trainees_index", next);
  return next;
}

/* ---- Fixed internal regulations ("Vos droits et devoirs" from the official trainee
   handbook, Livret Stagiaire version E du 12/01/2024). Hardcoded on purpose — this is
   the center's official règlement intérieur and is not editable by trainers. Only
   fr / en / ar are provided; other interface languages fall back to French. ---- */

const RULES_TEXT = {
  fr: `VOS DROITS ET DEVOIRS

L'entrée d'un(e) stagiaire au CFP02 entraîne l'acceptation sans réserve du présent règlement qui fixe, conformément à la loi, certaines dispositions concernant les horaires, l'utilisation des locaux et du matériel, la représentation des stagiaires, les sanctions.

Article 1 :
Le présent règlement est établi conformément aux dispositions des articles L6352-3 et 6352-4 et R6352-1 et 6352-15 du code du travail. Le présent règlement s'applique à tous les stagiaires, et ce pour la durée de la formation suivie.

Article 2 : Les horaires
Les horaires de chaque stagiaire sont fixés par le/la formateur(trice)-référent, en fonction du contrat de formation. En cas d'absence, le/la stagiaire doit prévenir le CFP02 au cours de la première demi-journée et, en cas de maladie, fournir un arrêt de travail dans les 48 heures. Le CFP02 informe le financeur (employeur, administration, etc..) de toutes absences et/ou retards injustifiés. De plus, conformément à l'article R6341-45 du Code du travail, le/la stagiaire – dont la rémunération est prise en charge par les pouvoirs publics – s'expose à une retenue sur sa rémunération de stage proportionnelle à la durée de l'absence. Pour toute absence non excusée, un courrier sera adressé avec un nouveau rendez-vous afin de poursuivre le parcours.

Article 3 : Santé, hygiène et sécurité
Les stagiaires sont invités à se présenter en tenue vestimentaire correcte. L'affichage sur les murs, sans autorisation de la Direction, est interdit. La photocopieuse ne peut être utilisée à des fins personnelles. Il est interdit de fumer ou vapoter dans les locaux du CFP02. Possibilité de fumer et vapoter au niveau du parking du CFP02 en jetant les mégots dans les poubelles prévues à cet effet. Il est interdit de manger et de boire dans les salles de formation (sauf si le formateur accorde une autorisation exceptionnelle).

Article 4 : Alcool et drogues
Il est interdit dans les mêmes conditions d'introduire ou de consommer des substances psychoactives illicites ou addictives (drogues, alcools, médicaments...).

Article 5 : Restauration
Sont mis à disposition pour les stagiaires désirant prendre leur repas sur les lieux de formation, selon les dispositions prévues par le code du travail : sur le site de Laon, une cuisine, au second étage, équipée d'un micro-onde, bouilloire, réfrigérateur, évier. Sur les sites extérieurs un micro-ondes et un évier. Après chaque utilisation, les stagiaires s'engagent à nettoyer le matériel utilisé ainsi que leur lieu de restauration avec les lingettes mises à cet effet.

Article 6 : Sanitaires
Dans les établissements, des sanitaires en nombre suffisant y compris accès handicapé, sont mis à la disposition des stagiaires. Il convient de rappeler la nécessité de se laver les mains autant de fois que nécessaire pour des raisons évidentes d'hygiène. Les stagiaires s'engagent à laisser ces installations propres.

Article 7 : Sécurité
Établissement sous vidéosurveillance : L'établissement est placé sous vidéosurveillance afin de sécuriser les biens et les personnes (Loi n°95-73 du 21/05/95 modifiée par loi n°2011-267 du 14/03/2011).
Protection des données personnelles du stagiaire : Conformément au règlement européen 2016/679 du 27/04/2016, le CFP02 dispose de moyens informatiques destinés à répondre à ses obligations réglementaires et juridiques en tant qu'organisme de formation. Les données collectées et enregistrées sont réservées à l'usage exclusif du CFP02 et ne sont communiquées à aucun tiers. Toute personne peut obtenir communication et, le cas échéant, rectification, effacement, limitation et portabilité des informations la concernant, en s'adressant au service administratif du CFP02 avec copie à cfp02@cfp02.info.
Responsabilité des effets personnels du stagiaire : Le CFP02 décline toute responsabilité en cas de vol ou de perte, il est recommandé au stagiaire de ne pas laisser ses effets personnels sans surveillance.
Prévention des accidents et incidents : Chaque stagiaire doit avoir pris connaissance et compris les consignes de sécurité et d'évacuation affichées à chaque étage et dans le livret stagiaire. Chaque stagiaire doit veiller à sa propre sécurité et à celle des autres. Si un(e) stagiaire détecte un problème, il/elle doit en avertir immédiatement son(sa) formateur(trice) ou conseiller(ère). Pendant les périodes de stage en entreprise, chaque stagiaire est tenu(e) de se conformer aux règles de sécurité appliquées dans l'établissement.
Accident de travail : Chaque stagiaire bénéficie de la protection des accidents du travail en vertu de l'article L 412.8.11 du Code de la Sécurité Sociale. Tout accident devra être porté à la connaissance du CFP02 dans un délai de 24 heures.
Hygiène : La prévention des risques de maladies est impérative et exige de chacun le respect en matière d'hygiène sur les lieux de formation.

Article 8 : Utilisation du matériel
Sauf autorisation particulière de l'organisme de formation, l'usage du matériel de formation se fait sur les lieux de formation et est exclusivement réservé à l'activité de formation. L'utilisation du matériel à des fins personnelles est interdite. Le/la stagiaire est tenu(e) de conserver en bon état le matériel qui lui est confié et de signaler immédiatement toute anomalie.

Article 9 : Discipline générale
Il est formellement interdit aux stagiaires : d'entrer dans l'établissement en état d'ivresse ou sous l'emprise de stupéfiant ; d'introduire des boissons alcoolisées ou des stupéfiants dans les locaux ; de quitter le centre sans motif ni autorisation écrite, ni de sortir pendant les heures de pause pour des raisons de sécurité et assurance ; d'emporter tout objet sans autorisation écrite ; de fumer ou vapoter dans l'établissement ; d'utiliser le téléphone portable à des fins personnelles pendant les heures de formation ; de prendre des photos sans autorisation ; de publier des informations sur les réseaux sociaux concernant la prestation ; de pénétrer dans les espaces réservés au personnel du CFP02.
Accès aux locaux : sauf autorisation, le/la stagiaire ne peut entrer ou demeurer dans les locaux à d'autres fins que la formation, y introduire des personnes étrangères à l'organisme, ni distribuer des tracts.

Article 10 : Non-discrimination
Constitue une discrimination toute distinction opérée entre les personnes physiques sur le fondement de leur origine, sexe, situation de famille, grossesse, apparence physique, situation économique, patronyme, lieu de résidence, état de santé, handicap, caractéristiques génétiques, mœurs, orientation sexuelle, identité de genre, âge, opinions politiques, activités syndicales, ou de leur appartenance ou non-appartenance, vraie ou supposée, à une ethnie, une nation, une prétendue race ou une religion déterminée (article 225-1 du code pénal).

Article 11 : Garanties disciplinaires / Sanctions
Toute dégradation des locaux ou du matériel sera à la charge du stagiaire. Les sanctions peuvent aller de l'exclusion temporaire à l'exclusion définitive. Aucune sanction ne peut être infligée avant que le/la stagiaire ne soit informé(e) par la Direction des griefs retenus contre lui. Lorsque la Direction envisage une sanction, elle convoque le/la stagiaire par lettre recommandée ou remise contre décharge. Le/la stagiaire peut se faire assister par une personne de son choix : stagiaire ou salarié du CFP02.

Article 11 bis : Échelle des sanctions
Lettre de mise en garde ; L'avertissement (réprimande écrite) ; La mise à pied d'une durée maximale de cinq jours ouvrés ; L'exclusion définitive pour faute ou suite à au moins 3 avertissements.

Article 12 :
La sanction ne peut intervenir moins d'un jour franc ni plus de 15 jours après l'entretien. Elle fait l'objet d'une notification écrite et motivée au stagiaire.

Article 13 :
La Direction du CFP02 informe l'employeur, et éventuellement l'organisme paritaire prenant en charge les frais de formation, de la sanction prise.

Représentation des stagiaires

Article 14 :
Les délégués sont élus pour la durée de leur formation. Leurs fonctions prennent fin lorsqu'ils cessent de participer à la formation. Les délégués font toute suggestion pour améliorer le déroulement des formations et présentent les réclamations individuelles ou collectives relatives aux conditions d'hygiène, de sécurité et à l'application du règlement intérieur.

Article 15 :
En ce qui concerne les dossiers de rémunération, le/la stagiaire est responsable des éléments et documents remis au centre, il/elle doit justifier l'authenticité sous sa propre responsabilité.

Fait à Laon. En signant ce document, vous reconnaissez avoir lu, compris et accepté l'ensemble de ce règlement intérieur.`,

  en: `YOUR RIGHTS AND OBLIGATIONS

Enrolling as a trainee at CFP02 implies full acceptance of these regulations, which set out, in accordance with the law, certain provisions concerning schedules, use of premises and equipment, trainee representation, and sanctions.

Article 1:
These regulations are established in accordance with articles L6352-3, L6352-4, R6352-1 to R6352-15 of the French Labour Code. They apply to all trainees, for the entire duration of the training followed.

Article 2 — Hours:
Each trainee's schedule is set by the referent trainer, based on the training contract. In case of absence, the trainee must notify CFP02 during the first half-day and, in case of illness, provide a medical certificate within 48 hours. CFP02 informs the funder of any unjustified absence and/or lateness. Under article R6341-45 of the Labour Code, a trainee whose training allowance is paid by public authorities is subject to a deduction proportional to the length of the absence. For any unexcused absence, a letter will be sent with a new appointment to continue the pathway.

Article 3 — Health, hygiene and safety:
Trainees are asked to dress appropriately. Posting on the walls without Management's authorization is forbidden. The photocopier may not be used for personal purposes. Smoking or vaping inside CFP02 premises is forbidden; allowed in the car park with cigarette butts disposed of in the bins provided. Eating and drinking in training rooms is forbidden (unless the trainer grants an exceptional authorization).

Article 4 — Alcohol and drugs:
It is likewise forbidden to bring in or consume illicit or addictive psychoactive substances (drugs, alcohol, medication…).

Article 5 — Catering:
For trainees wishing to eat on site: at the Laon site, a kitchen on the second floor equipped with a microwave, kettle, fridge and sink; at other sites, a microwave and a sink. After use, trainees agree to clean the equipment used and their eating area.

Article 6 — Sanitary facilities:
Sufficient sanitary facilities, including disabled access, are made available to trainees, who agree to leave these facilities clean.

Article 7 — Security:
The establishment is under video surveillance to secure property and people. In accordance with the GDPR (EU Regulation 2016/679), CFP02 uses IT systems to meet its regulatory obligations; data collected is used solely by CFP02 and is not shared with any third party. Anyone may obtain access to, rectification, erasure, restriction or portability of, information concerning them by contacting CFP02's administrative department (cfp02@cfp02.info). CFP02 declines all responsibility for theft or loss of personal belongings. Every trainee must read and understand the posted safety and evacuation instructions, and immediately report any hazard. Workplace accidents are covered under French Social Security law and must be reported to CFP02 within 24 hours. Hygiene rules must be observed at all times.

Article 8 — Use of equipment:
Training equipment must be used on the training premises for training purposes only; personal use is forbidden. The trainee must keep equipment in good condition and immediately report any malfunction.

Article 9 — General discipline:
Trainees are strictly forbidden to: enter the establishment intoxicated or under the influence of drugs; bring alcohol or drugs onto the premises; leave the center without written authorization or go out during breaks; take out any object without authorization; smoke or vape inside; use a mobile phone for personal purposes during training; take photos without authorization; publish information about the service on social media; enter staff-only areas.

Article 10 — Non-discrimination:
Discrimination means any distinction made between individuals on the basis of origin, sex, family situation, pregnancy, physical appearance, economic situation, surname, place of residence, health, disability, genetic characteristics, morals, sexual orientation, gender identity, age, political opinions, trade union activities, or actual or presumed belonging to an ethnicity, nation, race or religion (Article 225-1 of the Criminal Code).

Article 11 — Disciplinary guarantees / sanctions:
Any observed damage to premises or equipment will be charged to the trainee. Sanctions may range from temporary to permanent exclusion. No sanction may be imposed before the trainee has been informed of the grievances against them, and may be assisted by a person of their choice during the meeting.

Article 11 bis — Scale of sanctions:
Warning letter; formal written warning; suspension for a maximum of five working days without allowance; permanent exclusion for serious misconduct or after at least 3 formal warnings.

Article 12:
The sanction cannot take effect less than one clear day nor more than 15 days after the meeting, and is notified in writing with reasons.

Article 13:
CFP02's Management informs the employer, and where applicable the funding body, of the sanction taken.

Trainee representation

Article 14:
Delegates are elected for the duration of their training. They may suggest improvements to the training and present individual or collective complaints relating to hygiene, safety and the application of these regulations.

Article 15:
Regarding allowance files, the trainee is responsible for the items and documents provided to the center, and must justify their authenticity.

Done at Laon. By signing this document, you acknowledge that you have read, understood and accepted this entire set of regulations.`,

  ar: `حقوقكم وواجباتكم

يترتب على التحاق أي متدرب/ة بـ CFP02 قبول هذا النظام دون تحفظ، والذي يحدد، وفقاً للقانون، بعض الأحكام المتعلقة بالأوقات، واستخدام المرافق والمعدات، وتمثيل المتدربين، والعقوبات.

المادة 1:
وُضع هذا النظام وفقاً لأحكام المواد L6352-3 وL6352-4 وR6352-1 إلى R6352-15 من مدونة الشغل الفرنسية. يُطبَّق على جميع المتدربين، طوال مدة التكوين المتابَع.

المادة 2 — الأوقات:
يحدد المدرب/ة المرجعي/ة جدول أوقات كل متدرب/ة وفقاً لعقد التكوين. في حال الغياب، يجب إخطار CFP02 خلال النصف الأول من اليوم، وفي حال المرض تقديم شهادة توقف عن العمل خلال 48 ساعة. يُخطر CFP02 الجهة الممولة بأي غياب أو تأخر غير مبرر. وفقاً للمادة R6341-45، يتعرض المتدرب الذي تتحمل السلطات العمومية أجر تكوينه لاقتطاع يتناسب مع مدة الغياب. لكل غياب غير مبرر، سيُرسَل خطاب مع موعد جديد لمتابعة المسار.

المادة 3 — الصحة والنظافة والسلامة:
يُدعى المتدربون إلى الحضور بلباس لائق. يُمنع التعليق على الجدران دون إذن الإدارة. لا يجوز استخدام آلة النسخ لأغراض شخصية. يُمنع التدخين أو التبخير داخل المرافق، مع إمكانية ذلك في موقف السيارات. يُمنع الأكل والشرب في قاعات التكوين إلا بإذن استثنائي.

المادة 4 — الكحول والمخدرات:
يُمنع إدخال أو تعاطي مواد نفسية غير مشروعة أو مسببة للإدمان (مخدرات، كحول، أدوية...).

المادة 5 — المطعم:
في موقع لاون، مطبخ مجهّز بفرن ميكروويف وغلاية وثلاجة ومغسلة؛ في المواقع الأخرى، ميكروويف ومغسلة. يلتزم المتدربون بتنظيف المعدات والمكان بعد الاستخدام.

المادة 6 — المرافق الصحية:
توضع مرافق صحية كافية، بما في ذلك ولوجية لذوي الإعاقة، تحت تصرف المتدربين الذين يلتزمون بتركها نظيفة.

المادة 7 — الأمن:
يخضع المبنى لمراقبة بالفيديو. وفقاً للائحة الأوروبية لحماية البيانات (GDPR)، تُستخدم البيانات المجمّعة حصرياً من طرف CFP02 ولا تُبلَّغ لأي طرف ثالث؛ يحق لكل شخص طلب الوصول إليها أو تصحيحها أو حذفها عبر cfp02@cfp02.info. يخلي CFP02 مسؤوليته عن سرقة أو فقدان الأغراض الشخصية. يجب على كل متدرب الاطلاع على تعليمات السلامة والإخلاء وإبلاغ أي خطر فوراً. تخضع حوادث الشغل لقانون الضمان الاجتماعي الفرنسي ويجب الإبلاغ عنها خلال 24 ساعة. يجب احترام قواعد النظافة في كل الأوقات.

المادة 8 — استخدام المعدات:
تُستخدم معدات التكوين حصرياً في أماكن التكوين ولأغراض التكوين فقط؛ يُمنع الاستخدام الشخصي. يجب الحفاظ على المعدات وإبلاغ أي عطل فوراً.

المادة 9 — الانضباط العام:
يُمنع منعاً باتاً: الدخول في حالة سكر أو تحت تأثير مخدرات؛ إدخال كحول أو مخدرات؛ مغادرة المركز دون إذن كتابي أو الخروج خلال الاستراحات؛ إخراج أي غرض دون إذن؛ التدخين أو التبخير داخل المبنى؛ استخدام الهاتف لأغراض شخصية خلال التكوين؛ التقاط صور دون إذن؛ نشر معلومات عن الخدمة على مواقع التواصل؛ دخول أماكن الموظفين.

المادة 10 — عدم التمييز:
يُقصد بالتمييز أي تفرقة بين الأشخاص على أساس الأصل أو الجنس أو الوضع العائلي أو الحمل أو المظهر الجسدي أو الوضع الاقتصادي أو اللقب أو مكان الإقامة أو الحالة الصحية أو الإعاقة أو الخصائص الجينية أو السلوك أو الميول الجنسية أو الهوية الجندرية أو السن أو الآراء السياسية أو الأنشطة النقابية أو الانتماء الحقيقي أو المفترض إلى عرق أو أمة أو دين معيّن (المادة 225-1 من قانون العقوبات).

المادة 11 — الضمانات التأديبية / العقوبات:
يتحمل المتدرب تكلفة أي تلف في المرافق أو المعدات. يمكن أن تتراوح العقوبات بين الإقصاء المؤقت والنهائي. لا يجوز فرض أي عقوبة قبل إبلاغ المتدرب بالمآخذ المنسوبة إليه، ويحق له الاستعانة بشخص من اختياره خلال اللقاء.

المادة 11 مكرر — سلّم العقوبات:
خطاب إنذار؛ التوبيخ الكتابي؛ الإيقاف لمدة أقصاها خمسة أيام عمل دون أجر؛ الإقصاء النهائي لمخالفة جسيمة أو بعد 3 إنذارات على الأقل.

المادة 12:
لا تُطبَّق العقوبة قبل مرور يوم كامل ولا بعد 15 يوماً من اللقاء، وتُبلَّغ كتابياً ومُعللة.

المادة 13:
تُبلغ إدارة CFP02 صاحب العمل، وعند الاقتضاء الجهة الممولة، بالعقوبة المتخذة.

تمثيل المتدربين

المادة 14:
يُنتخب المندوبون لمدة تكوينهم، ويقدّمون اقتراحات لتحسين سير التكوين والشكاوى المتعلقة بالنظافة والسلامة وتطبيق هذا النظام.

المادة 15:
فيما يخص ملفات الأجر، يتحمل المتدرب مسؤولية الوثائق المسلَّمة للمركز ويجب عليه إثبات صحتها.

حُرِّر في لاون. بتوقيعك على هذا المستند، تقرّ بأنك قرأت وفهمت ووافقت على كامل هذا النظام الداخلي.`,

  tr: `HAKLARINIZ VE YÜKÜMLÜLÜKLERİNİZ

CFP02'ye stajyer olarak kayıt olmak, çalışma saatleri, mekân ve ekipman kullanımı, stajyer temsili ve yaptırımlar hakkındaki hükümleri belirleyen bu iç yönetmeliğin kayıtsız şartsız kabul edildiği anlamına gelir.

Madde 1: Bu yönetmelik Fransız İş Kanunu'nun L6352-3, L6352-4, R6352-1 – R6352-15 maddelerine uygun olarak hazırlanmıştır ve eğitim süresi boyunca tüm stajyerlere uygulanır.

Madde 2 — Saatler: Her stajyerin programı eğitim sözleşmesine göre referans eğitmen tarafından belirlenir. Devamsızlık halinde ilk yarım gün içinde CFP02'ye haber verilmeli, hastalık halinde 48 saat içinde rapor sunulmalıdır. Haksız devamsızlıklar finansörlere bildirilir ve ödenekten kesinti yapılabilir.

Madde 3 — Sağlık, hijyen ve güvenlik: Uygun kıyafet giyilmesi beklenir. İzinsiz duvara afiş asmak, fotokopi makinesini kişisel amaçla kullanmak yasaktır. Binada sigara/elektronik sigara içmek yasaktır (otoparkta izinlidir). Eğitim salonlarında yiyip içmek yasaktır.

Madde 4 — Alkol ve uyuşturucu: Yasa dışı veya bağımlılık yapan maddelerin (uyuşturucu, alkol, ilaç…) getirilmesi ve kullanılması yasaktır.

Madde 5 — Yemek: Laon'da mikrodalga, su ısıtıcı, buzdolabı ve lavabolu bir mutfak; diğer merkezlerde mikrodalga ve lavabo bulunur. Kullanımdan sonra temizlik stajyerin sorumluluğundadır.

Madde 6 — Sıhhi tesisler: Engelli erişimi dâhil yeterli tesis sunulur; temiz bırakılması beklenir.

Madde 7 — Güvenlik: Bina video ile izlenir. GDPR (AB 2016/679) uyarınca toplanan veriler yalnızca CFP02 tarafından kullanılır, üçüncü taraflarla paylaşılmaz; erişim, düzeltme ve silme talepleri cfp02@cfp02.info adresine yapılır. CFP02 kişisel eşyaların kaybından sorumlu değildir. Güvenlik ve tahliye talimatları okunmalı, tehlikeler derhal bildirilmelidir. İş kazaları 24 saat içinde bildirilmelidir.

Madde 8 — Ekipman: Ekipman ve belgeler özenle kullanılmalı, yerine bırakılmalıdır. Bilgisayarlar yalnızca eğitim amaçlı kullanılır.

Madde 9 — Cep telefonu: Eğitim salonlarında telefon kullanımı yasaktır; sessize alınmalıdır.

Madde 10 — Ücretsiz eğitim: Eğitim stajyer için ücretsizdir; finansman kamu kurumları tarafından sağlanır.

Madde 11 — Yaptırımlar: Yönetmeliğe aykırı davranışlar uyarı, kınama veya eğitimden kesin çıkarma ile sonuçlanabilir.

Madde 12 — Savunma hakkı: Hiçbir yaptırım, stajyere gerekçeler bildirilip açıklama yapma imkânı verilmeden uygulanamaz.

Madde 13 — Temsil: Stajyer grupları, mevzuata uygun olarak temsilci seçer.

Madde 14 — Temsilcilerin görevi: Temsilciler eğitim süresince seçilir; eğitimin işleyişine dair öneri ve şikâyetleri iletir.

Madde 15 — Ücret dosyaları: Stajyer, merkeze teslim ettiği belgelerin doğruluğundan sorumludur.

Laon'da düzenlenmiştir. Bu belgeyi imzalayarak bu iç yönetmeliğin tamamını okuduğunuzu, anladığınızı ve kabul ettiğinizi beyan edersiniz.`,

  es: `SUS DERECHOS Y DEBERES

La incorporación de un(a) alumno(a) al CFP02 implica la aceptación sin reservas de este reglamento, que fija, conforme a la ley, las disposiciones sobre horarios, uso de los locales y del material, representación de los alumnos y sanciones.

Artículo 1: Este reglamento se establece conforme a los artículos L6352-3, L6352-4 y R6352-1 a R6352-15 del Código del Trabajo francés y se aplica a todos los alumnos durante toda la formación.

Artículo 2 — Horarios: El formador de referencia fija el horario según el contrato de formación. En caso de ausencia hay que avisar al CFP02 durante la primera media jornada y, si es por enfermedad, presentar un justificante médico en 48 horas. Las ausencias injustificadas se comunican al financiador y pueden implicar una deducción proporcional de la remuneración.

Artículo 3 — Salud, higiene y seguridad: Se pide vestimenta adecuada. Prohibido colocar carteles sin autorización y usar la fotocopiadora con fines personales. Prohibido fumar o vapear en el interior (permitido en el aparcamiento). Prohibido comer y beber en las aulas.

Artículo 4 — Alcohol y drogas: Prohibido introducir o consumir sustancias ilícitas o adictivas (drogas, alcohol, medicamentos…).

Artículo 5 — Comidas: En Laon, cocina con microondas, hervidor, nevera y fregadero; en otros centros, microondas y fregadero. Hay que limpiar el material y el espacio después de usarlos.

Artículo 6 — Sanitarios: Se ponen a disposición sanitarios suficientes, incluidos accesibles, que deben dejarse limpios.

Artículo 7 — Seguridad: El edificio está videovigilado. Conforme al RGPD (UE 2016/679), los datos recogidos son de uso exclusivo del CFP02 y no se comunican a terceros; acceso, rectificación y supresión en cfp02@cfp02.info. El CFP02 no se responsabiliza de robos o pérdidas de objetos personales. Deben leerse las instrucciones de seguridad y evacuación y señalar de inmediato cualquier peligro. Los accidentes de trabajo se declaran en 24 horas.

Artículo 8 — Material: El material y los documentos deben usarse con cuidado y devolverse a su lugar. Los ordenadores se usan solo con fines formativos.

Artículo 9 — Teléfono móvil: Prohibido su uso en las aulas; debe estar silenciado.

Artículo 10 — Gratuidad: La formación es gratuita para el alumno; la financian organismos públicos.

Artículo 11 — Sanciones: El incumplimiento puede dar lugar a advertencia, apercibimiento o exclusión definitiva de la formación.

Artículo 12 — Derecho de defensa: Ninguna sanción se aplica sin informar al alumno de los motivos y permitirle explicarse.

Artículo 13 — Representación: Los grupos de alumnos eligen delegados conforme a la normativa.

Artículo 14 — Función de los delegados: Elegidos por la duración de la formación, transmiten sugerencias y reclamaciones sobre higiene, seguridad y aplicación del reglamento.

Artículo 15 — Expedientes de remuneración: El alumno es responsable de la autenticidad de los documentos entregados al centro.

Hecho en Laon. Al firmar este documento reconoce haber leído, comprendido y aceptado la totalidad de este reglamento interno.`,

  pt: `OS SEUS DIREITOS E DEVERES

A entrada de um(a) formando(a) no CFP02 implica a aceitação sem reservas deste regulamento, que fixa, em conformidade com a lei, as disposições relativas a horários, utilização das instalações e do material, representação dos formandos e sanções.

Artigo 1: Este regulamento é estabelecido de acordo com os artigos L6352-3, L6352-4 e R6352-1 a R6352-15 do Código do Trabalho francês e aplica-se a todos os formandos durante toda a formação.

Artigo 2 — Horários: O formador de referência define o horário conforme o contrato de formação. Em caso de ausência, avisar o CFP02 na primeira meia jornada e, em caso de doença, apresentar atestado em 48 horas. As ausências injustificadas são comunicadas ao financiador e podem originar dedução proporcional da remuneração.

Artigo 3 — Saúde, higiene e segurança: Pede-se vestuário adequado. Proibido afixar cartazes sem autorização e usar a fotocopiadora para fins pessoais. Proibido fumar ou vapear no interior (permitido no estacionamento). Proibido comer e beber nas salas de formação.

Artigo 4 — Álcool e drogas: Proibido introduzir ou consumir substâncias ilícitas ou aditivas (drogas, álcool, medicamentos…).

Artigo 5 — Refeições: Em Laon, cozinha com micro-ondas, chaleira, frigorífico e lava-louça; nos outros locais, micro-ondas e lava-louça. É obrigatório limpar o material e o espaço após a utilização.

Artigo 6 — Instalações sanitárias: São disponibilizadas instalações suficientes, incluindo acessíveis, que devem ser deixadas limpas.

Artigo 7 — Segurança: O edifício é videovigiado. Nos termos do RGPD (UE 2016/679), os dados recolhidos são de uso exclusivo do CFP02 e não são comunicados a terceiros; acesso, retificação e apagamento através de cfp02@cfp02.info. O CFP02 não se responsabiliza por roubo ou perda de bens pessoais. As instruções de segurança e evacuação devem ser lidas e qualquer perigo comunicado de imediato. Os acidentes de trabalho devem ser declarados em 24 horas.

Artigo 8 — Material: O material e os documentos devem ser usados com cuidado e arrumados. Os computadores destinam-se apenas à formação.

Artigo 9 — Telemóvel: Proibido usar nas salas de formação; deve estar silenciado.

Artigo 10 — Gratuidade: A formação é gratuita para o formando, financiada por organismos públicos.

Artigo 11 — Sanções: O incumprimento pode dar lugar a advertência, repreensão ou exclusão definitiva da formação.

Artigo 12 — Direito de defesa: Nenhuma sanção é aplicada sem informar o formando dos motivos e permitir-lhe explicar-se.

Artigo 13 — Representação: Os grupos de formandos elegem delegados conforme a regulamentação.

Artigo 14 — Papel dos delegados: Eleitos pela duração da formação, transmitem sugestões e reclamações sobre higiene, segurança e aplicação do regulamento.

Artigo 15 — Processos de remuneração: O formando é responsável pela autenticidade dos documentos entregues ao centro.

Feito em Laon. Ao assinar este documento, reconhece ter lido, compreendido e aceite a totalidade deste regulamento interno.`,

  ru: `ВАШИ ПРАВА И ОБЯЗАННОСТИ

Зачисление стажёра в CFP02 означает безоговорочное принятие настоящих правил, которые в соответствии с законом определяют режим занятий, использование помещений и оборудования, представительство стажёров и взыскания.

Статья 1: Правила составлены в соответствии со статьями L6352-3, L6352-4 и R6352-1 – R6352-15 Трудового кодекса Франции и применяются ко всем стажёрам на весь период обучения.

Статья 2 — Расписание: Расписание устанавливает наставник согласно договору об обучении. При отсутствии необходимо предупредить CFP02 в первую половину дня, при болезни — предоставить справку в течение 48 часов. О неоправданных пропусках сообщается финансирующему органу; возможен пропорциональный вычет из пособия.

Статья 3 — Здоровье, гигиена и безопасность: Требуется подобающая одежда. Запрещено размещать объявления без разрешения и использовать копировальный аппарат в личных целях. Курение и вейпинг в помещениях запрещены (разрешено на парковке). Есть и пить в учебных залах запрещено.

Статья 4 — Алкоголь и наркотики: Запрещено приносить и употреблять запрещённые или вызывающие зависимость вещества (наркотики, алкоголь, медикаменты…).

Статья 5 — Питание: В Лаоне есть кухня с микроволновкой, чайником, холодильником и мойкой; на других площадках — микроволновка и мойка. После использования нужно всё убрать.

Статья 6 — Санитарные помещения: Предоставляются в достаточном количестве, включая доступные для людей с инвалидностью; их следует оставлять чистыми.

Статья 7 — Безопасность: Здание находится под видеонаблюдением. Согласно GDPR (ЕС 2016/679) собранные данные используются только CFP02 и не передаются третьим лицам; доступ, исправление и удаление — через cfp02@cfp02.info. CFP02 не отвечает за кражу или утрату личных вещей. Необходимо ознакомиться с инструкциями по безопасности и эвакуации и немедленно сообщать об опасности. О несчастных случаях сообщается в течение 24 часов.

Статья 8 — Оборудование: Использовать бережно и возвращать на место. Компьютеры — только для учебных целей.

Статья 9 — Мобильный телефон: В учебных залах пользоваться запрещено; телефон должен быть беззвучным.

Статья 10 — Бесплатность: Обучение бесплатно для стажёра и финансируется государственными органами.

Статья 11 — Взыскания: Нарушение правил может привести к предупреждению, выговору или окончательному исключению.

Статья 12 — Право на защиту: Взыскание не применяется без объяснения причин стажёру и возможности высказаться.

Статья 13 — Представительство: Группы стажёров избирают делегатов в соответствии с нормами.

Статья 14 — Роль делегатов: Избираются на срок обучения, передают предложения и жалобы по гигиене, безопасности и применению правил.

Статья 15 — Документы по оплате: Стажёр отвечает за подлинность переданных центру документов.

Составлено в Лаоне. Подписывая этот документ, вы подтверждаете, что прочитали, поняли и приняли настоящие внутренние правила полностью.`,

  uk: `ВАШІ ПРАВА ТА ОБОВ'ЯЗКИ

Зарахування стажера до CFP02 означає беззастережне прийняття цих правил, які відповідно до закону визначають розклад, користування приміщеннями та обладнанням, представництво стажерів і стягнення.

Стаття 1: Правила укладені відповідно до статей L6352-3, L6352-4 та R6352-1 – R6352-15 Трудового кодексу Франції і застосовуються до всіх стажерів упродовж навчання.

Стаття 2 — Розклад: Розклад визначає наставник згідно з договором про навчання. У разі відсутності потрібно повідомити CFP02 у першу половину дня, у разі хвороби — надати довідку протягом 48 годин. Про невиправдані пропуски повідомляють фінансувальника; можливе пропорційне зменшення виплати.

Стаття 3 — Здоров'я, гігієна та безпека: Потрібен належний одяг. Заборонено розміщувати оголошення без дозволу та використовувати копіювальний апарат в особистих цілях. Курити й вейпити в приміщенні заборонено (дозволено на парковці). Їсти та пити в навчальних залах заборонено.

Стаття 4 — Алкоголь і наркотики: Заборонено приносити чи вживати заборонені або залежність-викликаючі речовини (наркотики, алкоголь, медикаменти…).

Стаття 5 — Харчування: У Лані є кухня з мікрохвильовкою, чайником, холодильником і мийкою; на інших майданчиках — мікрохвильовка та мийка. Після використання потрібно прибрати.

Стаття 6 — Санітарні приміщення: Надаються в достатній кількості, зокрема доступні; їх слід залишати чистими.

Стаття 7 — Безпека: Будівля під відеоспостереженням. Згідно з GDPR (ЄС 2016/679) зібрані дані використовує лише CFP02 і не передає третім особам; доступ, виправлення та видалення — через cfp02@cfp02.info. CFP02 не відповідає за кражу чи втрату особистих речей. Треба ознайомитися з інструкціями з безпеки та евакуації і негайно повідомляти про небезпеку. Про нещасні випадки повідомляють протягом 24 годин.

Стаття 8 — Обладнання: Користуватися обережно та повертати на місце. Комп'ютери — лише для навчання.

Стаття 9 — Мобільний телефон: У навчальних залах користуватися заборонено; телефон має бути беззвучним.

Стаття 10 — Безоплатність: Навчання безоплатне для стажера, фінансується державними органами.

Стаття 11 — Стягнення: Порушення правил може призвести до попередження, зауваження або остаточного виключення.

Стаття 12 — Право на захист: Стягнення не застосовують без пояснення причин і можливості висловитися.

Стаття 13 — Представництво: Групи стажерів обирають делегатів відповідно до норм.

Стаття 14 — Роль делегатів: Обираються на строк навчання, передають пропозиції та скарги щодо гігієни, безпеки й застосування правил.

Стаття 15 — Документи щодо оплати: Стажер відповідає за достовірність документів, переданих центру.

Складено в Лані. Підписуючи цей документ, ви підтверджуєте, що прочитали, зрозуміли та прийняли ці внутрішні правила повністю.`,

  fa: `حقوق و وظایف شما

ثبت‌نام کارآموز در CFP02 به معنای پذیرش بی‌قید و شرط این آیین‌نامه است که بر اساس قانون، ساعات کار، استفاده از فضا و تجهیزات، نمایندگی کارآموزان و مجازات‌ها را تعیین می‌کند.

ماده ۱: این آیین‌نامه بر پایه مواد L6352-3، L6352-4 و R6352-1 تا R6352-15 قانون کار فرانسه تنظیم شده و در تمام مدت آموزش برای همه کارآموزان اجرا می‌شود.

ماده ۲ — ساعات: برنامه هر کارآموز توسط مربی مرجع و بر اساس قرارداد آموزشی تعیین می‌شود. در صورت غیبت باید در نیمه اول روز به CFP02 اطلاع داد و در صورت بیماری تا ۴۸ ساعت گواهی پزشکی ارائه کرد. غیبت بدون دلیل به نهاد تأمین‌کننده اعلام می‌شود و ممکن است باعث کسر متناسب کمک‌هزینه شود.

ماده ۳ — بهداشت و ایمنی: پوشش مناسب لازم است. نصب اعلامیه بدون اجازه و استفاده شخصی از دستگاه کپی ممنوع است. سیگار و ویپ در ساختمان ممنوع (در پارکینگ مجاز) است. خوردن و آشامیدن در کلاس‌ها ممنوع است.

ماده ۴ — الکل و مواد مخدر: آوردن یا مصرف مواد غیرقانونی و اعتیادآور (مواد مخدر، الکل، دارو…) ممنوع است.

ماده ۵ — غذا: در لائون آشپزخانه‌ای با مایکروویو، کتری، یخچال و سینک؛ در سایر مراکز مایکروویو و سینک وجود دارد. پس از استفاده، نظافت بر عهده کارآموز است.

ماده ۶ — سرویس‌های بهداشتی: به اندازه کافی، شامل دسترس‌پذیر برای معلولان، فراهم است و باید پاکیزه رها شود.

ماده ۷ — امنیت: ساختمان دارای دوربین مداربسته است. بر اساس GDPR (اتحادیه اروپا ۲۰۱۶/۶۷۹) داده‌ها فقط توسط CFP02 استفاده می‌شود و به شخص ثالث داده نمی‌شود؛ دسترسی، اصلاح و حذف از طریق cfp02@cfp02.info. CFP02 مسئول دزدی یا گم شدن وسایل شخصی نیست. دستورهای ایمنی و تخلیه باید خوانده شود و هر خطر فوراً اطلاع داده شود. حوادث کار باید در ۲۴ ساعت اعلام شود.

ماده ۸ — تجهیزات: با دقت استفاده و سر جای خود گذاشته شود. رایانه‌ها فقط برای آموزش است.

ماده ۹ — تلفن همراه: استفاده در کلاس ممنوع است و باید بی‌صدا باشد.

ماده ۱۰ — رایگان بودن: آموزش برای کارآموز رایگان است و نهادهای عمومی آن را تأمین می‌کنند.

ماده ۱۱ — مجازات‌ها: تخلف می‌تواند به اخطار، تذکر کتبی یا اخراج قطعی منجر شود.

ماده ۱۲ — حق دفاع: هیچ مجازاتی بدون اعلام دلایل و فرصت توضیح اعمال نمی‌شود.

ماده ۱۳ — نمایندگی: گروه‌های کارآموز بر اساس مقررات نماینده انتخاب می‌کنند.

ماده ۱۴ — نقش نمایندگان: برای مدت آموزش انتخاب می‌شوند و پیشنهادها و شکایات مربوط به بهداشت، ایمنی و اجرای آیین‌نامه را منتقل می‌کنند.

ماده ۱۵ — پرونده‌های کمک‌هزینه: کارآموز مسئول درستی مدارک تحویل‌داده‌شده به مرکز است.

تنظیم‌شده در لائون. با امضای این سند تأیید می‌کنید که تمام این آیین‌نامه داخلی را خوانده، فهمیده و پذیرفته‌اید.`,

  prs: `حقوق او مکلفیتونه

په CFP02 کې د یو کارآموز شمولیت د دې کورني مقررات بې قید منل معنی لري، چې د قانون سره سم ساعتونه، د ودانۍ او تجهیزاتو کارول، د کارآموزانو استازیتوب او جزاوې ټاکي.

ماده ۱: دا مقررات د فرانسې د کار قانون د L6352-3، L6352-4 او R6352-1 تر R6352-15 موادو سره سم جوړ شوي او د ټولې روزنې په موده کې پر ټولو کارآموزانو تطبیق کیږي.

ماده ۲ — ساعتونه: د هر کارآموز مهال ویش د مرجع ښوونکي لخوا د روزنې قرارداد له مخې ټاکل کیږي. د غیر حاضرۍ په صورت کې باید د ورځې په لومړۍ نیمایي کې CFP02 خبر شي او د ناروغۍ په حالت کې تر ۴۸ ساعتونو پورې طبي سند وړاندې شي. بې دلیله غیر حاضري تمویل کوونکي ته خبر ورکول کیږي او د مرستې تناسبي کمښت رامنځته کولی شي.

ماده ۳ — روغتیا، پاکوالی او امنیت: مناسب لباس اړین دی. د اجازې پرته پر دیوالونو اعلان لګول او د کاپي ماشین شخصي کارول منع دي. په ودانۍ کې سګرټ او ویپ منع (په پارکینګ کې جواز لري). په روزنیزو کوټو کې خوړل او څښل منع دي.

ماده ۴ — الکول او نشه یې توکي: غیر قانوني یا اعتیاد راوستونکي مواد (نشه یې توکي، الکول، درمل…) راوستل او کارول منع دي.

ماده ۵ — خواړه: په لاون کې پخلنځی د مایکروویف، کیتلي، یخچال او سینک سره؛ په نورو مرکزونو کې مایکروویف او سینک. له کارولو وروسته پاکوالی د کارآموز مسؤولیت دی.

ماده ۶ — تشنابونه: کافي، په شمول د معلولینو لپاره لاسرسي وړ، برابر دي او باید پاک پریښودل شي.

ماده ۷ — امنیت: ودانۍ د کمرې تر څارنې لاندې ده. د GDPR (اروپايي اتحادیه ۲۰۱۶/۶۷۹) له مخې ټول معلومات یوازې CFP02 کاروي او دریمې خوا ته نه سپارل کیږي؛ لاسرسی، سمون او له منځه وړل د cfp02@cfp02.info له لارې. CFP02 د شخصي شیانو د غلا یا ورکېدو مسؤولیت نه لري. د امنیت او تخلیې لارښوونې باید ولوستل شي او هر خطر سمدلاسه راپور شي. کاري پېښې باید په ۲۴ ساعتونو کې اعلان شي.

ماده ۸ — تجهیزات: په احتیاط وکارول شي او خپل ځای ته وګرځول شي. کمپیوټرونه یوازې د روزنې لپاره دي.

ماده ۹ — موبایل: په روزنیزو کوټو کې کارول منع دي؛ باید بې غږه وي.

ماده ۱۰ — وړیا والی: روزنه د کارآموز لپاره وړیا ده او عامه ادارې یې تمویل کوي.

ماده ۱۱ — جزاوې: سرغړونه کولی شي خبرداری، لیکلې نیوکه یا له روزنې قطعي اخراج ولري.

ماده ۱۲ — د دفاع حق: هیڅ جزا د دلایلو د خبرولو او د توضیح فرصت پرته نه تطبیق کیږي.

ماده ۱۳ — استازیتوب: د کارآموزانو ډلې د مقرراتو سره سم استازي ټاکي.

ماده ۱۴ — د استازو رول: د روزنې د مودې لپاره ټاکل کیږي او د پاکوالي، امنیت او د مقرراتو د تطبیق په اړه وړاندیزونه او شکایتونه لیږدوي.

ماده ۱۵ — د مرستې دوسیې: کارآموز د مرکز ته سپارل شویو اسنادو د صحت مسؤول دی.

په لاون کې ترتیب شو. د دې سند په لاسلیک کولو تاسو مني چې دا ټول کورني مقررات مو لوستلي، پوه شوي او منلي دي.`,

  ku: `مافەکان و ئەرکەکانی تۆ

تۆمارکردنی فێرخواز لە CFP02 بە پەسەندکردنی بێ مەرجی ئەم ڕێسانە دادەنرێت، کە بەپێی یاسا کاتەکان، بەکارهێنانی شوێن و ئامێرەکان، نوێنەرایەتی فێرخوازان و سزاکان دیاری دەکەن.

بەند ١: ئەم ڕێسانە بەپێی بەندەکانی L6352-3، L6352-4 و R6352-1 بۆ R6352-15 ی یاسای کاری فەرەنسا دانراوە و بۆ هەموو فێرخوازان بە درێژایی خولی فێرکاری جێبەجێ دەکرێت.

بەند ٢ — کاتەکان: خشتەی هەر فێرخوازێک لەلایەن ڕاهێنەری سەرەکی و بەپێی گرێبەستی فێرکاری دیاری دەکرێت. لە کاتی نەهاتن دەبێت لە نیوەی یەکەمی ڕۆژدا CFP02 ئاگادار بکرێت و لە کاتی نەخۆشی بەڵگەنامەی پزیشکی لە ٤٨ کاتژمێردا پێشکەش بکرێت. نەهاتنی بێ بەڵگە بە دابینکەر ڕادەگەیەنرێت و دەکرێت بەشێک لە پارەدان کەم بکرێتەوە.

بەند ٣ — تەندروستی، پاکوخاوێنی و سەلامەتی: جلوبەرگی گونجاو پێویستە. هەڵواسینی ئاگادارکردنەوە بەبێ مۆڵەت و بەکارهێنانی کەسی ئامێری کۆپی قەدەغەیە. جگەرەکێشان و ڤیپ لە ناو بیناکە قەدەغەیە (لە پارکینگ ڕێگەپێدراوە). خواردن و خواردنەوە لە هۆڵەکانی فێرکاری قەدەغەیە.

بەند ٤ — کحول و مادە هۆشبەرەکان: هێنان یان بەکارهێنانی مادەی نایاسایی و ڕاهێنەر (مادەی هۆشبەر، کحول، دەرمان…) قەدەغەیە.

بەند ٥ — خواردن: لە لاون چێشتخانەیەک بە مایکرۆوەیڤ، کەتلی، ساردکەرەوە و دەستشۆر؛ لە شوێنەکانی تر مایکرۆوەیڤ و دەستشۆر. دوای بەکارهێنان پاککردنەوە ئەرکی فێرخوازە.

بەند ٦ — ئاودەستەکان: بە ژمارەی پێویست، بە ناوبردنی گونجاو بۆ کەم‌ئەندامان، دابین کراون و دەبێت پاک بەجێ بهێڵدرێن.

بەند ٧ — ئاسایش: بیناکە بە کامێرا چاودێری دەکرێت. بەپێی GDPR (یەکێتیی ئەوروپا ٢٠١٦/٦٧٩) داتاکان تەنها لەلایەن CFP02 بەکاردەهێنرێن و بە لای سێیەم نادرێن؛ دەستپێگەیشتن، ڕاستکردنەوە و سڕینەوە لە ڕێگەی cfp02@cfp02.info. CFP02 بەرپرس نییە بۆ دزین یان لەدەستدانی کەلوپەلی کەسی. ڕێنماییەکانی سەلامەتی و بەتاڵکردن دەبێت بخوێنرێن و هەر مەترسییەک دەستبەجێ ڕابگەیەنرێت. ڕووداوی کار دەبێت لە ٢٤ کاتژمێردا ڕابگەیەنرێت.

بەند ٨ — ئامێرەکان: بە ئاگایی بەکاربهێنرێن و بۆ شوێنی خۆیان بگەڕێنرێنەوە. کۆمپیوتەرەکان تەنها بۆ فێرکارین.

بەند ٩ — مۆبایل: بەکارهێنانی لە هۆڵەکانی فێرکاری قەدەغەیە؛ دەبێت بێدەنگ بێت.

بەند ١٠ — بەخۆڕایی: فێرکاری بۆ فێرخواز بەخۆڕاییە و لەلایەن دەزگاکانی گشتی دابین دەکرێت.

بەند ١١ — سزاکان: پێشێلکاری دەکرێت بە ئاگادارکردنەوە، سەرنجی نووسراو یان دەرکردنی کۆتایی لە فێرکاری کۆتایی بێت.

بەند ١٢ — مافی بەرگری: هیچ سزایەک بەبێ ئاگادارکردنی هۆکارەکان و دانی دەرفەتی ڕوونکردنەوە جێبەجێ نەکرێت.

بەند ١٣ — نوێنەرایەتی: گرووپەکانی فێرخوازان بەپێی ڕێسا نوێنەر هەڵدەبژێرن.

بەند ١٤ — ڕۆڵی نوێنەران: بۆ ماوەی فێرکاری هەڵدەبژێرن و پێشنیار و سکاڵاکان دەربارەی پاکوخاوێنی، سەلامەتی و جێبەجێکردنی ڕێساکان دەگەیەنن.

بەند ١٥ — دۆسیەی پارەدان: فێرخواز بەرپرسیارە لە ڕاستی ئەو بەڵگەنامانەی بە سەنتەر دەدرێن.

لە لاون ئامادە کراوە. بە واژووکردنی ئەم بەڵگەنامەیە دان دەنێی کە هەموو ئەم ڕێسا ناوەکییەکانت خوێندووە، تێگەیشتووی و پەسەندت کردووە.`,

  krl: `MAF Û ERKÊN WE

Tomarkirina stajyerekî li CFP02 tê wateya pejirandina bêmerc a vê rêziknameya hundirîn, ku li gorî qanûnê demjimêr, bikaranîna cih û amûran, nûnertiya stajyeran û cezayan destnîşan dike.

Xala 1: Ev rêzikname li gorî xalên L6352-3, L6352-4 û R6352-1 heta R6352-15 ya Qanûna Kar a Fransayê hatiye amadekirin û di tevahiya perwerdehiyê de ji bo hemû stajyeran tê sepandin.

Xala 2 — Demjimêr: Bernameya her stajyerî ji hêla perwerdekarê referans û li gorî peymana perwerdehiyê tê destnîşankirin. Di rewşa nehatinê de divê di nîvroja yekem de CFP02 agahdar bibe û di rewşa nexweşiyê de di 48 saetan de belgeya bijîşkî were pêşkêşkirin. Nehatinên bêsedem ji dabînkerê re têne ragihandin û dibe ku ji alîkariyê kêmkirinek çêbibe.

Xala 3 — Tenduristî, paqijî û ewlehî: Cilê guncaw tê xwestin. Bêyî destûr daliqandina agahdariyan û bikaranîna kesane ya makîneya kopiyê qedexe ye. Cixarekêşan û vape di hundir de qedexe ye (li parkingê destûr e). Xwarin û vexwarin di odeyên perwerdehiyê de qedexe ye.

Xala 4 — Alkol û narkotîk: Anîn an bikaranîna maddeyên neqanûnî û tiryakker (narkotîk, alkol, derman…) qedexe ye.

Xala 5 — Xwarin: Li Laon mitbaxek bi mîkrofirn, kettle, sarincok û şûştinê; li cihên din mîkrofirn û şûştin. Piştî bikaranînê paqijkirin erkê stajyer e.

Xala 6 — Avdestxane: Bi hejmara pêwîst, tevî yên gihîştî ji bo kêmendaman, tên peyda kirin û divê paqij bêne hiştin.

Xala 7 — Ewlehî: Avahî bi kamera tê şopandin. Li gorî GDPR (YE 2016/679) dane tenê ji hêla CFP02 tên bikaranîn û ji aliyên sêyem re nayên dayîn; gihîştin, rastkirin û jêbirin bi cfp02@cfp02.info. CFP02 ji dizî an windakirina tiştên kesane berpirsiyar nine. Rêbernameyên ewlehî û valakirinê divê bêne xwendin û her metirsî tavilê were ragihandin. Qezayên kar divê di 24 saetan de bêne ragihandin.

Xala 8 — Amûr: Bi baldarî bêne bikaranîn û li cihê xwe vegerin. Komputer tenê ji bo perwerdehiyê ne.

Xala 9 — Mobîl: Bikaranîn di odeyên perwerdehiyê de qedexe ye; divê bêdeng be.

Xala 10 — Belaş: Perwerdehî ji bo stajyer belaş e û ji hêla saziyên giştî tê fînansekirin.

Xala 11 — Ceza: Binpêkirin dikare bibe hişyarî, rexneya nivîskî an derxistina dawî ji perwerdehiyê.

Xala 12 — Mafê parastinê: Tu ceza bêyî ragihandina sedeman û dayîna derfeta ravekirinê nayê sepandin.

Xala 13 — Nûnertî: Komên stajyeran li gorî rêzikan nûner hilbijêrin.

Xala 14 — Rola nûneran: Ji bo dema perwerdehiyê tên hilbijartin û pêşniyar û gilîyên derbarê paqijî, ewlehî û sepandina rêziknameyê digihînin.

Xala 15 — Dosyeyên heqdayînê: Stajyer ji rastiya belgeyên ku radestî navendê dike berpirsiyar e.

Li Laon hatiye amadekirin. Bi îmzekirina vê belgeyê hûn dipejirînin ku we tevahiya vê rêziknameya hundirîn xwendiye, fêm kiriye û pejirandiye.`,

  zh: `您的权利与义务

学员进入 CFP02 即表示无保留地接受本内部规章。本规章依法规定作息时间、场所与设备的使用、学员代表以及处罚等事项。

第 1 条：本规章依据法国劳动法 L6352-3、L6352-4 及 R6352-1 至 R6352-15 条制定，适用于全部学员及整个培训期间。

第 2 条 — 时间：每位学员的作息由主责培训师依培训合同确定。缺席须在当日上半天通知 CFP02；因病缺席须在 48 小时内提交医疗证明。无故缺席将通知资助机构，并可能按缺席时长比例扣减培训津贴。

第 3 条 — 健康、卫生与安全：请穿着得体。未经许可不得在墙上张贴；复印机不得用于私人用途。室内禁止吸烟及电子烟（停车场允许）。培训教室内禁止饮食。

第 4 条 — 酒精与毒品：禁止携带或使用非法及成瘾性物质（毒品、酒精、药物等）。

第 5 条 — 用餐：拉昂中心设有配备微波炉、热水壶、冰箱和水槽的厨房；其他中心配备微波炉和水槽。使用后须清洁设备和用餐区域。

第 6 条 — 卫生设施：提供足够的卫生设施，包括无障碍设施，使用后须保持清洁。

第 7 条 — 安全：建筑内设有视频监控。依据 GDPR（欧盟 2016/679），所收集数据仅供 CFP02 使用，不向任何第三方提供；查阅、更正与删除请联系 cfp02@cfp02.info。CFP02 对个人物品的丢失或被盗不承担责任。学员须阅读安全与疏散须知，并立即报告任何危险。工伤须在 24 小时内申报。

第 8 条 — 设备：设备与资料须妥善使用并放回原处。计算机仅限培训用途。

第 9 条 — 手机：培训教室内禁止使用手机，须设为静音。

第 10 条 — 免费：培训对学员免费，由公共机构资助。

第 11 条 — 处罚：违反规章可导致警告、书面批评或最终开除。

第 12 条 — 申辩权：任何处罚均须先告知学员理由并给予其解释的机会。

第 13 条 — 代表：学员小组依相关规定选举代表。

第 14 条 — 代表的职责：代表任期为培训期间，负责转达关于卫生、安全及规章执行的建议与投诉。

第 15 条 — 津贴材料：学员对提交给中心的材料的真实性负责。

于拉昂订立。签署本文件即表示您已阅读、理解并接受本内部规章的全部内容。`,
};

/* ---- Extra fixed handbook sections (pages 6-20 and 40-48 of the official Livret
   Stagiaire, version F du 25/04/24). Hardcoded and read-only, same as RULES_TEXT
   above — these are the reference/context pages of the handbook (not the working
   pages 25-36, which are implemented as fillable forms in the "Partie Pro" tab). ---- */

const SITES_DATA = [
  { name: "LAON / SIÈGE", address: "16, Rue Roger Salengro, 02000 LAON", phone: "03 23 23 90 80", hours: "Du lundi au vendredi de 8h30 à 12h00 et de 13h30 à 17h00" },
  { name: "VERVINS", address: "Pépinière d'Entreprise Créapôle, 27, Rue d'Hirson, 02140 VERVINS", phone: "03 23 23 90 80", hours: "Du lundi au vendredi de 8h30 à 12h00 et de 13h30 à 17h00" },
  { name: "CHAUNY", address: "6, Rue Pasteur, 02300 CHAUNY", phone: "03 23 37 08 19 (tél/fax)", hours: "Du lundi au vendredi de 8h30 à 12h00 et de 13h30 à 17h00" },
  { name: "SOISSONS", address: "16 Rue Quinquet, 02200 SOISSONS", phone: "03 23 73 99 95", hours: "Du lundi au vendredi de 8h30 à 12h00 et de 13h30 à 17h00" },
  { name: "VAILLY SUR AISNE", address: "35 Rue du Bois Morin, 02370 PRESLES-ET-BOVES", phone: "03 23 23 90 80 (tél/fax)", hours: "Du lundi au vendredi de 8h30 à 12h00 et de 13h30 à 17h00" },
  { name: "MONTCORNET", address: "24 rue du Calvaire, 02340 MONTCORNET", phone: "03 23 23 90 80 (tél/fax)", hours: "Du lundi au vendredi de 8h30 à 12h00 et de 13h30 à 17h00" },
];

const HANDBOOK_SECTIONS = {
  fr: [
    {
      heading: "Pourquoi et comment utiliser ce livret ?",
      body: "Ce livret a été réalisé pour faciliter votre intégration et votre formation au sein du CFP02. Il comporte un certain nombre d'informations dont vous aurez besoin. Il vous servira à suivre votre progression, vos acquis et à consigner votre travail.\n\nC'est un outil de communication avec les différents formateurs. Votre référent pédagogique l'utilisera pour réguler votre parcours de formation et proposer des modifications (emploi du temps, durée, rythme…).\n\nVous devez donc l'avoir avec vous à tout moment de la formation pour conduire au mieux votre projet et atteindre votre objectif. Vous le conserverez à la fin de votre formation et il pourra vous servir pour faire état de vos acquis auprès de votre conseiller (Pôle Emploi, mission locale, PLIE…) ou d'un autre centre de formation.",
      items: ["Je note ce que je fais (plan de formation)", "Je note les questions à poser", "Je vérifie la date de fin de mon contrat"],
    },
    {
      heading: "La formation à l'APP : les engagements de qualité",
      body: "« Au service de la réussite de votre projet, l'équipe APP s'engage : »",
      numbered: [
        "à vous faire bénéficier d'un accueil personnalisé,",
        "à prendre en compte vos atouts et vos contraintes dans la construction de votre parcours,",
        "à négocier avec vous les termes de votre contrat (objectif, dates, modalités d'organisation…),",
        "à organiser des modalités de travail facilitant vos apprentissages et développant votre autonomie,",
        "à assurer un accompagnement personnalisé pendant toute la durée de votre contrat,",
        "à mettre à votre disposition des moyens (espace de travail, ordinateurs reliés à l'internet…) et des ressources (dossiers, livres, multimédia…),",
        "à vous délivrer une attestation à l'issue de votre contrat.",
      ],
    },
    {
      heading: "Notre centre",
      body: "Qui sommes-nous ? Le Centre de Formations Personnalisées de Laon est un organisme de formation créé en 2001. Le CFP02 porte le Label Atelier de Pédagogie Personnalisée, proposant des parcours adaptés aux besoins des bénéficiaires en développant une ingénierie pédagogique individualisée.\n\nEspace de formation ouvert, il permet l'accès aux savoirs de base et aux compétences clés européennes à tout public adulte. Le Centre de formation fonctionne en entrées et sorties permanentes, que ce soit au niveau formation ou dans l'accompagnement des personnes au retour à emploi. La démarche garantit le développement de l'autonomie des apprentissages. Elle s'inscrit dans une optique citoyenne et d'éducation permanente.\n\nNotre objectif : pour chaque Apprenant, nous mettons en œuvre une pédagogie adaptée visant à répondre à ses besoins et attentes, dans le cadre d'un projet d'insertion sociale et professionnelle.",
      numbered: [
        "Accueillir : toute personne souhaitant se former ou mettre en place un projet individuel de formation ou de suivi.",
        "Évaluer - Positionner : un positionnement initial est proposé au début de chaque formation.",
        "Mettre en place une méthodologie d'apprentissage : le développement de méthodes innovantes sera toujours recherché afin de répondre au mieux à la problématique de chaque bénéficiaire.",
        "Former : par la mise en place d'un contrat pédagogique validant le contenu et la durée de formation.",
        "Valider : chaque parcours est validé par un document attestant les compétences acquises au cours de la formation.",
      ],
    },
    {
      heading: "Vos interlocuteurs",
      body: "Le CFP02 s'organise autour d'un Conseil d'Administration (Président, Secrétaire, Trésorier et leurs adjoints), d'une Directrice et d'un Directeur pédagogique.\n\nLe Directeur pédagogique s'appuie sur un Pôle Support (référent développement numérique, référent qualité, référent handicap, chargé de communication, référent relations entreprises).\n\nLa Directrice s'appuie sur quatre pôles : le Pôle Formation (formateurs, évaluateurs), le Pôle Accompagnement (conseillers en insertion professionnelle, psychologues du travail), le Pôle Projet Développement (comité APP), et le Pôle Administratif (assistant administratif et comptable, responsable technique et gestion des moyens, référente opérationnelle France Travail).",
    },
    { heading: "Vos droits et devoirs", body: RULES_TEXT.fr },
    {
      heading: "Votre contrat pédagogique",
      body: "Un contrat pédagogique individuel est établi et signé entre vous et votre formateur référent. Il précise votre objectif, les dates de votre parcours et les modalités d'organisation de votre formation.",
    },
    {
      heading: "Organisation pédagogique — La démarche APP pour un parcours individualisé",
      body: "Après un accueil et un entretien exploratoire, votre parcours suit les étapes suivantes, avec une sécurisation de parcours constante à chaque étape :",
      numbered: [
        "Accueil : pour tous, une écoute attentive avec des moyens matériels et humains.",
        "Sas de positionnement : pour déterminer un parcours adapté répondant aux besoins et aux difficultés.",
        "Parcours de formation individualisé : des modalités pédagogiques innovantes et variées facilitant l'apprentissage.",
        "Accompagnement personnalisé : un référent, un chargé de sécurisation de parcours à l'écoute, un suivi entreprise, des validations et une définition d'étapes.",
        "Sécurisation post-formation : un plan d'actions, des échéances déterminées, une médiation vers les partenaires.",
        "Bilan : des connaissances et des compétences validées et attestées.",
        "Suivi post-formation : s'assurer de la réussite du projet, veiller à l'amélioration continue.",
      ],
    },
    {
      heading: "Votre parcours de formation",
      body: "Les plans de formation par compétences : à partir du positionnement, chaque formateur va élaborer avec vous un plan de formation, qui n'est autre que votre parcours pédagogique. Il va vous aider à suivre l'évolution de vos acquisitions.\n\nLe suivi pédagogique : au cours des séances de formation, chaque formateur va faire le point avec vous sur l'avancement de votre plan de formation et mesurer avec vous les progrès réalisés ; les fiches « suivi pédagogique » permettent de noter des conseils, des consignes de travail, etc.\n\nVos progrès seront mesurés et consignés tout au long de la formation, grâce à des évaluations ponctuelles ; les acquis seront notés sur vos plans de formation. Des évaluations seront également réalisées avant les bilans intermédiaires et finaux avec votre référent pédagogique.\n\nÀ la fin de votre parcours de formation, des attestations d'acquis par compétence seront établies par vos formateurs à partir des évaluations finales et intégrées dans ce livret.",
    },
    {
      heading: "Rôle du formateur référent",
      numbered: [
        "Vous accueillir et recueillir vos attentes et vos motivations.",
        "Déterminer votre parcours de formation.",
        "Restituer les résultats de votre positionnement.",
        "Vous accompagner tout au long de votre formation.",
      ],
    },
    {
      heading: "L'autoformation accompagnée",
      body: "L'autoformation guidée vise à votre autonomisation. Elle inclut la capacité de gérer votre temps, de résoudre des problèmes, de se fixer des objectifs, d'utiliser à bon escient les ressources mises à votre disposition, d'évaluer et d'intégrer de nouvelles connaissances, de prendre conscience de vos acquis et de les appliquer dans divers contextes de la vie privée et professionnelle.\n\nEn accord avec votre formateur, vous déterminerez un jour dans la semaine qui sera dédié à l'autoformation guidée. Pour vous accompagner et vous guider dans vos apprentissages, l'animateur du centre de ressources sera à vos côtés.",
    },
    {
      heading: "Le tutorat",
      body: "Qu'est-ce que le tutorat ? À votre entrée en formation, un stagiaire déjà présent sera votre tuteur, il vous aidera à vous familiariser avec les locaux, reconnaître les personnes référentes, il répondra à vos questions d'ordre pratique.",
    },
    {
      heading: "Bilans intermédiaire et final",
      body: "Un bilan intermédiaire, puis un bilan final, sont réalisés lors d'un entretien avec votre référent pédagogique. Ils permettent de faire le point sur votre parcours et d'échanger sur les recommandations pour la suite (poursuite de formation, entrée en emploi, autre orientation…).",
    },
    { heading: "Nos sites", sites: SITES_DATA },
    {
      heading: "Infos pratiques",
      body: "LAON : à pied, 5 minutes de la gare · en voiture, parking à proximité · en train, 5 minutes de la gare.\nVERVINS : en voiture, 8 minutes du centre, parking à proximité · en train, gare à 2,5 km.\nCHAUNY : en voiture, parking à proximité · en train, gare à 15 minutes à pied, arrêt « Pasteur » · ligne de bus n°1 Europe-Fargniers.\nSOISSONS : en voiture, 7 minutes du centre, parking à proximité · en train, gare à 3,5 km · bus, arrêt « centre social Presles » ou « Léon Blum », ligne n°1.\n\nCe document est publié avec le soutien du Fonds Social Européen (FSE).",
    },
    {
      heading: "Annexe 1 : Consignes générales en cas d'incendie et d'évacuation",
      body: "Incendie ou situation à risque : examiner rapidement la situation, déclencher l'alarme puis alerter les secours, intervenir avec un extincteur seulement si vous vous en sentez capable et que le feu est encore maîtrisable.\n\nÉvacuation : dès l'audition du signal d'alarme, toute personne présente doit évacuer immédiatement les lieux.",
      items: [
        "Arrêter toutes les activités en cours tout en mettant son poste de travail en sécurité",
        "Prendre ses affaires personnelles si elles sont à sa proximité",
        "Fermer les portes et fenêtres",
        "Évacuer par l'issue de secours la plus proche, ne pas utiliser les ascenseurs",
        "Ne pas revenir en arrière, suivre les consignes du guide-file et du serre-file",
        "Se rendre au point de rassemblement",
        "Garder son calme (ne pas pousser, ne pas crier « Au feu ! »), rassurer les personnes qui semblent perdre leur calme",
        "Ne jamais obstruer les circulations, ne JAMAIS prendre de risques",
      ],
    },
  ],

  en: [
    { heading: "Why and how to use this handbook?", body: "This handbook was designed to make it easier for you to join and train at CFP02. It will help you track your progress, what you have learned, and record your work. It is a communication tool with the different trainers — your pedagogical referent will use it to adjust your training path. Keep it with you at all times during training, and keep it afterwards: it may help you show what you have learned to your advisor or another training center.", items: ["I write down what I do (training plan)", "I write down questions to ask", "I check my contract's end date"] },
    { heading: "Training at the APP: our quality commitments", body: "\"In service of the success of your project, the APP team commits to:\"", numbered: ["giving you a personalized welcome,", "taking into account your strengths and constraints when building your path,", "negotiating the terms of your contract with you (objective, dates, organization…),", "organizing working arrangements that facilitate your learning and develop your autonomy,", "providing personalized support throughout your contract,", "making resources available to you (workspace, internet-connected computers…) and materials,", "issuing you a certificate at the end of your contract."] },
    { heading: "Our center", body: "The Centre de Formations Personnalisées de Laon is a training organization created in 2001, holding the \"Atelier de Pédagogie Personnalisée\" (APP) label. It gives adults open access to basic knowledge and key skills, with continuous entry and exit, guaranteeing the development of learning autonomy.\n\nOur objective: for each learner, we implement a pedagogy adapted to their needs, as part of a social and professional integration project.", numbered: ["Welcome: anyone wishing to train or set up an individual training project.", "Assess/Position: an initial assessment at the start of each training.", "Set up a learning method: innovative methods adapted to each beneficiary.", "Train: through a pedagogical contract defining content and duration.", "Certify: each pathway is validated by a document attesting skills acquired."] },
    { heading: "Your contacts", body: "CFP02 is organized around a Board (President, Secretary, Treasurer and deputies), a Director and a Pedagogical Director. The Pedagogical Director oversees a Support Unit (digital development, quality, disability, communications, business relations referents). The Director oversees four units: Training (trainers, assessors), Support (employment counsellors, occupational psychologists), Project Development (APP committee), and Administrative (accounting, technical/resources, France Travail operational referent)." },
    { heading: "Your rights and obligations", body: RULES_TEXT.en },
    { heading: "Your educational contract", body: "An individual pedagogical contract is drawn up and signed between you and your referent trainer. It sets out your objective, the dates of your pathway, and the organizational arrangements for your training." },
    { heading: "Educational organization — the APP approach to an individualized pathway", body: "After a welcome and exploratory interview, your pathway follows these stages, with continuous pathway-security monitoring throughout:", numbered: ["Welcome: attentive listening with material and human resources, for everyone.", "Positioning phase: to determine a pathway that meets needs and difficulties.", "Individualized training pathway: innovative, varied methods that facilitate learning.", "Personalized support: a referent, company follow-up, validations and milestones.", "Post-training security: an action plan, set deadlines, mediation toward partners.", "Review: knowledge and skills validated and certified.", "Post-training follow-up: ensuring the project's success, ongoing improvement."] },
    { heading: "Your training path", body: "Competency-based training plans: based on your positioning, each trainer builds your training plan with you, helping you track your progress. Pedagogical follow-up sheets record advice and work instructions during sessions. Progress is measured throughout via periodic assessments, and reviewed before interim and final assessments. At the end of your path, certificates of skills acquired are drawn up and included in this handbook." },
    { heading: "Role of the referent trainer", numbered: ["Welcome you and gather your expectations and motivations.", "Determine your training pathway.", "Report back the results of your positioning assessment.", "Support you throughout your training."] },
    { heading: "Guided self-training", body: "Guided self-training aims at your autonomy: managing your time, solving problems, setting goals, using available resources well, and applying what you learn in different contexts. Together with your trainer you will set a day of the week dedicated to it, with the resource-center facilitator supporting you." },
    { heading: "Mentoring (Tutorat)", body: "When you join the training, a trainee already present will be your mentor, helping you get to know the premises, the key people, and answering your practical questions." },
    { heading: "Interim and final reviews", body: "An interim review, then a final review, take place as interviews with your pedagogical referent, to take stock of your pathway and discuss recommendations for what comes next." },
    { heading: "Our sites", sites: SITES_DATA },
    { heading: "Practical information", body: "LAON: 5 min walk from the station · by car, parking nearby · by train, 5 min from the station.\nVERVINS: by car, 8 min from the center · by train, station 2.5 km away.\nCHAUNY: by car, parking nearby · by train, station 15 min walk, \"Pasteur\" stop · bus line 1.\nSOISSONS: by car, 7 min from the center · by train, station 3.5 km away · bus line 1.\n\nThis document is published with the support of the European Social Fund (ESF)." },
    { heading: "Appendix 1: General fire and evacuation instructions", body: "Fire or hazardous situation: quickly assess the situation, trigger the alarm then alert emergency services, only use a fire extinguisher if you feel able to and the fire is still manageable.\n\nEvacuation: as soon as the alarm is heard, everyone present must evacuate immediately.", items: ["Stop all activities while making your workstation safe", "Take personal belongings only if close at hand", "Close doors and windows", "Leave via the nearest emergency exit, do not use lifts", "Never go back, follow the guides' instructions", "Go to the assembly point", "Stay calm (do not push or shout), reassure others", "Never block passageways, NEVER take risks"] },
  ],

  ar: [
    { heading: "لماذا وكيف نستخدم هذا الكتيّب؟", body: "صُمم هذا الكتيّب لتسهيل اندماجكم وتكوينكم داخل CFP02. سيساعدكم على متابعة تقدمكم ومكتسباتكم وتدوين عملكم. إنه أداة تواصل مع المدربين — سيستخدمه مرجعكم التربوي لتنظيم مساركم. احتفظوا به معكم طوال التكوين، وبعده أيضاً: قد يفيدكم لإثبات مكتسباتكم لدى مستشاركم أو مركز تكوين آخر.", items: ["أدوّن ما أقوم به (خطة التكوين)", "أدوّن الأسئلة التي يجب طرحها", "أتحقق من تاريخ انتهاء عقدي"] },
    { heading: "التكوين لدى APP: التزامات الجودة", body: "«في خدمة نجاح مشروعكم، يلتزم فريق APP بـ:»", numbered: ["تقديم استقبال شخصي لكم،", "مراعاة إمكانياتكم وقيودكم عند بناء مساركم،", "التفاوض معكم حول بنود عقدكم (الهدف، التواريخ، طرائق التنظيم...)،", "تنظيم طرائق عمل تُيسّر تعلّمكم وتُنمّي استقلاليتكم،", "ضمان مرافقة شخصية طوال مدة عقدكم،", "وضع وسائل وموارد تحت تصرفكم،", "تسليمكم شهادة عند انتهاء عقدكم."] },
    { heading: "مركزنا", body: "مركز التكوينات الشخصية بلاون هو هيئة تكوين تأسست سنة 2001، يحمل وسم «ورشة التربية الشخصية» (APP)، ويتيح للبالغين الوصول إلى المعارف الأساسية والكفاءات الرئيسية، بنظام دخول وخروج دائم يضمن تطوير استقلالية التعلّم.\n\nهدفنا: لكل متعلّم، نضع موضع التنفيذ تربية مكيّفة مع احتياجاته، في إطار مشروع إدماج اجتماعي ومهني.", numbered: ["الاستقبال: لكل شخص يرغب في التكوّن أو وضع مشروع فردي.", "التقييم والتموضع: تموضع أولي في بداية كل تكوين.", "وضع منهجية تعلّم: طرائق مبتكرة مكيّفة لكل مستفيد.", "التكوين: عبر عقد تربوي يحدد المضمون والمدة.", "التصديق: كل مسار يُصادَق عليه بوثيقة تشهد على الكفاءات المكتسبة."] },
    { heading: "محاوروكم", body: "يتنظم CFP02 حول مجلس إدارة (رئيس، أمين عام، أمين صندوق ونوابهم)، ومديرة، ومدير تربوي. يشرف المدير التربوي على قطب الدعم (مراجع التطوير الرقمي، الجودة، الإعاقة، التواصل، العلاقات مع المؤسسات). وتشرف المديرة على أربعة أقطاب: قطب التكوين (المدربون، المقيّمون)، قطب المرافقة (مستشارو الإدماج، أخصائيو علم نفس العمل)، قطب تطوير المشاريع (لجنة APP)، والقطب الإداري (المحاسبة، الدعم التقني، مرجع France Travail)." },
    { heading: "حقوقكم وواجباتكم", body: RULES_TEXT.ar },
    { heading: "عقدكم التربوي", body: "يُوضع عقد تربوي فردي ويُوقَّع بينكم وبين مدربكم المرجعي، يحدد هدفكم، تواريخ مساركم، وطرائق تنظيم تكوينكم." },
    { heading: "التنظيم التربوي — مقاربة APP لمسار فردي", body: "بعد الاستقبال والمقابلة الاستكشافية، يتبع مساركم هذه المراحل، مع تأمين مستمر للمسار في كل خطوة:", numbered: ["الاستقبال: إصغاء متأنٍّ مع وسائل مادية وبشرية، للجميع.", "مرحلة التموضع: لتحديد مسار مناسب يستجيب للاحتياجات والصعوبات.", "مسار تكوين فردي: طرائق تربوية مبتكرة ومتنوعة تُيسّر التعلّم.", "مرافقة شخصية: مرجع، متابعة مع المؤسسات، تصديقات وتحديد مراحل.", "تأمين ما بعد التكوين: خطة عمل، آجال محددة، وساطة نحو الشركاء.", "الحصيلة: معارف وكفاءات مُصادَق عليها ومُشهَدة.", "متابعة ما بعد التكوين: التأكد من نجاح المشروع، والتحسين المستمر."] },
    { heading: "مسار تكوينكم", body: "خطط التكوين حسب الكفاءات: انطلاقاً من تموضعكم، سيضع كل مدرب معكم خطة تكوين تساعدكم على متابعة تطور مكتسباتكم. تتيح أوراق «المتابعة التربوية» تدوين النصائح خلال الحصص. سيُقاس تقدمكم طوال التكوين عبر تقييمات دورية، وستُجرى تقييمات أيضاً قبل التقييمات المرحلية والنهائية. في نهاية مساركم، سيُعِدّ مدربوكم شهادات مكتسبات حسب الكفاءة وتُدرَج في هذا الكتيّب." },
    { heading: "دور المدرب المرجعي", numbered: ["استقبالكم وجمع تطلعاتكم ودوافعكم.", "تحديد مسار تكوينكم.", "إعادة عرض نتائج تموضعكم عليكم.", "مرافقتكم طوال تكوينكم."] },
    { heading: "التكوين الذاتي الموجَّه", body: "يهدف إلى تحقيق استقلاليتكم: إدارة الوقت، حل المشكلات، تحديد الأهداف، حسن استخدام الموارد المتاحة، وتطبيق ما تتعلمونه في سياقات مختلفة. بالاتفاق مع مدربكم، ستحددون يوماً أسبوعياً مخصصاً له، بمرافقة منشّط مركز الموارد." },
    { heading: "الترافق (التوتورا)", body: "عند دخولكم التكوين، سيكون متدرب حاضر مسبقاً هو مرافقكم، وسيساعدكم على التعرف على المرافق والأشخاص المرجعيين، وسيجيب على أسئلتكم العملية." },
    { heading: "التقييم المرحلي والنهائي", body: "يُجرى تقييم مرحلي، ثم تقييم نهائي، كمقابلة مع مرجعكم التربوي، لتقييم مساركم ومناقشة التوصيات للمرحلة القادمة (متابعة التكوين، الدخول في العمل، توجّه آخر...)." },
    { heading: "مواقعنا", sites: SITES_DATA },
    { heading: "معلومات عملية", body: "لاون: 5 دقائق سيراً من المحطة · بالسيارة، مواقف قريبة · بالقطار، 5 دقائق من المحطة.\nفيرفان: بالسيارة، 8 دقائق من المركز · بالقطار، المحطة على بعد 2.5 كم.\nشوني: بالسيارة، مواقف قريبة · بالقطار، 15 دقيقة سيراً، محطة «Pasteur» · خط الحافلة رقم 1.\nسواسون: بالسيارة، 7 دقائق من المركز · بالقطار، المحطة على بعد 3.5 كم · خط الحافلة رقم 1.\n\nنُشر هذا المستند بدعم من الصندوق الاجتماعي الأوروبي (FSE)." },
    { heading: "الملحق 1: التعليمات العامة في حال الحريق والإخلاء", body: "الحريق أو وضعية خطرة: افحصوا الوضعية بسرعة، فعّلوا الإنذار ثم استدعوا الطوارئ، تدخلوا بطفاية الحريق فقط إذا شعرتم بالقدرة على ذلك وكان الحريق لا يزال قابلاً للسيطرة عليه.\n\nالإخلاء: فور سماع الإنذار، يجب على الجميع الإخلاء فوراً.", items: ["أوقفوا الأنشطة مع تأمين مكان عملكم", "خذوا أغراضكم الشخصية فقط إذا كانت قريبة", "أغلقوا الأبواب والنوافذ", "اخرجوا عبر أقرب مخرج طوارئ، لا تستخدموا المصاعد", "لا تعودوا إلى الوراء، اتبعوا تعليمات المرشدين", "توجهوا إلى نقطة التجمع", "حافظوا على الهدوء (لا دفع ولا صراخ)، اطمئنوا الآخرين", "لا تسدّوا الممرات أبداً، ولا تخاطروا أبداً"] },
  ],
};


/* Internal regulations text in the trainee's language (display only).
   Falls back to French when no translation exists. */
function getRegulationsText(lang) {
  return RULES_TEXT[lang] || RULES_TEXT.fr;
}

function getHandbookSections(lang) {
  const order = [lang, "fr", "ar", "en"];
  let base = HANDBOOK_SECTIONS.fr;
  for (const code of order) {
    if (HANDBOOK_SECTIONS[code] && HANDBOOK_SECTIONS[code].length) { base = HANDBOOK_SECTIONS[code]; break; }
  }
  // If the handbook itself is only available in French but the regulations exist
  // in the trainee's language, show the translated regulations section.
  if (!HANDBOOK_SECTIONS[lang] && RULES_TEXT[lang]) {
    return base.map((s) => (s.body && s.body === RULES_TEXT.fr ? { ...s, body: RULES_TEXT[lang] } : s));
  }
  return base;
}

function getRulesTextForLang(lang) {
  const sections = getHandbookSections(lang);
  const parts = sections.map((s) => {
    const bits = [s.heading.toUpperCase()];
    if (s.body) bits.push(s.body);
    if (s.numbered) bits.push(s.numbered.map((x, i) => `${i + 1}. ${x}`).join("\n"));
    if (s.items) bits.push(s.items.map((x) => `- ${x}`).join("\n"));
    if (s.sites) bits.push(s.sites.map((site) => `${site.name} — ${site.address} — ${site.phone} — ${site.hours}`).join("\n"));
    return bits.join("\n");
  });
  return parts.join("\n\n");
}


async function saveSignedRulesAck(traineeId, dk, ack) {
  const enc = await aesEncryptJSON(dk, ack);
  await sSet(`rules_ack:${traineeId}`, enc);
}

async function loadSignedRulesAck(traineeId, dk) {
  const enc = await sGet(`rules_ack:${traineeId}`);
  if (!enc) return null;
  try {
    return await aesDecryptJSON(dk, enc);
  } catch (e) {
    return null;
  }
}

function escapeHtml(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildSignedRulesElement({ traineeName, group, birthDate, signedAt, rulesText, signatureDataUrl, dir }) {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("dir", dir || "ltr");
  wrapper.style.cssText =
    "width:700px;padding:32px;background:#fff;color:#111;" +
    "font-family:'Noto Sans','Noto Sans Arabic','Noto Sans SC',sans-serif;font-size:14px;line-height:1.6;";
  wrapper.innerHTML = `
    <h2 style="margin:0 0 4px;font-size:18px;">CFP 02 · Aisne</h2>
    <p style="margin:0 0 16px;font-size:15px;font-weight:600;">Règlement intérieur — Accusé de lecture et de signature</p>
    <p style="margin:0 0 4px;"><b>Stagiaire :</b> ${escapeHtml(traineeName)}</p>
    <p style="margin:0 0 4px;"><b>Groupe :</b> ${escapeHtml(group)}</p>
    ${birthDate ? `<p style="margin:0 0 4px;"><b>Date de naissance :</b> ${escapeHtml(birthDate)}</p>` : ""}
    <p style="margin:0 0 16px;"><b>Signé le :</b> ${escapeHtml(new Date(signedAt).toLocaleString())}</p>
    <hr style="border:none;border-top:1px solid #ccc;margin:16px 0;"/>
    <div style="white-space:pre-wrap;">${escapeHtml(rulesText)}</div>
    <hr style="border:none;border-top:1px solid #ccc;margin:24px 0 16px;"/>
    <table style="width:100%;margin-top:20px;">
      <tr>
        <td style="width:50%;text-align:center;vertical-align:top;">
          <p style="margin:0 0 8px;">Formateur référent</p>
          <div style="height:70px;border-bottom:1px solid #999;"></div>
        </td>
        <td style="width:50%;text-align:center;vertical-align:top;">
          <p style="margin:0 0 8px;">Stagiaire</p>
          ${signatureDataUrl ? `<img src="${signatureDataUrl}" style="height:70px;" />` : `<div style="height:70px;border-bottom:1px solid #999;"></div>`}
        </td>
      </tr>
    </table>
  `;
  return wrapper;
}

async function downloadElementAsPdf(filename, element) {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);
  element.style.position = "fixed";
  element.style.left = "-9999px";
  element.style.top = "0";
  document.body.appendChild(element);
  try {
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff", useCORS: true });
    const imgData = canvas.toDataURL("image/jpeg", 0.92);
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    pdf.save(filename.endsWith(".pdf") ? filename : filename + ".pdf");
  } finally {
    document.body.removeChild(element);
  }
}

function genId() {
  return "id" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function compressImage(file, maxW = 1000, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxW / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ============================== design tokens ============================== */

const COLORS = {
  bg: "#F4F6F7",
  ink: "#16283D",
  inkSoft: "#5B6B7C",
  card: "#FFFFFF",
  border: "#DCE3E8",
  navy: "#173A6B",
  teal: "#147C8C",
  orange: "#E8720F",
  rules: "#173A6B",
  docs: "#147C8C",
  activity: "#E8720F",
  trainer: "#173A6B",
  danger: "#B0453B",
};

function OrgMark({ size = 44 }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="44" height="44" rx="12" fill={COLORS.navy} />
      <path d="M13 15C13 13.3431 14.3431 12 16 12H24V16H16V28H24V32H16C14.3431 32 13 30.6569 13 29V15Z" fill="#FFFFFF" />
      <rect x="21" y="19" width="9" height="4" fill={COLORS.teal} />
      <path d="M29 12L36 12L29 20V12Z" fill={COLORS.orange} />
    </svg>
  );
}

function useFonts() {
  useEffect(() => {
    if (document.getElementById("tsapp-fonts")) return;
    const link = document.createElement("link");
    link.id = "tsapp-fonts";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ============================== small UI atoms ============================== */

function Button({ children, onClick, variant = "solid", color = COLORS.ink, className = "", type = "button", disabled }) {
  const base = "px-4 py-3 rounded-xl font-medium text-[15px] flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100";
  const style =
    variant === "solid"
      ? { backgroundColor: color, color: "#fff" }
      : variant === "outline"
      ? { backgroundColor: "transparent", color: color, border: `1.5px solid ${color}` }
      : { backgroundColor: "transparent", color: color };
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`${base} ${className}`} style={style}>
      {children}
    </button>
  );
}

const TextInput = React.forwardRef(function TextInput({ label, ...props }, ref) {
  return (
    <label className="block mb-4">
      {label && <span className="block mb-1.5 text-sm font-medium" style={{ color: COLORS.inkSoft }}>{label}</span>}
      <input
        ref={ref}
        {...props}
        className="w-full px-4 py-3 rounded-xl outline-none text-[16px] transition"
        style={{ border: `1.5px solid ${COLORS.border}`, backgroundColor: "#fff", color: COLORS.ink }}
        onFocus={(e) => (e.target.style.borderColor = COLORS.ink)}
        onBlur={(e) => (e.target.style.borderColor = COLORS.border)}
      />
    </label>
  );
});

function Card({ children, className = "", style = {} }) {
  return (
    <div className={`rounded-2xl ${className}`} style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}`, ...style }}>
      {children}
    </div>
  );
}

function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(27,36,48,0.6)" }} onClick={onClose}>
      <div className="max-w-lg w-full max-h-[85vh] overflow-auto rounded-2xl bg-white p-5" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

const SignaturePad = React.forwardRef(function SignaturePad({ onChange }, ref) {
  const canvasRef = useRef(null);
  const drawingRef = useRef(false);
  const hasDrawnRef = useRef(false);

  function getPos(e) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const point = e.touches ? e.touches[0] : e;
    return {
      x: (point.clientX - rect.left) * (canvas.width / rect.width),
      y: (point.clientY - rect.top) * (canvas.height / rect.height),
    };
  }
  function start(e) {
    e.preventDefault();
    drawingRef.current = true;
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }
  function move(e) {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext("2d");
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = COLORS.ink;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    hasDrawnRef.current = true;
  }
  function end() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (hasDrawnRef.current && onChange) onChange(canvasRef.current.toDataURL("image/png"));
  }
  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawnRef.current = false;
    if (onChange) onChange(null);
  }

  React.useImperativeHandle(ref, () => ({ clear }));

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={180}
      className="w-full rounded-xl touch-none"
      style={{ border: `1.5px dashed ${COLORS.border}`, backgroundColor: "#fff" }}
      onMouseDown={start}
      onMouseMove={move}
      onMouseUp={end}
      onMouseLeave={end}
      onTouchStart={start}
      onTouchMove={move}
      onTouchEnd={end}
    />
  );
});

/* ============================== Language / Login flow ============================== */

function LanguageGrid({ lang, onPick }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {LANGS.map((l) => (
        <button
          key={l.code}
          onClick={() => onPick(l.code)}
          className="py-4 rounded-xl text-[16px] font-medium transition active:scale-[0.97]"
          style={{
            border: `1.5px solid ${lang === l.code ? COLORS.ink : COLORS.border}`,
            backgroundColor: lang === l.code ? COLORS.ink : "#fff",
            color: lang === l.code ? "#fff" : COLORS.ink,
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function LoginFlow({ onLogin }) {
  const [lang, setLang] = useState("fr");
  const [step, setStep] = useState("role");
  const [showLangSwitcher, setShowLangSwitcher] = useState(false);

  const [traineeMode, setTraineeMode] = useState("new");
  const [name, setName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [group, setGroup] = useState("");
  const [pin, setPin] = useState("");
  const [trainerPin, setTrainerPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [groupsList, setGroupsList] = useState([]);
  const [rulesChecked, setRulesChecked] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const nameRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const birthDateRef = useRef(null);
  const groupRef = useRef(null);
  const pinRef = useRef(null);
  const trainerPinRef = useRef(null);
  const signaturePadRef = useRef(null);
  const langMeta = LANGS.find((l) => l.code === lang);
  const t = useT(lang);

  useEffect(() => {
    (async () => {
      await ensureBootstrap();
      const groups = (await sGet("groups_index")) || [];
      setGroupsList(groups.map((g) => g.name));
    })();
  }, []);

  async function handleTraineeSubmit() {
    setError("");
    const groupVal = (groupRef.current && groupRef.current.value) || "";
    const pinVal = (pinRef.current && pinRef.current.value) || "";
    setGroup(groupVal); setPin(pinVal);
    const idx = (await sGet("trainees_index")) || [];
    const norm = (s) => s.trim().toLowerCase();

    if (traineeMode === "new") {
      const firstNameVal = (firstNameRef.current && firstNameRef.current.value) || "";
      const lastNameVal = (lastNameRef.current && lastNameRef.current.value) || "";
      const birthDateVal = (birthDateRef.current && birthDateRef.current.value) || "";
      setFirstName(firstNameVal); setLastName(lastNameVal); setBirthDate(birthDateVal);
      const nameVal = `${firstNameVal.trim()} ${lastNameVal.trim()}`.trim();
      if (!firstNameVal.trim() || !lastNameVal.trim() || !birthDateVal.trim() || !groupVal.trim() || pinVal.trim().length !== 4) {
        setError(t("errorFillFields"));
        return;
      }
      const exists = idx.find((x) => norm(x.name) === norm(nameVal) && norm(x.group) === norm(groupVal));
      if (exists) {
        setError(t("errorNameTaken"));
        return;
      }
      setBusy(true);
      try {
        const { saltPin, wrappedByPin, wrappedByTrainer, dk } = await createTraineeCrypto(pinVal.trim());
        const rec = {
          id: genId(), name: nameVal, firstName: firstNameVal.trim(), lastName: lastNameVal.trim(),
          birthDate: birthDateVal.trim(), group: groupVal.trim(), lang, createdAt: Date.now(),
          saltPin, wrappedByPin, wrappedByTrainer,
        };
        const next = [...idx, rec];
        await sSet("trainees_index", next);

        // The legally binding signed version is always the French text,
        // whatever language the trainee read it in.
        const rulesText = getRulesTextForLang("fr");
        const signedAt = Date.now();
        await saveSignedRulesAck(rec.id, dk, { lang, readLang: lang, signedLang: "fr", rulesText, signatureDataUrl, signedAt });

        setBusy(false);
        onLogin({ type: "trainee", ...rec, dk });
      } catch (e) {
        setBusy(false);
        setError(t("errorFillFields"));
      }
    } else {
      const nameVal = (nameRef.current && nameRef.current.value) || "";
      setName(nameVal);
      if (!nameVal.trim() || !groupVal.trim() || pinVal.trim().length < 4) {
        setError(t("errorFillFields"));
        return;
      }
      setBusy(true);
      const found = idx.find((x) => norm(x.name) === norm(nameVal) && norm(x.group) === norm(groupVal));
      if (!found) {
        setBusy(false);
        setError(t("errorNotFound"));
        return;
      }
      try {
        const dk = await unlockTraineeDataKey(pinVal.trim(), found);
        if (found.lang !== lang) {
          const updated = idx.map((x) => (x.id === found.id ? { ...x, lang } : x));
          await sSet("trainees_index", updated);
        }
        setBusy(false);
        onLogin({ type: "trainee", ...found, lang, dk });
      } catch (e) {
        setBusy(false);
        setError(t("errorWrongPin"));
      }
    }
  }

  async function handleTrainerSubmit() {
    setError("");
    const trainerPinVal = (trainerPinRef.current && trainerPinRef.current.value) || "";
    setTrainerPin(trainerPinVal);
    setBusy(true);
    try {
      await ensureBootstrap();
      const found = await findTrainerSessionByPin(trainerPinVal.trim());
      setBusy(false);
      if (!found) {
        setError(t("errorWrongPin"));
        return;
      }
      onLogin({
        type: "trainer",
        lang,
        trainerId: found.trainer.id,
        trainerName: found.trainer.name,
        role: found.trainer.role,
        groupNames: found.trainer.groupNames || [],
        trainerPrivateKey: found.privateKey,
      });
    } catch (e) {
      setBusy(false);
      setError(t("errorWrongPin"));
    }
  }

  return (
    <div dir={langMeta.dir} className="min-h-screen flex items-center justify-center p-5" style={{ backgroundColor: COLORS.bg, fontFamily: "'Noto Sans','Noto Sans Arabic','Noto Sans SC',sans-serif" }}>
      <div className="w-full max-w-md">
        <div className="flex justify-end mb-2">
          <button
            onClick={() => setShowLangSwitcher(true)}
            className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: "#fff", border: `1px solid ${COLORS.border}`, color: COLORS.ink }}
          >
            {langMeta.label}
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="inline-flex mb-4">
            <OrgMark size={56} />
          </div>
          <p className="text-[13px] font-semibold tracking-wide uppercase mb-1" style={{ color: COLORS.teal }}>CFP 02 · Aisne</p>
          <h1 className="text-2xl font-semibold" style={{ color: COLORS.ink }}>{t("appTitle")}</h1>
          <p className="mt-1 text-[15px]" style={{ color: COLORS.inkSoft }}>{t("appTagline")}</p>
        </div>

        {showLangSwitcher && (
          <Modal onClose={() => setShowLangSwitcher(false)}>
            <h2 className="text-[15px] font-medium mb-4" style={{ color: COLORS.inkSoft }}>{t("selectLanguage")}</h2>
            <LanguageGrid lang={lang} onPick={(code) => { setLang(code); setShowLangSwitcher(false); }} />
          </Modal>
        )}

        <Card className="p-6">
          {step === "lang" && (
            <>
              <h2 className="text-[15px] font-medium mb-4" style={{ color: COLORS.inkSoft }}>{t("selectLanguage")}</h2>
              <LanguageGrid lang={lang} onPick={setLang} />
              <Button className="w-full mt-5" onClick={() => setStep("role")}>{t("continueBtn")}</Button>
            </>
          )}

          {step === "role" && (
            <>
              <button onClick={() => setStep("lang")} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.inkSoft }}>
                <ChevronLeft size={16} /> {t("backBtn")}
              </button>
              <h2 className="text-[15px] font-medium mb-4" style={{ color: COLORS.inkSoft }}>{t("roleQuestion")}</h2>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setStep("traineeMode")}
                  className="p-4 rounded-xl flex items-center gap-3 text-start transition active:scale-[0.98]"
                  style={{ border: `1.5px solid ${COLORS.border}` }}
                >
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.rules + "1A" }}>
                    <User size={20} color={COLORS.rules} />
                  </div>
                  <span className="font-medium" style={{ color: COLORS.ink }}>{t("roleTrainee")}</span>
                </button>
                <button
                  onClick={() => setStep("trainerForm")}
                  className="p-4 rounded-xl flex items-center gap-3 text-start transition active:scale-[0.98]"
                  style={{ border: `1.5px solid ${COLORS.border}` }}
                >
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.ink + "1A" }}>
                    <Lock size={20} color={COLORS.ink} />
                  </div>
                  <span className="font-medium" style={{ color: COLORS.ink }}>{t("roleTrainer")}</span>
                </button>
              </div>
            </>
          )}

          {step === "traineeMode" && (
            <>
              <button onClick={() => setStep("role")} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.inkSoft }}>
                <ChevronLeft size={16} /> {t("backBtn")}
              </button>
              <div className="flex flex-col gap-3 mb-2">
                <button
                  onClick={() => { setError(""); setRulesChecked(false); setSignatureDataUrl(null); setTraineeMode("new"); setStep("rulesAccept"); }}
                  className="p-4 rounded-xl text-start font-medium transition active:scale-[0.98]"
                  style={{ border: `1.5px solid ${COLORS.border}`, color: COLORS.ink }}
                >
                  {t("newAccount")}
                </button>
                <button
                  onClick={() => { setError(""); setTraineeMode("existing"); setStep("traineeForm"); }}
                  className="p-4 rounded-xl text-start font-medium transition active:scale-[0.98]"
                  style={{ border: `1.5px solid ${COLORS.border}`, color: COLORS.ink }}
                >
                  {t("haveAccount")}
                </button>
              </div>
            </>
          )}

          {step === "rulesAccept" && (
            <>
              <button onClick={() => { setError(""); setStep("traineeMode"); }} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.inkSoft }}>
                <ChevronLeft size={16} /> {t("backBtn")}
              </button>
              <h2 className="text-lg font-semibold mb-3" style={{ color: COLORS.ink }}>{t("rulesAcceptHeading")}</h2>
              <div
                className="rounded-xl p-4 mb-4 max-h-64 overflow-y-auto whitespace-pre-wrap text-[14px] leading-relaxed"
                style={{ border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, backgroundColor: "#fff" }}
              >
                {getRulesTextForLang(lang)}
              </div>

              <label className="flex items-start gap-2 mb-4 text-sm" style={{ color: COLORS.ink }}>
                <input type="checkbox" className="mt-1" checked={rulesChecked} onChange={(e) => setRulesChecked(e.target.checked)} />
                <span>{t("acceptRulesLabel")}</span>
              </label>

              <span className="block mb-1.5 text-sm font-medium" style={{ color: COLORS.inkSoft }}>{t("signatureLabel")}</span>
              <SignaturePad ref={signaturePadRef} onChange={setSignatureDataUrl} />
              <div className="flex justify-end mt-2 mb-4">
                <button
                  onClick={() => { signaturePadRef.current && signaturePadRef.current.clear(); }}
                  className="text-sm font-medium"
                  style={{ color: COLORS.inkSoft }}
                >
                  {t("clearSignatureBtn")}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: COLORS.danger }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <Button
                className="w-full"
                onClick={() => {
                  if (!rulesChecked || !signatureDataUrl) {
                    setError(t("mustAcceptRulesMsg"));
                    return;
                  }
                  setError("");
                  setStep("traineeForm");
                }}
              >
                {t("continueBtn")}
              </Button>
            </>
          )}

          {step === "traineeForm" && (
            <>
              <button
                onClick={() => { setError(""); setStep(traineeMode === "new" ? "rulesAccept" : "traineeMode"); }}
                className="flex items-center gap-1 text-sm mb-4"
                style={{ color: COLORS.inkSoft }}
              >
                <ChevronLeft size={16} /> {t("backBtn")}
              </button>
              {traineeMode === "new" ? (
                <>
                  <TextInput ref={firstNameRef} label={t("firstNameLabel")} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="off" />
                  <TextInput ref={lastNameRef} label={t("lastNameLabel")} value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="off" />
                  <TextInput ref={birthDateRef} label={t("birthDateLabel")} type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} autoComplete="off" />
                </>
              ) : (
                <TextInput ref={nameRef} label={t("fullNameLabel")} value={name} onChange={(e) => setName(e.target.value)} placeholder="" autoComplete="off" />
              )}
              <label className="block mb-4">
                <span className="block mb-1.5 text-sm font-medium" style={{ color: COLORS.inkSoft }}>{t("groupLabel")}</span>
                {groupsList.length === 0 ? (
                  <p className="text-sm" style={{ color: COLORS.danger }}>{t("noGroupsYetMsg")}</p>
                ) : (
                  <select
                    ref={groupRef}
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl outline-none text-[16px]"
                    style={{ border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, backgroundColor: "#fff" }}
                  >
                    <option value="" disabled>{t("selectGroupPlaceholder")}</option>
                    {groupsList.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                )}
              </label>
              <TextInput
                ref={pinRef}
                label={t("pinLabel")}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, traineeMode === "new" ? 4 : 6))}
                inputMode="numeric"
                type="password"
                autoComplete="off"
              />
              {traineeMode === "new" && <p className="text-xs -mt-3 mb-4" style={{ color: COLORS.inkSoft }}>{t("pinHint")}</p>}
              {error && (
                <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: COLORS.danger }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <Button className="w-full" onClick={handleTraineeSubmit} disabled={busy}>
                {busy ? <Loader2 className="animate-spin" size={18} /> : traineeMode === "new" ? t("createAccountBtn") : t("loginBtn")}
              </Button>
            </>
          )}

          {step === "trainerForm" && (
            <>
              <button onClick={() => { setError(""); setStep("role"); }} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.inkSoft }}>
                <ChevronLeft size={16} /> {t("backBtn")}
              </button>
              <TextInput
                ref={trainerPinRef}
                label={t("trainerPinLabel")}
                value={trainerPin}
                onChange={(e) => setTrainerPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !busy) handleTrainerSubmit();
                }}
                inputMode="numeric"
                type="password"
                autoComplete="off"
                autoFocus
              />

              {error && (
                <div className="flex items-center gap-2 mb-1 text-sm" style={{ color: COLORS.danger }}>
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <Button className="w-full" onClick={handleTrainerSubmit} disabled={busy}>
                {busy ? <Loader2 className="animate-spin" size={18} /> : t("trainerLoginBtn")}
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

/* ============================== Rules Section ============================== */

function RulesView({ lang, t, traineeId, dk, traineeName, group }) {
  const [showHandbook, setShowHandbook] = useState(false);
  const [ack, setAck] = useState(undefined);
  useEffect(() => {
    if (!traineeId || !dk) return;
    (async () => setAck(await loadSignedRulesAck(traineeId, dk)))();
  }, [traineeId, dk]);

  const sections = getHandbookSections(lang);

  if (showHandbook) {
    return <HandbookViewer t={t} onClose={() => setShowHandbook(false)} />;
  }

  async function handleDownload() {
    if (!ack) return;
    const dir = (LANGS.find((l) => l.code === ack.lang) || {}).dir || "ltr";
    const el = buildSignedRulesElement({
      traineeName, group,
      birthDate: null,
      signedAt: ack.signedAt,
      rulesText: ack.rulesText,
      signatureDataUrl: ack.signatureDataUrl,
      dir,
    });
    await downloadElementAsPdf(`Reglement_signe_${(traineeName || "stagiaire").replace(/\s+/g, "_")}`, el);
  }

  return (
    <div>
      <SectionHeader icon={<BookOpen size={20} color="#fff" />} color={COLORS.rules} title={t("rulesHeading")} />

      <Card className="p-4 mt-4 flex items-center gap-3" style={{ backgroundColor: COLORS.rules + "0D", borderColor: COLORS.rules + "40" }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.rules }}>
          <BookOpen size={20} color="#fff" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold" style={{ color: COLORS.ink }}>{t("handbookTitle")}</p>
          <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{t("handbookReadonly")}</p>
        </div>
        <button onClick={() => setShowHandbook(true)} className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition active:scale-95" style={{ backgroundColor: COLORS.rules, color: "#fff" }}>
          <BookOpen size={16} /> {t("handbookOpen")}
        </button>
      </Card>

      {ack && (
        <Card className="p-4 mt-4 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.ink }}>
            <Check size={20} color="#fff" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold" style={{ color: COLORS.ink }}>{t("rulesSignedHeading")}</p>
            <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{t("signedOnLabel")} {new Date(ack.signedAt).toLocaleDateString()}</p>
          </div>
          <button onClick={handleDownload} className="px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition active:scale-95" style={{ backgroundColor: COLORS.ink, color: "#fff" }}>
            <Download size={16} /> {t("downloadSignedRulesBtn")}
          </button>
        </Card>
      )}

      <HandbookSections sections={sections} t={t} />
    </div>
  );
}

function HandbookSections({ sections, t }) {
  return (
    <div className="flex flex-col gap-3 mt-4">
      {sections.map((s, i) => (
        <Card key={i} className="p-5">
          <h3 className="font-semibold text-[15.5px] mb-2" style={{ color: COLORS.rules }}>{s.heading}</h3>
          {s.body && <div className="whitespace-pre-wrap leading-relaxed text-[15px]" style={{ color: COLORS.ink }}>{s.body}</div>}
          {s.numbered && (
            <ol className="list-decimal ms-5 mt-2 flex flex-col gap-1.5 text-[15px]" style={{ color: COLORS.ink }}>
              {s.numbered.map((x, j) => <li key={j}>{x}</li>)}
            </ol>
          )}
          {s.items && (
            <ul className="list-disc ms-5 mt-2 flex flex-col gap-1.5 text-[15px]" style={{ color: COLORS.ink }}>
              {s.items.map((x, j) => <li key={j}>{x}</li>)}
            </ul>
          )}
          {s.sites && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {s.sites.map((site, j) => (
                <div key={j} className="p-3 rounded-xl" style={{ border: `1px solid ${COLORS.border}` }}>
                  <p className="font-medium text-sm" style={{ color: COLORS.ink }}>{site.name}</p>
                  <p className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>{site.address}</p>
                  <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{site.phone}</p>
                  <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{site.hours}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

/* ============================== Partie Pro (fillable forms, pages 25-36) ==============================
   These are personal working documents for the trainee (career self-assessment,
   professional projects, internship reports, comparisons). Only the trainee can edit
   them; the trainer can view them read-only from the trainee's profile. Each section
   is stored encrypted with the trainee's data key (dk), same as uploaded documents. */

const PROJET_FIELDS = [
  { key: "intitule", label: "Intitulé du métier", type: "text" },
  { key: "rome", label: "N° ROME", type: "text" },
  { key: "definition", label: "Définition", type: "textarea" },
  { key: "conditionsAcces", label: "Conditions d'accès", type: "textarea" },
  { key: "entreprisesVisees", label: "Caractéristiques des entreprises visées", type: "textarea" },
  { key: "conditionsTravail", label: "Conditions de travail", type: "textarea" },
  { key: "activitesPrincipales", label: "Activités principales", type: "textarea" },
  { key: "activitesSecondaires", label: "Activités secondaires", type: "textarea" },
  { key: "avantages", label: "Avantages liés au travail", type: "textarea" },
  { key: "contraintes", label: "Contraintes liées au travail", type: "textarea" },
  { key: "competencesAMettreEnOeuvre", label: "Compétences, qualités et aptitudes à mettre en œuvre", type: "textarea" },
  { key: "competencesAAcquerir", label: "Compétences, qualités et aptitudes à acquérir", type: "textarea" },
  { key: "freins", label: "Freins détectés", type: "textarea" },
];

const STAGE_FIELDS = [
  { key: "entreprise", label: "Entreprise d'accueil", type: "text" },
  { key: "dates", label: "Dates de stage", type: "text" },
  { key: "tuteur", label: "Nom du tuteur", type: "text" },
  { key: "metierObserve", label: "Métier observé (N° ROME)", type: "text" },
  { key: "competencesAcquises", label: "Quelles compétences avez-vous acquises ?", type: "textarea" },
  { key: "savoirEtre", label: "Quels savoir-être avez-vous développés ?", type: "textarea" },
  { key: "diplomeNecessaire", label: "Quel diplôme ou formation est nécessaire ?", type: "textarea" },
  { key: "experiencesPositivesNegatives", label: "Quelles sont les expériences positives et négatives que vous retenez de votre période de stage ?", type: "textarea" },
  { key: "ceQueJaiAimePasAime", label: "Ce que j'ai aimé et pas aimé pendant le stage", type: "textarea" },
  { key: "organisationPersonnelle", label: "Quelle organisation personnelle avez-vous su mettre en place ? (garde d'enfant, mobilité…)", type: "textarea" },
];

const BILAN_FIELDS = [
  { key: "niveauFormation", label: "Niveau de formation", type: "textarea", rows: 4 },
  { key: "metiersExerces", label: "Métiers exercés", type: "textarea", rows: 4 },
  { key: "mesQualites", label: "Mes qualités", type: "textarea", rows: 4 },
  { key: "mesDefauts", label: "Mes défauts", type: "textarea", rows: 4 },
  { key: "mesFreins", label: "Mes freins", type: "textarea", rows: 4 },
  { key: "mesMotivations", label: "Mes motivations", type: "textarea", rows: 4 },
  { key: "conditionsRecherchees", label: "Conditions de travail recherchées", type: "textarea", rows: 4 },
  { key: "conditionsAEviter", label: "Conditions de travail à éviter", type: "textarea", rows: 4 },
];

const SOURCES_DATA = {
  METIERS: ["ROME", "Fiches et cahiers ONISEP", "Fiches CIDJ", "Revues spécialisées (Entreprendre, Challenges, Le Moniteur du BTP, l'Hôtellerie, Fonction publique…)", "Enquêtes métiers", "CLéOR C2RP", "Espace ressources", "France Travail", "CIO", "Missions locales, MEF, MAJ", "CCI", "Chambre des Métiers", "Administration, Centre de Gestion de la Fonction Publique Territoriale"],
  FORMATIONS: ["Le CPF", "Classeurs AFPA", "Fiches et cahiers ONISEP", "Fiches CIDJ", "C2RP", "Internet (ex : intercarif.fr)", "France Travail", "Espace Ressources", "CIO, AFPA, GRETA", "Missions locales, MEF, MAJ, Centre de Gestion (concours administratifs)", "CFPPA, CNAM, CCI", "CFA, DDTEFP, Chambre des Métiers"],
  ENTREPRISES: ["Annuaire professionnel", "Listing de la CCI", "Répertoire Chambre des Métiers", "Kompass", "Corporama", "Qui fait quoi ?", "L'enquête en entreprise", "France Travail", "Espace Ressources", "CCI", "Chambre des Métiers", "Mairies, Administrations", "Centre de Gestion de la Fonction Publique Territoriale", "Presse spécialisée"],
};

async function loadProSection(storageKey, dk) {
  const enc = await sGet(storageKey);
  if (!enc) return null;
  try {
    return await aesDecryptJSON(dk, enc);
  } catch (e) {
    return null;
  }
}
async function saveProSection(storageKey, dk, data) {
  const enc = await aesEncryptJSON(dk, data);
  await sSet(storageKey, enc);
}

function SimpleForm({ storageKey, dk, t, fields, readOnly }) {
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => setData((await loadProSection(storageKey, dk)) || {}))();
  }, [storageKey, dk]);

  async function handleSave() {
    setBusy(true);
    await saveProSection(storageKey, dk, data);
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (data === null) return <LoadingBlock t={t} />;

  const inputStyle = { border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, backgroundColor: readOnly ? "#f7f7f5" : "#fff" };

  return (
    <div>
      {fields.map((f) => (
        <label key={f.key} className="block mb-4">
          <span className="block mb-1.5 text-sm font-medium" style={{ color: COLORS.inkSoft }}>{f.label}</span>
          {f.type === "textarea" ? (
            <textarea
              readOnly={readOnly}
              rows={f.rows || 3}
              value={data[f.key] || ""}
              onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
              className="w-full px-4 py-3 rounded-xl outline-none text-[15px] resize-none"
              style={inputStyle}
            />
          ) : (
            <input
              readOnly={readOnly}
              value={data[f.key] || ""}
              onChange={(e) => setData({ ...data, [f.key]: e.target.value })}
              className="w-full px-4 py-3 rounded-xl outline-none text-[15px]"
              style={inputStyle}
            />
          )}
        </label>
      ))}
      {!readOnly && (
        <div className="flex items-center gap-3">
          <Button color={COLORS.rules} onClick={handleSave} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" size={18} /> : t("saveBtn")}
          </Button>
          {saved && <span className="flex items-center gap-1 text-sm" style={{ color: COLORS.rules }}><Check size={16} />{t("savedMsg")}</span>}
        </div>
      )}
    </div>
  );
}

const RESEAU_COLUMNS = [
  { key: "date", label: "Date" },
  { key: "entreprise", label: "Nom de l'entreprise et ses coordonnées" },
  { key: "personneContactee", label: "Personne contactée et sa fonction" },
  { key: "secteur", label: "Secteur d'activité" },
  { key: "metierVise", label: "Métier visé" },
  { key: "demande", label: "Enquête ou demande de stage" },
  { key: "resultat", label: "Résultat obtenu" },
  { key: "suites", label: "Les suites à donner" },
];

function ReseauTable({ storageKey, dk, t, readOnly }) {
  const [rows, setRows] = useState(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => setRows((await loadProSection(storageKey, dk)) || []))();
  }, [storageKey, dk]);

  function updateCell(i, key, val) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));
  }
  function addRow() {
    setRows((prev) => [...prev, {}]);
  }
  function removeRow(i) {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }
  async function handleSave() {
    setBusy(true);
    await saveProSection(storageKey, dk, rows);
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (rows === null) return <LoadingBlock t={t} />;

  return (
    <div>
      <div className="flex flex-col gap-4">
        {rows.length === 0 && <EmptyState text={readOnly ? t("noEntryYetMsg") : t("addRowBtn")} />}
        {rows.map((row, i) => (
          <Card key={i} className="p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {RESEAU_COLUMNS.map((c) => (
                <label key={c.key} className="block">
                  <span className="block mb-1 text-xs font-medium" style={{ color: COLORS.inkSoft }}>{c.label}</span>
                  <input
                    readOnly={readOnly}
                    value={row[c.key] || ""}
                    onChange={(e) => updateCell(i, c.key, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg outline-none text-sm"
                    style={{ border: `1px solid ${COLORS.border}`, color: COLORS.ink, backgroundColor: readOnly ? "#f7f7f5" : "#fff" }}
                  />
                </label>
              ))}
            </div>
            {!readOnly && (
              <button onClick={() => removeRow(i)} className="mt-3 text-sm flex items-center gap-1" style={{ color: COLORS.danger }}>
                <Trash2 size={14} /> {t("deleteBtn")}
              </button>
            )}
          </Card>
        ))}
      </div>
      {!readOnly && (
        <div className="flex items-center gap-3 mt-4">
          <Button variant="outline" onClick={addRow}><Plus size={16} /> {t("addRowBtn")}</Button>
          <Button color={COLORS.rules} onClick={handleSave} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" size={18} /> : t("saveBtn")}
          </Button>
          {saved && <span className="flex items-center gap-1 text-sm" style={{ color: COLORS.rules }}><Check size={16} />{t("savedMsg")}</span>}
        </div>
      )}
    </div>
  );
}

const COMPARATIF_ROWS = [
  { key: "missions", label: "Missions principales du poste" },
  { key: "savoirFaire", label: "Principaux savoir-faire et connaissances" },
  { key: "qualites", label: "Principales qualités personnelles" },
];
const COMPARATIF_ECART_OPTIONS = ["++", "+", "-", "--"];
const COMPARATIF_ENV_ITEMS = ["Mobilité géographique", "Sécurité de l'emploi", "Perspectives d'évolution", "Horaires", "Déplacements"];

function ComparatifForm({ storageKey, dk, t, readOnly }) {
  const [data, setData] = useState(null);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    (async () => setData((await loadProSection(storageKey, dk)) || { rows: {}, env: "" }))();
  }, [storageKey, dk]);

  async function handleSave() {
    setBusy(true);
    await saveProSection(storageKey, dk, data);
    setBusy(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (data === null) return <LoadingBlock t={t} />;
  const rows = data.rows || {};
  const inputStyle = { border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, backgroundColor: readOnly ? "#f7f7f5" : "#fff" };

  return (
    <div className="flex flex-col gap-4">
      {COMPARATIF_ROWS.map((r) => {
        const rowVal = rows[r.key] || {};
        return (
          <Card key={r.key} className="p-4">
            <p className="font-medium text-sm mb-3" style={{ color: COLORS.ink }}>{r.label}</p>
            <label className="block mb-3">
              <span className="block mb-1 text-xs font-medium" style={{ color: COLORS.inkSoft }}>Ce qui est demandé sur le marché du travail</span>
              <textarea readOnly={readOnly} rows={2} value={rowVal.demande || ""} onChange={(e) => setData({ ...data, rows: { ...rows, [r.key]: { ...rowVal, demande: e.target.value } } })} className="w-full px-3 py-2 rounded-lg outline-none text-sm resize-none" style={inputStyle} />
            </label>
            <div className="flex gap-2 mb-3">
              {COMPARATIF_ECART_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  disabled={readOnly}
                  onClick={() => setData({ ...data, rows: { ...rows, [r.key]: { ...rowVal, ecart: opt } } })}
                  className="w-10 h-10 rounded-lg font-semibold text-sm"
                  style={{
                    border: `1.5px solid ${COLORS.border}`,
                    backgroundColor: rowVal.ecart === opt ? COLORS.rules : "#fff",
                    color: rowVal.ecart === opt ? "#fff" : COLORS.ink,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <label className="block mb-3">
              <span className="block mb-1 text-xs font-medium" style={{ color: COLORS.inkSoft }}>Moi</span>
              <textarea readOnly={readOnly} rows={2} value={rowVal.moi || ""} onChange={(e) => setData({ ...data, rows: { ...rows, [r.key]: { ...rowVal, moi: e.target.value } } })} className="w-full px-3 py-2 rounded-lg outline-none text-sm resize-none" style={inputStyle} />
            </label>
            <label className="block">
              <span className="block mb-1 text-xs font-medium" style={{ color: COLORS.inkSoft }}>Commentaires</span>
              <textarea readOnly={readOnly} rows={2} value={rowVal.commentaires || ""} onChange={(e) => setData({ ...data, rows: { ...rows, [r.key]: { ...rowVal, commentaires: e.target.value } } })} className="w-full px-3 py-2 rounded-lg outline-none text-sm resize-none" style={inputStyle} />
            </label>
          </Card>
        );
      })}
      <Card className="p-4">
        <p className="font-medium text-sm mb-2" style={{ color: COLORS.ink }}>Environnement professionnel</p>
        <ul className="list-disc ms-5 mb-3 text-sm" style={{ color: COLORS.inkSoft }}>
          {COMPARATIF_ENV_ITEMS.map((it) => <li key={it}>{it}</li>)}
        </ul>
        <textarea readOnly={readOnly} rows={3} value={data.env || ""} onChange={(e) => setData({ ...data, env: e.target.value })} className="w-full px-3 py-2 rounded-lg outline-none text-sm resize-none" style={inputStyle} placeholder="Notes sur l'environnement professionnel" />
      </Card>
      {!readOnly && (
        <div className="flex items-center gap-3">
          <Button color={COLORS.rules} onClick={handleSave} disabled={busy}>
            {busy ? <Loader2 className="animate-spin" size={18} /> : t("saveBtn")}
          </Button>
          {saved && <span className="flex items-center gap-1 text-sm" style={{ color: COLORS.rules }}><Check size={16} />{t("savedMsg")}</span>}
        </div>
      )}
    </div>
  );
}

function SourcesInfoCard({ t }) {
  return (
    <Card className="p-5">
      {Object.entries(SOURCES_DATA).map(([col, items]) => (
        <div key={col} className="mb-4 last:mb-0">
          <p className="font-semibold text-sm mb-2" style={{ color: COLORS.rules }}>{col}</p>
          <ul className="list-disc ms-5 flex flex-col gap-1 text-sm" style={{ color: COLORS.ink }}>
            {items.map((it) => <li key={it}>{it}</li>)}
          </ul>
        </div>
      ))}
    </Card>
  );
}

function ProView({ traineeId, dk, t, readOnly }) {
  const [open, setOpen] = useState(null);

  const items = [
    { key: "bilan", label: t("proBilanTitle") },
    { key: "reseau", label: t("proReseauTitle") },
    { key: "projet1", label: `${t("proProjetTitle")} N°1` },
    { key: "stage1", label: `${t("proStageTitle")} N°1` },
    { key: "comparatif1", label: `${t("proComparatifTitle")} 1` },
    { key: "projet2", label: `${t("proProjetTitle")} N°2` },
    { key: "stage2", label: `${t("proStageTitle")} N°2` },
    { key: "comparatif2", label: `${t("proComparatifTitle")} 2` },
    { key: "projet3", label: `${t("proProjetTitle")} N°3` },
    { key: "stage3", label: `${t("proStageTitle")} N°3` },
    { key: "comparatif3", label: `${t("proComparatifTitle")} 3` },
    { key: "sources", label: t("proSourcesTitle") },
  ];

  if (open) {
    const item = items.find((x) => x.key === open);
    return (
      <div>
        <button onClick={() => setOpen(null)} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.inkSoft }}>
          <ChevronLeft size={16} /> {t("backBtn")}
        </button>
        <SectionHeader icon={<ClipboardList size={20} color="#fff" />} color={COLORS.rules} title={item.label} />
        <div className="mt-4">
          {open === "bilan" && <SimpleForm storageKey={`pro_bilan:${traineeId}`} dk={dk} t={t} fields={BILAN_FIELDS} readOnly={readOnly} />}
          {open === "reseau" && <ReseauTable storageKey={`pro_reseau:${traineeId}`} dk={dk} t={t} readOnly={readOnly} />}
          {open === "sources" && <SourcesInfoCard t={t} />}
          {["projet1", "projet2", "projet3"].includes(open) && (
            <SimpleForm storageKey={`pro_projet:${traineeId}:${open.slice(-1)}`} dk={dk} t={t} fields={PROJET_FIELDS} readOnly={readOnly} />
          )}
          {["stage1", "stage2", "stage3"].includes(open) && (
            <SimpleForm storageKey={`pro_stage:${traineeId}:${open.slice(-1)}`} dk={dk} t={t} fields={STAGE_FIELDS} readOnly={readOnly} />
          )}
          {["comparatif1", "comparatif2", "comparatif3"].includes(open) && (
            <ComparatifForm storageKey={`pro_comparatif:${traineeId}:${open.slice(-1)}`} dk={dk} t={t} readOnly={readOnly} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader icon={<ClipboardList size={20} color="#fff" />} color={COLORS.rules} title={t("proHeading")} />
      <p className="text-sm mt-2 mb-4" style={{ color: COLORS.inkSoft }}>{readOnly ? t("readOnlyBadge") : t("proIntro")}</p>
      <div className="flex flex-col gap-3">
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => setOpen(it.key)}
            className="p-4 rounded-xl text-start font-medium flex items-center justify-between transition active:scale-[0.98]"
            style={{ backgroundColor: "#fff", border: `1px solid ${COLORS.border}`, color: COLORS.ink }}
          >
            {it.label}
            <ChevronRight size={18} color={COLORS.inkSoft} />
          </button>
        ))}
      </div>
    </div>
  );
}


function EmptyState({ text }) {
  return <p className="text-center py-6 text-[15px]" style={{ color: COLORS.inkSoft }}>{text}</p>;
}
function LoadingBlock({ t }) {
  return (
    <div className="flex items-center justify-center py-16 gap-2" style={{ color: COLORS.inkSoft }}>
      <Loader2 className="animate-spin" size={18} /> {t("loadingMsg")}
    </div>
  );
}
function SectionHeader({ icon, color, title, action }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color }}>{icon}</div>
        <h2 className="text-xl font-semibold" style={{ color: COLORS.ink }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

/* ============================== Handbook Viewer (read-only PDF) ============================== */

const HANDBOOK_URL = "/documents/Livret_Stagiaire_Version_E_du_12_01_24_sans_partie_PRO_.pdf";

function HandbookViewer({ t, onClose }) {
  const [pdf, setPdf] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pageUrls, setPageUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        const worker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
        const doc = await pdfjs.getDocument(HANDBOOK_URL).promise;
        if (cancelled) return;
        setPdf(doc);
        setNumPages(doc.numPages);
        setLoading(false);
      } catch (e) {
        if (!cancelled) { setError(true); setLoading(false); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!pdf) return;
    let cancelled = false;
    (async () => {
      if (pageUrls[pageNum]) return;
      try {
        const page = await pdf.getPage(pageNum);
        if (cancelled) return;
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d");
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (cancelled) return;
        const url = canvas.toDataURL("image/jpeg", 0.85);
        setPageUrls((prev) => ({ ...prev, [pageNum]: url }));
      } catch (e) {}
    })();
    return () => { cancelled = true; };
  }, [pdf, pageNum, pageUrls]);

  if (loading) return <LoadingBlock t={t} />;
  if (error) return <div className="text-center py-8" style={{ color: COLORS.danger }}>PDF error</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onClose} className="flex items-center gap-1 text-sm" style={{ color: COLORS.inkSoft }}>
          <ChevronLeft size={16} /> {t("backBtn")}
        </button>
        <span className="text-sm font-medium" style={{ color: COLORS.inkSoft }}>
          {t("handbookPage")} {pageNum} {t("handbookOf")} {numPages}
        </span>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={() => setPageNum((p) => Math.max(1, p - 1))}
          disabled={pageNum <= 1}
          className="w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 disabled:opacity-30"
          style={{ backgroundColor: COLORS.docs, color: "#fff" }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
          disabled={pageNum >= numPages}
          className="w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 disabled:opacity-30"
          style={{ backgroundColor: COLORS.docs, color: "#fff" }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <Card className="p-2 sm:p-4 flex justify-center">
        {pageUrls[pageNum] ? (
          <img
            src={pageUrls[pageNum]}
            alt={`Page ${pageNum}`}
            className="max-w-full h-auto rounded-lg"
            style={{ maxHeight: "70vh", objectFit: "contain" }}
          />
        ) : (
          <div className="flex items-center justify-center py-16 gap-2" style={{ color: COLORS.inkSoft }}>
            <Loader2 className="animate-spin" size={18} /> {t("loadingMsg")}
          </div>
        )}
      </Card>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => setPageNum((p) => Math.max(1, p - 1))}
          disabled={pageNum <= 1}
          className="w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 disabled:opacity-30"
          style={{ backgroundColor: COLORS.docs, color: "#fff" }}
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setPageNum((p) => Math.min(numPages, p + 1))}
          disabled={pageNum >= numPages}
          className="w-10 h-10 rounded-full flex items-center justify-center transition active:scale-95 disabled:opacity-30"
          style={{ backgroundColor: COLORS.docs, color: "#fff" }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

/* ============================== Documents Section ============================== */

function DocumentsView({ traineeId, dk, t }) {
  const [docs, setDocs] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [docName, setDocName] = useState("");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [viewing, setViewing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    const raw = (await sGet(`docs_index:${traineeId}`)) || [];
    const decoded = await Promise.all(
      raw.map(async (d) => {
        try {
          return { ...d, name: await aesDecryptStr(dk, d.name) };
        } catch (e) {
          return { ...d, name: "•••" };
        }
      })
    );
    setDocs(decoded);
  }, [traineeId, dk]);

  useEffect(() => { load(); }, [load]);

  async function handleUpload() {
    setError("");
    if (!docName.trim() || !file) { setError(t("errorFillFields")); return; }
    if (file.size > 3 * 1024 * 1024) { setError(t("fileTooLargeMsg")); return; }
    setBusy(true);
    let dataUrl;
    if (file.type.startsWith("image/")) dataUrl = await compressImage(file, 1400, 0.75);
    else dataUrl = await fileToDataUrl(file);

    const docId = genId();
    const encFile = await aesEncryptJSON(dk, { dataUrl, type: file.type, filename: file.name });
    await sSet(`doc_file:${traineeId}:${docId}`, encFile);
    const encName = await aesEncryptStr(dk, docName.trim());
    const meta = { id: docId, name: encName, type: file.type, addedAt: Date.now() };
    const next = [meta, ...(await sGet(`docs_index:${traineeId}`) || [])];
    await sSet(`docs_index:${traineeId}`, next);
    setBusy(false);
    setShowAdd(false);
    setDocName("");
    setFile(null);
    load();
  }

  async function handleView(docId) {
    const enc = await sGet(`doc_file:${traineeId}:${docId}`);
    if (!enc) return;
    try {
      const full = await aesDecryptJSON(dk, enc);
      setViewing(full);
    } catch (e) {}
  }

  async function handleDelete(docId) {
    await sDelete(`doc_file:${traineeId}:${docId}`);
    const rawIndex = (await sGet(`docs_index:${traineeId}`)) || [];
    const next = rawIndex.filter((d) => d.id !== docId);
    await sSet(`docs_index:${traineeId}`, next);
    setDocs((docs || []).filter((d) => d.id !== docId));
    setConfirmDel(null);
  }

  if (docs === null) return <LoadingBlock t={t} />;

  return (
    <div>
      <SectionHeader
        icon={<FileText size={20} color="#fff" />}
        color={COLORS.docs}
        title={t("documentsHeading")}
        action={
          <Button color={COLORS.docs} onClick={() => setShowAdd(true)} className="!px-3 !py-2">
            <Plus size={18} />
          </Button>
        }
      />

      <div className="mt-4 flex flex-col gap-3">
        {docs.length === 0 && <Card className="p-5"><EmptyState text={t("documentsEmptyTrainee")} /></Card>}
        {docs.map((d) => (
          <Card key={d.id} className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.docs + "1A" }}>
              <FileText size={18} color={COLORS.docs} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate" style={{ color: COLORS.ink }}>{d.name}</p>
              <p className="text-xs" style={{ color: COLORS.inkSoft }}>{t("uploadedOn")} {new Date(d.addedAt).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleView(d.id)} className="p-2 rounded-lg" style={{ color: COLORS.ink }}><Eye size={18} /></button>
            <button onClick={() => setConfirmDel(d.id)} className="p-2 rounded-lg" style={{ color: COLORS.danger }}><Trash2 size={18} /></button>
          </Card>
        ))}
      </div>

      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.ink }}>{t("addDocumentBtn")}</h3>
          <TextInput label={t("documentNameLabel")} value={docName} onChange={(e) => setDocName(e.target.value)} />
          <div className="mb-4">
            <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setFile(e.target.files[0] || null)} />
            <button onClick={() => fileRef.current.click()} className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium" style={{ border: `1.5px dashed ${COLORS.border}`, color: COLORS.inkSoft }}>
              <Upload size={18} /> {file ? file.name : t("chooseFileBtn")}
            </button>
          </div>
          {error && <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: COLORS.danger }}><AlertCircle size={16} />{error}</div>}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>{t("cancelBtn")}</Button>
            <Button color={COLORS.docs} className="flex-1" onClick={handleUpload} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" size={18} /> : t("uploadBtn")}
            </Button>
          </div>
        </Modal>
      )}

      {viewing && (
        <Modal onClose={() => setViewing(null)}>
          <div className="flex justify-end mb-2">
            <button onClick={() => setViewing(null)}><X size={20} color={COLORS.inkSoft} /></button>
          </div>
          {viewing.type && viewing.type.startsWith("image/") ? (
            <img src={viewing.dataUrl} alt="" className="w-full rounded-xl" />
          ) : (
            <a href={viewing.dataUrl} download={viewing.filename} className="flex items-center justify-center gap-2 py-4 rounded-xl font-medium" style={{ backgroundColor: COLORS.docs, color: "#fff" }}>
              <Download size={18} /> {t("downloadBtn")}
            </a>
          )}
        </Modal>
      )}

      {confirmDel && (
        <Modal onClose={() => setConfirmDel(null)}>
          <p className="mb-5 text-[15px]" style={{ color: COLORS.ink }}>{t("confirmDeleteMsg")}</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmDel(null)}>{t("cancelBtn")}</Button>
            <Button className="flex-1" color={COLORS.danger} onClick={() => handleDelete(confirmDel)}>{t("deleteBtn")}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== Activity Section ============================== */

function ActivityView({ traineeId, dk, t }) {
  const [entries, setEntries] = useState(null);
  const [activeType, setActiveType] = useState("formation");
  const [showAdd, setShowAdd] = useState(false);
  const [date, setDate] = useState(todayStr());
  const [text, setText] = useState("");
  const [entryType, setEntryType] = useState("formation");
  const [attachFile, setAttachFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [viewingAttachment, setViewingAttachment] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    const raw = (await sGet(`activity_index:${traineeId}`)) || [];
    const decoded = await Promise.all(
      raw.map(async (e) => {
        try {
          return { ...e, text: await aesDecryptStr(dk, e.text) };
        } catch (err) {
          return { ...e, text: "•••" };
        }
      })
    );
    setEntries(decoded);
  }, [traineeId, dk]);
  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEntryType(activeType);
    setShowAdd(true);
  }

  async function handleSave() {
    setError("");
    if (!text.trim()) { setError(t("errorFillFields")); return; }
    if (attachFile && attachFile.size > 3 * 1024 * 1024) { setError(t("fileTooLargeMsg")); return; }
    setBusy(true);
    const entryId = genId();
    if (attachFile) {
      let dataUrl;
      if (attachFile.type.startsWith("image/")) dataUrl = await compressImage(attachFile, 1200, 0.72);
      else dataUrl = await fileToDataUrl(attachFile);
      const encFile = await aesEncryptJSON(dk, { dataUrl, fileType: attachFile.type, filename: attachFile.name });
      await sSet(`activity_file:${traineeId}:${entryId}`, encFile);
    }
    const encText = await aesEncryptStr(dk, text.trim());
    const meta = { id: entryId, date, type: entryType, text: encText, hasFile: !!attachFile, addedAt: Date.now() };
    const rawIndex = (await sGet(`activity_index:${traineeId}`)) || [];
    const next = [meta, ...rawIndex].sort((a, b) => (a.date < b.date ? 1 : -1));
    await sSet(`activity_index:${traineeId}`, next);
    setBusy(false);
    setShowAdd(false);
    setText("");
    setAttachFile(null);
    setDate(todayStr());
    load();
  }

  async function handleViewAttachment(entryId) {
    const enc = await sGet(`activity_file:${traineeId}:${entryId}`);
    if (!enc) return;
    try {
      const p = await aesDecryptJSON(dk, enc);
      setViewingAttachment(p);
    } catch (e) {}
  }

  async function handleDelete(entryId) {
    await sDelete(`activity_file:${traineeId}:${entryId}`);
    const rawIndex = (await sGet(`activity_index:${traineeId}`)) || [];
    const next = rawIndex.filter((e) => e.id !== entryId);
    await sSet(`activity_index:${traineeId}`, next);
    setEntries((entries || []).filter((e) => e.id !== entryId));
    setConfirmDel(null);
  }

  if (entries === null) return <LoadingBlock t={t} />;

  const filtered = entries.filter((e) => (e.type || "formation") === activeType);

  return (
    <div>
      <SectionHeader
        icon={<ClipboardList size={20} color="#fff" />}
        color={COLORS.activity}
        title={t("activityHeading")}
        action={
          <Button color={COLORS.activity} onClick={openAdd} className="!px-3 !py-2">
            <Plus size={18} />
          </Button>
        }
      />

      <div className="flex gap-2 mt-4 mb-1">
        {["formation", "professionnelle"].map((tp) => (
          <button
            key={tp}
            onClick={() => setActiveType(tp)}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium transition"
            style={{
              backgroundColor: activeType === tp ? COLORS.activity : "#fff",
              color: activeType === tp ? "#fff" : COLORS.ink,
              border: `1.5px solid ${activeType === tp ? COLORS.activity : COLORS.border}`,
            }}
          >
            {tp === "formation" ? t("formationLabel") : t("professionnelleLabel")}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        {filtered.length === 0 && <Card className="p-5"><EmptyState text={t("activityEmptyTrainee")} /></Card>}
        {filtered.map((e) => (
          <Card key={e.id} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold mb-1" style={{ color: COLORS.activity }}>{new Date(e.date).toLocaleDateString()}</p>
                <p className="text-[15px] whitespace-pre-wrap" style={{ color: COLORS.ink }}>{e.text}</p>
              </div>
              <button onClick={() => setConfirmDel(e.id)} className="p-1.5 rounded-lg shrink-0" style={{ color: COLORS.danger }}><Trash2 size={16} /></button>
            </div>
            {e.hasFile && (
              <button onClick={() => handleViewAttachment(e.id)} className="mt-3 flex items-center gap-2 text-sm font-medium" style={{ color: COLORS.activity }}>
                <FileText size={16} /> {t("viewBtn")}
              </button>
            )}
          </Card>
        ))}
      </div>

      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.ink }}>{t("addEntryBtn")}</h3>

          <div className="flex gap-2 mb-4">
            {["formation", "professionnelle"].map((tp) => (
              <button
                key={tp}
                onClick={() => setEntryType(tp)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition"
                style={{
                  backgroundColor: entryType === tp ? COLORS.activity : "#fff",
                  color: entryType === tp ? "#fff" : COLORS.ink,
                  border: `1.5px solid ${entryType === tp ? COLORS.activity : COLORS.border}`,
                }}
              >
                {tp === "formation" ? t("formationLabel") : t("professionnelleLabel")}
              </button>
            ))}
          </div>

          <TextInput label={t("entryDateLabel")} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <label className="block mb-4">
            <span className="block mb-1.5 text-sm font-medium" style={{ color: COLORS.inkSoft }}>{t("entryTextLabel")}</span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("entryTextPlaceholder")}
              rows={4}
              className="w-full px-4 py-3 rounded-xl outline-none text-[16px] resize-none"
              style={{ border: `1.5px solid ${COLORS.border}`, color: COLORS.ink }}
            />
          </label>
          <div className="mb-4">
            <span className="block mb-1.5 text-sm font-medium" style={{ color: COLORS.inkSoft }}>{t("attachFileLabel")}</span>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={(e) => setAttachFile(e.target.files[0] || null)} />
            <button onClick={() => fileRef.current.click()} className="w-full py-3 rounded-xl flex items-center justify-center gap-2 font-medium" style={{ border: `1.5px dashed ${COLORS.border}`, color: COLORS.inkSoft }}>
              <Camera size={18} /> {attachFile ? attachFile.name : t("attachFileLabel")}
            </button>
          </div>
          {error && <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: COLORS.danger }}><AlertCircle size={16} />{error}</div>}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>{t("cancelBtn")}</Button>
            <Button color={COLORS.activity} className="flex-1" onClick={handleSave} disabled={busy}>
              {busy ? <Loader2 className="animate-spin" size={18} /> : t("saveEntryBtn")}
            </Button>
          </div>
        </Modal>
      )}

      {viewingAttachment && (
        <Modal onClose={() => setViewingAttachment(null)}>
          <div className="flex justify-end mb-2">
            <button onClick={() => setViewingAttachment(null)}><X size={20} color={COLORS.inkSoft} /></button>
          </div>
          {viewingAttachment.fileType && viewingAttachment.fileType.startsWith("image/") ? (
            <img src={viewingAttachment.dataUrl} alt="" className="w-full rounded-xl" />
          ) : (
            <a href={viewingAttachment.dataUrl} download={viewingAttachment.filename || "document.pdf"} className="flex items-center justify-center gap-2 py-4 rounded-xl font-medium" style={{ backgroundColor: COLORS.activity, color: "#fff" }}>
              <Download size={18} /> {t("downloadBtn")}
            </a>
          )}
        </Modal>
      )}

      {confirmDel && (
        <Modal onClose={() => setConfirmDel(null)}>
          <p className="mb-5 text-[15px]" style={{ color: COLORS.ink }}>{t("confirmDeleteMsg")}</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmDel(null)}>{t("cancelBtn")}</Button>
            <Button className="flex-1" color={COLORS.danger} onClick={() => handleDelete(confirmDel)}>{t("deleteBtn")}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== Trainee App ============================== */

function TraineeApp({ session, onLogout }) {
  const [tab, setTab] = useState("rules");
  const langMeta = LANGS.find((l) => l.code === session.lang) || LANGS[0];
  const t = useT(session.lang);

  const tabs = [
    { key: "rules", label: t("navRules"), icon: BookOpen, color: COLORS.rules },
    { key: "pro", label: t("proHeading"), icon: Building2, color: COLORS.rules },
    { key: "documents", label: t("navDocuments"), icon: FileText, color: COLORS.docs },
    { key: "activity", label: t("navActivity"), icon: ClipboardList, color: COLORS.activity },
  ];

  return (
    <div dir={langMeta.dir} className="min-h-screen pb-24" style={{ backgroundColor: COLORS.bg, fontFamily: "'Noto Sans','Noto Sans Arabic','Noto Sans SC',sans-serif" }}>
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OrgMark size={38} />
          <div>
            <p className="text-sm" style={{ color: COLORS.inkSoft }}>{session.group}</p>
            <h1 className="text-xl font-semibold" style={{ color: COLORS.ink }}>{session.name}</h1>
          </div>
        </div>
        <button onClick={onLogout} className="p-2.5 rounded-xl" style={{ backgroundColor: "#fff", border: `1px solid ${COLORS.border}` }}>
          <LogOut size={18} color={COLORS.inkSoft} />
        </button>
      </header>

      <main className="px-5">
        {tab === "rules" && <RulesView lang={session.lang} t={t} traineeId={session.id} dk={session.dk} traineeName={session.name} group={session.group} />}
        {tab === "pro" && <ProView traineeId={session.id} dk={session.dk} t={t} readOnly={false} />}
        {tab === "documents" && <DocumentsView traineeId={session.id} dk={session.dk} t={t} />}
        {tab === "activity" && <ActivityView traineeId={session.id} dk={session.dk} t={t} />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 px-4 pb-4 pt-2">
        <div className="max-w-md mx-auto rounded-2xl flex overflow-hidden shadow-lg" style={{ backgroundColor: "#fff", border: `1px solid ${COLORS.border}` }}>
          {tabs.map((tb) => {
            const Icon = tb.icon;
            const active = tab === tb.key;
            return (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className="flex-1 flex flex-col items-center gap-1 py-3 transition"
                style={{ backgroundColor: active ? tb.color + "14" : "transparent" }}
              >
                <Icon size={20} color={active ? tb.color : COLORS.inkSoft} />
                <span className="text-[11px] font-medium" style={{ color: active ? tb.color : COLORS.inkSoft }}>{tb.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

/* ============================== Trainer App ============================== */

function TrainerApp({ session, onLogout }) {
  const [tab, setTab] = useState("groups");
  const [trainees, setTrainees] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedTrainee, setSelectedTrainee] = useState(null);
  const langMeta = LANGS.find((l) => l.code === session.lang) || LANGS[0];
  const t = useT(session.lang);
  const isAdmin = session.role === "admin";
  const scopedGroupNames = session.groupNames || [];

  const loadTrainees = useCallback(async () => {
    setTrainees((await sGet("trainees_index")) || []);
  }, []);
  useEffect(() => { loadTrainees(); }, [loadTrainees]);

  // A plain trainer only sees trainees belonging to groups assigned to them by the admin.
  const inScope = useCallback(
    (x) => isAdmin || scopedGroupNames.length === 0 || scopedGroupNames.includes(x.group),
    [isAdmin, scopedGroupNames]
  );

  const activeTrainees = trainees.filter((x) => !x.archived && inScope(x));
  const archivedTrainees = trainees.filter((x) => x.archived && inScope(x));
  const groups = [...new Set(activeTrainees.map((x) => x.group))];

  async function handleArchive(traineeId, archived) {
    const next = await archiveTrainee(traineeId, archived);
    setTrainees(next);
    setSelectedTrainee(null);
  }
  async function handleDeleteForever(traineeId) {
    const next = await deleteTraineeCompletely(traineeId);
    setTrainees(next);
    setSelectedTrainee(null);
  }

  return (
    <div dir={langMeta.dir} className="min-h-screen pb-24" style={{ backgroundColor: COLORS.bg, fontFamily: "'Noto Sans','Noto Sans Arabic','Noto Sans SC',sans-serif" }}>
      <header className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <OrgMark size={38} />
          <div>
            <p className="text-sm" style={{ color: COLORS.inkSoft }}>{session.trainerName} · {isAdmin ? t("adminBadge") : t("trainerBadge")}</p>
            <h1 className="text-xl font-semibold" style={{ color: COLORS.ink }}>{t("trainerDashboardHeading")}</h1>
          </div>
        </div>
        <button onClick={onLogout} className="p-2.5 rounded-xl" style={{ backgroundColor: "#fff", border: `1px solid ${COLORS.border}` }}>
          <LogOut size={18} color={COLORS.inkSoft} />
        </button>
      </header>

      <main className="px-5">
        {tab === "groups" && !selectedGroup && (
          <GroupsList t={t} groups={groups} trainees={activeTrainees} onSelect={setSelectedGroup} />
        )}
        {tab === "groups" && selectedGroup && !selectedTrainee && (
          <TraineesList
            t={t}
            group={selectedGroup}
            trainees={activeTrainees.filter((x) => x.group === selectedGroup)}
            onBack={() => setSelectedGroup(null)}
            onSelect={setSelectedTrainee}
          />
        )}
        {tab === "archive" && !selectedTrainee && (
          <ArchivedList t={t} trainees={archivedTrainees} onSelect={setSelectedTrainee} />
        )}
        {(tab === "groups" || tab === "archive") && selectedTrainee && (
          <TraineeProfile
            t={t}
            trainee={selectedTrainee}
            trainerPrivateKey={session.trainerPrivateKey}
            onBack={() => setSelectedTrainee(null)}
            onArchive={handleArchive}
            onDeleteForever={handleDeleteForever}
          />
        )}
        {tab === "settings" && <TrainerSettings t={t} session={session} />}
        {tab === "management" && isAdmin && (
          <ManagementView t={t} session={session} />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 px-4 pb-4 pt-2">
        <div className="max-w-md mx-auto rounded-2xl flex overflow-hidden shadow-lg" style={{ backgroundColor: "#fff", border: `1px solid ${COLORS.border}` }}>
          {[
            { key: "groups", label: t("groupsHeading"), icon: Users },
            { key: "archive", label: t("archivedHeading"), icon: FileText },
            ...(isAdmin ? [{ key: "management", label: t("managementHeading"), icon: Shield }] : []),
            { key: "settings", label: t("settingsHeading"), icon: Settings },
          ].map((tb) => {
            const Icon = tb.icon;
            const active = tab === tb.key;
            return (
              <button
                key={tb.key}
                onClick={() => { setTab(tb.key); setSelectedGroup(null); setSelectedTrainee(null); }}
                className="flex-1 flex flex-col items-center gap-1 py-3 transition"
                style={{ backgroundColor: active ? COLORS.ink + "10" : "transparent" }}
              >
                <Icon size={20} color={active ? COLORS.ink : COLORS.inkSoft} />
                <span className="text-[11px] font-medium" style={{ color: active ? COLORS.ink : COLORS.inkSoft }}>{tb.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function ArchivedList({ t, trainees, onSelect }) {
  return (
    <div>
      <SectionHeader icon={<FileText size={20} color="#fff" />} color={COLORS.trainer} title={t("archivedHeading")} />
      <div className="mt-4 flex flex-col gap-3">
        {trainees.length === 0 && <Card className="p-5"><EmptyState text={t("archivedEmptyMsg")} /></Card>}
        {trainees.map((tr) => (
          <Card key={tr.id} className="p-4">
            <button className="w-full flex items-center gap-3" onClick={() => onSelect(tr)}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.border }}>
                <User size={18} color={COLORS.inkSoft} />
              </div>
              <div className="text-start flex-1 min-w-0">
                <p className="font-medium truncate" style={{ color: COLORS.ink }}>{tr.name}</p>
                <p className="text-xs" style={{ color: COLORS.inkSoft }}>{tr.group}</p>
              </div>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
function GroupsList({ t, groups, trainees, onSelect }) {
  return (
    <div>
      <SectionHeader icon={<Building2 size={20} color="#fff" />} color={COLORS.trainer} title={t("groupsHeading")} />
      <div className="mt-4 flex flex-col gap-3">
        {groups.length === 0 && <Card className="p-5"><EmptyState text={t("noGroupsMsg")} /></Card>}
        {groups.map((g) => {
          const count = trainees.filter((x) => x.group === g).length;
          return (
            <Card key={g} className="p-4 flex items-center justify-between cursor-pointer" style={{ cursor: "pointer" }}>
              <button className="flex-1 flex items-center justify-between" onClick={() => onSelect(g)}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.trainer + "14" }}>
                    <Users size={18} color={COLORS.trainer} />
                  </div>
                  <span className="font-medium" style={{ color: COLORS.ink }}>{g}</span>
                </div>
                <span className="text-sm" style={{ color: COLORS.inkSoft }}>{count} {t("traineesInGroup")}</span>
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TraineesList({ t, group, trainees, onBack, onSelect }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.inkSoft }}>
        <ChevronLeft size={16} /> {t("backToGroupsBtn")}
      </button>
      <SectionHeader icon={<Users size={20} color="#fff" />} color={COLORS.trainer} title={group} />
      <div className="mt-4 flex flex-col gap-3">
        {trainees.map((tr) => (
          <Card key={tr.id} className="p-4">
            <button className="w-full flex items-center gap-3" onClick={() => onSelect(tr)}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.trainer + "14" }}>
                <User size={18} color={COLORS.trainer} />
              </div>
              <span className="font-medium" style={{ color: COLORS.ink }}>{tr.name}</span>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TraineeProfile({ t, trainee, trainerPrivateKey, onBack, onArchive, onDeleteForever }) {
  const [tab, setTab] = useState("documents");
  const [dk, setDk] = useState(null);
  const [failed, setFailed] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [confirmDeleteForever, setConfirmDeleteForever] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setDk(null);
    setFailed(false);
    unlockTraineeDataKeyForTrainer(trainerPrivateKey, trainee)
      .then((key) => { if (!cancelled) setDk(key); })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [trainee.id, trainerPrivateKey]);

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1 text-sm mb-4" style={{ color: COLORS.inkSoft }}>
        <ChevronLeft size={16} /> {t("backToGroupsBtn")}
      </button>
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-xl font-semibold" style={{ color: COLORS.ink }}>{trainee.name}</h2>
        {trainee.archived && (
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: COLORS.border, color: COLORS.inkSoft }}>
            {t("archivedBadge")}
          </span>
        )}
      </div>
      <p className="text-sm mb-4" style={{ color: COLORS.inkSoft }}>{trainee.group}</p>

      <div className="flex gap-2 mb-5 flex-wrap">
        <button onClick={() => setTab("rules")} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: tab === "rules" ? COLORS.rules : "#fff", color: tab === "rules" ? "#fff" : COLORS.ink, border: `1px solid ${COLORS.border}` }}>{t("navRules")}</button>
        <button onClick={() => setTab("pro")} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: tab === "pro" ? COLORS.rules : "#fff", color: tab === "pro" ? "#fff" : COLORS.ink, border: `1px solid ${COLORS.border}` }}>{t("proHeading")}</button>
        <button onClick={() => setTab("documents")} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: tab === "documents" ? COLORS.docs : "#fff", color: tab === "documents" ? "#fff" : COLORS.ink, border: `1px solid ${COLORS.border}` }}>{t("navDocuments")}</button>
        <button onClick={() => setTab("activity")} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: tab === "activity" ? COLORS.activity : "#fff", color: tab === "activity" ? "#fff" : COLORS.ink, border: `1px solid ${COLORS.border}` }}>{t("navActivity")}</button>
      </div>

      {failed && <Card className="p-5"><EmptyState text={t("errorWrongPin")} /></Card>}
      {!failed && !dk && <LoadingBlock t={t} />}
      {!failed && dk && tab === "rules" && <TraineeRulesAckView traineeId={trainee.id} dk={dk} t={t} traineeName={trainee.name} group={trainee.group} birthDate={trainee.birthDate} />}
      {!failed && dk && tab === "pro" && <ProView traineeId={trainee.id} dk={dk} t={t} readOnly={true} />}
      {!failed && dk && tab === "documents" && <DocumentsView traineeId={trainee.id} dk={dk} t={t} />}
      {!failed && dk && tab === "activity" && <ActivityView traineeId={trainee.id} dk={dk} t={t} />}

      <Card className="p-4 mt-5">
        <h3 className="font-medium mb-3 text-sm" style={{ color: COLORS.inkSoft }}>{t("traineeActionsHeading")}</h3>
        <div className="flex gap-3">
          <Button
            variant="outline"
            color={COLORS.inkSoft}
            className="flex-1"
            onClick={() => setConfirmArchive(true)}
          >
            {trainee.archived ? t("unarchiveBtn") : t("archiveBtn")}
          </Button>
          <Button color={COLORS.danger} className="flex-1" onClick={() => setConfirmDeleteForever(true)}>
            {t("deleteForeverBtn")}
          </Button>
        </div>
      </Card>

      {confirmArchive && (
        <Modal onClose={() => setConfirmArchive(false)}>
          <p className="mb-5 text-[15px]" style={{ color: COLORS.ink }}>{t("confirmArchiveMsg")}</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmArchive(false)}>{t("cancelBtn")}</Button>
            <Button
              className="flex-1"
              color={COLORS.ink}
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await onArchive(trainee.id, !trainee.archived);
                setBusy(false);
                setConfirmArchive(false);
              }}
            >
              {busy ? <Loader2 className="animate-spin" size={18} /> : (trainee.archived ? t("unarchiveBtn") : t("archiveBtn"))}
            </Button>
          </div>
        </Modal>
      )}

      {confirmDeleteForever && (
        <Modal onClose={() => setConfirmDeleteForever(false)}>
          <p className="mb-5 text-[15px]" style={{ color: COLORS.ink }}>{t("confirmDeleteForeverMsg")}</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmDeleteForever(false)}>{t("cancelBtn")}</Button>
            <Button
              className="flex-1"
              color={COLORS.danger}
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                await onDeleteForever(trainee.id);
                setBusy(false);
                setConfirmDeleteForever(false);
              }}
            >
              {busy ? <Loader2 className="animate-spin" size={18} /> : t("deleteForeverBtn")}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TraineeRulesAckView({ traineeId, dk, t, traineeName, group, birthDate }) {
  const [ack, setAck] = useState(undefined);
  useEffect(() => {
    (async () => setAck(await loadSignedRulesAck(traineeId, dk)))();
  }, [traineeId, dk]);

  if (ack === undefined) return <LoadingBlock t={t} />;

  async function handleDownload() {
    const dir = (LANGS.find((l) => l.code === ack.lang) || {}).dir || "ltr";
    const el = buildSignedRulesElement({
      traineeName, group, birthDate,
      signedAt: ack.signedAt,
      rulesText: ack.rulesText,
      signatureDataUrl: ack.signatureDataUrl,
      dir,
    });
    await downloadElementAsPdf(`Reglement_signe_${(traineeName || "stagiaire").replace(/\s+/g, "_")}`, el);
  }


  if (!ack) {
    return <Card className="p-5"><EmptyState text={t("noSignedRulesMsg")} /></Card>;
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.ink }}>
          <Check size={20} color="#fff" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold" style={{ color: COLORS.ink }}>{t("rulesSignedHeading")}</p>
          <p className="text-xs mt-0.5" style={{ color: COLORS.inkSoft }}>{t("signedOnLabel")} {new Date(ack.signedAt).toLocaleString()}</p>
        </div>
      </div>
      {ack.signatureDataUrl && (
        <img src={ack.signatureDataUrl} alt="signature" className="rounded-xl mb-4" style={{ border: `1px solid ${COLORS.border}`, maxHeight: 120 }} />
      )}
      <Button color={COLORS.ink} className="w-full" onClick={handleDownload}>
        <Download size={16} /> {t("downloadSignedRulesBtn")}
      </Button>
    </Card>
  );
}

function ManagementView({ t, session }) {
  const [subTab, setSubTab] = useState("trainers");
  const [trainers, setTrainers] = useState(null);
  const [groups, setGroups] = useState(null);

  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [trainerName, setTrainerName] = useState("");
  const [trainerPin, setTrainerPin] = useState("");
  const [trainerRole, setTrainerRole] = useState("trainer");
  const [trainerGroups, setTrainerGroups] = useState([]);
  const [trainerError, setTrainerError] = useState("");
  const [trainerBusy, setTrainerBusy] = useState(false);
  const [trainerMsg, setTrainerMsg] = useState("");
  const [confirmDeleteTrainer, setConfirmDeleteTrainer] = useState(null);

  const [showAddGroup, setShowAddGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupBusy, setGroupBusy] = useState(false);
  const [groupMsg, setGroupMsg] = useState("");
  const [confirmDeleteGroup, setConfirmDeleteGroup] = useState(null);

  const load = useCallback(async () => {
    setTrainers((await sGet("trainers_index")) || []);
    setGroups((await sGet("groups_index")) || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  function resetTrainerForm() {
    setTrainerName(""); setTrainerPin(""); setTrainerRole("trainer"); setTrainerGroups([]); setTrainerError("");
  }

  async function handleAddTrainer() {
    setTrainerError("");
    if (!trainerName.trim() || trainerPin.trim().length < 4) { setTrainerError(t("errorFillFields")); return; }
    setTrainerBusy(true);
    try {
      await addTrainerAccount(session.trainerPrivateKey, {
        name: trainerName.trim(),
        pin: trainerPin.trim(),
        role: trainerRole,
        groupNames: trainerGroups,
      });
      setTrainerBusy(false);
      setShowAddTrainer(false);
      resetTrainerForm();
      setTrainerMsg(t("trainerAddedMsg"));
      setTimeout(() => setTrainerMsg(""), 2500);
      load();
    } catch (e) {
      setTrainerBusy(false);
      setTrainerError(t("errorFillFields"));
    }
  }

  async function handleDeleteTrainer(id) {
    try {
      await removeTrainerAccount(id);
      setConfirmDeleteTrainer(null);
      load();
    } catch (e) {
      setConfirmDeleteTrainer(null);
      setTrainerError(t("cannotDeleteLastAdminMsg"));
      setTimeout(() => setTrainerError(""), 3000);
    }
  }

  async function handleAddGroup() {
    if (!groupName.trim()) return;
    setGroupBusy(true);
    await addGroupRecord(groupName.trim());
    setGroupBusy(false);
    setGroupName("");
    setShowAddGroup(false);
    setGroupMsg(t("groupAddedMsg"));
    setTimeout(() => setGroupMsg(""), 2500);
    load();
  }

  async function handleDeleteGroup(id) {
    await removeGroupRecord(id);
    setConfirmDeleteGroup(null);
    load();
  }

  if (trainers === null || groups === null) return <LoadingBlock t={t} />;

  return (
    <div>
      <SectionHeader icon={<Shield size={20} color="#fff" />} color={COLORS.ink} title={t("managementHeading")} />

      <div className="flex gap-2 mt-4 mb-4">
        <button onClick={() => setSubTab("trainers")} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: subTab === "trainers" ? COLORS.ink : "#fff", color: subTab === "trainers" ? "#fff" : COLORS.ink, border: `1px solid ${COLORS.border}` }}>{t("trainersHeading")}</button>
        <button onClick={() => setSubTab("groups")} className="px-4 py-2 rounded-lg text-sm font-medium" style={{ backgroundColor: subTab === "groups" ? COLORS.ink : "#fff", color: subTab === "groups" ? "#fff" : COLORS.ink, border: `1px solid ${COLORS.border}` }}>{t("groupsManagementHeading")}</button>
      </div>

      {subTab === "trainers" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <Button color={COLORS.ink} className="!px-4 !py-2" onClick={() => { resetTrainerForm(); setShowAddTrainer(true); }}>
              <UserPlus size={16} /> {t("addTrainerBtn")}
            </Button>
            {trainerMsg && <span className="flex items-center gap-1 text-sm" style={{ color: COLORS.rules }}><Check size={16} />{trainerMsg}</span>}
          </div>
          <div className="flex flex-col gap-3">
            {trainers.length === 0 && <Card className="p-5"><EmptyState text={t("noTrainersMsg")} /></Card>}
            {trainers.map((tr) => (
              <Card key={tr.id} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate" style={{ color: COLORS.ink }}>{tr.name}</p>
                  <p className="text-xs" style={{ color: COLORS.inkSoft }}>
                    {tr.role === "admin" ? t("adminBadge") : t("trainerBadge")}
                    {tr.role !== "admin" && (tr.groupNames && tr.groupNames.length ? ` · ${tr.groupNames.join("، ")}` : ` · ${t("allGroupsLabel")}`)}
                  </p>
                </div>
                <button onClick={() => setConfirmDeleteTrainer(tr.id)} className="p-2 rounded-lg shrink-0" style={{ color: COLORS.danger }}>
                  <Trash2 size={18} />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {subTab === "groups" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <Button color={COLORS.trainer} className="!px-4 !py-2" onClick={() => { setGroupName(""); setShowAddGroup(true); }}>
              <Plus size={16} /> {t("addGroupBtn")}
            </Button>
            {groupMsg && <span className="flex items-center gap-1 text-sm" style={{ color: COLORS.rules }}><Check size={16} />{groupMsg}</span>}
          </div>
          <div className="flex flex-col gap-3">
            {groups.length === 0 && <Card className="p-5"><EmptyState text={t("noGroupsMsg")} /></Card>}
            {groups.map((g) => (
              <Card key={g.id} className="p-4 flex items-center justify-between gap-3">
                <span className="font-medium" style={{ color: COLORS.ink }}>{g.name}</span>
                <button onClick={() => setConfirmDeleteGroup(g.id)} className="p-2 rounded-lg shrink-0" style={{ color: COLORS.danger }}>
                  <Trash2 size={18} />
                </button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {showAddTrainer && (
        <Modal onClose={() => setShowAddTrainer(false)}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.ink }}>{t("addTrainerBtn")}</h3>
          <TextInput label={t("trainerNameLabel")} value={trainerName} onChange={(e) => setTrainerName(e.target.value)} autoComplete="off" />
          <TextInput
            label={t("newTrainerPinLabel")}
            type="password"
            inputMode="numeric"
            value={trainerPin}
            onChange={(e) => setTrainerPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            autoComplete="off"
          />
          <label className="block mb-4">
            <span className="block mb-1.5 text-sm font-medium" style={{ color: COLORS.inkSoft }}>{t("roleLabel")}</span>
            <select
              value={trainerRole}
              onChange={(e) => setTrainerRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl outline-none text-[16px]"
              style={{ border: `1.5px solid ${COLORS.border}`, color: COLORS.ink, backgroundColor: "#fff" }}
            >
              <option value="trainer">{t("trainerRoleLabel")}</option>
              <option value="admin">{t("adminRoleLabel")}</option>
            </select>
          </label>
          {trainerRole === "trainer" && (
            <div className="mb-4">
              <span className="block mb-1.5 text-sm font-medium" style={{ color: COLORS.inkSoft }}>{t("assignGroupsLabel")}</span>
              {groups.length === 0 ? (
                <p className="text-sm" style={{ color: COLORS.inkSoft }}>{t("noGroupsToAssignMsg")}</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {groups.map((g) => (
                    <label key={g.id} className="flex items-center gap-2 text-sm" style={{ color: COLORS.ink }}>
                      <input
                        type="checkbox"
                        checked={trainerGroups.includes(g.name)}
                        onChange={(e) => {
                          setTrainerGroups((prev) =>
                            e.target.checked ? [...prev, g.name] : prev.filter((n) => n !== g.name)
                          );
                        }}
                      />
                      {g.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
          {trainerError && <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: COLORS.danger }}><AlertCircle size={16} />{trainerError}</div>}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddTrainer(false)}>{t("cancelBtn")}</Button>
            <Button color={COLORS.ink} className="flex-1" onClick={handleAddTrainer} disabled={trainerBusy}>
              {trainerBusy ? <Loader2 className="animate-spin" size={18} /> : t("addBtn")}
            </Button>
          </div>
        </Modal>
      )}

      {showAddGroup && (
        <Modal onClose={() => setShowAddGroup(false)}>
          <h3 className="text-lg font-semibold mb-4" style={{ color: COLORS.ink }}>{t("addGroupBtn")}</h3>
          <TextInput label={t("groupNameLabel")} value={groupName} onChange={(e) => setGroupName(e.target.value)} autoComplete="off" />
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowAddGroup(false)}>{t("cancelBtn")}</Button>
            <Button color={COLORS.trainer} className="flex-1" onClick={handleAddGroup} disabled={groupBusy}>
              {groupBusy ? <Loader2 className="animate-spin" size={18} /> : t("addBtn")}
            </Button>
          </div>
        </Modal>
      )}

      {confirmDeleteTrainer && (
        <Modal onClose={() => setConfirmDeleteTrainer(null)}>
          <p className="mb-5 text-[15px]" style={{ color: COLORS.ink }}>{t("confirmDeleteTrainerMsg")}</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmDeleteTrainer(null)}>{t("cancelBtn")}</Button>
            <Button className="flex-1" color={COLORS.danger} onClick={() => handleDeleteTrainer(confirmDeleteTrainer)}>{t("deleteBtn")}</Button>
          </div>
        </Modal>
      )}

      {confirmDeleteGroup && (
        <Modal onClose={() => setConfirmDeleteGroup(null)}>
          <p className="mb-5 text-[15px]" style={{ color: COLORS.ink }}>{t("confirmDeleteGroupMsg")}</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmDeleteGroup(null)}>{t("cancelBtn")}</Button>
            <Button className="flex-1" color={COLORS.danger} onClick={() => handleDeleteGroup(confirmDeleteGroup)}>{t("deleteBtn")}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function TrainerSettings({ t, session }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const isAdmin = session.role === "admin";

  async function handleSave() {
    setError(""); setOk(false);
    if (next.trim().length < 4) { setError(t("errorFillFields")); return; }
    setBusy(true);
    try {
      await changeOwnTrainerPin(session.trainerId, current.trim(), next.trim());
      setBusy(false);
      setOk(true);
      setCurrent(""); setNext("");
    } catch (e) {
      setBusy(false);
      setError(t("errorWrongPin"));
    }
  }

  return (
    <div>
      <SectionHeader icon={<Settings size={20} color="#fff" />} color={COLORS.ink} title={t("settingsHeading")} />
      <Card className="p-4 mt-4">
        <p className="text-sm" style={{ color: COLORS.inkSoft }}>{t("loggedInAsLabel")}</p>
        <p className="font-medium" style={{ color: COLORS.ink }}>{session.trainerName} · {isAdmin ? t("adminBadge") : t("trainerBadge")}</p>
        {!isAdmin && (
          <p className="text-xs mt-1" style={{ color: COLORS.inkSoft }}>
            {(session.groupNames && session.groupNames.length) ? session.groupNames.join("، ") : t("allGroupsLabel")}
          </p>
        )}
      </Card>
      <Card className="p-5 mt-4">
        <h3 className="font-medium mb-4" style={{ color: COLORS.ink }}>{t("changeTrainerPinHeading")}</h3>
        <TextInput label={t("currentPinLabel")} type="password" inputMode="numeric" value={current} onChange={(e) => setCurrent(e.target.value.replace(/\D/g, "").slice(0, 6))} />
        <TextInput label={t("newPinLabel")} type="password" inputMode="numeric" value={next} onChange={(e) => setNext(e.target.value.replace(/\D/g, "").slice(0, 6))} />
        {error && <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: COLORS.danger }}><AlertCircle size={16} />{error}</div>}
        {ok && <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: COLORS.rules }}><Check size={16} />{t("pinChangedMsg")}</div>}
        <Button color={COLORS.ink} onClick={handleSave} disabled={busy}>
          {busy ? <Loader2 className="animate-spin" size={18} /> : t("savePinBtn")}
        </Button>
      </Card>
    </div>
  );
}

/* ============================== Root ============================== */

export default function App() {
  useFonts();
  const [session, setSession] = useState(null);

  if (!session) return <LoginFlow onLogin={setSession} />;

  return session.type === "trainee" ? (
    <TraineeApp session={session} onLogout={() => setSession(null)} />
  ) : (
    <TrainerApp session={session} onLogout={() => setSession(null)} />
  );
}
