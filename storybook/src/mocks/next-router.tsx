import { useNavigate, useLocation } from 'react-router-dom'

export function useRouter() {
  const navigate = useNavigate()
  const location = useLocation()
  
  return {
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    pathname: location.pathname,
    query: Object.fromEntries(new URLSearchParams(location.search)),
    asPath: location.pathname + location.search,
    route: location.pathname,
    isReady: true,
    events: {
      on: () => {},
      off: () => {},
      emit: () => {}
    }
  }
}

export const withRouter = (Component: React.ComponentType<any>) => {
  return function WithRouterComponent(props: any) {
    const router = useRouter()
    return <Component {...props} router={router} />
  }
}