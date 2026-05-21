import { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';
import {
  Settings, Globe, Accessibility, MessageSquare, X,
  Sun, Moon, Type, Send, Check
} from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
];

const SettingsButton = () => {
  const { theme, setTheme, textSize, setTextSize, language, setLanguage, t } = useSettings();
  
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const [feedback, setFeedback] = useState({ improve: '', remove: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
    const lang = languages.find(l => l.code === langCode);
    toast.success(`Language: ${lang.label}`);
    setActivePanel(null);
    setIsOpen(false);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.improve.trim() && !feedback.remove.trim()) {
      toast.error('Please write something');
      return;
    }
    setSubmitting(true);
    
    const allFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
    allFeedback.push({ ...feedback, timestamp: new Date().toISOString() });
    localStorage.setItem('feedback', JSON.stringify(allFeedback));
    
    setTimeout(() => {
      toast.success(t('thankYou'));
      setFeedback({ improve: '', remove: '' });
      setActivePanel(null);
      setSubmitting(false);
    }, 800);
  };

  const closePanel = () => setActivePanel(null);

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
        {isOpen && (
          <>
            <button onClick={() => setActivePanel('translate')}
              className="flex items-center space-x-2 bg-white dark:bg-gray-900 hover:bg-orange-500 hover:text-white text-gray-800 dark:text-white px-4 py-3 rounded-full shadow-xl shadow-orange-500/20 transition-all hover:scale-105 border-2 border-orange-100 dark:border-orange-500/30">
              <Globe className="h-5 w-5" />
              <span className="hidden sm:inline font-semibold text-sm">{t('translate')}</span>
            </button>

            <button onClick={() => setActivePanel('accessibility')}
              className="flex items-center space-x-2 bg-white dark:bg-gray-900 hover:bg-orange-500 hover:text-white text-gray-800 dark:text-white px-4 py-3 rounded-full shadow-xl shadow-orange-500/20 transition-all hover:scale-105 border-2 border-orange-100 dark:border-orange-500/30">
              <Accessibility className="h-5 w-5" />
              <span className="hidden sm:inline font-semibold text-sm">{t('accessibility')}</span>
            </button>

            <button onClick={() => setActivePanel('feedback')}
              className="flex items-center space-x-2 bg-white dark:bg-gray-900 hover:bg-orange-500 hover:text-white text-gray-800 dark:text-white px-4 py-3 rounded-full shadow-xl shadow-orange-500/20 transition-all hover:scale-105 border-2 border-orange-100 dark:border-orange-500/30">
              <MessageSquare className="h-5 w-5" />
              <span className="hidden sm:inline font-semibold text-sm">{t('feedback')}</span>
            </button>
          </>
        )}

        <button onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center transition-all hover:scale-110 ${
            isOpen 
              ? 'bg-gradient-to-br from-red-500 to-red-600 text-white rotate-90' 
              : 'bg-gradient-to-br from-orange-500 to-red-500 text-white'
          }`}>
          {isOpen ? <X className="h-6 w-6" /> : <Settings className="h-6 w-6 animate-spin-slow" />}
        </button>
      </div>

      {/* TRANSLATE PANEL */}
      {activePanel === 'translate' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closePanel}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-orange-200 dark:border-orange-500/30" onClick={(e) => e.stopPropagation()}>
            {/* Orange Gradient Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Globe className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t('changeLanguage')}</h2>
              </div>
              <button onClick={closePanel} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-2 bg-orange-50/30 dark:bg-gray-900">
              {languages.map(lang => (
                <button key={lang.code} onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                    language === lang.code
                      ? 'bg-gradient-to-r from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-2 border-orange-500 shadow-md'
                      : 'bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-gray-700 border-2 border-orange-100 dark:border-gray-700 hover:border-orange-300'
                  }`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{lang.flag}</span>
                    <span className="font-semibold text-gray-800 dark:text-white">{lang.label}</span>
                  </div>
                  {language === lang.code && (
                    <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACCESSIBILITY PANEL - NEW ORANGE THEME */}
      {activePanel === 'accessibility' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closePanel}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-orange-200 dark:border-orange-500/30" onClick={(e) => e.stopPropagation()}>
            {/* Orange Gradient Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Accessibility className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t('accessibility')}</h2>
              </div>
              <button onClick={closePanel} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 bg-orange-50/30 dark:bg-gray-900">
              {/* THEME */}
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-orange-500" />
                  <span>{t('theme')}</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setTheme('light')}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
                      theme === 'light' 
                        ? 'border-orange-500 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 shadow-lg shadow-orange-500/20' 
                        : 'border-orange-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300'
                    }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      theme === 'light' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-yellow-100 dark:bg-yellow-900/30'
                    }`}>
                      <Sun className={`h-7 w-7 ${theme === 'light' ? 'text-white' : 'text-yellow-500'}`} />
                    </div>
                    <span className="font-bold text-gray-800 dark:text-white">{t('lightTheme')}</span>
                  </button>
                  
                  <button onClick={() => setTheme('dark')}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center space-y-2 ${
                      theme === 'dark' 
                        ? 'border-orange-500 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 shadow-lg shadow-orange-500/20' 
                        : 'border-orange-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300'
                    }`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-indigo-100 dark:bg-indigo-900/30'
                    }`}>
                      <Moon className={`h-7 w-7 ${theme === 'dark' ? 'text-white' : 'text-indigo-500'}`} />
                    </div>
                    <span className="font-bold text-gray-800 dark:text-white">{t('darkTheme')}</span>
                  </button>
                </div>
              </div>

              {/* TEXT SIZE */}
              <div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center space-x-2">
                  <Type className="h-5 w-5 text-orange-500" />
                  <span>{t('textSize')}</span>
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'small', label: t('small'), size: 'text-xs' },
                    { id: 'normal', label: t('normal'), size: 'text-sm' },
                    { id: 'large', label: t('large'), size: 'text-base' },
                    { id: 'xlarge', label: t('extraLarge'), size: 'text-lg' }
                  ].map(option => (
                    <button key={option.id} onClick={() => setTextSize(option.id)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        textSize === option.id 
                          ? 'border-orange-500 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 shadow-md shadow-orange-500/20' 
                          : 'border-orange-100 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-300'
                      }`}>
                      <p className={`font-bold ${textSize === option.id ? 'text-orange-500' : 'text-gray-800 dark:text-white'} ${option.size}`}>A</p>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK PANEL */}
      {activePanel === 'feedback' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closePanel}>
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-orange-200 dark:border-orange-500/30" onClick={(e) => e.stopPropagation()}>
            {/* Orange Gradient Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">{t('sendFeedback')}</h2>
              </div>
              <button onClick={closePanel} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleFeedbackSubmit} className="p-6 space-y-4 bg-orange-50/30 dark:bg-gray-900">
              <div>
                <label className="block font-bold text-gray-800 dark:text-white mb-2">
                   {t('whatToImprove')}
                </label>
                <textarea value={feedback.improve}
                  onChange={(e) => setFeedback({ ...feedback, improve: e.target.value })}
                  placeholder={t('yourSuggestions')} rows="3"
                  className="w-full p-3 bg-white dark:bg-gray-800 dark:text-white border-2 border-orange-100 dark:border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 resize-none" />
              </div>
              
              <div>
                <label className="block font-bold text-gray-800 dark:text-white mb-2">
                  {t('whatToRemove')}
                </label>
                <textarea value={feedback.remove}
                  onChange={(e) => setFeedback({ ...feedback, remove: e.target.value })}
                  placeholder={t('yourSuggestions')} rows="3"
                  className="w-full p-3 bg-white dark:bg-gray-800 dark:text-white border-2 border-orange-100 dark:border-gray-700 rounded-xl focus:outline-none focus:border-orange-500 resize-none" />
              </div>

              <button type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center space-x-2 disabled:opacity-50">
                {submitting ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>{t('submit')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsButton;