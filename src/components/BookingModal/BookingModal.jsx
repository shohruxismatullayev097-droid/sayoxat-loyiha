import { useState } from 'react';
import styles from './BookingModal.module.css';

export function BookingModal({ isOpen, onClose, countryName = "O'zbekiston", initialCity = "Samarqand", language = 'uz' }) {
    const labels = {
        uz: { badge: 'VIP Sayohat', title: 'bo‘ylab sayohatni rejalashtiring', desc: 'Tarixiy obidalar, qadimiy shaharlar va baland tog‘lar uzra unutilmas sayohat', name: 'Ism va familiyangiz', phone: 'Telefon raqamingiz', city: 'Asosiy manzil', travelers: 'Sayohatchilar', submit: 'Sayohatni bron qilish', success: 'Sayohat muvaffaqiyatli band qilindi!', close: 'Tushunarli, rahmat!', invalid: 'Iltimos, ismingiz va telefon raqamingizni kiriting.', confirm: 'Tez orada operatorimiz siz bilan bog‘lanadi.' },
        ru: { badge: 'VIP путешествие', title: 'спланируйте путешествие', desc: 'Незабываемое путешествие среди памятников, древних городов и высоких гор', name: 'Имя и фамилия', phone: 'Номер телефона', city: 'Основной маршрут', travelers: 'Путешественники', submit: 'Забронировать поездку', success: 'Путешествие успешно забронировано!', close: 'Понятно, спасибо!', invalid: 'Введите имя и номер телефона.', confirm: 'Наш оператор скоро свяжется с вами.' },
        en: { badge: 'VIP Travel', title: 'plan your journey', desc: 'An unforgettable journey through historic landmarks, ancient cities and high mountains', name: 'Full name', phone: 'Phone number', city: 'Main destination', travelers: 'Travellers', submit: 'Book a trip', success: 'Your journey has been booked!', close: 'Got it, thanks!', invalid: 'Please enter your name and phone number.', confirm: 'Our operator will contact you soon.' },
    }[language] || {};
    const [step, setStep] = useState('form'); // 'form' | 'ticket'
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        city: initialCity,
        travelers: '2 kishi',
        date: '2026-10-15',
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.phone) {
            alert(labels.invalid);
            return;
        }
        setStep('ticket');
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>✕</button>

                {step === 'form' ? (
                    <div>
                        <div className={styles.header}>
                            <span className={styles.badge}>✈️ {labels.badge}</span>
                            <h2>{countryName} — {labels.title}</h2>
                            <p>{labels.desc}</p>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.field}>
                                <label>{labels.name}</label>
                                <input
                                    type="text"
                                    placeholder="Masalan: Azizbek Aliyev"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.field}>
                                <label>{labels.phone}</label>
                                <input
                                    type="tel"
                                    placeholder="+998 90 123 45 67"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.field}>
                                    <label>{labels.city}</label>
                                    <select
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    >
                                        <option value="Samarqand">Samarqand (Registon)</option>
                                        <option value="Buxoro">Buxoro (Minorai Kalon)</option>
                                        <option value="Xiva">Xiva (Ichan Qal'a)</option>
                                        <option value="Toshkent">Toshkent</option>
                                        <option value="Chimyon">Chimyon va Chorvoq</option>
                                    </select>
                                </div>

                                <div className={styles.field}>
                                    <label>{labels.travelers}</label>
                                    <select
                                        value={formData.travelers}
                                        onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                                    >
                                        <option value="1 kishi">1 kishi</option>
                                        <option value="2 kishi">2 kishi (Juftlik)</option>
                                        <option value="Oila (3-5 kishi)">Oila (3-5 kishi)</option>
                                        <option value="Guruh (6+ kishi)">Guruh (6+ kishi)</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className={styles.submitBtn}>
                                {labels.submit}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className={styles.ticketCard}>
                        <div className={styles.ticketSuccess}>
                            <span className={styles.checkIcon}>✓</span>
                            <h3>{labels.success}</h3>
                            <p>{labels.confirm}</p>
                        </div>

                        <div className={styles.boardingPass}>
                            <div className={styles.passHeader}>
                                <span>TRAVEL PASS • SAYOHAT</span>
                                <span className={styles.passCode}>#UZB-2026</span>
                            </div>
                            <div className={styles.passBody}>
                                <div>
                                    <small>Yo'lovchi</small>
                                    <strong>{formData.name}</strong>
                                </div>
                                <div>
                                    <small>Asosiy shahar</small>
                                    <strong>{formData.city}</strong>
                                </div>
                                <div>
                                    <small>Guruh</small>
                                    <strong>{formData.travelers}</strong>
                                </div>
                                <div>
                                    <small>Holati</small>
                                    <span className={styles.confirmedBadge}>Tasdiqlandi</span>
                                </div>
                            </div>
                        </div>

                        <button className={styles.closeDoneBtn} onClick={onClose}>
                            {labels.close}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
