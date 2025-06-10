import { useNavigate, useLocation } from "react-router-dom";

export const useNavigationHelper = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateAfterItemAction = () => {
    // If we came from My Stash, go back to My Stash
    // Otherwise, go to My Stash as default
    const referrer = location.state?.from;
    if (referrer === "/my-stash" || location.pathname.includes("/items/")) {
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
