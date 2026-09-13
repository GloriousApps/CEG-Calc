
import React, { useState, useEffect, useReducer, useCallback } from 'react';
import Display from './components/Display';
import CalculatorButton from './components/CalculatorButton';
import { ButtonType, Operator } from './types';
import { formatConstructionUnit, builderToDisplay } from './utils/formatter';
import { calculatorReducer, initialCalculatorState, CalculatorActionType } from './utils/calculatorReducer';
import { checkForUpdate, downloadUpdate, installAPK, GithubRelease } from './utils/updateChecker';
import { UpdateModal } from './components/UpdateModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showTape, setShowTape] = useState(false);
  const [fractionDenominator, setFractionDenominator] = useState<number>(() => {
    const stored = Number(window.localStorage.getItem('ceg-fraction-denominator'));
    return [2, 4, 8, 16, 32, 64].includes(stored) ? stored : 64;
  });
  const [normalDecimalPlaces, setNormalDecimalPlaces] = useState<number>(() => {
    const stored = Number(window.localStorage.getItem('ceg-normal-decimals'));
    return stored >= 1 && stored <= 6 ? stored : 6;
  });
  const [engineeringDecimalPlaces, setEngineeringDecimalPlaces] = useState<number>(() => {
    const stored = Number(window.localStorage.getItem('ceg-engineering-decimals'));
    return stored >= 1 && stored <= 6 ? stored : 5;
  });
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>(() => {
    const stored = window.localStorage.getItem('ceg-orientation');
    return stored === 'portrait' || stored === 'landscape' ? stored : 'auto';
  });
  const [wideViewport, setWideViewport] = useState(() => window.matchMedia('(min-width: 700px)').matches);
  const [state, dispatch] = useReducer(calculatorReducer, initialCalculatorState);
  const isLandscape = orientation === 'landscape' || (orientation === 'auto' && wideViewport);

  // Update State
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateRelease, setUpdateRelease] = useState<GithubRelease | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  // Check for updates on mount
  useEffect(() => {
    const check = async () => {
      const release = await checkForUpdate();
      if (release) {
        setUpdateRelease(release);
        setShowUpdateModal(true);
      }
    };
    check();
  }, []);

  const handleUpdateConfirm = async () => {
    if (!updateRelease) return;

    // Find APK asset
    const apkAsset = updateRelease.assets.find(a => a.name.endsWith('.apk'));

    if (!apkAsset) {
      // No APK found, open release page in browser
      const { Browser } = await import('@capacitor/browser');
      await Browser.open({ url: updateRelease.html_url });
      setShowUpdateModal(false);
      return;
    }

    setIsDownloading(true);
    try {
      const filePath = await downloadUpdate(updateRelease, (progress) => {
        setDownloadProgress(progress);
      });
      setIsDownloading(false);
      await installAPK(filePath);
    } catch (error) {
      console.error("In-app download failed, opening browser:", error);
      setIsDownloading(false);

      // Fallback: Open APK download link in system browser
      try {
        const { Browser } = await import('@capacitor/browser');
        await Browser.open({ url: apkAsset.browser_download_url });
        setShowUpdateModal(false);
      } catch (browserError) {
        console.error("Browser open also failed:", browserError);
        alert("İndirme başarısız oldu. Lütfen GitHub'dan manuel olarak indirin.");
      }
    }
  };

  const handleUpdateCancel = () => {
    setShowUpdateModal(false);
  };

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleFractionDenominatorChange = useCallback((denominator: number) => {
    setFractionDenominator(denominator);
    window.localStorage.setItem('ceg-fraction-denominator', String(denominator));
  }, []);

  const handleNormalDecimalPlacesChange = useCallback((places: number) => {
    setNormalDecimalPlaces(places);
    window.localStorage.setItem('ceg-normal-decimals', String(places));
  }, []);

  const handleEngineeringDecimalPlacesChange = useCallback((places: number) => {
    setEngineeringDecimalPlaces(places);
    window.localStorage.setItem('ceg-engineering-decimals', String(places));
  }, []);

  const handleOrientationChange = useCallback((value: 'auto' | 'portrait' | 'landscape') => {
    setOrientation(value);
    window.localStorage.setItem('ceg-orientation', value);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 700px)');
    const update = () => setWideViewport(media.matches);
    update();
    media.addEventListener?.('change', update);
    window.addEventListener('resize', update);
    return () => {
      media.removeEventListener?.('change', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  // Handlers wrapped in useCallback for stable references
  const handleNumber = useCallback((num: string) => {
    dispatch({ type: CalculatorActionType.NUMBER, payload: num });
  }, []);

  const handleDecimal = useCallback(() => {
    dispatch({ type: CalculatorActionType.DECIMAL });
  }, []);

  const handleConv = useCallback(() => {
    dispatch({ type: CalculatorActionType.CONVERSION });
  }, []);

  const handleUnit = useCallback((unit: 'feet' | 'inch' | 'yard') => {
    dispatch({ type: CalculatorActionType.UNIT, payload: unit });
  }, []);

  const handleFractionSlash = useCallback(() => {
    dispatch({ type: CalculatorActionType.FRACTION });
  }, []);

  const handleBackspace = useCallback(() => {
    dispatch({ type: CalculatorActionType.BACKSPACE });
  }, []);

  const handleOperator = useCallback((op: Operator) => {
    // Only used for visual buttons, keydown handles mapping separately? 
    // Actually keydown should use the same dispatch.
    dispatch({ type: CalculatorActionType.OPERATOR, payload: op });
  }, []);

  const handleEqual = useCallback(() => {
    dispatch({ type: CalculatorActionType.EQUAL });
  }, []);

  const handleClear = useCallback(() => {
    dispatch({ type: CalculatorActionType.CLEAR });
  }, []);

  const handleMemoryStore = useCallback(() => {
    dispatch({ type: CalculatorActionType.MEMORY_STORE });
  }, []);

  const handleMemoryRecall = useCallback(() => {
    dispatch({ type: CalculatorActionType.MEMORY_RECALL });
  }, []);

  const handleMemoryAdd = useCallback(() => {
    dispatch({ type: CalculatorActionType.MEMORY_ADD });
  }, []);

  const handleMemorySubtract = useCallback(() => {
    dispatch({ type: CalculatorActionType.MEMORY_SUBTRACT });
  }, []);

  const handleMemoryClear = useCallback(() => {
    dispatch({ type: CalculatorActionType.MEMORY_CLEAR });
  }, []);

  const handleDimension = useCallback((dimension: 1 | 2 | 3) => {
    dispatch({ type: CalculatorActionType.SET_DIMENSION, payload: dimension });
  }, []);

  // Keyboard Event Listener
  // Optimized: depends ONLY on dispatch, which is stable. 
  // Should NOT re-attach on every state change.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const code = e.code;
      if (/^[0-9]$/.test(key)) { e.preventDefault(); dispatch({ type: CalculatorActionType.NUMBER, payload: key }); return; }
      if (key === '.' || key === ',') { e.preventDefault(); dispatch({ type: CalculatorActionType.DECIMAL }); return; }
      if (key === '+') { e.preventDefault(); dispatch({ type: CalculatorActionType.OPERATOR, payload: Operator.Add }); return; }
      if (key === '-') { e.preventDefault(); dispatch({ type: CalculatorActionType.OPERATOR, payload: Operator.Subtract }); return; }
      if (key === '*' || key.toLowerCase() === 'x') { e.preventDefault(); dispatch({ type: CalculatorActionType.OPERATOR, payload: Operator.Multiply }); return; }
      if (code === 'NumpadDivide') { e.preventDefault(); dispatch({ type: CalculatorActionType.OPERATOR, payload: Operator.Divide }); return; }
      if (key === '/') { e.preventDefault(); dispatch({ type: CalculatorActionType.FRACTION }); return; }
      if (key === 'Enter' || key === '=') { e.preventDefault(); dispatch({ type: CalculatorActionType.EQUAL }); return; }
      if (key === 'Backspace') { e.preventDefault(); dispatch({ type: CalculatorActionType.BACKSPACE }); return; }
      if (key === 'Escape' || key === 'Delete') { e.preventDefault(); dispatch({ type: CalculatorActionType.CLEAR }); return; }
      if (key.toLowerCase() === 'f') { e.preventDefault(); dispatch({ type: CalculatorActionType.UNIT, payload: 'feet' }); return; }
      if (key.toLowerCase() === 'i') { e.preventDefault(); dispatch({ type: CalculatorActionType.UNIT, payload: 'inch' }); return; }
      if (key.toLowerCase() === 'y') { e.preventDefault(); dispatch({ type: CalculatorActionType.UNIT, payload: 'yard' }); return; }
      if (key.toLowerCase() === 'c') { e.preventDefault(); dispatch({ type: CalculatorActionType.CONVERSION }); return; }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty dependency array as dispatch is stable

  const isBuilding = state.builder.feet !== null || state.builder.inch !== null || state.builder.yard !== null || state.builder.numerator !== null || state.inputBuffer !== '';
  const displayData = isBuilding
    ? builderToDisplay(state.builder, state.inputBuffer, state.preferredUnit)
    : formatConstructionUnit(
      state.displayValue,
      state.convertedUnit,
      state.convertedDimension,
      state.activeDimension,
      state.preferredUnit,
      state.isUnitless,
      fractionDenominator,
      normalDecimalPlaces,
      engineeringDecimalPlaces
    );

  return (
    <div className="min-h-[100dvh] w-full bg-[#0d141a] font-display text-white flex items-center justify-center p-3 sm:p-6 select-none">
      <div className={`w-full bg-[#171e24] rounded-[30px] shadow-2xl overflow-hidden flex ${isLandscape ? 'max-w-[1100px] h-[min(560px,calc(100dvh-32px))] flex-row' : 'max-w-[492px] h-[calc(100dvh-24px)] sm:h-[850px] sm:max-h-[90dvh] flex-col'}`}>
        <section className={`${isLandscape ? 'w-[52%] h-full' : 'flex-[4.5]'} min-h-0 px-6 pt-5 pb-6 flex flex-col`}>
          <div className="relative h-12 mb-3 shrink-0">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div onDoubleClick={() => setShowTape(true)} className="h-12 w-64 rounded-full bg-[#11306e] px-3 flex items-center justify-center shadow-inner" title="Tape için iki kez dokunun">
                <img src="/ceg-calc-logo.png" alt="CEG Calc" className="h-10 w-52 object-contain" />
              </div>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              aria-label="Ayarları aç"
              className="absolute right-0 top-0 h-11 w-11 rounded-lg border border-[#2a3b4e] bg-[#252d36] text-2xl leading-none text-[#c0cad7] active:translate-y-px"
            >
              ⚙
            </button>
          </div>
          <div className="flex-1 min-h-0 flex flex-col justify-end">
          <Display value={displayData} onBackspace={handleBackspace} memoryActive={state.memoryHasValue} />
          </div>
        </section>

        <section className={`${isLandscape ? 'w-[48%] h-full border-l border-[#1b3446] px-3 py-4 justify-center' : 'flex-[5.5] border-t border-[#1b3446] px-3 pb-4 pt-2'} min-h-0 bg-[#151b20] flex flex-col`}>
          <div
            className={`grid grid-cols-5 grid-rows-5 gap-2 min-h-0 ${isLandscape ? 'aspect-square h-auto self-center' : 'w-full h-[88%]'}`}
            style={isLandscape ? { width: 'min(100%, calc(100dvh - 80px))' } : undefined}
          >
            <CalculatorButton label="Yds" type={ButtonType.Primary} onClick={() => handleUnit('yard')} />
            <CalculatorButton label="Feet" type={ButtonType.Primary} onClick={() => handleUnit('feet')} />
            <CalculatorButton label="Inch" type={ButtonType.Primary} onClick={() => handleUnit('inch')} />
            <CalculatorButton label="/" type={ButtonType.Primary} onClick={handleFractionSlash} />
            <CalculatorButton label="Clear" type={ButtonType.Primary} onClick={handleClear} />

            <CalculatorButton label="Conv" type={ButtonType.Accent} onClick={handleConv} />
            <CalculatorButton label="7" onClick={() => handleNumber('7')} />
            <CalculatorButton label="8" onClick={() => handleNumber('8')} />
            <CalculatorButton label="9" onClick={() => handleNumber('9')} />
            <CalculatorButton label="÷" type={ButtonType.Secondary} onClick={() => handleOperator(Operator.Divide)} />

            <CalculatorButton label="Store" type={ButtonType.Memory} onClick={handleMemoryStore} />
            <CalculatorButton label="4" onClick={() => handleNumber('4')} />
            <CalculatorButton label="5" onClick={() => handleNumber('5')} />
            <CalculatorButton label="6" onClick={() => handleNumber('6')} />
            <CalculatorButton label="×" type={ButtonType.Secondary} onClick={() => handleOperator(Operator.Multiply)} />

            <CalculatorButton label="Rcl" type={ButtonType.Memory} onClick={handleMemoryRecall} />
            <CalculatorButton label="1" onClick={() => handleNumber('1')} />
            <CalculatorButton label="2" onClick={() => handleNumber('2')} />
            <CalculatorButton label="3" onClick={() => handleNumber('3')} />
            <CalculatorButton label="−" type={ButtonType.Secondary} onClick={() => handleOperator(Operator.Subtract)} />

            <CalculatorButton label="M+" type={ButtonType.Memory} onClick={handleMemoryAdd} />
            <CalculatorButton label="0" onClick={() => handleNumber('0')} />
            <CalculatorButton label="." onClick={handleDecimal} />
            <CalculatorButton label="=" type={ButtonType.Function} onClick={handleEqual} />
            <CalculatorButton label="+" type={ButtonType.Secondary} onClick={() => handleOperator(Operator.Add)} />
          </div>
        </section>
      </div>
      {showTape && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShowTape(false)}>
          <div className="w-full max-w-sm max-h-[75dvh] overflow-hidden rounded-2xl border border-[#2b3d50] bg-[#202830] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-[#334454] px-5 py-4">
              <h2 className="text-lg font-bold text-white">Tape / Geçmiş</h2>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => dispatch({ type: CalculatorActionType.TAPE_CLEAR })} className="rounded-lg bg-[#394554] px-2.5 py-1.5 text-xs font-bold text-[#d8e0e8]">Temizle</button>
                <button type="button" onClick={() => setShowTape(false)} className="rounded-full bg-[#34465d] px-3 py-1 text-lg text-white">×</button>
              </div>
            </div>
            <div className="max-h-[60dvh] overflow-y-auto p-3">
              {state.tape.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-[#94a2b0]">Henüz kayıt yok. Bir işlem tamamlayın.</p>
              ) : (
                <div className="space-y-2">
                  {[...state.tape].reverse().map((entry, reverseIndex) => {
                    const index = state.tape.length - 1 - reverseIndex;
                    return (
                      <button key={`${entry.expression}-${index}`} type="button" onClick={() => { dispatch({ type: CalculatorActionType.TAPE_RECALL, payload: index }); setShowTape(false); }} className="w-full rounded-xl bg-[#171e24] px-4 py-3 text-left transition-colors hover:bg-[#26333f]">
                        <div className="font-mono text-xs text-[#9aa8b6]">{entry.expression}</div>
                        <div className="mt-1 flex items-center justify-between"><span className="font-mono text-lg text-white">{Number(entry.result.toFixed(6))}</span><span className="text-[10px] font-bold tracking-wider text-[#19ad9b]">{entry.dimension === 3 ? 'CB' : entry.dimension === 2 ? 'SQ' : ''}</span></div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <UpdateModal
        isOpen={showUpdateModal}
        version={updateRelease?.tag_name || ''}
        releaseNotes={updateRelease?.body || ''}
        onConfirm={handleUpdateConfirm}
        onCancel={handleUpdateCancel}
        isDownloading={isDownloading}
        progress={downloadProgress}
      />
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        darkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
        fractionDenominator={fractionDenominator}
        onFractionDenominatorChange={handleFractionDenominatorChange}
        normalDecimalPlaces={normalDecimalPlaces}
        onNormalDecimalPlacesChange={handleNormalDecimalPlacesChange}
        engineeringDecimalPlaces={engineeringDecimalPlaces}
        onEngineeringDecimalPlacesChange={handleEngineeringDecimalPlacesChange}
        orientation={orientation}
        onOrientationChange={handleOrientationChange}
        version="v1.1.1"
      />
    </div>
  );
}
