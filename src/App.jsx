import PromptGenerator from './components/PromptGenerator';

function App() {
  return (
    <div className="min-h-screen bg-dark-bg text-dark-text p-4 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl space-y-8 mt-10">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-green-400 via-primary-500 to-blue-600 text-transparent bg-clip-text animate-in fade-in slide-in-from-top-4 duration-1000">
            Universal AI Prompt Generator
          </h1>
          <p className="text-dark-muted text-xl max-w-2xl mx-auto animate-in fade-in slide-in-from-top-8 duration-1000 delay-100">
            Transform your ideas into professional, high-performance prompts for any AI model.
          </p>
        </div>
        
        <PromptGenerator />
        
        <footer className="text-center text-dark-muted text-sm pt-8">
          <p>© 2025 Antigravity AI. Powered by Nano Banana Architecture.</p>
        </footer>
      </div>
    </div>
  )
}

export default App
