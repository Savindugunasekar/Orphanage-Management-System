//import AdminDash from "./components/AdminDash";

//import OrphanageForm from "./components/Admin Dashboard/OrphanageForm";
import Orphanage from "./components/Orphanage";
import { Route, Routes, Outlet } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import RequireAuth from "./components/RequireAuth";
import Unauthorized from "./components/Unauthorized";
import PersistLogin from "./components/PersistLogin";
import UserDash from "./components/UserDash";
//import UpdateOrphanage from "./components/UpdateOrphanage";
import FosteringMain from "./components/FosteringMain";
import Payment from "./components/Payment";

import Inbox from "./components/Inbox";

import Child from "./components/Child";
import { Toaster } from 'react-hot-toast';
import Case from "./components/Case";
import Myapplications from "./components/MoreInfo";

import UserCaseList from "./components/UserCaseList";
import CaseSW from "./components/CaseSW";

import Notification from "./components/Notification";
import LandingPage from "./components/LandingPage";
import VideoChat from "./components/VideoChat";

import NavBar from "./components/Navbar";

//user components
import UserDashboard from "./components/User Dashboard/Main";
import Application from "./components/User Dashboard/Application";
import UserInbox from "./components/User Dashboard/Inbox";

//orphanage components
import OrphanageDashboard from "./components/Orphanage Dashboard/Main";
import SideBar from "./components/Orphanage Dashboard/SideBar";
import VerifyEmail from "./components/VerifyEmail";

//admin components
import AdminDashboard from "./components/Admin Dashboard/Main";

const ROLES = {
  'User': 1010,
  'Head': 1910,
  'Staff': 5528,
  'SocialWorker': 2525,
  'Admin': 7788
}

function App() {
  return (


    <main className="App">
      <Routes>

        {/* Public Routes */}
        <Route path='/' element={<LandingPage />} />
        <Route path='/login' element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path='/register' element={<Register />} />
        <Route path='/donateNow' element={<Payment />} />
        <Route path="/verify" element={<VerifyEmail />} />



        {/* Protected Routes */}
        <Route element={<PersistLogin />}>
          {/*common navbar*/}
          <Route
            element={(
              <>
                <NavBar />
                <Outlet />
              </>)}>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path='/admin' element={<AdminDashboard />} />
              <Route path="/admin/inbox" element={<Inbox />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Head, ROLES.SocialWorker, ROLES.Staff, ROLES.User]} />} >
              <Route path="/chatroom/:roomId" element={<VideoChat />} />
              <Route path='/mycases' element={<UserCaseList />} />
            </Route>

            {/*orphanage routes*/}
            <Route path="/orphanage" element={<RequireAuth allowedRoles={[ROLES.Head, ROLES.SocialWorker, ROLES.Staff]} />}>
              <Route path=':id' element={<Orphanage />} />
              <Route path=':id/child/:childid' element={<Child />} />
              <Route path=':id/case/:caseId' element={<Case />} />
              <Route path="inbox" element={<Inbox />} />
            </Route>

            {/*user routes*/}
            <Route path="/user" element={<RequireAuth allowedRoles={[ROLES.Head, ROLES.Head, ROLES.SocialWorker, ROLES.User]} />} >
              <Route path='dashboard' element={<UserDashboard />} />
              <Route path='application' element={<Application />} />
              <Route path='inbox' element={<UserInbox />} />
            </Route>
          </Route>

        </Route>


        {/* <Route path="/" element={<Authorization />} />

        <Route path="/admin" element={<AdminDash />} />

        <Route path="/admin/addOrphanage" element={<OrphanageForm />} />

        <Route path="/orphanage" element={<Orphanage />}>
          <Route path=":orphanageId" element={<Orphanage />} />
        </Route> */}
      </Routes >
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </main >
  );
}

export default App;
