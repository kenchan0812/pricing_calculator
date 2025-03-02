import * as React from "react";

const SIDEBAR_BREAKPOINT = 1151; // Defines the screen width threshold for compact sidebar mode

/**
 * Custom hook to determine whether the sidebar should be in a compact mode
 * based on the window width. It listens for window resize events and updates
 * the state accordingly.
 * @returns {boolean} `true` if the sidebar should be compact, `false` otherwise.
 */
export function useSidebarBreakpoint() {
  const [isCompactSidebar, setIsCompactSidebar] = React.useState<boolean>(
    window.innerWidth < SIDEBAR_BREAKPOINT
  );

  React.useEffect(() => {
    const updateSidebar = () =>
      setIsCompactSidebar(window.innerWidth < SIDEBAR_BREAKPOINT);

    window.addEventListener("resize", updateSidebar);

    return () => window.removeEventListener("resize", updateSidebar);
  }, []);

  return isCompactSidebar;
}
