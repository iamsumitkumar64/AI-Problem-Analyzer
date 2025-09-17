import { Route, Routes } from "react-router";
import MainPage from './pages/mainPage';
import UsersPage from './pages/users';
import RequestsPage from './pages/requests';
import Login from './pages/login';
import LogOut from "./services/logout";
import CheckLogin from "./services/check_Login";
import ReportPage from "./pages/AllReport";
import ViewReport from "./pages/ViewReport";
import ViewAnalyes from './pages/ViewAnalyes';

const AllRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<LogOut />} />

                <Route path="/main" element={<CheckLogin><MainPage /></CheckLogin>}>
                    <Route path="requests" element={<RequestsPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="anlayse/:id" element={<ViewAnalyes />} />
                    <Route path="report/:id" >
                        <Route index element={<ReportPage />} />
                        <Route path="viewreport/:id" element={<ViewReport />} />
                    </Route>
                </Route>
            </Routes>
        </>
    )
};

export default AllRoutes;