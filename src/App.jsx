import React, { useState, useEffect } from 'react';
import { Copy, ChevronDown, Rocket } from 'lucide-react'; // Importing icons

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

  // Removed states for selectedFontStyle, selectedFontColor, selectedResolution, selectedFraming, selectedOutputStyle

  // Default lighting options array for each prompt
  const defaultPromptLightingOptions = [
    'Natural daylight', 'Studio softbox', 'Golden hour', 'Dramatic chiaroscuro',
    'High-key lighting', 'Low-key lighting', 'Backlight', 'Rim light',
    'Soft diffused light', 'Hard directional light', 'Fluorescent light', 'Neon glow',
    'Cinematic lighting', 'Ambient light', 'Volumetric lighting', 'Splash light',
    'Shadow play', 'Softbox with fill light', 'Contour lighting', 'Spotlight'
  ];

  // Default scene options array for each prompt - MORE DETAILED
  const defaultPromptSceneOptions = [
    'A luxurious, ancient marble slab with subtle veins, surrounded by delicate, dew-kissed silk drapes and scattered emerald-green fern leaves, with a backdrop of a softly blurred, sun-drenched botanical garden, casting gentle, elongated shadows.',
    'A sleek, obsidian pedestal with sharp, clean edges, set within a vast, softly glowing futuristic chamber. Holographic blue and purple light beams subtly intersect, creating an ethereal, high-tech atmosphere.',
    'Product partially submerged in a pristine, crystal-clear pool of water, where gentle ripples create mesmerizing light patterns. The background is a serene, sunlit waterfall cascading into a tranquil lagoon, evoking purity and freshness.',
    'Product nestled among an opulent arrangement of vibrant, exotic orchids and cascading, iridescent silk ribbons. The scene is bathed in a warm, diffused light, highlighting the textures and creating a sense of delicate luxury.',
    'Product on a highly polished, dark chrome surface, reflecting subtle, shifting neon light glows from a blurred, rain-slicked cyberpunk city street at night. The atmosphere is edgy and modern.',
    'Product in a tranquil, sun-dappled forest clearing. Diffused sunlight filters through a canopy of ancient, lush green leaves, creating a misty, dreamlike backdrop that emphasizes natural beauty and serenity.',
    'Product elegantly positioned on a pristine white marble plinth, surrounded by an array of abstract, sculptural glass elements that refract light into subtle rainbows. Sharp, artistic shadows play across the scene, adding depth and sophistication.',
    'Product showcased in a pristine, high-tech laboratory environment, with blurred, glowing scientific instruments and intricate circuit patterns in the background, emphasizing precision, innovation, and cutting-edge research.',
    'Product floating weightlessly against a breathtaking backdrop of a swirling cosmic nebula, with vibrant blues, purples, and pinks, and distant, twinkling stars, highlighting an otherworldly and expansive theme.',
    'Product resting on a crystalline, icy surface, with intricate frost patterns and sharp, reflective facets. The atmosphere is cool, ethereal, and pristine, with subtle blue and white light reflections.',
    'Product gently placed on a bed of soft, ethereal white clouds, with a vast, clear azure sky stretching infinitely in the background, creating a dreamlike, weightless, and aspirational quality.',
    'Product dramatically set on a piece of rugged, dark volcanic rock, contrasting sharply with a few delicate, vibrant red floral elements. The scene is under a moody, overcast sky, evoking raw power and subtle beauty.',
    'Product displayed within a dynamic, abstract art gallery setting. The background features blurred, expressive brushstrokes in bold, complementary colors, giving a sense of artistic flair and modern elegance.',
    'Product carefully positioned on a pristine, golden sandy beach at the soft glow of sunrise. Warm, inviting light bathes the scene, with gentle, shimmering ocean waves in the far distance, creating a peaceful and natural ambiance.',
    'Product encapsulated within a transparent, iridescent bubble-like enclosure, seemingly floating in a vast, minimalist, and airy white space, emphasizing its preciousness and unique form.',
    'Product on a dark, highly reflective obsidian surface, with sharp, focused spotlights creating dramatic contrasts and intense, deep shadows that highlight its contours and texture.',
    'Product surrounded by an array of glowing, fantastical bioluminescent flora in a mystical, dimly lit twilight forest. Soft, magical glows illuminate the product, creating an enchanting and otherworldly atmosphere.',
    'Product on a warm, inviting rustic wooden table, with blurred, cozy kitchen elements like ceramic bowls and fresh herbs in the background, suggesting natural ingredients and a comforting, wholesome feel.',
    'Product placed in a luxurious, softly lit spa environment. Blurred elements like plush white towels, steaming hot stones, and delicate aromatherapy diffusers in the background evoke deep relaxation and pampering.',
    'Product presented on a futuristic, illuminated grid, where glowing lines extend into a dark, infinite void. The design emphasizes precision, technology, and a sense of boundless possibility.'
  ];

  // Default mood and emotion options array for each prompt - MORE DETAILED & DYNAMIC
  const defaultPromptMoodEmotionOptions = [
    'Theme: Freshness, authenticity, simplicity - Message: Enhancing natural beauty with a touch of serene purity.',
    'Theme: Luxury, sophistication, elegance - Message: Indulge in timeless beauty and refined allure.',
    'Theme: Vibrancy, energy, playfulness - Message: Unleash your inner radiance with joyful confidence.',
    'Theme: Calm, serenity, wellness - Message: Find your inner peace and tranquil glow.',
    'Theme: Boldness, innovation, futurism - Message: Redefine beauty standards with visionary appeal.',
    'Theme: Empowerment, confidence, strength - Message: Embrace your power, radiate self-assurance.',
    'Theme: Mystery, allure, enchantment - Message: Discover the magic within, captivating all senses.',
    'Theme: Purity, innocence, delicate touch - Message: Experience gentle care and pristine charm.',
    'Theme: Adventure, freedom, exploration - Message: Journey to boundless beauty horizons.',
    'Theme: Harmony, balance, natural flow - Message: Align with nature, achieve perfect equilibrium.',
    'Theme: Passion, intensity, desire - Message: Ignite your senses, awaken your deepest desires.',
    'Theme: Nostalgia, classic charm, heritage - Message: Revisit timeless elegance, cherish enduring grace.',
    'Theme: Minimalism, clarity, essentialism - Message: Embrace simplicity, reveal true essence.',
    'Theme: Transformation, renewal, rebirth - Message: Unveil a new you, a fresh beginning.',
    'Theme: Connection, empathy, warmth - Message: Feel the gentle embrace of shared beauty.',
    'Theme: Celebration, joy, festivity - Message: Illuminate your moments with vibrant happiness.',
    'Theme: Dreamy, ethereal, whimsical - Message: Step into a world of enchanting fantasy.',
    'Theme: Grounding, earthy, organic - Message: Root yourself in natural goodness and vitality.',
    'Theme: Artistic, expressive, creative - Message: Paint your world with unique beauty.',
    'Theme: Resilience, protection, strength - Message: Fortify your beauty, stand firm and radiant.'
  ];

  // New dynamic parameter option arrays (now only used internally for prompt generation)
  const defaultPromptFontStyleOptions = [
    'Modern serif', 'Elegant sans-serif', 'Minimalist geometric', 'Art Deco inspired', 'Handwritten script'
  ];
  const defaultPromptFontColorOptions = [
    'Natural tones', 'Soft pastels', 'Metallic gradients', 'Vibrant neon', 'Monochromatic'
  ];
  const defaultPromptResolutionOptions = [
    '4K', '8K', 'Full HD'
  ];
  const defaultPromptFramingOptions = [
    'Portrait', 'Close-up', 'Wide shot', 'Dynamic angle', 'Flat lay'
  ];
  const defaultPromptOutputStyleOptions = [
    'Visual Quality: Commercial-grade clarity - Realism Rule: High-fidelity photo realism',
    'Visual Quality: Artistic interpretation - Realism Rule: Painterly realism',
    'Visual Quality: Hyper-realistic - Realism Rule: Cinematic grade',
    'Visual Quality: Soft focus - Realism Rule: Dreamlike quality',
    'Visual Quality: Sharp, crisp - Realism Rule: Editorial style'
  ];

  // Creative prompt names array
  const creativePromptNames = [
    "Aurora Glow",
    "Zenith Bloom",
    "Lunar Radiance",
    "Velvet Mist",
    "Crystal Dew",
    "Ethereal Silk",
    "Terra Whisper",
    "Solar Kiss",
    "Oceanic Serenity",
    "Stardust Veil",
    "Mystic Bloom",
    "Glimmering Stone",
    "Aqua Aura",
    "Chromatic Dream",
    "Cosmic Petal",
    "Infinite Fresh",
    "Echoing Light",
    "Silent Stream",
    "Celestial Touch",
    "Timeless Essence"
  ];

  /**
   * Generates a cosmetic prompt string based on the prompt number and selected parameters.
   * @param {number} i - The prompt number.
   * @param {string} currentOverlayText - Custom text to include as an overlay.
   * @param {string} currentAspectRatio - Selected aspect ratio.
   * @param {string} currentCameraLens - Selected camera lens.
   * @param {string} selectedGlobalLighting - Selected lighting style (or default).
   * @returns {string} The generated prompt string.
   */
  const generatePrompt = (
    i,
    currentOverlayText,
    currentAspectRatio,
    currentCameraLens,
    selectedGlobalLighting
  ) => { 
    const hasOverlay = currentOverlayText && currentOverlayText.trim() !== '';
    
    // Use default lighting if 'DEFAULT_PROMPT_LIGHTING' is selected globally
    const lightingToUse = selectedGlobalLighting === 'DEFAULT_PROMPT_LIGHTING' 
      ? defaultPromptLightingOptions[(i - 1) % defaultPromptLightingOptions.length] 
      : selectedGlobalLighting;

    // Scene is always taken from defaultPromptSceneOptions array, no user selection
    const sceneToUse = defaultPromptSceneOptions[(i - 1) % defaultPromptSceneOptions.length];

    // Mood & emotion is always taken from defaultPromptMoodEmotionOptions array, no user selection
    const moodEmotionToUse = defaultPromptMoodEmotionOptions[(i - 1) % defaultPromptMoodEmotionOptions.length];

    // Dynamic parameters' usage (always taken from default arrays, no global selection)
    const fontStyleToUse = defaultPromptFontStyleOptions[(i - 1) % defaultPromptFontStyleOptions.length];
    const fontColorToUse = defaultPromptFontColorOptions[(i - 1) % defaultPromptFontColorOptions.length];
    const resolutionToUse = defaultPromptResolutionOptions[(i - 1) % defaultPromptResolutionOptions.length];
    const framingToUse = defaultPromptFramingOptions[(i - 1) % defaultPromptFramingOptions.length];
    const outputStyleToUse = defaultPromptOutputStyleOptions[(i - 1) % defaultPromptOutputStyleOptions.length];


    return `${hasOverlay ? `[PARAMETERS]\nOverlay Text: ${currentOverlayText}` : `[PARAMETERS]`}\nAspect Ratio: ${currentAspectRatio}\nFont Style: ${fontStyleToUse}\nFont Color: ${fontColorToUse}\nResolution: ${resolutionToUse}\nCamera Lens: ${currentCameraLens}\nFraming: ${framingToUse}\nLighting: ${lightingToUse}\n\n[DESCRIPTION]\nCreate a cosmetic ad featuring the product in a styled and emotionally engaging environment that fits modern branding needs.\n\n[PRODUCT INTEGRITY]\n- Use the uploaded product image exactly as it is.\n- Do not change the label, shape, or design.\n- Preserve original lighting, text, and reflections.\n\n[SCENE]\n- ${sceneToUse}\n\n[MOOD & EMOTION]\n- ${moodEmotionToUse}\n\n[OUTPUT STYLE]\n- ${outputStyleToUse}`;
  };

  /**
   * Generates the original prompt text for each prompt.
   * This function uses fixed default values, independent of control panel selections.
   * @param {number} i - The prompt number.
   * @returns {string} The original prompt string.
   */
  const getOriginalPromptText = (i) => {
    // Fixed default values for original prompt
    const originalAspectRatio = '1:1'; // Original default from HTML
    const originalCameraLens = '85mm'; // Original default from HTML
    const originalLighting = defaultPromptLightingOptions[(i - 1) % defaultPromptLightingOptions.length]; // Each prompt's default lighting
    const originalScene = defaultPromptSceneOptions[(i - 1) % defaultPromptSceneOptions.length]; // Each prompt's default scene
    const originalMoodEmotion = defaultPromptMoodEmotionOptions[(i - 1) % defaultPromptMoodEmotionOptions.length]; // Each prompt's default mood and emotion

    // Dynamic parameters' original values (always taken from default arrays)
    const originalFontStyle = defaultPromptFontStyleOptions[(i - 1) % defaultPromptFontStyleOptions.length];
    const originalFontColor = defaultPromptFontColorOptions[(i - 1) % defaultPromptFontColorOptions.length];
    const originalResolution = defaultPromptResolutionOptions[(i - 1) % defaultPromptResolutionOptions.length];
    const originalFraming = defaultPromptFramingOptions[(i - 1) % defaultPromptFramingOptions.length];
    const originalOutputStyle = defaultPromptOutputStyleOptions[(i - 1) % defaultPromptOutputStyleOptions.length];

    // OverlayText was not in original prompt, so leaving it empty.
    return `[PARAMETERS]\nAspect Ratio: ${originalAspectRatio}\nFont Style: ${originalFontStyle}\nFont Color: ${originalFontColor}\nResolution: ${originalResolution}\nCamera Lens: ${originalCameraLens}\nFraming: ${originalFraming}\nLighting: ${originalLighting}\n\n[DESCRIPTION]\nCreate a cosmetic ad featuring the product in a styled and emotionally engaging environment that fits modern branding needs.\n\n[PRODUCT INTEGRITY]\n- Use the uploaded product image exactly as it is.\n- Do not change the label, shape, or design.\n- Preserve original lighting, text, and reflections.\n\n[SCENE]\n- ${originalScene}\n\n[MOOD & EMOTION]\n- ${originalMoodEmotion}\n\n[OUTPUT STYLE]\n- ${originalOutputStyle}`;
  };

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

  // Array to generate 20 prompt numbers
  const promptNumbers = Array.from({ length: 20 }, (_, i) => i + 1);

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
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
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
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
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
                  {defaultPromptLightingOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
              </div>
            </div>
            {/* Removed Font Style, Font Color, Resolution, Framing, Mood & Emotion, Output Style dropdowns */}
          </div>
        </div>
      </div>

      {/* Prompt Grid (List View) */}
      <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto relative z-10"> {/* Wider max-width */}
        {promptNumbers.map((num) => {
          const promptCode = generatePrompt(
            num,
            overlayText,
            selectedAspectRatio,
            selectedCameraLens,
            selectedLighting
            // Removed parameters for Font Style, Font Color, Resolution, Framing, Mood & Emotion, Output Style
          );
          const imgWidth = selectedAspectRatio === '1:1' ? 1000 : (selectedAspectRatio === '4:5' ? 800 : 1600);
          const imgHeight = selectedAspectRatio === '1:1' ? 1000 : (selectedAspectRatio === '4:5' ? 1000 : 900);

          return (
            // Individual Prompt Card (List Item)
            <div
              key={num}
              className="bg-gray-900/70 backdrop-blur-lg rounded-3xl shadow-xl p-6 flex flex-col md:flex-row gap-6 items-center transition-all duration-300 transform hover:scale-103 hover:shadow-blue-500/30 border border-gray-700 relative overflow-hidden group animate-fade-in-up"
            >
              {/* Card Corner Effect and Inner Glow */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none z-20" style={{ border: '1px solid rgba(100, 100, 100, 0.2)', boxShadow: 'inset 0 0 10px rgba(0,200,255,0.05)' }}></div>

              {/* Example Image Area */}
              <div className="w-full md:w-1/3 h-48 flex-shrink-0 bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center border border-gray-700 group-hover:border-blue-500 transition-colors duration-300 relative aspect-w-16 aspect-h-9 md:aspect-w-auto md:aspect-h-auto">
                <img
                  src={`https://placehold.co/${imgWidth}x${imgHeight}/1A202C/93C5FD?text=AR%3A+${selectedAspectRatio}`}
                  alt={`Example for Prompt ${num}`}
                  className="w-full h-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-300"
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
                <h2 className="text-2xl font-bold text-purple-400 mb-3 group-hover:text-blue-400 transition-colors duration-300">{creativePromptNames[num - 1]}</h2> {/* Creative name used here */}

                {/* Prompt Code Display */}
                <pre className="bg-gray-800/60 p-4 rounded-xl text-sm font-mono overflow-x-auto whitespace-pre-wrap break-words flex-grow mb-4 text-gray-300 border border-gray-700 group-hover:border-blue-600 transition-colors duration-300 shadow-inner-dark">
                  {promptCode}
                </pre>

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
                      copyToClipboard(getOriginalPromptText(num), e.target, 'Copy Original & Open GPT'); 
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
