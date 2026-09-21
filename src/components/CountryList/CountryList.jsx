import { countries } from '../../data/countries';
import styles from './CountryList.module.css';

export function CountryList({ activeId, onSelect }) {
    return (
        <aside className={styles.panel}>
            <div className={styles.header}>
                <span className={styles.label}>Davlatlar</span>
                <span className={styles.count}>{countries.length}</span>
            </div>

            <ul className={styles.list}>
                {countries.map((c, i) => (
                    <li key={c.id}>
                        <button
                            className={`${styles.item} ${activeId === c.id ? styles.active : ''}`}
                            onClick={() => onSelect(c)}
                            style={{ '--accent': c.color }}
                        >
                            <span className={styles.flag}>{c.flag}</span>
                            <span className={styles.name}>{c.name.uz}</span>
                            <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
}