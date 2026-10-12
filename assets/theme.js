// Day or night. Loaded in <head> before paint so a page never flashes the wrong sky.
// No saved choice: follow the device. The sun/moon in the top bar saves a choice.
(() => {
  const root = document.documentElement, light = matchMedia('(prefers-color-scheme: light)')
  let saved = null
  try { saved = localStorage.getItem('theme') } catch (e) {}
  if (saved === 'light' || saved === 'dark') root.dataset.theme = saved
  const now = () => root.dataset.theme || (light.matches ? 'light' : 'dark')
  const paint = () => {
    const m = document.querySelector('meta[name="theme-color"]')
    if (m) m.content = now() === 'light' ? '#f5efe3' : '#040406'
    dispatchEvent(new Event('themechange'))
  }
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>'
  light.addEventListener('change', () => { if (!root.dataset.theme) { paint(); label() } })
  let btn
  const label = () => { if (!btn) return; const day = now() === 'light'; btn.innerHTML = day ? MOON : SUN; btn.setAttribute('aria-label', day ? 'Switch to night' : 'Switch to day') }
  addEventListener('DOMContentLoaded', () => {
    paint()
    const nav = document.querySelector('.top nav')
    if (!nav) return
    btn = Object.assign(document.createElement('button'), { type: 'button', className: 'theme' })
    btn.onclick = () => {
      root.dataset.theme = now() === 'light' ? 'dark' : 'light'
      try { localStorage.setItem('theme', root.dataset.theme) } catch (e) {}
      label(); paint()
    }
    label(); nav.append(btn)
  })

})()
