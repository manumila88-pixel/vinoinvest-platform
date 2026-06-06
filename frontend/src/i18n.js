import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import it from "./locales/it.json";

// Translations for 40 languages
// All non-en/it use English as base with translated hero/nav keys
const fr = {
  nav: { dashboard: "Tableau de bord", market: "Marché", news: "Actualités", blog: "Blog IA", analysis: "Analyse", portfolio: "Mon Portefeuille", portfolioAI: "Portefeuille IA", b2b: "Dashboard B2B", alerts: "Alertes", pricing: "Tarifs" },
  hero: { title: "Plateforme Mondiale d'Investissement Viticole", subtitle: "Constructeur de portefeuille IA, intelligence viticole, analyses et recherche mondiale.", searchPlaceholder: "Rechercher des vins, producteurs, régions, millésimes..." },
  stats: { globalMarket: "Marché Mondial", portfolioValue: "Valeur du Portefeuille", invested: "Investi", profitLoss: "Profit / Perte", roi: "ROI", watchlist: "Liste de surveillance" },
  market: { searchPlaceholder: "Rechercher n'importe quel vin dans le monde...", addToPortfolio: "+ Ajouter au Portefeuille", buyOn: "Acheter sur Wine-Searcher →", noWines: "Aucun vin trouvé.", loadingMore: "Chargement de plus de vins…" },
  auth: { signOut: "Déconnexion", serverStarting: "⚡ Serveur en démarrage...", offline: "⚠️ Pas de connexion" },
  notifications: { title: "Notifications", enablePush: "🔔 Activer Push", markAllRead: "Tout marquer comme lu", noNotifications: "Pas encore de notifications.", pushEnabled: "Notifications push activées!" },
  common: { loading: "Chargement...", noData: "Aucune donnée", refresh: "Actualiser", save: "Enregistrer", cancel: "Annuler", close: "Fermer", back: "Retour", error: "Erreur", success: "Succès" },
  chart: { realData: "Données réelles", estimated: "Données estimées", mixed: "Mixte" },
  portfolio: { ...en.portfolio, title: "Mon Portefeuille", exportCSV: "Exporter CSV", noPositions: "Aucune position. Allez sur le Marché et ajoutez une position.", growth: "Croissance du Portefeuille", diversification: "Diversification", byType: "Par Type", byWine: "Par Vin", estimatedNote: "* Valeurs estimées basées sur 8% de croissance annuelle moyenne" }
};
const de = {
  nav: { dashboard: "Dashboard", market: "Markt", news: "Nachrichten", blog: "KI-Blog", analysis: "Analyse", portfolio: "Mein Portfolio", portfolioAI: "KI-Portfolio", b2b: "B2B Dashboard", alerts: "Alarme", pricing: "Preise" },
  hero: { title: "Globale Weinanlage-Plattform", subtitle: "KI-Portfolioersteller, Weinintelligenz, Analysen und weltweite Suche.", searchPlaceholder: "Suche Weine, Erzeuger, Regionen, Jahrgänge..." },
  stats: { globalMarket: "Weltmarkt", portfolioValue: "Portfoliowert", invested: "Investiert", profitLoss: "Gewinn / Verlust", roi: "ROI", watchlist: "Beobachtungsliste" },
  market: { searchPlaceholder: "Suche beliebige Weine weltweit...", addToPortfolio: "+ Zum Portfolio hinzufügen", buyOn: "Auf Wine-Searcher kaufen →", noWines: "Keine Weine gefunden.", loadingMore: "Weitere Weine laden…" },
  auth: { signOut: "Abmelden", serverStarting: "⚡ Server startet...", offline: "⚠️ Keine Verbindung" },
  notifications: { title: "Benachrichtigungen", enablePush: "🔔 Push aktivieren", markAllRead: "Alle als gelesen markieren", noNotifications: "Noch keine Benachrichtigungen.", pushEnabled: "Push-Benachrichtigungen aktiviert!" },
  common: { loading: "Laden...", noData: "Keine Daten", refresh: "Aktualisieren", save: "Speichern", cancel: "Abbrechen", close: "Schließen", back: "Zurück", error: "Fehler", success: "Erfolg" },
  chart: { realData: "Echte Daten", estimated: "Geschätzte Daten", mixed: "Gemischt" },
  portfolio: { ...en.portfolio, title: "Mein Portfolio", exportCSV: "CSV exportieren", noPositions: "Noch keine Positionen.", growth: "Portfolio-Wachstum", diversification: "Diversifikation", byType: "Nach Typ", byWine: "Nach Wein", estimatedNote: "* Geschätzte Werte basierend auf 8% jährlichem Wachstum" }
};
const es = {
  nav: { dashboard: "Panel", market: "Mercado", news: "Noticias", blog: "Blog IA", analysis: "Análisis", portfolio: "Mi Cartera", portfolioAI: "Cartera IA", b2b: "Panel B2B", alerts: "Alertas", pricing: "Precios" },
  hero: { title: "Plataforma Global de Inversión en Vino", subtitle: "Constructor de cartera IA, inteligencia vinícola, análisis y búsqueda mundial.", searchPlaceholder: "Buscar vinos, productores, regiones, cosechas..." },
  stats: { globalMarket: "Mercado Global", portfolioValue: "Valor de la Cartera", invested: "Invertido", profitLoss: "Ganancia / Pérdida", roi: "ROI", watchlist: "Lista de seguimiento" },
  market: { searchPlaceholder: "Buscar cualquier vino en el mundo...", addToPortfolio: "+ Añadir a la Cartera", buyOn: "Comprar en Wine-Searcher →", noWines: "No se encontraron vinos.", loadingMore: "Cargando más vinos…" },
  auth: { signOut: "Cerrar sesión", serverStarting: "⚡ Servidor iniciando...", offline: "⚠️ Sin conexión" },
  notifications: { title: "Notificaciones", enablePush: "🔔 Activar Push", markAllRead: "Marcar todo como leído", noNotifications: "Aún no hay notificaciones.", pushEnabled: "¡Notificaciones push activadas!" },
  common: { loading: "Cargando...", noData: "Sin datos", refresh: "Actualizar", save: "Guardar", cancel: "Cancelar", close: "Cerrar", back: "Volver", error: "Error", success: "Éxito" },
  chart: { realData: "Datos reales", estimated: "Datos estimados", mixed: "Mixto" },
  portfolio: { ...en.portfolio, title: "Mi Cartera", exportCSV: "Exportar CSV", noPositions: "Sin posiciones aún.", growth: "Crecimiento de la Cartera", diversification: "Diversificación", byType: "Por Tipo", byWine: "Por Vino", estimatedNote: "* Valores estimados basados en crecimiento anual promedio del 8%" }
};
const pt = {
  nav: { dashboard: "Painel", market: "Mercado", news: "Notícias", blog: "Blog IA", analysis: "Análise", portfolio: "Minha Carteira", portfolioAI: "Carteira IA", b2b: "Painel B2B", alerts: "Alertas", pricing: "Preços" },
  hero: { title: "Plataforma Global de Investimento em Vinho", subtitle: "Construtor de carteira IA, inteligência vinícola, análises e pesquisa mundial.", searchPlaceholder: "Pesquisar vinhos, produtores, regiões, safras..." },
  stats: { globalMarket: "Mercado Global", portfolioValue: "Valor da Carteira", invested: "Investido", profitLoss: "Lucro / Perda", roi: "ROI", watchlist: "Lista de acompanhamento" },
  market: { searchPlaceholder: "Pesquisar qualquer vinho no mundo...", addToPortfolio: "+ Adicionar à Carteira", buyOn: "Comprar no Wine-Searcher →", noWines: "Nenhum vinho encontrado.", loadingMore: "Carregando mais vinhos…" },
  auth: { signOut: "Sair", serverStarting: "⚡ Servidor iniciando...", offline: "⚠️ Sem conexão" },
  notifications: { title: "Notificações", enablePush: "🔔 Ativar Push", markAllRead: "Marcar tudo como lido", noNotifications: "Sem notificações ainda.", pushEnabled: "Notificações push ativadas!" },
  common: { loading: "Carregando...", noData: "Sem dados", refresh: "Atualizar", save: "Salvar", cancel: "Cancelar", close: "Fechar", back: "Voltar", error: "Erro", success: "Sucesso" },
  chart: { realData: "Dados reais", estimated: "Dados estimados", mixed: "Mistos" },
  portfolio: { ...en.portfolio, title: "Minha Carteira", exportCSV: "Exportar CSV", noPositions: "Sem posições ainda.", growth: "Crescimento da Carteira", diversification: "Diversificação", byType: "Por Tipo", byWine: "Por Vinho", estimatedNote: "* Valores estimados com base em crescimento médio anual de 8%" }
};
const zh = {
  nav: { dashboard: "仪表板", market: "市场", news: "新闻", blog: "AI博客", analysis: "分析", portfolio: "我的投资组合", portfolioAI: "AI投资组合", b2b: "B2B仪表板", alerts: "提醒", pricing: "定价" },
  hero: { title: "全球葡萄酒投资平台", subtitle: "AI投资组合构建器、葡萄酒智能、分析和全球搜索。", searchPlaceholder: "搜索葡萄酒、生产商、产区、年份..." },
  stats: { globalMarket: "全球市场", portfolioValue: "投资组合价值", invested: "已投资", profitLoss: "盈利/亏损", roi: "回报率", watchlist: "关注列表" },
  market: { searchPlaceholder: "在全球搜索任何葡萄酒...", addToPortfolio: "+ 添加到投资组合", buyOn: "在Wine-Searcher购买 →", noWines: "未找到葡萄酒。", loadingMore: "加载更多葡萄酒…" },
  auth: { signOut: "退出", serverStarting: "⚡ 服务器启动中...", offline: "⚠️ 无连接" },
  notifications: { title: "通知", enablePush: "🔔 启用推送", markAllRead: "全部标为已读", noNotifications: "暂无通知。", pushEnabled: "推送通知已启用！" },
  common: { loading: "加载中...", noData: "无数据", refresh: "刷新", save: "保存", cancel: "取消", close: "关闭", back: "返回", error: "错误", success: "成功" },
  chart: { realData: "真实数据", estimated: "估算数据", mixed: "混合" },
  portfolio: { ...en.portfolio, title: "我的投资组合", exportCSV: "导出CSV", noPositions: "暂无持仓。", growth: "投资组合增长", diversification: "多元化", byType: "按类型", byWine: "按葡萄酒", estimatedNote: "* 基于葡萄酒市场历史年均8%增长的估算值" }
};
const ja = {
  nav: { dashboard: "ダッシュボード", market: "マーケット", news: "ニュース", blog: "AIブログ", analysis: "分析", portfolio: "ポートフォリオ", portfolioAI: "AIポートフォリオ", b2b: "B2Bダッシュボード", alerts: "アラート", pricing: "料金" },
  hero: { title: "グローバルワイン投資プラットフォーム", subtitle: "AIポートフォリオビルダー、ワインインテリジェンス、分析、世界規模の検索。", searchPlaceholder: "ワイン、生産者、産地、ヴィンテージを検索..." },
  stats: { globalMarket: "グローバル市場", portfolioValue: "ポートフォリオ価値", invested: "投資済み", profitLoss: "損益", roi: "ROI", watchlist: "ウォッチリスト" },
  market: { searchPlaceholder: "世界中のワインを検索...", addToPortfolio: "+ ポートフォリオに追加", buyOn: "Wine-Searcherで購入 →", noWines: "ワインが見つかりません。", loadingMore: "さらにワインを読み込む…" },
  auth: { signOut: "サインアウト", serverStarting: "⚡ サーバー起動中...", offline: "⚠️ 接続なし" },
  notifications: { title: "通知", enablePush: "🔔 プッシュを有効化", markAllRead: "すべて既読にする", noNotifications: "まだ通知はありません。", pushEnabled: "プッシュ通知が有効になりました！" },
  common: { loading: "読み込み中...", noData: "データなし", refresh: "更新", save: "保存", cancel: "キャンセル", close: "閉じる", back: "戻る", error: "エラー", success: "成功" },
  chart: { realData: "実データ", estimated: "推定データ", mixed: "混合" },
  portfolio: { ...en.portfolio, title: "マイポートフォリオ", exportCSV: "CSVエクスポート", noPositions: "まだポジションがありません。", growth: "ポートフォリオ成長", diversification: "分散化", byType: "タイプ別", byWine: "ワイン別", estimatedNote: "* ワイン市場の年平均8%成長に基づく推定値" }
};
const ko = {
  nav: { dashboard: "대시보드", market: "시장", news: "뉴스", blog: "AI 블로그", analysis: "분석", portfolio: "내 포트폴리오", portfolioAI: "AI 포트폴리오", b2b: "B2B 대시보드", alerts: "알림", pricing: "요금제" },
  hero: { title: "글로벌 와인 투자 플랫폼", subtitle: "AI 포트폴리오 빌더, 와인 인텔리전스, 분석 및 전 세계 검색.", searchPlaceholder: "와인, 생산자, 지역, 빈티지 검색..." },
  stats: { globalMarket: "글로벌 시장", portfolioValue: "포트폴리오 가치", invested: "투자금", profitLoss: "손익", roi: "ROI", watchlist: "관심 목록" },
  market: { searchPlaceholder: "전 세계 와인 검색...", addToPortfolio: "+ 포트폴리오에 추가", buyOn: "Wine-Searcher에서 구매 →", noWines: "와인을 찾을 수 없습니다.", loadingMore: "더 많은 와인 불러오기…" },
  auth: { signOut: "로그아웃", serverStarting: "⚡ 서버 시작 중...", offline: "⚠️ 연결 없음" },
  notifications: { title: "알림", enablePush: "🔔 푸시 활성화", markAllRead: "모두 읽음 표시", noNotifications: "아직 알림이 없습니다.", pushEnabled: "푸시 알림이 활성화되었습니다!" },
  common: { loading: "로딩 중...", noData: "데이터 없음", refresh: "새로고침", save: "저장", cancel: "취소", close: "닫기", back: "뒤로", error: "오류", success: "성공" },
  chart: { realData: "실제 데이터", estimated: "추정 데이터", mixed: "혼합" },
  portfolio: { ...en.portfolio }
};
const ar = {
  nav: { dashboard: "لوحة التحكم", market: "السوق", news: "الأخبار", blog: "مدونة الذكاء الاصطناعي", analysis: "التحليل", portfolio: "محفظتي", portfolioAI: "محفظة الذكاء الاصطناعي", b2b: "لوحة B2B", alerts: "التنبيهات", pricing: "الأسعار" },
  hero: { title: "منصة الاستثمار في النبيذ العالمية", subtitle: "منشئ المحفظة بالذكاء الاصطناعي، ذكاء النبيذ، التحليلات والبحث العالمي.", searchPlaceholder: "ابحث عن النبيذ، المنتجين، المناطق، السنوات..." },
  stats: { globalMarket: "السوق العالمي", portfolioValue: "قيمة المحفظة", invested: "المستثمر", profitLoss: "الربح / الخسارة", roi: "العائد على الاستثمار", watchlist: "قائمة المراقبة" },
  market: { searchPlaceholder: "ابحث عن أي نبيذ في العالم...", addToPortfolio: "+ إضافة إلى المحفظة", buyOn: "شراء على Wine-Searcher ←", noWines: "لم يتم العثور على نبيذ.", loadingMore: "تحميل المزيد من النبيذ…" },
  auth: { signOut: "تسجيل الخروج", serverStarting: "⚡ جاري تشغيل الخادم...", offline: "⚠️ لا يوجد اتصال" },
  notifications: { title: "الإشعارات", enablePush: "🔔 تفعيل Push", markAllRead: "تعليم الكل كمقروء", noNotifications: "لا توجد إشعارات بعد.", pushEnabled: "تم تفعيل إشعارات Push!" },
  common: { loading: "جار التحميل...", noData: "لا توجد بيانات", refresh: "تحديث", save: "حفظ", cancel: "إلغاء", close: "إغلاق", back: "رجوع", error: "خطأ", success: "نجاح" },
  chart: { realData: "بيانات حقيقية", estimated: "بيانات تقديرية", mixed: "مختلطة" },
  portfolio: { ...en.portfolio }
};
const ru = { nav: { dashboard: "Панель", market: "Рынок", news: "Новости", blog: "ИИ Блог", analysis: "Анализ", portfolio: "Портфель", portfolioAI: "ИИ Портфель", b2b: "B2B панель", alerts: "Уведомления", pricing: "Цены" }, hero: { title: "Глобальная Платформа для Инвестиций в Вино", subtitle: "Конструктор портфеля ИИ, аналитика вина, аналитика и поиск.", searchPlaceholder: "Поиск вин, производителей, регионов, vintages..." }, stats: { globalMarket: "Мировой рынок", portfolioValue: "Стоимость портфеля", invested: "Инвестировано", profitLoss: "Прибыль / Убыток", roi: "ROI", watchlist: "Список наблюдения" }, market: { searchPlaceholder: "Поиск любого вина в мире...", addToPortfolio: "+ Добавить в портфель", buyOn: "Купить на Wine-Searcher →", noWines: "Вина не найдены.", loadingMore: "Загрузка вин…" }, auth: { signOut: "Выйти", serverStarting: "⚡ Сервер запускается...", offline: "⚠️ Нет соединения" }, notifications: { title: "Уведомления", enablePush: "🔔 Включить Push", markAllRead: "Отметить всё прочитанным", noNotifications: "Уведомлений пока нет.", pushEnabled: "Push-уведомления включены!" }, common: { loading: "Загрузка...", noData: "Нет данных", refresh: "Обновить", save: "Сохранить", cancel: "Отмена", close: "Закрыть", back: "Назад", error: "Ошибка", success: "Успех" }, chart: { realData: "Реальные данные", estimated: "Расчётные данные", mixed: "Смешанные" }, portfolio: { ...en.portfolio } };
const nl = { nav: { dashboard: "Dashboard", market: "Markt", news: "Nieuws", blog: "AI Blog", analysis: "Analyse", portfolio: "Mijn Portfolio", portfolioAI: "AI Portfolio", b2b: "B2B Dashboard", alerts: "Meldingen", pricing: "Prijzen" }, hero: { title: "Mondiaal Wijninvesteringsplatform", subtitle: "AI portfolio builder, wijnintelligentie, analyses en wereldwijde zoekopdrachten.", searchPlaceholder: "Zoek wijnen, producenten, regio's, jaargangen..." }, stats: { globalMarket: "Wereldmarkt", portfolioValue: "Portfoliowaarde", invested: "Geïnvesteerd", profitLoss: "Winst / Verlies", roi: "ROI", watchlist: "Volglijst" }, market: { searchPlaceholder: "Zoek elke wijn wereldwijd...", addToPortfolio: "+ Toevoegen aan Portfolio", buyOn: "Kopen op Wine-Searcher →", noWines: "Geen wijnen gevonden.", loadingMore: "Meer wijnen laden…" }, auth: { signOut: "Uitloggen", serverStarting: "⚡ Server start op...", offline: "⚠️ Geen verbinding" }, notifications: { title: "Meldingen", enablePush: "🔔 Push inschakelen", markAllRead: "Alles als gelezen markeren", noNotifications: "Nog geen meldingen.", pushEnabled: "Push-meldingen ingeschakeld!" }, common: { loading: "Laden...", noData: "Geen gegevens", refresh: "Vernieuwen", save: "Opslaan", cancel: "Annuleren", close: "Sluiten", back: "Terug", error: "Fout", success: "Succes" }, chart: { realData: "Echte data", estimated: "Geschatte data", mixed: "Gemengd" }, portfolio: { ...en.portfolio } };

// For remaining languages, use English as base with language-specific nav/hero
const makeTranslation = (navOverrides, heroOverrides, statsOverrides, marketOverrides, authOverrides, notifOverrides, commonOverrides) => ({
  nav: { ...en.nav, ...navOverrides },
  hero: { ...en.hero, ...heroOverrides },
  stats: { ...en.stats, ...statsOverrides },
  market: { ...en.market, ...marketOverrides },
  auth: { ...en.auth, ...authOverrides },
  notifications: { ...en.notifications, ...notifOverrides },
  common: { ...en.common, ...commonOverrides },
  chart: en.chart,
  portfolio: en.portfolio,
});

const sv = makeTranslation({ dashboard: "Instrumentpanel", market: "Marknad", news: "Nyheter", portfolio: "Min Portfölj" }, { title: "Global Vininvesteringsplattform", searchPlaceholder: "Sök viner, producenter, regioner, årgångar..." }, { globalMarket: "Världsmarknad", portfolioValue: "Portföljvärde", invested: "Investerat" }, { searchPlaceholder: "Sök vilket vin som helst i världen...", addToPortfolio: "+ Lägg till portfölj", noWines: "Inga viner hittades." }, { signOut: "Logga ut" }, { title: "Aviseringar", markAllRead: "Markera allt som läst", noNotifications: "Inga aviseringar ännu." }, { loading: "Laddar...", noData: "Inga data" });
const no = makeTranslation({ dashboard: "Kontrollpanel", market: "Marked", news: "Nyheter", portfolio: "Min Portefølje" }, { title: "Global Vininvesteringsplattform", searchPlaceholder: "Søk viner, produsenter, regioner, årganger..." }, { globalMarket: "Verdensmarked", portfolioValue: "Porteføljeverdi", invested: "Investert" }, { searchPlaceholder: "Søk etter vin i hele verden...", addToPortfolio: "+ Legg til portefølje", noWines: "Ingen viner funnet." }, { signOut: "Logg ut" }, { title: "Varsler", markAllRead: "Merk alle som lest", noNotifications: "Ingen varsler ennå." }, { loading: "Laster...", noData: "Ingen data" });
const da = makeTranslation({ dashboard: "Kontrolpanel", market: "Marked", news: "Nyheder", portfolio: "Min Portefølje" }, { title: "Global Vininvesteringsplatform", searchPlaceholder: "Søg vine, producenter, regioner, årgange..." }, { globalMarket: "Verdensmarked", portfolioValue: "Porteføljeværdi", invested: "Investeret" }, { searchPlaceholder: "Søg efter vin i hele verden...", addToPortfolio: "+ Tilføj til portefølje", noWines: "Ingen vine fundet." }, { signOut: "Log ud" }, { title: "Meddelelser", markAllRead: "Markér alle som læste", noNotifications: "Ingen meddelelser endnu." }, { loading: "Indlæser...", noData: "Ingen data" });
const fi = makeTranslation({ dashboard: "Kojelauta", market: "Markkinat", news: "Uutiset", portfolio: "Salkku" }, { title: "Maailmanlaajuinen Viiini-investointialusta", searchPlaceholder: "Etsi viinejä, tuottajia, alueita, vuosikertoja..." }, { globalMarket: "Maailmanmarkkinat", portfolioValue: "Salkun arvo", invested: "Sijoitettu" }, { searchPlaceholder: "Etsi mitä tahansa viiniä maailmasta...", addToPortfolio: "+ Lisää salkkuun", noWines: "Viinejä ei löydy." }, { signOut: "Kirjaudu ulos" }, { title: "Ilmoitukset", markAllRead: "Merkitse kaikki luetuiksi", noNotifications: "Ei vielä ilmoituksia." }, { loading: "Ladataan...", noData: "Ei tietoja" });
const pl = makeTranslation({ dashboard: "Panel", market: "Rynek", news: "Aktualności", portfolio: "Moje Portfolio" }, { title: "Globalna Platforma Inwestycji w Wino", searchPlaceholder: "Szukaj win, producentów, regionów, roczników..." }, { globalMarket: "Rynek globalny", portfolioValue: "Wartość portfela", invested: "Zainwestowano" }, { searchPlaceholder: "Szukaj dowolnego wina na świecie...", addToPortfolio: "+ Dodaj do portfela", noWines: "Nie znaleziono win." }, { signOut: "Wyloguj" }, { title: "Powiadomienia", markAllRead: "Oznacz wszystkie jako przeczytane", noNotifications: "Brak powiadomień." }, { loading: "Ładowanie...", noData: "Brak danych" });
const cs = makeTranslation({ dashboard: "Přehled", market: "Trh", news: "Zprávy", portfolio: "Moje Portfolio" }, { title: "Globální Platforma pro Investice do Vína", searchPlaceholder: "Hledat víno, výrobce, oblasti, ročníky..." }, { globalMarket: "Světový trh", portfolioValue: "Hodnota portfolia", invested: "Investováno" }, { searchPlaceholder: "Hledat jakékoli víno po celém světě...", addToPortfolio: "+ Přidat do portfolia", noWines: "Žádná vína nenalezena." }, { signOut: "Odhlásit" }, { title: "Oznámení", markAllRead: "Označit vše jako přečtené", noNotifications: "Žádná oznámení." }, { loading: "Načítání...", noData: "Žádná data" });
const hu = makeTranslation({ dashboard: "Irányítópult", market: "Piac", news: "Hírek", portfolio: "Saját Portfólió" }, { title: "Globális Borberuházási Platform", searchPlaceholder: "Keresés borok, termelők, régiók, évjáratok..." }, { globalMarket: "Globális piac", portfolioValue: "Portfólió értéke", invested: "Befektetve" }, { searchPlaceholder: "Keressen bármilyen bort a világon...", addToPortfolio: "+ Hozzáadás a portfólióhoz", noWines: "Nem találhatók borok." }, { signOut: "Kijelentkezés" }, { title: "Értesítések", markAllRead: "Mindent olvasottnak jelölöm", noNotifications: "Még nincsenek értesítések." }, { loading: "Betöltés...", noData: "Nincs adat" });
const ro = makeTranslation({ dashboard: "Tablou de bord", market: "Piață", news: "Știri", portfolio: "Portofoliul meu" }, { title: "Platformă Globală de Investiții în Vin", searchPlaceholder: "Caută vinuri, producători, regiuni, recolte..." }, { globalMarket: "Piața globală", portfolioValue: "Valoarea portofoliului", invested: "Investit" }, { searchPlaceholder: "Caută orice vin din lume...", addToPortfolio: "+ Adaugă în portofoliu", noWines: "Nu s-au găsit vinuri." }, { signOut: "Deconectare" }, { title: "Notificări", markAllRead: "Marchează tot ca citit", noNotifications: "Nicio notificare încă." }, { loading: "Se încarcă...", noData: "Nu există date" });
const el = makeTranslation({ dashboard: "Πίνακας", market: "Αγορά", news: "Νέα", portfolio: "Χαρτοφυλάκιό μου" }, { title: "Παγκόσμια Πλατφόρμα Επένδυσης σε Κρασί", searchPlaceholder: "Αναζήτηση κρασιών, παραγωγών, περιοχών, vintage..." }, { globalMarket: "Παγκόσμια αγορά", portfolioValue: "Αξία χαρτοφυλακίου", invested: "Επενδύθηκε" }, { searchPlaceholder: "Αναζητήστε οποιοδήποτε κρασί παγκοσμίως...", addToPortfolio: "+ Προσθήκη στο χαρτοφυλάκιο", noWines: "Δεν βρέθηκαν κρασιά." }, { signOut: "Αποσύνδεση" }, { title: "Ειδοποιήσεις", markAllRead: "Σήμανση όλων ως αναγνωσμένων", noNotifications: "Δεν υπάρχουν ακόμα ειδοποιήσεις." }, { loading: "Φόρτωση...", noData: "Δεν υπάρχουν δεδομένα" });
const tr = makeTranslation({ dashboard: "Gösterge Paneli", market: "Pazar", news: "Haberler", portfolio: "Portföyüm" }, { title: "Küresel Şarap Yatırım Platformu", searchPlaceholder: "Şarap, üretici, bölge, yıl ara..." }, { globalMarket: "Küresel Pazar", portfolioValue: "Portföy Değeri", invested: "Yatırılan" }, { searchPlaceholder: "Dünyada herhangi bir şarap ara...", addToPortfolio: "+ Portföye Ekle", noWines: "Şarap bulunamadı." }, { signOut: "Çıkış Yap" }, { title: "Bildirimler", markAllRead: "Tümünü okundu işaretle", noNotifications: "Henüz bildirim yok." }, { loading: "Yükleniyor...", noData: "Veri yok" });
const he = makeTranslation({ dashboard: "לוח בקרה", market: "שוק", news: "חדשות", portfolio: "תיק ההשקעות שלי" }, { title: "פלטפורמת השקעות יין גלובלית", searchPlaceholder: "חיפוש יינות, יצרנים, אזורים, בציר..." }, { globalMarket: "שוק עולמי", portfolioValue: "שווי התיק", invested: "הושקע" }, { searchPlaceholder: "חפש כל יין בעולם...", addToPortfolio: "+ הוסף לתיק", noWines: "לא נמצאו יינות." }, { signOut: "התנתק" }, { title: "התראות", markAllRead: "סמן הכל כנקרא", noNotifications: "אין התראות עדיין." }, { loading: "טוען...", noData: "אין נתונים" });
const hi = makeTranslation({ dashboard: "डैशबोर्ड", market: "बाज़ार", news: "समाचार", portfolio: "मेरा पोर्टफोलियो" }, { title: "वैश्विक वाइन निवेश मंच", searchPlaceholder: "वाइन, उत्पादक, क्षेत्र, विंटेज खोजें..." }, { globalMarket: "वैश्विक बाज़ार", portfolioValue: "पोर्टफोलियो मूल्य", invested: "निवेशित" }, { searchPlaceholder: "दुनिया में कोई भी वाइन खोजें...", addToPortfolio: "+ पोर्टफोलियो में जोड़ें", noWines: "कोई वाइन नहीं मिली।" }, { signOut: "साइन आउट" }, { title: "सूचनाएं", markAllRead: "सभी पढ़े के रूप में चिह्नित करें", noNotifications: "अभी तक कोई सूचना नहीं।" }, { loading: "लोड हो रहा है...", noData: "कोई डेटा नहीं" });
const th = makeTranslation({ dashboard: "แดชบอร์ด", market: "ตลาด", news: "ข่าว", portfolio: "พอร์ตโฟลิโอของฉัน" }, { title: "แพลตฟอร์มลงทุนไวน์ทั่วโลก", searchPlaceholder: "ค้นหาไวน์ ผู้ผลิต ภูมิภาค วินเทจ..." }, { globalMarket: "ตลาดโลก", portfolioValue: "มูลค่าพอร์ตโฟลิโอ", invested: "ลงทุนแล้ว" }, { searchPlaceholder: "ค้นหาไวน์ใดก็ได้ทั่วโลก...", addToPortfolio: "+ เพิ่มในพอร์ตโฟลิโอ", noWines: "ไม่พบไวน์" }, { signOut: "ออกจากระบบ" }, { title: "การแจ้งเตือน", markAllRead: "ทำเครื่องหมายทั้งหมดว่าอ่านแล้ว", noNotifications: "ยังไม่มีการแจ้งเตือน" }, { loading: "กำลังโหลด...", noData: "ไม่มีข้อมูล" });
const vi = makeTranslation({ dashboard: "Bảng điều khiển", market: "Thị trường", news: "Tin tức", portfolio: "Danh mục của tôi" }, { title: "Nền tảng đầu tư rượu vang toàn cầu", searchPlaceholder: "Tìm kiếm rượu vang, nhà sản xuất, vùng, năm..." }, { globalMarket: "Thị trường toàn cầu", portfolioValue: "Giá trị danh mục", invested: "Đã đầu tư" }, { searchPlaceholder: "Tìm kiếm bất kỳ loại rượu vang nào trên thế giới...", addToPortfolio: "+ Thêm vào danh mục", noWines: "Không tìm thấy rượu vang." }, { signOut: "Đăng xuất" }, { title: "Thông báo", markAllRead: "Đánh dấu tất cả là đã đọc", noNotifications: "Chưa có thông báo." }, { loading: "Đang tải...", noData: "Không có dữ liệu" });
const id = makeTranslation({ dashboard: "Dasbor", market: "Pasar", news: "Berita", portfolio: "Portofolio Saya" }, { title: "Platform Investasi Anggur Global", searchPlaceholder: "Cari anggur, produsen, wilayah, vintage..." }, { globalMarket: "Pasar Global", portfolioValue: "Nilai Portofolio", invested: "Diinvestasikan" }, { searchPlaceholder: "Cari anggur apapun di seluruh dunia...", addToPortfolio: "+ Tambah ke Portofolio", noWines: "Tidak ada anggur ditemukan." }, { signOut: "Keluar" }, { title: "Notifikasi", markAllRead: "Tandai semua telah dibaca", noNotifications: "Belum ada notifikasi." }, { loading: "Memuat...", noData: "Tidak ada data" });
const ms = makeTranslation({ dashboard: "Papan Pemuka", market: "Pasaran", news: "Berita", portfolio: "Portfolio Saya" }, { title: "Platform Pelaburan Wain Global", searchPlaceholder: "Cari wain, pengeluar, rantau, vintaj..." }, { globalMarket: "Pasaran Global", portfolioValue: "Nilai Portfolio", invested: "Dilaburkan" }, { searchPlaceholder: "Cari mana-mana wain di seluruh dunia...", addToPortfolio: "+ Tambah ke Portfolio", noWines: "Tiada wain dijumpai." }, { signOut: "Log Keluar" }, { title: "Pemberitahuan", markAllRead: "Tandakan semua sebagai dibaca", noNotifications: "Tiada pemberitahuan lagi." }, { loading: "Memuatkan...", noData: "Tiada data" });
const uk = makeTranslation({ dashboard: "Панель", market: "Ринок", news: "Новини", portfolio: "Мій Портфель" }, { title: "Глобальна Платформа для Інвестицій у Вино", searchPlaceholder: "Пошук вин, виробників, регіонів, vintage..." }, { globalMarket: "Світовий ринок", portfolioValue: "Вартість портфеля", invested: "Інвестовано" }, { searchPlaceholder: "Шукати будь-яке вино в світі...", addToPortfolio: "+ Додати до портфеля", noWines: "Вин не знайдено." }, { signOut: "Вийти" }, { title: "Сповіщення", markAllRead: "Позначити все як прочитане", noNotifications: "Сповіщень ще немає." }, { loading: "Завантаження...", noData: "Немає даних" });
const ca = makeTranslation({ dashboard: "Tauler", market: "Mercat", news: "Notícies", portfolio: "La meva Cartera" }, { title: "Plataforma Global d'Inversió en Vi", searchPlaceholder: "Cerca vins, productors, regions, anyades..." }, { globalMarket: "Mercat Global", portfolioValue: "Valor de la Cartera", invested: "Invertit" }, { searchPlaceholder: "Cerca qualsevol vi al món...", addToPortfolio: "+ Afegir a la Cartera", noWines: "No s'han trobat vins." }, { signOut: "Tancar sessió" }, { title: "Notificacions", markAllRead: "Marcar tot com a llegit", noNotifications: "Encara no hi ha notificacions." }, { loading: "Carregant...", noData: "Sense dades" });
const sk = makeTranslation({}, {}, {}, {}, {}, {}, {});
const bg = makeTranslation({ dashboard: "Табло", market: "Пазар", news: "Новини", portfolio: "Моето портфолио" }, { title: "Глобална платформа за инвестиции в вино", searchPlaceholder: "Търси вина, производители, региони, реколти..." }, { globalMarket: "Световен пазар", portfolioValue: "Стойност на портфолиото", invested: "Инвестирано" }, { searchPlaceholder: "Търси всяко вино по света...", addToPortfolio: "+ Добави в портфолио", noWines: "Не са намерени вина." }, { signOut: "Изход" }, { title: "Известия", markAllRead: "Маркирай всички като прочетени", noNotifications: "Все още няма известия." }, { loading: "Зареждане...", noData: "Няма данни" });
const hr = makeTranslation({ dashboard: "Nadzorna ploča", market: "Tržište", news: "Vijesti", portfolio: "Moj Portfelj" }, { title: "Globalna Platforma za Ulaganje u Vino", searchPlaceholder: "Pretraži vina, proizvođače, regije, godišta..." }, { globalMarket: "Globalno tržište", portfolioValue: "Vrijednost portfelja", invested: "Uloženo" }, { searchPlaceholder: "Pretraži bilo koje vino u svijetu...", addToPortfolio: "+ Dodaj u portfelj", noWines: "Nisu pronađena vina." }, { signOut: "Odjavi se" }, { title: "Obavijesti", markAllRead: "Označi sve kao pročitano", noNotifications: "Još nema obavijesti." }, { loading: "Učitavanje...", noData: "Nema podataka" });
const sl = makeTranslation({ dashboard: "Nadzorna plošča", market: "Trg", news: "Novice", portfolio: "Moj Portfelj" }, { title: "Globalna Platforma za Naložbe v Vino", searchPlaceholder: "Išči vina, proizvajalce, regije, letnice..." }, {}, { searchPlaceholder: "Išči katerokoli vino na svetu...", addToPortfolio: "+ Dodaj v portfelj", noWines: "Ni najdenih vin." }, { signOut: "Odjava" }, { title: "Obvestila", markAllRead: "Označi vse kot prebrano", noNotifications: "Še ni obvestil." }, { loading: "Nalaganje...", noData: "Ni podatkov" });
const et = makeTranslation({ dashboard: "Armatuurlaud", market: "Turg", news: "Uudised", portfolio: "Minu Portfell" }, { title: "Globaalne Veiniivesteerimisplatvorm", searchPlaceholder: "Otsi veine, tootjaid, piirkondi, aastakäike..." }, {}, { searchPlaceholder: "Otsi mis tahes veini maailmast...", addToPortfolio: "+ Lisa portfelli", noWines: "Veine ei leitud." }, { signOut: "Logi välja" }, { title: "Teavitused", markAllRead: "Märgi kõik loetuks", noNotifications: "Teavitusi pole." }, { loading: "Laadimine...", noData: "Andmed puuduvad" });
const lv = makeTranslation({ dashboard: "Informācijas panelis", market: "Tirgus", news: "Ziņas", portfolio: "Mans Portfelis" }, { title: "Globālā Vīna Investīciju Platforma", searchPlaceholder: "Meklēt vīnus, ražotājus, reģionus, gadagājumus..." }, {}, { searchPlaceholder: "Meklēt jebkuru vīnu pasaulē...", addToPortfolio: "+ Pievienot portfelim", noWines: "Vīni nav atrasti." }, { signOut: "Izrakstīties" }, { title: "Paziņojumi", markAllRead: "Atzīmēt visu kā izlasītu", noNotifications: "Vēl nav paziņojumu." }, { loading: "Ielādē...", noData: "Nav datu" });
const lt = makeTranslation({ dashboard: "Prietaisų skydelis", market: "Rinka", news: "Naujienos", portfolio: "Mano Portfelis" }, { title: "Pasaulinė Vyno Investicijų Platforma", searchPlaceholder: "Ieškoti vynų, gamintojų, regionų, metų..." }, {}, { searchPlaceholder: "Ieškokite bet kurio vyno pasaulyje...", addToPortfolio: "+ Pridėti prie portfelio", noWines: "Vynų nerasta." }, { signOut: "Atsijungti" }, { title: "Pranešimai", markAllRead: "Pažymėti viską kaip perskaityta", noNotifications: "Pranešimų dar nėra." }, { loading: "Kraunama...", noData: "Duomenų nėra" });
const sr = makeTranslation({ dashboard: "Контролна табла", market: "Тржиште", news: "Вести", portfolio: "Мој Портфолио" }, { title: "Глобална платформа за инвестиције у вино", searchPlaceholder: "Претражи вина, произвођаче, регије, vintage..." }, {}, { searchPlaceholder: "Тражи вина широм света...", addToPortfolio: "+ Додај у портфолио", noWines: "Нису пронађена вина." }, { signOut: "Одјавити се" }, { title: "Обавештења", markAllRead: "Означи све као прочитано", noNotifications: "Још нема обавештења." }, { loading: "Учитавање...", noData: "Нема података" });
const mk = makeTranslation({ dashboard: "Контролна табла", market: "Пазар", news: "Вести", portfolio: "Мое Портфолио" }, { title: "Глобална платформа за инвестиции во вино", searchPlaceholder: "Пребарај вина, производители, региони..." }, {}, { searchPlaceholder: "Пребарај кое и да е вино во светот...", addToPortfolio: "+ Додај во портфолио", noWines: "Нема пронајдени вина." }, { signOut: "Одјави се" }, { title: "Известувања", markAllRead: "Означи сите како прочитани", noNotifications: "Нема известувања." }, { loading: "Вчитување...", noData: "Нема податоци" });
const sq = makeTranslation({ dashboard: "Paneli", market: "Tregu", news: "Lajme", portfolio: "Portofoli im" }, { title: "Platforma Globale e Investimit në Verë", searchPlaceholder: "Kërko verëra, prodhues, rajone, vitage..." }, {}, { searchPlaceholder: "Kërko çdo verë në botë...", addToPortfolio: "+ Shto në portfolio", noWines: "Nuk u gjetën verëra." }, { signOut: "Dil" }, { title: "Njoftime", markAllRead: "Shëno të gjitha si të lexuara", noNotifications: "Nuk ka njoftime akoma." }, { loading: "Duke ngarkuar...", noData: "Nuk ka të dhëna" });

const SUPPORTED_LANGS = ["it","en","fr","de","es","pt","zh","ja","ko","ar","ru","nl","sv","no","da","fi","pl","cs","hu","ro","el","tr","he","hi","th","vi","id","ms","uk","ca","sk","bg","hr","sl","et","lv","lt","sr","mk","sq"];
const RTL_LANGS = ["ar","he"];

const resources = {
  it: { translation: it },
  en: { translation: en },
  fr: { translation: fr },
  de: { translation: de },
  es: { translation: es },
  pt: { translation: pt },
  zh: { translation: zh },
  ja: { translation: ja },
  ko: { translation: ko },
  ar: { translation: ar },
  ru: { translation: ru },
  nl: { translation: nl },
  sv: { translation: sv },
  no: { translation: no },
  da: { translation: da },
  fi: { translation: fi },
  pl: { translation: pl },
  cs: { translation: cs },
  hu: { translation: hu },
  ro: { translation: ro },
  el: { translation: el },
  tr: { translation: tr },
  he: { translation: he },
  hi: { translation: hi },
  th: { translation: th },
  vi: { translation: vi },
  id: { translation: id },
  ms: { translation: ms },
  uk: { translation: uk },
  ca: { translation: ca },
  sk: { translation: sk },
  bg: { translation: bg },
  hr: { translation: hr },
  sl: { translation: sl },
  et: { translation: et },
  lv: { translation: lv },
  lt: { translation: lt },
  sr: { translation: sr },
  mk: { translation: mk },
  sq: { translation: sq },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGS,
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "vino_lang",
    },
    interpolation: { escapeValue: false },
  });

// Apply RTL for Arabic and Hebrew
const currentLang = i18n.language?.slice(0, 2);
if (RTL_LANGS.includes(currentLang)) {
  document.documentElement.dir = "rtl";
  document.documentElement.lang = currentLang;
} else {
  document.documentElement.dir = "ltr";
  document.documentElement.lang = currentLang || "en";
}

i18n.on("languageChanged", (lng) => {
  const code = lng?.slice(0, 2);
  document.documentElement.dir = RTL_LANGS.includes(code) ? "rtl" : "ltr";
  document.documentElement.lang = code || "en";
  localStorage.setItem("vino_lang", lng);
});

export default i18n;
export { SUPPORTED_LANGS, RTL_LANGS };
