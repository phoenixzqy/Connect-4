import React from 'react';
import avatars from './configs/avatars';
import { makeStyles } from '@material-ui/styles';

const CELL_CONFIG = {
	width: 100,
	height: 100
};

const useStyles = makeStyles({
	root: {
		position: 'fixed',
		top: 0,
		left: 0,
		height: '100vh',
		width: '100vw',
		overflow: 'hidden',
		display: 'flex',
		flexWrap: 'wrap',
		zIndex: -1,
		opacity: .1
	},
	cell: {
		width: CELL_CONFIG.width,
		height: CELL_CONFIG.height,
		backgroundRepeat: 'no-repeat',
		backgroundPosition: 'center'
	}
});


export default function(){
	const classes = useStyles();
	const count = Math.ceil(window.screen.width * window.screen.height / (CELL_CONFIG.width * CELL_CONFIG.height));
	return (
		<div className={classes.root}>
			{new Array(count).fill(undefined).map((v, i) => 
				<div 
					className={classes.cell}
					key={i}
					style={{
						backgroundImage: `url("${avatars[Math.round(Math.random() * (60 - 1))]}")`,
						backgroundSize: `${Math.round(Math.random() * 30 + 20)}px`,
					}}
				></div>)}
		</div>
	);
}
