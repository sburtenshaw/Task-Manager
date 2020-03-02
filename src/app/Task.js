import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import moment from "moment";

import { Typography, Paper, IconButton, Tooltip } from "@material-ui/core";
import { Delete, CheckCircle } from "@material-ui/icons";

const TaskPaper = styled(Paper)`
	padding: 12px;
	cursor: pointer;
	display: flex;
	flex-direction: row;
	align-items: center;
	&:not(:last-child) {
		margin-bottom: 24px;
	}
`;

const TaskTitle = styled(Typography)`
	flex-grow: 1;
`;

const TaskDue = styled(Typography)`
	margin-right: 12px;
	display: none;
	@media screen and (min-width: 768px) {
		display: block;
	}
`;

export default class Task extends Component {
	static propTypes = {
		task: PropTypes.object.isRequired,
		taskClick: PropTypes.func.isRequired,
		deleteTaskIconClick: PropTypes.func.isRequired,
		completeTaskIconClick: PropTypes.func.isRequired
	};

	render() {
		const {
			task: { id, name, due } = {},
			taskClick,
			deleteTaskIconClick,
			completeTaskIconClick
		} = this.props;
		return (
			<TaskPaper variant="outlined" onClick={() => taskClick(id)}>
				<TaskTitle variant="h5">{name}</TaskTitle>
				<Tooltip title="Task Due" placement="top">
					<TaskDue variant="subtitle1">
						{moment(due).calendar()}
					</TaskDue>
				</Tooltip>
				<Tooltip title="Delete Task" placement="top">
					<IconButton
						aria-label="delete"
						onClick={e => deleteTaskIconClick(e, id)}
					>
						<Delete />
					</IconButton>
				</Tooltip>
				<Tooltip title="Complete Task" placement="top">
					<IconButton
						aria-label="complete"
						onClick={e => completeTaskIconClick(e, id)}
					>
						<CheckCircle />
					</IconButton>
				</Tooltip>
			</TaskPaper>
		);
	}
}
