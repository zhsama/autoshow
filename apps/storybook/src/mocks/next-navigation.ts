import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

export function useRouter() {
  const navigate = useNavigate()
  const location = useLocation()

  return {
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)),
    asPath: location.pathname + location.search,
  }
}

export function usePathname() {
  const location = useLocation()
  return location.pathname
}

export function useSearchParams() {
  const [searchParams] = useSearchParams()
  return searchParams
}

export function redirect(url: string) {
  window.location.href = url
}

export function notFound() {
  throw new Error('Not Found - 404')
}
