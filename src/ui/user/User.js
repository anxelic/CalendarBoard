import Typography from '@mui/material/Typography';
import { Link, useNavigate } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import Button from '@mui/material/Button';
import { getDatabase, ref, onValue, set, update } from "firebase/database";
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import ListGroup from 'react-bootstrap/ListGroup';
import { useSelector } from "react-redux";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Box, Stack } from "@mui/material";
import { UserCalendar } from "../components/UserCalendar";
import { Chat } from '../components/Chat';

const User = () => {
	const { user, sucess } = useSelector(
		(state) => state.user
	)

	const [data, setData] = useState("");
	const [timeRanges, setTimeRanges] = useState([]);

	const [img, setImg] = useState('');

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const db = getDatabase();

	useEffect(() => {

		//const db = getDatabase();  
		const dataRef = ref(db, 'users/' + user.uid + '/profile');
		const dataRefAv = ref(db, 'users/' + user.uid + '/profile' + '/availability' + '/availability');

		onValue(dataRef, (snapshot) => {
			const data = snapshot.val();
			if (data.name == null) {
				let namey = "";
				update(ref(db, 'users/' + user.uid + '/profile'), {
					name: namey
				});
			} else if (data.bio == null) {
				let bio = "";
				update(ref(db, 'users/' + user.uid + '/profile'), {
					bio: bio
				});
			} else if (data.image == null) {
				let image = "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg";
				update(ref(db, 'users/' + user.uid + '/profile'), {
					image: image
				});
			} else {
				setData(data);
			}
		});

		//data[0].whatever
		onValue(dataRefAv, (snapshot) => {
			const data = snapshot.val();
			const dataArray = [];
			const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

			for (let dayIndex in data) {
				const dayOfWeek = daysOfWeek[dayIndex];
				const { start, end } = data[dayIndex];
				dataArray.push({
					dayOfWeek,
					start: start,
					end: end
				});
			}
			setTimeRanges(dataArray);
		});

	}, []);

	function handleImage(event) {
		event.preventDefault();

		//const db = getDatabase(); 
		update(ref(db, 'users/' + user.uid + '/profile'), {
			image: img,
		});

		setImg('');
	}

	const [isInChat, setIsInChat] = useState(null);
	const [room, setRoom] = useState("");

	return (
		<div class="pageLight2">
			<div>
				<Box component='button' sx={{ border: '0', backgroundColor: 'transparent', float: 'left' }} onClick={handleShow} style={{ minHeight: '150px', minWidth: '150px', position: 'relative', top: '75px', maxHeight: '150px', maxWidth: '150px' }}>
					<Image id='profilepic' src={data.image} roundedCircle />
				</Box>
				<Modal show={show} onHide={handleClose} centered>
					<Modal.Header closeButton>
						<Modal.Title>Paste a link to an image</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form onSubmit={handleImage}>
							<Form.Control type="text" value={img} onChange={(event) => setImg(event.target.value)} />
							<Button variant="primary" type='submit' style={{ padding: '10px' }} onClick={handleClose}>
								Save Changes
							</Button>
						</Form>
					</Modal.Body>
				</Modal>
				<div style={{
					display: 'flex',
					minHeight: '100px',
					maxWidth: '15vw',
					float: 'center',
					paddingTop: '100px',
					paddingLeft: '4vw',
					paddingRight: '2vw'
				}}>
					<ListGroup.Item>
						<Typography variant="h3" style={{
							color: 'black',
							justifyContent: 'left',
							alignItems: 'left',
							overflowWrap: 'break-word',
							maxWidth: '60vw',
							minWidth: '50vw',
							paddingBottom: '10px'
						}}>
							<b>Name</b>: {data.name}
							<br />
							<b>Bio</b>: {data.bio}
							<br />
						</Typography>

						<Link to="/UserEdit">
							<Button variant="contained" sx={{ maxHeight: '50px' }}>
								<Typography variant="h4" style={{ justifyContent: 'right', alignItems: 'right' }}>
									Edit
								</Typography>
							</Button>
						</Link>
					</ListGroup.Item>
				</div>
			</div>
			<div id="usercalendar"><UserCalendar uid={user.uid} /></div>
			<Box m={1}>
				{!isInChat ? (
					<div className="room">
						<label> Who do you want to talk to</label>
						<input onChange={(e) => setRoom(e.target.value)} />
						<button
							onClick={() => {
								setIsInChat(true);
							}}
						>
							Start chat
						</button>
					</div>
				) : (
					<Chat room={room} />
				)}
			</Box>
			<Box style={{ position: "flex", p: 2 }}>
				<div style={{ paddingBottom: '20px' }}><b>Availability</b>
					<Link to="/AvailEdit">
						<Button variant="contained" sx={{ maxHeight: '50px', left: '20px' }}>
							<Typography variant="h4" style={{ justifyContent: 'right', alignItems: 'right', marginTop: "12px" }}>
								Edit
							</Typography>
						</Button>
					</Link>
				</div>

				{timeRanges.map(({ dayOfWeek, start, end }) => (
					<>
						<Typography>
							{`${dayOfWeek}\n start time = ${start}\n end time = ${end}`}
						</Typography>
					</>
				))}
			</Box>
		</div>
	);
}

export default User; 