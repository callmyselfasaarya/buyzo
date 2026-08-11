import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) {
      navigate("/chat");
    } else {
      navigate("/chat", { state: { initialQuery: searchQuery } });
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate("/chat", { state: { initialQuery: `Show top ${category}` } });
  };

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden relative">
      {/* Subtle animated background glow */}
      <div className="fixed inset-0 z-[-1] bg-gradient-radial pointer-events-none w-[150vw] h-[1536px] -translate-x-1/4 -translate-y-1/4" />

      {/* TopAppBar */}
      <header className="bg-surface/60 backdrop-blur-lg font-headline-md text-headline-md fixed top-0 w-full border-b border-white/10 shadow-[0_0_20px_rgba(99,102,241,0.1)] transition-all duration-300 ease-in-out z-50">
        <div className="flex justify-between items-center px-margin-desktop py-4 max-w-container-max-width mx-auto">
          <Link to="/" className="font-display-lg text-display-lg text-primary tracking-tighter hover:opacity-90 transition-opacity">
            Buyzo
          </Link>
          <nav className="hidden md:flex gap-gutter items-center">
            <Link className="text-primary font-bold border-b-2 border-primary pb-1" to="/">
              Discover
            </Link>
            <Link className="text-on-surface-variant font-body-md hover:text-primary transition-colors duration-300" to="/chat">
              AI Assistant
            </Link>
            <Link className="text-on-surface-variant font-body-md hover:text-primary transition-colors duration-300" to="/alerts">
              Price Drops
            </Link>
          </nav>
          <div className="flex items-center gap-stack-md text-primary">
            <Link to="/wishlist" aria-label="wishlist" className="hover:text-primary-container transition-colors duration-300 flex items-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
            </Link>
            <Link to="/chat" aria-label="account" className="hover:text-primary-container transition-colors duration-300 flex items-center">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>account_circle</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-[100px] pb-[100px] md:pb-stack-xl px-margin-mobile md:px-margin-desktop max-w-container-max-width mx-auto w-full flex flex-col gap-stack-xl">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center py-stack-xl relative">
          <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface mb-stack-md tracking-tight">
            Luminous <span className="text-primary">Intelligence</span> for Shoppers
          </h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mb-stack-lg">
            Experience effortless mastery over your shopping journey. Curated deals and price predictions powered by AI.
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-3xl glass-panel rounded-full p-2 flex items-center ai-glow relative transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/50">
            <span className="material-symbols-outlined text-primary ml-stack-sm mr-stack-xs">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-on-surface w-full focus:ring-0 font-body-lg placeholder:text-on-surface-variant/50 h-12 outline-none"
              placeholder="What are you looking for today?"
              type="text"
            />
            <button
              type="submit"
              className="bg-primary text-on-primary-fixed rounded-full px-6 py-2 font-label-caps hover:bg-primary-container hover:text-on-primary-container transition-all shadow-[0_0_15px_rgba(192,193,255,0.4)] flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span> AI Search
            </button>
          </form>
        </section>

        {/* Featured Categories Bento */}
        <section className="flex flex-col gap-stack-md">
          <h2 className="font-headline-md text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">category</span> Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter auto-rows-[200px]">
            {/* Electronics */}
            <div
              onClick={() => handleCategoryClick("Electronics")}
              className="glass-panel rounded-xl p-stack-md flex flex-col justify-end group hover:bg-surface-container-high transition-all duration-300 relative overflow-hidden md:col-span-2 md:row-span-2 cursor-pointer"
            >
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen group-hover:opacity-60 transition-opacity duration-500"
                alt="High-end sleek futuristic consumer electronics"
                src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="relative z-10">
                <h3 className="font-headline-md text-on-surface">Electronics</h3>
                <p className="font-body-md text-on-surface-variant">Next-gen gear</p>
              </div>
            </div>

            {/* Fashion */}
            <div
              onClick={() => handleCategoryClick("Fashion")}
              className="glass-panel rounded-xl p-stack-md flex flex-col justify-end group hover:bg-surface-container-high transition-all duration-300 relative overflow-hidden cursor-pointer"
            >
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen group-hover:opacity-60 transition-opacity duration-500"
                alt="Avant-garde minimalist fashion photography"
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=500&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="relative z-10">
                <h3 className="font-headline-md text-on-surface">Fashion</h3>
              </div>
            </div>

            {/* Home */}
            <div
              onClick={() => handleCategoryClick("Home Tech")}
              className="glass-panel rounded-xl p-stack-md flex flex-col justify-end group hover:bg-surface-container-high transition-all duration-300 relative overflow-hidden cursor-pointer"
            >
              <img
                className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-screen group-hover:opacity-60 transition-opacity duration-500"
                alt="Modern dark-themed smart home interior"
                src="https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=500&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              <div className="relative z-10">
                <h3 className="font-headline-md text-on-surface">Home</h3>
              </div>
            </div>

            {/* Explore All */}
            <div
              onClick={() => navigate("/chat")}
              className="glass-panel rounded-xl p-stack-md flex flex-col justify-center items-center group hover:bg-surface-container-high transition-all duration-300 relative overflow-hidden md:col-span-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-4xl text-primary mb-2">explore</span>
              <h3 className="font-headline-md text-on-surface">Explore All</h3>
            </div>
          </div>
        </section>

        {/* Trending Drops */}
        <section className="flex flex-col gap-stack-md">
          <div className="flex justify-between items-end border-b border-outline-variant/30 pb-4">
            <h2 className="font-headline-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">trending_down</span> Trending Drops
            </h2>
            <Link className="font-label-caps text-primary hover:text-primary-container transition-colors" to="/alerts">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-4">
            {/* Product Card 1 */}
            <div
              onClick={() => navigate("/chat", { state: { initialQuery: "Tell me about StudioWave ANC Noise Cancelling Headphones" } })}
              className="glass-panel rounded-xl flex flex-col overflow-hidden group hover:ai-glow transition-shadow duration-300 relative cursor-pointer"
            >
              <div className="absolute top-3 left-3 z-10 bg-secondary-container/80 text-on-secondary-container font-label-caps px-2 py-1 rounded-full backdrop-blur-sm border border-secondary/20 flex items-center gap-1 shadow-lg shadow-secondary/20 animate-[pulse_3s_ease-in-out_infinite]">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span> 24% Drop
              </div>
              <div className="h-48 relative overflow-hidden bg-surface-container-low">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  alt="Aura Pro Noise Cancelling"
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
                />
              </div>
              <div className="p-stack-md flex flex-col gap-2">
                <h3 className="font-body-lg text-on-surface truncate">StudioWave ANC Headphones</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-price-display text-primary">₹14,990</span>
                  <span className="font-body-md text-on-surface-variant line-through">₹19,999</span>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div
              onClick={() => navigate("/chat", { state: { initialQuery: "Tell me about ChronoFit Ultra Smartwatch" } })}
              className="glass-panel rounded-xl flex flex-col overflow-hidden group hover:ai-glow transition-shadow duration-300 relative cursor-pointer"
            >
              <div className="absolute top-3 left-3 z-10 bg-secondary-container/80 text-on-secondary-container font-label-caps px-2 py-1 rounded-full backdrop-blur-sm border border-secondary/20 flex items-center gap-1 shadow-lg shadow-secondary/20 animate-[pulse_3s_ease-in-out_infinite] animation-delay-1000">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span> 23% Drop
              </div>
              <div className="h-48 relative overflow-hidden bg-surface-container-low">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  alt="Quantum Timepiece V2"
                  src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=500&q=80"
                />
              </div>
              <div className="p-stack-md flex flex-col gap-2">
                <h3 className="font-body-lg text-on-surface truncate">ChronoFit Ultra Smartwatch</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-price-display text-primary">₹12,999</span>
                  <span className="font-body-md text-on-surface-variant line-through">₹16,999</span>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div
              onClick={() => navigate("/chat", { state: { initialQuery: "Tell me about Tactile RGB Mechanical Keyboard" } })}
              className="glass-panel rounded-xl flex flex-col overflow-hidden group hover:ai-glow transition-shadow duration-300 relative cursor-pointer"
            >
              <div className="absolute top-3 left-3 z-10 bg-secondary-container/80 text-on-secondary-container font-label-caps px-2 py-1 rounded-full backdrop-blur-sm border border-secondary/20 flex items-center gap-1 shadow-lg shadow-secondary/20 animate-[pulse_3s_ease-in-out_infinite] animation-delay-2000">
                <span className="material-symbols-outlined text-[14px]">arrow_downward</span> 28% Drop
              </div>
              <div className="h-48 relative overflow-hidden bg-surface-container-low">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  alt="Tactile RGB Mechanical Keyboard"
                  src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80"
                />
              </div>
              <div className="p-stack-md flex flex-col gap-2">
                <h3 className="font-body-lg text-on-surface truncate">Tactile RGB Mechanical Deck</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-price-display text-primary">₹4,999</span>
                  <span className="font-body-md text-on-surface-variant line-through">₹6,999</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden bg-surface-container/80 backdrop-blur-xl font-label-caps text-label-caps fixed bottom-0 w-full rounded-t-xl border-t border-white/10 shadow-2xl z-50 flex justify-around items-center px-margin-mobile pb-safe py-2">
        <Link to="/chat" className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full p-3 shadow-[0_0_15px_rgba(192,193,255,0.4)] scale-95 active:scale-90 transition-transform">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
          <span>Search</span>
        </Link>
        <Link to="/wishlist" className="flex flex-col items-center justify-center text-on-surface-variant p-3 hover:bg-surface-container-high transition-all scale-95 active:scale-90 transition-transform">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>favorite</span>
          <span>Wishlist</span>
        </Link>
        <Link to="/alerts" className="flex flex-col items-center justify-center text-on-surface-variant p-3 hover:bg-surface-container-high transition-all scale-95 active:scale-90 transition-transform">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: "'FILL' 0" }}>insights</span>
          <span>Track</span>
        </Link>
      </nav>

      {/* Footer */}
      <footer className="bg-surface-container-lowest text-outline font-body-md text-body-md w-full py-stack-xl border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center px-margin-desktop gap-stack-md mt-auto">
        <div className="font-display-lg-mobile text-display-lg-mobile text-outline-variant tracking-tighter">Buyzo</div>
        <div className="flex gap-gutter">
          <a className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Privacy</a>
          <a className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">Terms</a>
          <a className="text-on-surface-variant hover:text-secondary transition-colors opacity-80 hover:opacity-100" href="#">API</a>
        </div>
        <div className="text-sm">© 2026 Buyzo AI Intelligence</div>
      </footer>
    </div>
  );
}
