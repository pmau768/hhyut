import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import { DesktopNavigation, MobileNavigation } from "@/components/layout/Navigation";
import Overview from "@/pages/Overview";
import MyDogs from "@/pages/MyDogs";
import Events from "@/pages/Events";
import EventDetail from "@/pages/EventDetail";
import Settings from "@/pages/Settings";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import NotFound from "@/pages/NotFound";
import { ROUTES, TAB_VALUES, getTabFromRoute } from "@/lib/services/routes";
import { useState, useEffect } from "react";
import { getUser } from "@/lib/localStorage";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    try {
      // Check if user exists in localStorage
      const user = getUser();
      setIsAuthenticated(!!user && !!user.id);
    } catch (error) {
      console.error("Error checking authentication state:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.SIGN_IN} replace />;
  }

  return <>{children}</>;
};

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
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
        
        {/* Protected Main App Routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dogs/*" 
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/events" 
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } 
        />
        
        {/* Event Details Page */}
        <Route 
          path="/events/:eventId" 
          element={
            <ProtectedRoute>
              <EventDetail />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/settings/*" 
          element={
            <ProtectedRoute>
              <AppContent />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
}

export default App;