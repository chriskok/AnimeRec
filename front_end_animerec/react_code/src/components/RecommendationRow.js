import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Grid,
	makeStyles,
	Tooltip,
	Typography,
} from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import React from "react";
import _ from "lodash";

const useStyles = makeStyles({
	root: {
		maxWidth: 345,
	},
	media: {
		height: 140,
	},
});

export default function RecommendationRow({
	sectionTitle,
	sectionDescription,
	data,
}) {
	const classes = useStyles();
	return (
		<>
			<Box>
				<Typography variant='h5' align='center' color='secondary'>
					{sectionTitle}{" "}
					<Tooltip title={sectionDescription}>
						<InfoOutlinedIcon color='primary' />
					</Tooltip>
				</Typography>

				<Grid container justify='space-evenly' alignItems='center'>
					{_.map(data, (item) => (
						<Grid item>
							<Card>
								<CardActionArea>
									<CardContent>
										<CardMedia
											component='img'
											width='140'
											image={item.image_url}
										/>
										<Typography
											align='center'
											variant='h6'
											gutterBottom
											noWrap
											style={{ maxWidth: "225px" }}
										>
											{item.full_title}
										</Typography>
									</CardContent>
								</CardActionArea>
							</Card>
						</Grid>
					))}
				</Grid>
			</Box>
			<br />
			<br />{" "}
		</>
	);
}
