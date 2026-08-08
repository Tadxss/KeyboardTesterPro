import { useState } from 'react';
import BuyMeACoffee from './BuyMeACoffee';
import CollabCta from './CollabCta';
import ContactModal from './ContactModal';
import ControlPanel from './ControlPanel';
import Footer from './Footer';
import Header from './Header';
import Instructions from './Instructions';
import KeyHistoryPanel from './KeyHistoryPanel';
import KeyStatistics from './KeyStatistics';
import VirtualKeyboard from './VirtualKeyboard';
import { useKeyboardTester } from '../hooks/useKeyboardTester';

const KeyboardTester = () => {
  const [showContact, setShowContact] = useState(false);
  const tester = useKeyboardTester(!showContact);
  const { currentMode } = tester;

  const showStatsAndHistory =
    currentMode.showStats &&
    currentMode.showHistory &&
    (tester.isRecording || tester.keyHistory.length > 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <Header description={currentMode.description} isMac={tester.isMac} />

      <main className="max-w-5xl mx-auto px-6 py-5 space-y-4">
        <ControlPanel
          testModes={tester.testModes}
          testMode={tester.testMode}
          currentMode={currentMode}
          onSelectMode={tester.selectTestMode}
          isRecording={tester.isRecording}
          onStart={tester.startRecording}
          onStop={tester.stopRecording}
          onReset={tester.resetTest}
          onExport={tester.exportResults}
          keyHistoryCount={tester.keyHistory.length}
          showNumpad={tester.showNumpad}
          onToggleNumpad={tester.toggleNumpad}
          elapsedTime={tester.elapsedTime}
          formatTime={tester.formatTime}
        />

        <VirtualKeyboard
          keyboardLayouts={tester.keyboardLayouts}
          showNumpad={tester.showNumpad}
          testMode={tester.testMode}
          getKeyDisplay={tester.getKeyDisplay}
          getKeyClassName={tester.getKeyClassName}
          getKeyWidth={tester.getKeyWidth}
        />

        {showStatsAndHistory && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <KeyStatistics keyStats={tester.keyStats} getKeyDisplay={tester.getKeyDisplay} />
            <KeyHistoryPanel
              keyHistory={tester.keyHistory}
              settings={tester.settings}
              getKeyDisplay={tester.getKeyDisplay}
            />
          </div>
        )}

        <Instructions currentMode={currentMode} isMac={tester.isMac} />

        <CollabCta onContactClick={() => setShowContact(true)} />

        <BuyMeACoffee />
      </main>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />

      <Footer isMac={tester.isMac} />
    </div>
  );
};

export default KeyboardTester;
