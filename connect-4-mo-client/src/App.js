import React from 'react';
import 'antd/dist/antd.css';
import { makeStyles } from '@material-ui/styles';
import Background from "./components/Background";
import Views from "./Views";

const useStyles = makeStyles({
	root: {
		display: 'flex',
		justifyContent: "center",
		alignItems: 'center',
		height: '100vh',
		width: '100vw'
	},
});

function App() {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<Background />
			<Views />
		</div>
	);
}

export default App;
