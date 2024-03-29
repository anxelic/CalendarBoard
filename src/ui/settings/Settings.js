import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { deleteUser, reauthenticateWithCredential, getAuth } from 'firebase/auth';
import '../../App.css';
import { getDatabase, remove, ref } from "@firebase/database";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "../../redux/userSlice";
import { guestUserLoggedOut } from "../../redux/userSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const { user, error, sucess } = useSelector(
    (state) => state.user
  )
  const [mySettings, setMySettings, setError, newEmail, setEmail, newPassword, setPassword] = useState("");
  const navigate = useNavigate();
  const db = getDatabase();

  const handleChange = (event) => {
    setMySettings(event.target.value)
  };

  const del = async (e) => {
    e.preventDefault();
    try {
      // reauthenticateWithCredential();
      remove(ref(db, "users/" + user.uid));
      deleteUser(user);
      // await logOut();
      dispatch(guestUserLoggedOut());
      window.location.reload(true)
    } catch (err) {
      setError(err.message);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      navigate("/UpdateUser");
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="pageLight">
      <div className="tabList">
        <Tabs>
          <Tab eventKey="first" title="Account Settings">
            <div style={{ padding: 10 }}>
              <Button variant="secondary" type="submit" onClick={updateUser}>Update Account</Button>{' '}
              <Button variant="danger" type="submit" onClick={del}>Delete Account</Button>
            </div>
          </Tab>
          {/* <Tab eventKey="second" title="Schedule Privacy">
              <div style={{padding:10}}>
                <label>Select Schedule Privacy: </label>
                <Form>
                  <select value={mySettings} defaultValue="Nobody" onChange={handleChange}>
                    <option value="Friends">Friends</option>
                    <option value="Group Members">Group Members</option>
                    <option value="All Users">All Users</option>
                    <option value="Nobody">Nobody</option>
                  </select>
                </Form>
              </div>
            </Tab> */}
        </Tabs>
      </div>
    </div>
  );
}

export default Settings; 
