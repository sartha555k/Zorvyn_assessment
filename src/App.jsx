import { useState } from 'react'

export default function App() {
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-tertiary/5 blur-[100px]"></div>
      </div>

      <aside className="fixed left-0 top-0 h-full w-[72px] hover:w-[220px] transition-all duration-500 ease-in-out z-50 group overflow-hidden border-r border-white/5 bg-[#121319]/90 backdrop-blur-2xl flex flex-col py-8 shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
        <div className="px-6 mb-10 flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-on-primary-container text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
          </div>
          <span className="text-white font-black italic tracking-tighter text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">NEON_VELOCITY</span>
        </div>
        <nav className="flex-1 space-y-2 px-3">
          <a className="flex items-center gap-4 py-3 px-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-[#00FF88]/20 to-transparent text-[#00FF88] border-l-4 border-[#00FF88]" href="#">
            <span className="material-symbols-outlined shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>grid_view</span>
            <span className="font-['Plus_Jakarta_Sans'] font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100">Cockpit</span>
          </a>
          <a className="flex items-center gap-4 py-3 px-3 rounded-xl transition-all duration-300 text-gray-500 hover:bg-[#181920] hover:text-[#00FF88] group-hover:text-gray-300" href="#">
            <span className="material-symbols-outlined shrink-0">account_balance_wallet</span>
            <span className="font-['Plus_Jakarta_Sans'] font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100">Liquidity</span>
          </a>
          <a className="flex items-center gap-4 py-3 px-3 rounded-xl transition-all duration-300 text-gray-500 hover:bg-[#181920] hover:text-[#00FF88] group-hover:text-gray-300" href="#">
            <span className="material-symbols-outlined shrink-0">lock_open</span>
            <span className="font-['Plus_Jakarta_Sans'] font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100">Vault</span>
          </a>
          <a className="flex items-center gap-4 py-3 px-3 rounded-xl transition-all duration-300 text-gray-500 hover:bg-[#181920] hover:text-[#00FF88] group-hover:text-gray-300" href="#">
            <span className="material-symbols-outlined shrink-0">query_stats</span>
            <span className="font-['Plus_Jakarta_Sans'] font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100">Signals</span>
          </a>
          <a className="flex items-center gap-4 py-3 px-3 rounded-xl transition-all duration-300 text-gray-500 hover:bg-[#181920] hover:text-[#00FF88] group-hover:text-gray-300" href="#">
            <span className="material-symbols-outlined shrink-0">account_tree</span>
            <span className="font-['Plus_Jakarta_Sans'] font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100">Governance</span>
          </a>
        </nav>
        <div className="px-3 space-y-2 border-t border-white/5 pt-6">
          <a className="flex items-center gap-4 py-3 px-3 rounded-xl text-gray-500 hover:text-white transition-colors" href="#">
            <span className="material-symbols-outlined shrink-0">contact_support</span>
            <span className="font-['Plus_Jakarta_Sans'] font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100">Support</span>
          </a>
          <a className="flex items-center gap-4 py-3 px-3 rounded-xl text-error transition-colors" href="#">
            <span className="material-symbols-outlined shrink-0">logout</span>
            <span className="font-['Plus_Jakarta_Sans'] font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100">Log Out</span>
          </a>
        </div>
      </aside>

      <header className="fixed top-0 w-full flex justify-between items-center px-6 md:pl-24 h-16 bg-[#0d0e13]/80 backdrop-blur-xl z-40 border-b border-[#2a2c34]/30 shadow-[0_0_20px_rgba(0,255,136,0.05)]">
        <div className="flex items-center gap-8">
          <span className="text-xl font-black italic text-[#00FF88] tracking-tighter">NEON_VELOCITY</span>
          <div className="hidden md:flex items-center bg-surface-container-highest/50 border border-outline-variant/20 rounded-full px-4 py-1.5 gap-3 w-80 focus-within:border-primary/50 transition-all shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]">
            <span className="material-symbols-outlined text-outline text-sm">search</span>
            <input className="bg-transparent border-none p-0 text-sm focus:ring-0 placeholder:text-outline w-full font-body" placeholder="Search markets, assets, or users..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-surface-container rounded-full p-1 border border-outline-variant/30">
            <button className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-[#00FF88] bg-[#00FF88]/10">Admin</button>
            <button className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-on-surface-variant hover:text-on-surface transition-colors">Analyst</button>
          </div>
          <div className="flex items-center gap-4">
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-2xl">notifications</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors text-2xl">settings</button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
              <img alt="User" data-alt="close up minimalist 3D avatar profile picture of a tech professional against a dark neon background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0BW_6JK93Xw60f0JJXGMII5ZmTwtGQVf7PDwBAChTfPQdMizIBaUTENlDsExZ2aGBt-uX3jH0uUxoZvAsAFsfcJ7IdMmlq2_3TSSJ9Nl7QiVt_KlPOtFk0Wuy28eu9i5Rz04Q13tj13IaeaFVAU4V8_Wp8Gcc5YblZaDQLNfZIHoWmUpfjurtn-IrR_K8J9paVvML2Jm0NeFqWKMxD_g1psW156RJ7bT5qqqlAgpFxbLap5xQMUOfxGMC9WI1oea90sYTTK9zoCA" />
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-20 px-6 md:pl-28 md:pr-10 max-w-[1600px] mx-auto z-10 relative">
        <section className="mb-12">
          <div className="glass-card rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
            <svg className="absolute inset-x-0 bottom-0 w-full h-32 opacity-20" preserveAspectRatio="none" viewBox="0 0 1000 100">
              <path d="M0,80 Q100,20 200,60 T400,40 T600,70 T800,30 T1000,50" fill="none" stroke="#a4ffb9" strokeWidth="4" />
            </svg>
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <p className="text-on-surface-variant uppercase font-label tracking-[0.2em] text-xs mb-3">Total Liquid Balance</p>
                <h1 className="font-mono text-5xl md:text-7xl font-medium tracking-tight text-on-background">
                  $14,582.<span className="text-on-surface-variant">40</span>
                </h1>
              </div>
              <div className="flex gap-8 md:pb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-label uppercase tracking-widest text-primary/60 mb-1">Income</span>
                  <span className="font-mono text-xl text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">north_east</span>
                    +2,300.12
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-label uppercase tracking-widest text-secondary/60 mb-1">Expenses</span>
                  <span className="font-mono text-xl text-secondary flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">south_west</span>
                    -1,120.45
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card rounded-3xl p-6 glow-hover transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-tertiary/10 rounded-xl">
                <span className="material-symbols-outlined text-tertiary">monitoring</span>
              </div>
              <span className="text-primary text-xs font-mono bg-primary/10 px-2 py-0.5 rounded-full">+12.4%</span>
            </div>
            <h3 className="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">Active Vaults</h3>
            <p className="font-mono text-3xl font-medium">8,492</p>
            <div className="mt-4 h-8 flex items-end gap-1">
              <div className="flex-1 bg-tertiary/20 rounded-t-sm h-1/2"></div>
              <div className="flex-1 bg-tertiary/20 rounded-t-sm h-3/4"></div>
              <div className="flex-1 bg-tertiary/20 rounded-t-sm h-1/2"></div>
              <div className="flex-1 bg-tertiary rounded-t-sm h-full"></div>
              <div className="flex-1 bg-tertiary/20 rounded-t-sm h-2/3"></div>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6 glow-hover transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-primary">speed</span>
              </div>
              <span className="text-primary text-xs font-mono bg-primary/10 px-2 py-0.5 rounded-full">Optimal</span>
            </div>
            <h3 className="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">Execution Speed</h3>
            <p className="font-mono text-3xl font-medium">14ms</p>
            <div className="mt-4 h-8 flex items-end gap-1">
              <div className="flex-1 bg-primary/20 rounded-t-sm h-3/4"></div>
              <div className="flex-1 bg-primary rounded-t-sm h-full"></div>
              <div className="flex-1 bg-primary/20 rounded-t-sm h-2/3"></div>
              <div className="flex-1 bg-primary/20 rounded-t-sm h-1/2"></div>
              <div className="flex-1 bg-primary/20 rounded-t-sm h-3/4"></div>
            </div>
          </div>
          <div className="glass-card rounded-3xl p-6 glow-hover transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="p-2 bg-secondary/10 rounded-xl">
                <span className="material-symbols-outlined text-secondary">token</span>
              </div>
              <span className="text-secondary text-xs font-mono bg-secondary/10 px-2 py-0.5 rounded-full">High Vol</span>
            </div>
            <h3 className="text-on-surface-variant font-label text-xs uppercase tracking-widest mb-1">Token Velocity</h3>
            <p className="font-mono text-3xl font-medium">1.28x</p>
            <div className="mt-4 h-8 flex items-end gap-1">
              <div className="flex-1 bg-secondary/20 rounded-t-sm h-1/2"></div>
              <div className="flex-1 bg-secondary/20 rounded-t-sm h-2/3"></div>
              <div className="flex-1 bg-secondary rounded-t-sm h-full"></div>
              <div className="flex-1 bg-secondary/20 rounded-t-sm h-3/4"></div>
              <div className="flex-1 bg-secondary/20 rounded-t-sm h-1/2"></div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="glass-card rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-headline font-bold">Portfolio Performance</h2>
                <p className="text-on-surface-variant text-sm">30-day volatility and trend analysis</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-xl bg-surface-container-highest text-xs font-bold uppercase tracking-widest">7D</button>
                <button className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold uppercase tracking-widest">30D</button>
                <button className="px-4 py-2 rounded-xl bg-surface-container-highest text-xs font-bold uppercase tracking-widest">1Y</button>
              </div>
            </div>
            <div className="h-80 w-full relative">
              <div className="absolute inset-0 flex items-end gap-2 px-2">
                <div className="flex-1 bg-gradient-to-t from-primary/30 to-primary/5 rounded-t-lg h-[40%] transition-all hover:opacity-80"></div>
                <div className="flex-1 bg-gradient-to-t from-primary/30 to-primary/5 rounded-t-lg h-[45%]"></div>
                <div className="flex-1 bg-gradient-to-t from-primary/30 to-primary/5 rounded-t-lg h-[60%]"></div>
                <div className="flex-1 bg-gradient-to-t from-primary/30 to-primary/5 rounded-t-lg h-[55%]"></div>
                <div className="flex-1 bg-gradient-to-t from-primary/30 to-primary/5 rounded-t-lg h-[70%]"></div>
                <div className="flex-1 bg-gradient-to-t from-primary/30 to-primary/5 rounded-t-lg h-[65%]"></div>
                <div className="flex-1 bg-gradient-to-t from-primary/30 to-primary/5 rounded-t-lg h-[80%]"></div>
                <div className="flex-1 bg-gradient-to-t from-primary/30 to-primary/5 rounded-t-lg h-[75%]"></div>
                <div className="flex-1 bg-gradient-to-t from-primary/30 to-primary/5 rounded-t-lg h-[90%] border-t-2 border-primary shadow-[0_-10px_20px_rgba(0,255,136,0.2)]"></div>
              </div>
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="border-t border-white"></div>
                <div className="border-t border-white"></div>
                <div className="border-t border-white"></div>
                <div className="border-t border-white"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="glass-card rounded-[2rem] p-8">
            <h2 className="text-xl font-headline font-bold mb-8">Burn Categories</h2>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-label uppercase tracking-widest">
                  <span>Rent &amp; Living</span>
                  <span className="font-mono">$2,400.00</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-label uppercase tracking-widest">
                  <span>Food &amp; Drink</span>
                  <span className="font-mono">$842.15</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-label uppercase tracking-widest">
                  <span>Subscriptions</span>
                  <span className="font-mono">$128.50</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-label uppercase tracking-widest">
                  <span>Travel</span>
                  <span className="font-mono">$1,100.00</span>
                </div>
                <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-on-surface-variant rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-[2rem] p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-headline font-bold">Recent Pulse</h2>
              <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">payments</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">V-Bucks Store</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Today, 2:45 PM</p>
                  </div>
                </div>
                <span className="font-mono text-sm text-secondary">-$24.99</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary text-lg">download</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Income Deposit</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Yesterday, 9:12 AM</p>
                  </div>
                </div>
                <span className="font-mono text-sm text-primary">+$1,850.00</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant text-lg">shopping_cart</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Starbucks</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Aug 22, 10:05 AM</p>
                  </div>
                </div>
                <span className="font-mono text-sm text-secondary">-$6.45</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-surface-container transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-lg">bolt</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Gas Utility</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">Aug 21, 1:20 PM</p>
                  </div>
                </div>
                <span className="font-mono text-sm text-secondary">-$82.10</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-[0_10px_40px_rgba(0,255,136,0.4)] flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all group">
        <span className="material-symbols-outlined text-3xl font-bold group-hover:rotate-90 transition-transform">add</span>
      </button>

      <nav className="fixed bottom-0 w-full rounded-t-[2rem] border-t border-[#00FF88]/20 z-50 md:hidden bg-[#0d0e13]/90 backdrop-blur-lg flex justify-around items-center px-4 py-3 shadow-[0_-10px_40px_rgba(0,255,136,0.1)]">
        <a className="flex flex-col items-center justify-center bg-[#00FF88] text-black rounded-full w-12 h-12 mb-2 scale-110" href="#">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-gray-500 active:scale-90 transition-all" href="#">
          <span className="material-symbols-outlined">insights</span>
          <span className="font-['DM_Mono'] text-[10px] uppercase tracking-widest">Market</span>
        </a>
        <a className="flex flex-col items-center justify-center text-gray-500 active:scale-90 transition-all" href="#">
          <span className="material-symbols-outlined">payments</span>
          <span className="font-['DM_Mono'] text-[10px] uppercase tracking-widest">Wallet</span>
        </a>
        <a className="flex flex-col items-center justify-center text-gray-500 active:scale-90 transition-all" href="#">
          <span className="material-symbols-outlined">person</span>
          <span className="font-['DM_Mono'] text-[10px] uppercase tracking-widest">Profile</span>
        </a>
      </nav>
    </>
  )
}
