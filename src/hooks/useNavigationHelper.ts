import { useNavigate, useLocation, useSearchParams } from "react-router-dom";

export const useNavigationHelper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const navigateAfterItemAction = () => {
    // Check for 'from' parameter in URL first, then location state as fallback
    const fromParam = searchParams.get('from');
    const referrer = location.state?.from;
    
    // Priority: URL parameter > location state > default
    if (fromParam === 'collections') {
      navigate('/collections');
    } else if (fromParam === 'my-stash' || referrer === "/my-stash") {
      navigate("/my-stash");
    } else if (location.pathname.includes("/items/")) {
      navigate("/my-stash");
    } else {
      navigate("/my-stash");
    }
  };

  const navigateToMyStash = () => {
    navigate("/my-stash");
  };

  const navigateWithState = (path: string, from?: string) => {
    navigate(path, { state: { from: from || location.pathname } });
  };

  return {
    navigateAfterItemAction,
    navigateToMyStash,
    navigateWithState
  };
};
