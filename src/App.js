import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
  Navigate,
} from "react-router-dom";
import LogIn from "./pages/LoginPage/LogIn";
import { useEffect, useState } from "react";
import Dashboard from "./Components/MainLayout-blue/Dashboard";
import UXCaseStudies from "./pages/Skills-section/ux-case-studies/UXCaseStudies";
import UXposts from "./pages/Skills-section/uxposts/UXposts";
import ManageCasestudy from "./pages/Skills-section/ux-case-studies/ManageCasestudy";
import MyWritings from "./pages/Skills-section/mywritings/MyWritings";
import UiDesigns from "./pages/Skills-section/designs/Uidesigns";
import Faq from "./pages/Skills-section/faq/Faq";
import Casestudycontent from "./pages/Assets-section/CasestudyContent";
import CasestudyfolderContent from "./pages/Assets-section/CasestudyfolderContent";
import ProfilePage from "./pages/ProfilePage";

function App() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    let title = "";
    let metaDescription = "";

    switch (pathname) {
      case "/":
        title = "";
        metaDescription = "";
        break;
    }

    if (title) {
      document.title = title;
    }

    if (metaDescription) {
      const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
      );
      if (metaDescriptionTag) {
        metaDescriptionTag.content = metaDescription;
      }
    }
  }, [pathname]);


  const user = sessionStorage.getItem("user");
  return (
    <Routes>
      <Route path="/" element={<LogIn />} />
      {/* <Route path="/forgot" element={<Forgot />} /> */}
      <Route element={user !== null ? <Dashboard /> : <Navigate replace to="/" />}>
        <Route path="/skills-section/ux-case-studies" element={<UXCaseStudies />} />
        <Route path="/skills-section/ux-case-studies/manage/:id" element={<ManageCasestudy />} />
        <Route path="/skills-section/uxposts" element={<UXposts />} />
        <Route path="/skills-section/mywritings" element={<MyWritings />} />
        <Route path="/skills-section/designs" element={<UiDesigns />} />
        <Route path="/skills-section/faq" element={<Faq />} />
        <Route path="/assets-section/casestudycontent" element={<Casestudycontent />} />
        <Route path="/assets-section/casestudycontent/manage/:id" element={<CasestudyfolderContent />} />

        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/skills-section/*" element={<Navigate replace to="/skills-section/ux-case-studies" />} />
        <Route path="/assets-section/*" element={<Navigate replace to="/assets-section/casestudycontent" />} />
      </Route>
    </Routes>
  );
}
export default App;
