import {
  ArrowLeft,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  ListTree,
  LogOut,
  PieChart,
  RefreshCw,
  Search,
  Star,
} from 'lucide-react';
import styles from './telegram.module.css';
import { notFound } from 'next/navigation';

const campaigns = [
  { id: '256121', name: 'Runo new groups', channel: 'zrofficial', state: 'active', cpm: '2.03', budget: '60.00', views: '354 680', clicks: '993', actions: '89', ctr: '0.28', cpc: '0.73', cv: '8.96', spent: '720.00', cpa: '8.09' },
  { id: '203314', name: 'Runo channels', channel: 'zrofficial', state: 'stopped', cpm: '2.01', budget: '51.00', views: '194 030', clicks: '524', actions: '45', ctr: '0.27', cpc: '0.74', cv: '8.59', spent: '390.00', cpa: '8.67' },
  { id: '182982', name: 'Mega 6', channel: 'megawheel', state: 'stopped', cpm: '2.01', budget: '90.00', views: '487 562', clicks: '1 560', actions: '143', ctr: '0.32', cpc: '0.63', cv: '9.17', spent: '980.00', cpa: '6.85' },
  { id: '174789', name: 'Mega 7', channel: 'megawheel', state: 'active', cpm: '2.02', budget: '75.00', views: '376 238', clicks: '1 279', actions: '123', ctr: '0.34', cpc: '0.59', cv: '9.62', spent: '760.00', cpa: '6.18' },
  { id: '170534', name: 'Mega 6', channel: 'megawheel', state: 'stopped', cpm: '2.01', budget: '57.00', views: '238 806', clicks: '693', actions: '57', ctr: '0.29', cpc: '0.69', cv: '8.23', spent: '480.00', cpa: '8.42' },
];

const filters = [
  ['draft', 'ЧЕРНОВИК'],
  ['active', 'АКТИВНО', '2'],
  ['holding', 'НА УДЕРЖАНИИ'],
  ['stopped', 'ОСТАНОВЛЕНО', '3'],
  ['moderation', 'НА МОДЕРАЦИИ'],
  ['declined', 'ОТКЛОНЕНО'],
  ['deleted', 'УДАЛЕНО'],
];

const columns = [
  ['id', 'ID'], ['name', 'НАЗВАНИЕ'], ['favorite', 'ИЗБРАННЫЕ'], ['logs', 'LOGS'],
  ['state', 'СТАТУС'], ['cpm', 'CPM €'], ['budget', 'БЮДЖЕТ €'], ['views', 'ПРОСМОТРЫ'],
  ['clicks', 'КЛИКИ'], ['actions', 'ДЕЙСТВИЯ'], ['ctr', 'CTR %'], ['cpc', 'CPC €'],
  ['cv', 'CV %'], ['spent', 'ПОТРАЧЕНО €'], ['cpa', 'CPA €'],
];

function SidebarGroup({ icon: Icon, label }) {
  return (
    <div className={styles.sidebarGroup}>
      <span className={styles.groupLabel}><Icon size={18} strokeWidth={1.5} />{label}</span>
      <ChevronDown size={15} strokeWidth={1.5} />
    </div>
  );
}

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarCrop} aria-hidden="true"><span /><span /></div>
      <div className={styles.pagesLabel}>PAGES</div>
      <nav aria-label="Навигация кабинета">
        <div className={styles.manageTitle}><ListTree size={18} strokeWidth={1.45} /><strong>Управление кабинетом</strong><ChevronDown size={15} /></div>
        <a className={styles.activeLink} href="#"><span>•</span>Объявления</a>
        {['Кампании', 'Автоправила', 'Группы каналов', 'События', 'Мини-приложения', 'AI Студия'].map((label) => (
          <a className={styles.subLink} href="#" key={label}><span>•</span>{label}</a>
        ))}
        <SidebarGroup icon={PieChart} label="Аналитика" />
        <SidebarGroup icon={PieChart} label="Настройки" />
        <SidebarGroup icon={BriefcaseBusiness} label="Финансы" />
      </nav>
      <div className={styles.profile}>
        <div className={styles.avatar}><span /></div>
        <div className={styles.profileText}><div>Vahagn <b>ID:176</b></div><small>gevorgyanvahag45@gmail.com</small></div>
        <LogOut size={17} strokeWidth={1.8} />
      </div>
    </aside>
  );
}

function FilterBar() {
  return (
    <section className={styles.filterPanel} aria-label="Фильтры статуса">
      <div className={styles.croppedActions} aria-hidden="true"><span>СОЗДАТЬ ОБЪЯВЛЕНИЕ</span><i>▦</i><b>Фильтр</b><em /></div>
      <div className={styles.filters}>
        {filters.map(([kind, label, count]) => (
          <button className={`${styles.filter} ${styles[kind]}`} key={kind} type="button">
            <i />{label}{count && <span>{count}</span>}
          </button>
        ))}
        <button className={styles.favoritesFilter} type="button"><Star size={16} fill="currentColor" />ИЗБРАННЫЕ <span>0</span></button>
      </div>
    </section>
  );
}

function Status({ state }) {
  const active = state === 'active';
  const holding = state === 'holding';
  const label = active ? 'Активно' : holding ? 'На удержании' : 'Остановлено';
  const stateClass = active ? styles.statusActive : holding ? styles.statusHolding : '';
  return <span className={`${styles.status} ${stateClass}`}>{label}<ChevronDown size={10} /></span>;
}

function TableRow({ row }) {
  return (
    <div className={styles.tableRow} role="row">
      <div className={styles.selectCell}><span className={styles.checkbox} /></div>
      <div className={styles.idCell}><span>{row.id}</span></div>
      <div className={styles.nameCell}><strong>{row.name}</strong><a href={`https://t.me/${row.channel}`}>t.me/{row.channel}</a></div>
      <div className={styles.favoriteCell}><Star size={18} /></div>
      <div className={styles.logsCell}><span className={styles.logsIcon}>☷</span></div>
      <div className={styles.stateCell}><Status state={row.state} /></div>
      <div className={styles.metricCell}><strong>{row.cpm}</strong><small>↘</small></div>
      <div className={`${styles.metricCell} ${styles.blue}`}>{row.budget}</div>
      <div className={styles.metricCell}>{row.views}</div>
      <div className={styles.metricCell}>{row.clicks}</div>
      <div className={styles.metricCell}>{row.actions}</div>
      <div className={styles.metricCell}>{row.ctr}</div>
      <div className={styles.metricCell}>{row.cpc}</div>
      <div className={styles.metricCell}>{row.cv}</div>
      <div className={styles.metricCell}>{row.spent}</div>
      <div className={styles.metricCell}>{row.cpa}</div>
    </div>
  );
}

function CampaignTable() {
  return (
    <div className={styles.tableCard}>
      <header className={styles.cardToolbar}>
        <div className={styles.workspaceTitle}><ArrowLeft size={19} /><strong>Runo</strong><button type="button" aria-label="Обновить"><RefreshCw size={18} /></button></div>
        <div className={styles.searchTools}>
          <label><Search size={19} /><input type="search" placeholder="Искать" /></label>
          <button type="button">Содержит<ChevronDown size={16} /></button>
        </div>
      </header>
      <div className={styles.scroller}>
        <div className={styles.table} role="table" aria-label="Объявления">
          <div className={`${styles.tableRow} ${styles.tableHead}`} role="row">
            <div className={styles.selectCell}><span className={styles.checkbox} /></div>
            {columns.map(([key, label]) => <div className={styles[`${key}Cell`]} key={key}>{label}</div>)}
          </div>
          {campaigns.map((row) => <TableRow row={row} key={row.id} />)}
          <div className={`${styles.tableRow} ${styles.totalRow}`}>
            <div className={styles.totalBlank} />
            <div className={styles.totalStatus} />
            <div className={styles.metricCell}><strong>2.02</strong></div>
            <div className={styles.metricCell} />
            <div className={styles.metricCell}><strong>1 651 316</strong></div>
            <div className={styles.metricCell}><strong>5 049</strong></div>
            <div className={styles.metricCell}><strong>457</strong></div>
            <div className={styles.metricCell}><strong>0.31</strong></div>
            <div className={styles.metricCell}><strong>0.66</strong></div>
            <div className={styles.metricCell}><strong>9.05</strong></div>
            <div className={styles.metricCell} />
            <div className={styles.metricCell}><strong>7.29</strong></div>
          </div>
        </div>
        <div className={styles.scrollTrack}><span /></div>
      </div>
    </div>
  );
}

export default function TelegramPage() {
  // Preserve the legacy mockup without exposing it on the book website.
  if (process.env.WONDER_LEGACY_DEMOS !== 'true') notFound();
  return (
    <div className={styles.telegramPage} data-telegram-page>
      <Sidebar />
      <main className={styles.content}>
        <FilterBar />
        <CampaignTable />
        <div className={styles.pagination}>
          <button className={styles.current} type="button">50</button>
          <button type="button">100</button><button type="button">200</button><button type="button">500</button>
          <span>Всего 5</span>
        </div>
      </main>
    </div>
  );
}
