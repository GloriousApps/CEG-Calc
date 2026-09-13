import React, { useEffect, useState } from 'react';
import { Browser } from '@capacitor/browser';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    darkMode: boolean;
    toggleTheme: () => void;
    fractionDenominator: number;
    onFractionDenominatorChange: (denominator: number) => void;
    normalDecimalPlaces: number;
    onNormalDecimalPlacesChange: (places: number) => void;
    engineeringDecimalPlaces: number;
    onEngineeringDecimalPlacesChange: (places: number) => void;
    orientation: 'auto' | 'portrait' | 'landscape';
    onOrientationChange: (orientation: 'auto' | 'portrait' | 'landscape') => void;
    onCheckForUpdates: () => Promise<string | null>;
    version: string;
}

type SectionId = 'theme' | 'fraction' | 'decimal' | 'layout' | 'about' | 'thanks' | 'updates';

export const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    darkMode,
    toggleTheme,
    fractionDenominator,
    onFractionDenominatorChange,
    normalDecimalPlaces,
    onNormalDecimalPlacesChange,
    engineeringDecimalPlaces,
    onEngineeringDecimalPlacesChange,
    orientation,
    onOrientationChange,
    onCheckForUpdates,
    version
}) => {
    const [activeSection, setActiveSection] = useState<SectionId | null>(null);
    const [showThanks, setShowThanks] = useState(false);
    const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
    const [updateMessage, setUpdateMessage] = useState('');
    const [availableVersion, setAvailableVersion] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setActiveSection(null);
            setShowThanks(false);
            setUpdateMessage('');
            setAvailableVersion('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleGitHub = async () => {
        await Browser.open({ url: 'https://github.com/GloriousApps/CEG-Calc' });
    };

    const sectionMeta: Array<{ id: SectionId; title: string; description: string; icon: string }> = [
        { id: 'theme', title: 'Tema', description: darkMode ? 'Karanlık mod etkin' : 'Aydınlık mod etkin', icon: '◐' },
        { id: 'fraction', title: 'Kesir Hassasiyeti', description: `Yakın kesir: 1/${fractionDenominator}`, icon: '½' },
        { id: 'decimal', title: 'Ondalık Hane', description: `Normal ${normalDecimalPlaces} · Mühendislik ${engineeringDecimalPlaces}`, icon: '0.0' },
        { id: 'layout', title: 'Görünüm', description: orientation === 'auto' ? 'Otomatik yönlendirme' : orientation === 'portrait' ? 'Dikey görünüm' : 'Yatay görünüm', icon: '▣' },
        { id: 'about', title: 'Hakkında', description: `Sürüm ${version}`, icon: 'i' },
        { id: 'thanks', title: 'Teşekkürler', description: 'Projeye katkı sağlayanlar', icon: '♥' },
        { id: 'updates', title: 'Güncellemeler', description: 'Yeni sürüm denetimi', icon: '↻' }
    ];

    const sectionCard = (section: typeof sectionMeta[number]) => (
        <button
            key={section.id}
            type="button"
            onClick={() => setActiveSection(section.id)}
            className="group flex min-h-[76px] w-full items-center gap-4 rounded-2xl border border-gray-200 bg-gray-100 px-4 py-4 text-left shadow-sm transition-all hover:border-amber-400 hover:shadow-md dark:border-gray-700 dark:bg-[#1C2024] dark:hover:border-amber-500/70"
        >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#252d36] text-lg font-bold text-amber-400 shadow-inner">{section.icon}</span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-200">{section.title}</span>
                <span className="mt-1 block truncate text-xs text-gray-500 dark:text-gray-400">{section.description}</span>
            </span>
            <svg className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 010-1.06L10.92 10 7.21 6.29a.75.75 0 111.06-1.06l4.24 4.24a.75.75 0 010 1.06l-4.24 4.24a.75.75 0 01-1.06 0z" clipRule="evenodd" /></svg>
        </button>
    );

    const subPanel = () => {
        if (!activeSection) return null;
        const meta = sectionMeta.find((section) => section.id === activeSection)!;

        return (
            <div className="absolute inset-x-0 bottom-0 top-[81px] z-20 flex min-h-0 flex-col bg-white dark:bg-[#2C3035]">
                <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-700">
                    <button type="button" onClick={() => setActiveSection(null)} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-xl text-gray-600 transition-colors hover:bg-gray-200 dark:bg-[#1C2024] dark:text-gray-200 dark:hover:bg-[#252d36]" aria-label="Ayarlar listesine dön">‹</button>
                    <div><h3 className="text-base font-bold text-gray-900 dark:text-white">{meta.title}</h3><p className="text-xs text-gray-500 dark:text-gray-400">Seçiminizi yapın</p></div>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-5">
                    {activeSection === 'theme' && <div className="flex min-h-[88px] items-center justify-between rounded-2xl bg-gray-100 p-5 shadow-inner dark:bg-[#1C2024]"><span className="flex items-center gap-3 font-medium text-gray-900 dark:text-gray-200"><span className="text-xl text-amber-400">{darkMode ? '☾' : '☀'}</span>{darkMode ? 'Karanlık Mod' : 'Aydınlık Mod'}</span><button type="button" onClick={toggleTheme} className={`h-9 w-16 rounded-full p-1 transition-colors ${darkMode ? 'bg-primary' : 'bg-gray-300'}`} aria-label="Tema değiştir"><span className={`block h-7 w-7 rounded-full bg-white shadow-md transition-transform ${darkMode ? 'translate-x-7' : ''}`} /></button></div>}

                    {activeSection === 'fraction' && <div><p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Ölçü sonuçlarını seçilen en yakın kesre yuvarlar.</p><div className="grid grid-cols-3 gap-3">{[2, 4, 8, 16, 32, 64].map((denominator) => { const selected = fractionDenominator === denominator; return <button key={denominator} type="button" onClick={() => onFractionDenominatorChange(denominator)} className={`min-h-[56px] rounded-2xl border font-mono text-sm font-bold shadow-sm transition-all ${selected ? 'border-amber-500 bg-amber-500 text-white shadow-md' : 'border-gray-200 bg-gray-100 text-gray-700 hover:border-amber-300 dark:border-gray-700 dark:bg-[#1C2024] dark:text-gray-200'}`} aria-pressed={selected}>1/{denominator}</button>; })}</div></div>}

                    {activeSection === 'decimal' && <div className="space-y-4"><p className="text-sm text-gray-500 dark:text-gray-400">Normal ve mühendislik sonuçlarında noktadan sonra gösterilecek hane sayısı.</p>{[['Normal hesap', normalDecimalPlaces, onNormalDecimalPlacesChange], ['Mühendislik', engineeringDecimalPlaces, onEngineeringDecimalPlacesChange]].map(([label, value, onChange]) => <div key={label as string} className="space-y-3 rounded-2xl bg-gray-100 p-4 shadow-inner dark:bg-[#1C2024]"><span className="text-sm font-semibold text-gray-700 dark:text-gray-200">{label as string}</span><div className="grid grid-cols-6 gap-2">{[1, 2, 3, 4, 5, 6].map((places) => <button key={places} type="button" onClick={() => (onChange as (places: number) => void)(places)} className={`h-10 rounded-xl text-xs font-bold shadow-sm transition-colors ${(value as number) === places ? 'bg-amber-500 text-white' : 'bg-white text-gray-700 dark:bg-[#252c34] dark:text-gray-200'}`}>{places}</button>)}</div></div>)}</div>}

                    {activeSection === 'layout' && <div><p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Uygulama yönünü seçin.</p><div className="grid grid-cols-1 gap-3">{([['auto', 'Otomatik'], ['portrait', 'Dikey'], ['landscape', 'Yatay']] as const).map(([value, label]) => <button key={value} type="button" onClick={() => onOrientationChange(value)} className={`min-h-[60px] rounded-2xl border px-4 text-left text-sm font-bold shadow-sm transition-all ${orientation === value ? 'border-amber-500 bg-amber-500 text-white shadow-md' : 'border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-700 dark:bg-[#1C2024] dark:text-gray-200'}`}><span className="flex items-center justify-between">{label}<span>{orientation === value ? '✓' : '›'}</span></span></button>)}</div></div>}

                    {activeSection === 'about' && <div className="space-y-3 rounded-2xl bg-gray-100 p-5 shadow-inner dark:bg-[#1C2024]"><div className="flex min-h-[48px] items-center justify-between text-sm"><span className="text-gray-600 dark:text-gray-400">Sürüm</span><span className="font-mono font-semibold text-primary">{version}</span></div><button type="button" onClick={handleGitHub} className="flex min-h-[56px] w-full items-center justify-between border-t border-gray-200 pt-3 text-sm dark:border-gray-700"><span className="text-gray-600 dark:text-gray-400">GitHub</span><span className="flex items-center gap-1 font-medium text-blue-500">GloriousApps/CEG-Calc<svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10v-4M14 4h6m0 0v6m0-6L10 14" /></svg></span></button></div>}

                    {activeSection === 'thanks' && <div className="space-y-4"><button type="button" onClick={() => setShowThanks(!showThanks)} className="min-h-[60px] w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 font-bold text-white shadow-lg transition-transform active:scale-[.98]"><span className="mr-2 text-xl">🙏</span>{showThanks ? 'Teşekkürleri gizle' : 'Teşekkürleri göster'}</button>{showThanks && <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-5 dark:border-amber-800 dark:from-amber-900/20 dark:to-orange-900/20"><p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300"><strong className="text-amber-600 dark:text-amber-400">CEG Türkiye</strong> ofisine teşekkürler.</p><p className="mt-3 text-sm leading-relaxed text-gray-700 dark:text-gray-300">Özellikle test aşamasındaki desteği için <strong className="text-orange-600 dark:text-orange-400">Hasan Hüseyin URAL</strong>'a teşekkürler! 🎉</p></div>}</div>}

                    {activeSection === 'updates' && <div className="space-y-4"><p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">Yeni uygulama sürümü olup olmadığını şimdi kontrol edin.</p><button type="button" disabled={isCheckingUpdates} onClick={async () => { setIsCheckingUpdates(true); setUpdateMessage('Kontrol ediliyor…'); try { const found = await onCheckForUpdates(); setAvailableVersion(found || ''); setUpdateMessage(found ? `${found} Sürümünü İndir ve Güncelle 🌐` : 'Uygulamanız Güncel ✅'); } catch { setAvailableVersion(''); setUpdateMessage('Güncelleme kontrolü başarısız oldu.'); } finally { setIsCheckingUpdates(false); } }} className="min-h-[60px] w-full rounded-2xl bg-[#0b3aa5] px-4 font-bold text-white shadow-lg transition-colors hover:bg-[#1748bd] disabled:cursor-wait disabled:opacity-70"><span className="mr-2 text-xl">↻</span>{isCheckingUpdates ? 'Kontrol ediliyor…' : 'Güncellemeleri denetle'}</button>{updateMessage && <div className={`rounded-2xl border p-4 text-center text-sm font-semibold ${availableVersion ? 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200' : 'border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200'}`}>{updateMessage}</div>}</div>}
                </div>
            </div>
        );
    };

    return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"><div className="relative flex h-[min(760px,90dvh)] max-h-[90dvh] w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-2xl dark:border-gray-700 dark:bg-[#2C3035]"><div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-5 dark:border-gray-700 dark:bg-[#25282C]"><h2 className="text-xl font-bold tracking-wide text-gray-900 dark:text-white">⚙️ Ayarlar</h2><button type="button" onClick={onClose} className="rounded-full bg-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600" aria-label="Ayarları kapat"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button></div><div className="min-h-0 flex-1 overflow-y-auto p-5"><p className="mb-4 px-1 text-xs text-gray-500 dark:text-gray-400">Bir ayar kartı seçerek seçenekleri ayrı pencerede açın.</p><div className="space-y-3">{sectionMeta.map(sectionCard)}</div></div>{subPanel()}</div></div>;
};
