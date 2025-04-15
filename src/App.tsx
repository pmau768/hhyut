import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import { DesktopNavigation, MobileNavigation } from "@/components/layout/Navigation";
import Overview from "@/pages/Overview";
import MyDogs from "@/pages/MyDogs";
import Events from "@/pages/Events";
import Settings from "@/pages/Settings";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";

function App() {
  // TODO: Replace with actual auth state when adding Supabase
  const isAuthenticated = true;

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
      <div className="min-h-screen bg-background">
        <Header />

        <div className="pt-16 lg:pt-8 p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            <Tabs defaultValue="overview" className="w-full">
              <DesktopNavigation />
              <MobileNavigation />

              <div className="mt-4 lg:mt-8">
                <TabsContent value="overview" className="m-0">
                  <Overview />
                </TabsContent>

                <TabsContent value="mydogs" className="m-0">
                  <MyDogs />
                </TabsContent>

                <TabsContent value="events" className="m-0">
                  <Events />
                </TabsContent>

                <TabsContent value="settings" className="m-0">
                  <Settings />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;