import { Route, Routes } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./ui/home/Home";
import Error from "./ui/components/Error";
import User from "./ui/user/User";
import Groups from "./ui/groups/Groups";
import Events from "./ui/events/Events";
import Contacts from "./ui/contacts/Contacts";
import Settings from "./ui/settings/Settings";
import UpdateUser from "./updateUser/UpdateUser";
import Notifications from "./ui/notifications/Notifications";
import UserEdit from "./ui/user/UserEdit";
import AvailEdit from "./ui/user/AvailEdit";
import CreateGroup from "./ui/groups/CreateGroup";
import CreateEvents from "./ui/events/CreateEvents";
import CreateGroupEvents from "./ui/events/CreateGroupEvents";
import { ThemeProvider } from '@mui/material/styles';
import { tokens } from "./theme";
import { ColorModeContext, useMode } from "./theme"
import { Box, Toolbar } from "@mui/material";
import { sizeConfigs } from "./ui/components/configs";
import Sidebar from "./ui/components/Sidebar";
import Topbar from "./ui/components/Topbar";
import { Helmet } from 'react-helmet';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Navigate } from "react-router-dom";
import Reset from "./ui/components/Reset";
import { Outlet } from "react-router-dom";
import Login from "./ui/login/Login";
import Signup from "./ui/login/Signup";
import { useDispatch } from "react-redux";
import { userLoggedIn, userLoggedOut } from "./redux/userSlice";
import GroupsPage from "./ui/groups/GroupsPage";
import UserPage from "./ui/user/UserPage";
import EventPage from "./ui/events/EventPage";
import { useMediaQuery } from "@mui/material";
import { useState } from "react";
import { Color, info, success, warning, error } from "./ui/notifications/notificationsN";
import Notification from "./ui/notifications/notificationsN";
import GroupEdit from "./ui/groups/GroupEdit";
import * as React from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';


const { useRef, useLayoutEffect } = React;
const ProtectedRoute = ({
  isAllowed,
  redirectPath = '/login',
  children,
}) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? children : <Outlet />;
};

function App() {
  const dispatch = useDispatch();

  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);

  const title = "CalendarBoard";

  const { sucess, rememberMe, user, hasNotification } = useSelector(
    (state) => state.user
  )

  console.log(`notifications from home =${hasNotification}`)
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("")

  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    // setMessage("Welcome!");
    // createNotification(Color.success);
  });

  // TODO - make notifications this happen only once!
  //welcome msg 
  useEffect(() => {
    setMessage("CalandarBoard v1.0.0");
    createNotification(Color.success);
  }, [sucess]);

  const token = localStorage.getItem('userToken');
  
  //updating current user 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      if (currentuser !== undefined && currentuser !== null) {
        // if (process.env.NODE_ENV === 'development') {
        //   connectAuthEmulator(auth, "http://localhost:9099");
        // } dd
        console.log("Auth", currentuser, currentuser.uid);
        if (currentuser != null && currentuser != undefined) {
          localStorage.setItem('userToken', currentuser.uid);
          dispatch(userLoggedIn(currentuser));
          console.log(`just dispatched a user = ${JSON.stringify(currentuser)}`)
        } else {
          localStorage.setItem('userToken', '')
          dispatch(userLoggedOut());
        }
      } else {
        console.log(`current user is ${currentuser}, userToken is ${token}`);
      }
    });

    return () => {
      unsubscribe();
    };
  },);


  const createNotification = (color) =>
    setNotifications([...notifications, { color, id: notifications.length }]);

  const deleteNotification = (id) =>
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );

  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="App Description" />
        <meta name="theme-color" content="#008f68" />
      </Helmet>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <Box sx={{ display: "flex" }}>

            {/* Topbar */}
            {sucess === true ? (<Topbar />) : (<></>)}
            <Box
              component="nav"
              sx={{
                width: sucess === true ? sizeConfigs.sidebar.width : 0,
                flexShrink: 0,
                display: { xs: "none", md: "flex" }
              }}
            >
              {/* sidebar  */}
              {sucess === true ? (<Sidebar />) : (<></>)}
            </Box>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: matchesXs === true ? `calc(100% - ${sizeConfigs.sidebar.width})` : `0`,
              }}
            >
              {/* routes */}
              <Toolbar />

              <Routes>
                <Route path="*" element={<Error />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/reset" element={<Reset />} />
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute isAllowed={sucess && user != {}} />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/user" element={<User />} />
                  <Route path="/useredit" element={<UserEdit />} />
                  <Route path="/availedit" element={<AvailEdit />} />
                  <Route path="/groups" element={<Groups />} />
                  <Route path="/creategroup" element={<CreateGroup />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/createevents" element={<CreateEvents />} />
                  <Route path="/creategroupevents" element={<CreateGroupEvents />} />
                  <Route path="/contacts" element={<Contacts />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/updateUser" element={<UpdateUser />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/groups/:groupID" element={<GroupsPage />} />
                  <Route path="/groups/:groupID/edit" element={<GroupEdit />} />
                  <Route path="/user/:userID" element={<UserPage />} />
                  <Route path="/event/:eventID" element={<EventPage />} />
                </Route>
              </Routes>
              {notifications.length != 0 && notifications.map(({ id, color }) => (
                <Notification
                  key={id}
                  onDelete={() => deleteNotification(id)}
                  color={color}
                  autoClose={true}
                >
                  {message}
                </Notification>
              ))}
            </Box>
          </Box>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}
export default App;
