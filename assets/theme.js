// Day or night. Loaded in <head> before paint so a page never flashes the wrong sky.
// No saved choice: follow the device. The sun/moon in the top bar saves a choice, and the new sky
// spreads out in a circle from the button.
(() => {
  const root = document.documentElement, light = matchMedia('(prefers-color-scheme: light)')
  let saved = null
  try { saved = localStorage.getItem('theme') } catch (e) {}
  const set = t => { root.dataset.theme = t; const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = t === 'light' ? '#dce9f4' : '#040406' }
  set(saved === 'light' || saved === 'dark' ? saved : light.matches ? 'light' : 'dark')
  const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
  const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>'
  let btn
  const label = () => { if (!btn) return; const day = root.dataset.theme === 'light'; btn.innerHTML = day ? MOON : SUN; btn.setAttribute('aria-label', day ? 'Switch to night' : 'Switch to day') }
  const flip = t => { set(t); label(); dispatchEvent(new Event('themechange')) }
  light.addEventListener('change', () => { if (!saved) flip(light.matches ? 'light' : 'dark') })
  addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('.top nav, .theme-slot')
    if (!nav) return
    btn = Object.assign(document.createElement('button'), { type: 'button', className: 'theme' })
    btn.onclick = () => {
      const t = root.dataset.theme === 'light' ? 'dark' : 'light'
      saved = t; try { localStorage.setItem('theme', t) } catch (e) {}
      if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return flip(t)
      const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2
      const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
      document.startViewTransition(() => flip(t)).ready.then(() => root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 900, easing: 'cubic-bezier(.65,0,.25,1)', pseudoElement: '::view-transition-new(root)' }))
    }
    label(); nav.append(btn)
  })
})()
