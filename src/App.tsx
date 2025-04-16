import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import { DesktopNavigation, MobileNavigation } from "@/components/layout/Navigation";
import Overview from "@/pages/Overview";
import MyDogs from "@/pages/MyDogs";
import Events from "@/pages/Events";
import Settings from "@/pages/Settings";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import { TAB_VALUES, getTabFromRoute } from "@/lib/services/routes";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/localStorage";

// AppContent component to handle tab state based on current route
const AppContent = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(TAB_VALUES.OVERVIEW);
  
  // Update the active tab based on the current route
  useEffect(() => {
    setActiveTab(getTabFromRoute(location.pathname));
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="pt-16 lg:pt-8 px-4 pb-16 lg:pb-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <DesktopNavigation />
            <MobileNavigation />

            <div className="mt-2 sm:mt-4 lg:mt-8">
              <TabsContent value={TAB_VALUES.OVERVIEW} className="m-0">
                <Overview />
              </TabsContent>

              <TabsContent value={TAB_VALUES.MY_DOGS} className="m-0">
                <MyDogs />
              </TabsContent>

              <TabsContent value={TAB_VALUES.EVENTS} className="m-0">
                <Events />
              </TabsContent>

              <TabsContent value={TAB_VALUES.SETTINGS} className="m-0">
                <Settings />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

function App() {
  // Use local storage to determine authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    try {
      // Check if user exists in localStorage
      const user = getUser();
      setIsAuthenticated(!!user && !!user.id);
    } catch (error) {
      console.error("Error checking authentication state:", error);
      setIsAuthenticated(false);
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="*" element={<AppContent />} />
      </Routes>
    </Router>
  );
}

export default App;