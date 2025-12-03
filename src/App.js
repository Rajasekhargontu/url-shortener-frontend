import { useAuth } from './AuthContext';
import AuthPage from './pages/AuthPage';
import { Routes, Route,BrowserRouter,Navigate} from "react-router";
import ShortenPage from './pages/ShortenPage';
import LinksPage from './pages/LinksPage';
function App() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/auth" element={isAuthenticated?<Navigate to="/shorten"/>:<AuthPage></AuthPage>}></Route>
      <Route path="/shorten" element={isAuthenticated ? <ShortenPage></ShortenPage> : <Navigate to="/auth" replace/>}></Route>
      <Route path="/mylinks" element={isAuthenticated ? <LinksPage></LinksPage> : <AuthPage></AuthPage>}></Route>
      <Route path="/" element={isAuthenticated ? <Navigate to="/shorten" replace/>:<Navigate to="/auth" replace/>}></Route>
    </Routes>
    </BrowserRouter>

  );
}

export default App;
