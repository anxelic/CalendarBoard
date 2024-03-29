import { Box } from "@mui/system";
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from "react-router-dom";
import ListGroup from 'react-bootstrap/Listgroup';
import Image from 'react-bootstrap/Image';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { getDatabase, ref, set, update } from "firebase/database";
import { getAuth } from 'firebase/auth';
import { useState } from "react";
import { useSelector } from "react-redux";

const UserEdit = () => {

	const { user, error, sucess } = useSelector(
		(state) => state.user
	)

	const navigate = useNavigate();
	const [namey, setNamey] = useState('');
	const [bio, setBio] = useState('');

	function handleSubmit (event) {
		
		event.preventDefault();
 
        const db = getDatabase();   
        update(ref(db, 'users/' + user.uid + '/profile'), {
            name: namey,
            bio: bio
        });

		setNamey('');
		setBio('');
		navigate("/User");
	};

    return (
		<div>
			<Box component='button' style={{minHeight: '150px', minWidth: '150px', position: 'fixed', top: '100px'}}>
				<Image src= "logo.svg" roundedCircle />
			</Box>
			<ListGroup style={{
					display: 'flex',
					minHeight: '100px',
					maxWidth: '1000px',
					position: 'fixed', 
					top: '100px', 
					right: '100px'
			}}>
				<ListGroup.Item>
					<Form onSubmit={handleSubmit}>
						<Typography variant="h3" style={{ 
							color: 'black', 
							justifyContent: 'left', 
							alignItems: 'left'
						}}>
							<Form.Group> {/* Place controlId here */}
								<Form.Label> Name: </Form.Label>
								<Form.Control type="text" value={namey} onChange={(event) => setNamey(event.target.value)}/>
							</Form.Group>
							<Form.Group>
								<Form.Label> Bio: </Form.Label>
								<Form.Control type="text" value={bio} onChange={(event) => setBio(event.target.value)}/>
							</Form.Group>
						</Typography>
						<br/>
						<Button type="submit">Submit</Button>
					</Form>
				</ListGroup.Item>
				<ListGroup.Item>
					<Link to= "/User">
						<Button style={{maxHeight:'50px',}}>
							<Typography variant ="h4" style={{ justifyContent: 'right', alignItems: 'right'}}>
							Back
							</Typography>
						</Button>
					</Link>
				</ListGroup.Item>
			</ListGroup>
			{/* <Box>
				<Typography variant ="h1" style={{ color: 'black', position: 'relative', top: '200px'}}>
				Availability
				</Typography>
			</Box> */}
		</div>
    );
}

export default UserEdit; 