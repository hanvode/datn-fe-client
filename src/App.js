import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditUser from "./pages/editUser/EditUser";
import Home from "./pages/home/Home";
import ListFollowed from "./pages/listFollowed/ListFollowed";
import ListRice from "./pages/list/ListRice";
import Login from "./pages/login/Login";
import NotFound from "./pages/notFound/NotFound";
import Register from "./pages/register/Register";
import Rice from "./pages/diner/Rice";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const ENDPOINT = "https://datn-comment-realtime.onrender.com/";

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io(ENDPOINT));
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/list-rice" element={<ListRice />} />
        <Route path="/list-rice/:id" element={<Rice socket={socket}/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit" element={<EditUser />} />
        <Route path="/list-followed" element={<ListFollowed />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
