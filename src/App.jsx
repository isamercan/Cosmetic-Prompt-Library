import React, { useState, useEffect, useCallback } from 'react';
import { Copy, ChevronDown as ChevronDownIcon, Rocket, Dice5, ChevronUp as ChevronUpIcon } from 'lucide-react';

// Helper function to shuffle an array
const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

// Main App component
const App = () => {
  // State to hold the custom overlay text entered by the user
  const [overlayText, setOverlayText] = useState('');
  // State to hold the selected aspect ratio
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('1:1');
  // State to hold the selected camera lens
  const [selectedCameraLens, setSelectedCameraLens] = useState('85mm');
  // State to hold the selected lighting style
  const [selectedLighting, setSelectedLighting] = useState('DEFAULT_PROMPT_LIGHTING'); 

  // State to trigger re-randomization for "Default (Per Prompt)" options
  const [randomizeKey, setRandomizeKey] = useState(0);

  // States to hold the loaded prompt data from JSON
  const [allPromptsData, setAllPromptsData] = useState(null); // Holds the entire JSON object
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [errorLoadingOptions, setErrorLoadingOptions] = useState(false);

  // Shuffled versions of the default arrays (used for 'Default (Per Prompt)' randomization)
  const [shuffledLightingOptions, setShuffledLightingOptions] = useState([]);
  const [shuffledSceneOptions, setShuffledSceneOptions] = useState([]);
  const [shuffledMoodEmotionOptions, setShuffledMoodEmotionOptions] = useState([]);
  const [shuffledFontStyleOptions, setShuffledFontStyleOptions] = useState([]);
  const [shuffledFontColorOptions, setShuffledFontColorOptions] = useState([]);
  const [shuffledResolutionOptions, setShuffledResolutionOptions] = useState([]);
  const [shuffledFramingOptions, setShuffledFramingOptions] = useState([]);
  const [shuffledOutputStyleOptions, setShuffledOutputStyleOptions] = useState([]);
  
  // Creative prompt names array (will be loaded from JSON and potentially shuffled)
  const [creativePromptNames, setCreativePromptNames] = useState([]);

  // Inside the App component, before the return statement:
  const [expandedPrompts, setExpandedPrompts] = useState({});

  // Effect to load prompt data from JSON
  useEffect(() => {
    const loadPromptData = async () => {
      try {
        setIsLoadingOptions(true);
        setErrorLoadingOptions(false);
        
        // Try to fetch from public directory first
        const response = await fetch('/prompts.json');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validate the data structure
        if (!data || !data.options || !data.creativeNames || !data.prompts) {
          throw new Error('Invalid data structure in prompts.json');
        }
        
        setAllPromptsData(data);
        console.log('Successfully loaded prompt data');
      } catch (error) {
        console.error("Failed to load prompt data:", error);
        setErrorLoadingOptions(true);
        // Show more detailed error message
        alert(`Failed to load prompt data: ${error.message}. Please check if prompts.json exists in the public directory.`);
      } finally {
        setIsLoadingOptions(false);
      }
    };
    loadPromptData();
  }, []);

  // Effect to shuffle arrays when allPromptsData are loaded or randomizeKey changes
  useEffect(() => {
    if (allPromptsData && allPromptsData.options && allPromptsData.creativeNames) {
      // Use options and creativeNames directly from loaded JSON
      setShuffledLightingOptions(shuffleArray([...allPromptsData.options.lighting]));
      setShuffledSceneOptions(shuffleArray([...allPromptsData.options.scenes]));
      setShuffledMoodEmotionOptions(shuffleArray([...allPromptsData.options.moodEmotions]));
      setShuffledFontStyleOptions(shuffleArray([...allPromptsData.options.fontStyles]));
      setShuffledFontColorOptions(shuffleArray([...allPromptsData.options.fontColors]));
      setShuffledResolutionOptions(shuffleArray([...allPromptsData.options.resolutions]));
      setShuffledFramingOptions(shuffleArray([...allPromptsData.options.framings]));
      setShuffledOutputStyleOptions(shuffleArray([...allPromptsData.options.outputStyles]));
      setCreativePromptNames(shuffleArray([...allPromptsData.creativeNames])); // Creative names are also shuffled
    }
  }, [allPromptsData, randomizeKey]); // Re-shuffle when allPromptsData are loaded or randomizeKey changes

  /**
   * Generates a cosmetic prompt string based on the prompt's data and selected global parameters.
   * @param {object} promptData - The specific prompt object from the JSON array.
   * @param {string} currentOverlayText - Custom text to include as an overlay.
   * @param {string} currentAspectRatio - Selected aspect ratio from global controls.
   * @param {string} currentCameraLens - Selected camera lens from global controls.
   * @param {string} selectedGlobalLighting - Selected lighting style from global controls (or default).
   * @returns {string} The generated prompt string.
   */
  const generatePrompt = useCallback((
    promptData, // Now takes the full prompt object
    currentOverlayTextParam, // Renamed parameter to avoid confusion
    currentAspectRatioParam,
    currentCameraLensParam,
    selectedGlobalLightingParam
  ) => { 
    if (!allPromptsData || shuffledLightingOptions.length === 0) return ''; // Don't generate if data isn't ready

    const hasOverlay = currentOverlayTextParam && currentOverlayTextParam.trim() !== '';
    
    // Use selected global lighting, or the shuffled default if 'DEFAULT_PROMPT_LIGHTING'
    const lightingToUse = selectedGlobalLightingParam === 'DEFAULT_PROMPT_LIGHTING' 
      ? shuffledLightingOptions[promptData.parameters.lightingIndex % shuffledLightingOptions.length] 
      : selectedGlobalLightingParam;

    // Get values from shuffled arrays using indices from promptData
    const sceneToUse = shuffledSceneOptions[promptData.sceneDescriptionIndex % shuffledSceneOptions.length];
    const moodEmotionToUse = shuffledMoodEmotionOptions[promptData.moodEmotionIndex % shuffledMoodEmotionOptions.length];
    const fontStyleToUse = shuffledFontStyleOptions[promptData.parameters.fontStyleIndex % shuffledFontStyleOptions.length];
    const fontColorToUse = shuffledFontColorOptions[promptData.parameters.fontColorIndex % shuffledFontColorOptions.length];
    const resolutionToUse = shuffledResolutionOptions[promptData.parameters.resolutionIndex % shuffledResolutionOptions.length];
    const framingToUse = shuffledFramingOptions[promptData.parameters.framingIndex % shuffledFramingOptions.length];
    const outputStyleToUse = shuffledOutputStyleOptions[promptData.outputStyleIndex % shuffledOutputStyleOptions.length];


    return `${hasOverlay ? `[PARAMETERS]\nOverlay Text: ${currentOverlayTextParam}` : `[PARAMETERS]`}\nAspect Ratio: ${currentAspectRatioParam}\nFont Style: ${fontStyleToUse}\nFont Color: ${fontColorToUse}\nResolution: ${resolutionToUse}\nCamera Lens: ${currentCameraLensParam}\nFraming: ${framingToUse}\nLighting: ${lightingToUse}\n\n[DESCRIPTION]\n${promptData.promptDescription}\n\n[PRODUCT INTEGRITY]\n${promptData.productIntegrityRequirements.map(req => `- ${req}`).join('\n')}\n\n[SCENE]\n- ${sceneToUse}\n\n[MOOD & EMOTION]\n- ${moodEmotionToUse}\n\n[OUTPUT STYLE]\n- ${outputStyleToUse}`;
  }, [selectedLighting, overlayText, selectedAspectRatio, selectedCameraLens, allPromptsData, // Dependencies for useCallback
      shuffledLightingOptions, shuffledSceneOptions, shuffledMoodEmotionOptions, 
      shuffledFontStyleOptions, shuffledFontColorOptions, shuffledResolutionOptions, 
      shuffledFramingOptions, shuffledOutputStyleOptions]); 

  /**
   * Generates the original prompt text for each prompt.
   * This function uses fixed default values from the original loaded JSON data.
   * @param {object} originalPromptData - The specific original prompt object from the JSON array.
   * @returns {string} The original prompt string.
   */
  const getOriginalPromptText = useCallback((originalPromptData) => {
    if (!allPromptsData) return ''; // Don't generate if data isn't loaded yet

    // Get values from original (unshuffled) options arrays using indices from originalPromptData
    const originalLighting = allPromptsData.options.lighting[originalPromptData.parameters.lightingIndex]; 
    const originalScene = allPromptsData.options.scenes[originalPromptData.sceneDescriptionIndex]; 
    const originalMoodEmotion = allPromptsData.options.moodEmotions[originalPromptData.moodEmotionIndex]; 
    const originalFontStyle = allPromptsData.options.fontStyles[originalPromptData.parameters.fontStyleIndex];
    const originalFontColor = allPromptsData.options.fontColors[originalPromptData.parameters.fontColorIndex];
    const originalResolution = allPromptsData.options.resolutions[originalPromptData.parameters.resolutionIndex];
    const originalFraming = allPromptsData.options.framings[originalPromptData.parameters.framingIndex];
    const originalOutputStyle = allPromptsData.options.outputStyles[originalPromptData.outputStyleIndex];

    // OverlayText was not in original prompt, so leaving it empty.
    return `[PARAMETERS]\nAspect Ratio: ${originalPromptData.parameters.aspectRatio}\nFont Style: ${originalFontStyle}\nFont Color: ${originalFontColor}\nResolution: ${originalResolution}\nCamera Lens: ${originalPromptData.parameters.cameraLens}\nFraming: ${originalFraming}\nLighting: ${originalLighting}\n\n[DESCRIPTION]\n${originalPromptData.promptDescription}\n\n[PRODUCT INTEGRITY]\n${originalPromptData.productIntegrityRequirements.map(req => `- ${req}`).join('\n')}\n\n[SCENE]\n- ${originalScene}\n\n[MOOD & EMOTION]\n- ${originalMoodEmotion}\n\n[OUTPUT STYLE]\n- ${originalOutputStyle}`;
  }, [allPromptsData]); // Dependency on allPromptsData

  // Function to copy text to clipboard
  const copyToClipboard = (text, buttonElement, originalButtonText) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      const spanElement = buttonElement.querySelector('span');
      if (spanElement) {
        spanElement.textContent = 'Copied!';
        setTimeout(() => {
          spanElement.textContent = originalButtonText; // Restore original button text
        }, 2000);
      }
    } catch (err) {
      console.error('Failed to copy text: ', err);
      const spanElement = buttonElement.querySelector('span');
      if (spanElement) {
        spanElement.textContent = 'Failed to copy!';
        setTimeout(() => {
          spanElement.textContent = originalButtonText;
        }, 2000);
      }
    } finally {
      document.body.removeChild(textarea);
    }
  };

  return (
    // Main container with Tailwind CSS for styling
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-gray-200 font-inter relative overflow-hidden flex flex-col items-center p-4 sm:p-8">
      {/* Background Effects - More integrated and sophisticated */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      {/* Page Title */}
      <h1 className="text-5xl sm:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400 mb-12 text-center drop-shadow-lg relative z-10 animate-fade-in">
        <span role="img" aria-label="sparkle">✨</span> COSMIC PROMPTS <span role="img" aria-label="sparkle">✨</span>
      </h1>

      {/* Control Panel */}
      <div className="w-full max-w-4xl bg-gray-900/70 backdrop-blur-lg p-8 rounded-3xl shadow-2xl mb-12 border border-gray-700 relative z-10 animate-slide-up transition-all duration-500 hover:shadow-blue-500/30">
        <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ border: '1px solid rgba(100, 100, 100, 0.2)', boxShadow: 'inset 0 0 25px rgba(0,200,255,0.08), 0 0 40px rgba(150,0,255,0.15)' }}></div> {/* Inner and outer glow */}

        <div className="flex flex-col gap-6">
          {/* Input for Overlay Text */}
          <div>
            <label htmlFor="overlayTextInput" className="block text-sm font-medium text-gray-300 mb-2">Overlay Text (Optional)</label>
            <input
              type="text"
              id="overlayTextInput"
              placeholder="Enter custom overlay text"
              value={overlayText}
              onChange={(e) => setOverlayText(e.target.value)}
              className="w-full p-3 rounded-xl bg-gray-800/60 border border-blue-700 text-gray-100 focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all duration-300 text-lg shadow-inner-dark focus:border-blue-500 placeholder-gray-500"
            />
          </div>

          {/* Dropdowns for Prompt Customization */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> {/* Grid updated for fewer columns */}
            {/* Aspect Ratio */}
            <div>
              <label htmlFor="aspectRatioSelect" className="block text-sm font-medium text-gray-300 mb-2">Aspect Ratio</label>
              <div className="relative">
                <select
                  id="aspectRatioSelect"
                  value={selectedAspectRatio}
                  onChange={(e) => setSelectedAspectRatio(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800/60 border border-purple-700 text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all duration-300 text-lg shadow-inner-dark appearance-none pr-10 custom-select placeholder-gray-500"
                >
                  <option value="1:1">1:1 (Square)</option>
                  <option value="4:5">4:5 (Portrait)</option>
                  <option value="16:9">16:9 (Landscape)</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            {/* Camera Lens */}
            <div>
              <label htmlFor="cameraLensSelect" className="block text-sm font-medium text-gray-300 mb-2">Camera Lens</label>
              <div className="relative">
                <select
                  id="cameraLensSelect"
                  value={selectedCameraLens}
                  onChange={(e) => setSelectedCameraLens(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800/60 border border-purple-700 text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all duration-300 text-lg shadow-inner-dark appearance-none pr-10 custom-select placeholder-gray-500"
                >
                  <option value="85mm">85mm (Portrait)</option>
                  <option value="50mm">50mm (Standard)</option>
                  <option value="24mm">24mm (Wide Angle)</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>

            {/* Lighting */}
            <div>
              <label htmlFor="lightingSelect" className="block text-sm font-medium text-gray-300 mb-2">Lighting</label>
              <div className="relative">
                <select
                  id="lightingSelect"
                  value={selectedLighting}
                  onChange={(e) => setSelectedLighting(e.target.value)}
                  className="w-full p-3 rounded-xl bg-gray-800/60 border border-purple-700 text-gray-100 focus:outline-none focus:ring-4 focus:ring-purple-500 transition-all duration-300 text-lg shadow-inner-dark appearance-none pr-10 custom-select placeholder-gray-500"
                >
                  <option value="DEFAULT_PROMPT_LIGHTING">Default (Per Prompt)</option>
                  {allPromptsData && allPromptsData.options.lighting.map((option, index) => ( // Use loaded options
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
          </div>
          
          {/* Randomize All Prompts Button */}
          <button
            onClick={() => setRandomizeKey(prev => prev + 1)} // Increment key to trigger re-shuffle
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full shadow-lg text-white font-semibold relative overflow-hidden z-10 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 text-base
              bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-4 focus:ring-blue-300 button-glow"
          >
            <Dice5 size={24} /> Randomize All Prompts
          </button>
        </div>
      </div>

      {/* Prompt Grid (List View) */}
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto relative z-10"> {/* Wider max-width */}
        {allPromptsData && allPromptsData.prompts.map((promptData, index) => { // Iterate over loaded prompt data
          // State for individual prompt expansion
          const isExpanded = expandedPrompts[index] || false;

          const promptCode = generatePrompt(
            promptData, // Pass the full promptData object
            overlayText,
            selectedAspectRatio,
            selectedCameraLens,
            selectedLighting
          );
          const imgWidth = selectedAspectRatio === '1:1' ? 1000 : (selectedAspectRatio === '4:5' ? 800 : 1600);
          const imgHeight = selectedAspectRatio === '1:1' ? 1000 : (selectedAspectRatio === '4:5' ? 1000 : 900);

          return (
            // Individual Prompt Card (List Item)
            <div
              key={promptData.id} // Use UUID as key
              className="bg-gray-900/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 flex flex-col md:flex-row gap-6 items-center transition-all duration-300 transform hover:scale-103 hover:shadow-blue-500/30 border border-gray-700 relative overflow-hidden group animate-fade-in-up"
            >
              {/* Number Badge */}
              <div className="absolute -top-2 -left-2 w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-gray-800 z-30">
                #{index + 1}
              </div>

              {/* Card Corner Effect and Inner Glow */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none z-20" style={{ border: '1px solid rgba(100, 100, 100, 0.2)', boxShadow: 'inset 0 0 10px rgba(0,200,255,0.05)' }}></div>

              {/* Example Image Area */}
              <div className="w-full md:w-1/3 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center border border-gray-700 group-hover:border-blue-500 transition-colors duration-300 relative aspect-w-16 aspect-h-9"> {/* Max 9:16 aspect ratio enforced */}
                <img
                  src={`https://placehold.co/${imgWidth}x${imgHeight}/1A202C/93C5FD?text=AR%3A+${selectedAspectRatio}`}
                  alt={`Example for Prompt ${promptData.promptTitleIndex}`}
                  className="w-full h-full object-contain rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300" // object-contain kullanıldı
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://placehold.co/400x200/1A202C/FF0000?text=Image+Unavailable`;
                  }}
                />
                {/* Image Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>

              {/* Prompt Content and Buttons */}
              <div className="flex flex-col flex-grow w-full md:w-2/3">
                {/* Card Title */}
                <h2 className="text-2xl font-bold text-purple-400 mb-3 group-hover:text-blue-400 transition-colors duration-300">{allPromptsData.creativeNames[promptData.promptTitleIndex]}</h2> {/* Use promptTitle from JSON */}

                {/* Prompt Code Display */}
                <pre 
                  className={`bg-gray-800/60 p-4 rounded-xl text-sm font-mono whitespace-pre-wrap break-words mb-4 text-gray-300 border border-gray-700 group-hover:border-blue-600 transition-colors duration-300 shadow-inner-dark 
                  ${isExpanded ? '' : 'max-h-[12rem] overflow-hidden'}`} // Fixed height and overflow
                >
                  {promptCode}
                </pre>
                
                {/* Expand/Collapse Button for Prompt Text */}
                <button
                  onClick={() => setExpandedPrompts(prev => ({ ...prev, [index]: !prev[index] }))}
                  className="self-start text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-semibold flex items-center gap-1 mb-4"
                >
                  {isExpanded ? (
                    <>
                      Show Less <ChevronUpIcon size={16} />
                    </>
                  ) : (
                    <>
                      Show Full Prompt <ChevronDownIcon size={16} />
                    </>
                  )}
                </button>

                {/* Buttons */}
                <div className="flex flex-row gap-3 mt-auto flex-wrap sm:flex-nowrap"> {/* Buttons always on one line */}
                  {/* Copy Prompt & Open ChatGPT 4o Button */}
                  <button
                    onClick={(e) => { 
                      copyToClipboard(promptCode, e.target, 'Copy & Open GPT 4o'); 
                      window.open('https://chat.openai.com/chat', '_blank'); 
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-full shadow-lg text-white font-semibold relative overflow-hidden z-10 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 text-sm
                    bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300
                    before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-blue-500 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:text-white button-glow"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1">
                      <Copy size={16} /> Copy & Open GPT 4o
                    </span>
                  </button>

                  {/* Copy Original & Open ChatGPT Button */}
                  <button
                    onClick={(e) => { 
                      copyToClipboard(getOriginalPromptText(promptData), e.target, 'Copy Original & Open GPT'); // Pass promptData object
                      window.open('https://chat.openai.com/chat', '_blank'); 
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-full shadow-lg text-white font-semibold relative overflow-hidden z-10 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 text-sm
                    bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-4 focus:ring-blue-300
                    before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100 hover:text-white button-glow"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-1">
                      <Rocket size={16} /> Copy Original & Open GPT
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom CSS Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 1s ease-out forwards; animation-delay: 0.2s; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in-up:nth-child(1) { animation-delay: 0.3s; }
        .animate-fade-in-up:nth-child(2) { animation-delay: 0.4s; }
        .animate-fade-in-up:nth-child(3) { animation-delay: 0.5s; }
        .animate-fade-in-up:nth-child(4) { animation-delay: 0.6s; }
        /* ... remaining animations can continue with increasing delays */

        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        .custom-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23a1a1aa' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1.5em 1.5em;
        }

        .shadow-inner-dark {
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
        }

        .button-glow:hover {
          box-shadow: 0 0 20px rgba(var(--button-glow-color), 0.7);
        }
        /* --button-glow-color variables would typically be in a Tailwind config,
           but here we use direct rgba values */
        .group-hover\\:shadow-fuchsia-500\\/50 {
            box-shadow: 0 0 20px rgba(233, 30, 99, 0.5); /* fuchsia-500 */
        }
        .group-hover\\:shadow-indigo-500\\/50 {
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.5); /* indigo-500 */
        }
        /* Newly added styles */
        .bg-clip-text {
            -webkit-background-clip: text;
            background-clip: text;
        }
        .placeholder-gray-500::placeholder {
            color: #6b7280; /* Tailwind gray-500 */
            opacity: 1; /* For Firefox */
        }
      `}</style>
    </div>
  );
};

export default App;
