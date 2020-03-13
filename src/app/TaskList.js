import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Typography, Grid, Button, TextField } from "@material-ui/core";

import Task from "./Task";

const HeaderGrid = styled(Grid)`
	margin-bottom: 24px;
`;

const SearchTextField = styled(TextField)`
	margin-bottom: 24px;
`;

const TasksWrapper = styled.div`
	overflow-y: auto;
	height: 100%;
`;

export default class TaskList extends Component {
	static propTypes = {
		tasks: PropTypes.array.isRequired,
		addTaskButtonClick: PropTypes.func.isRequired,
		taskClick: PropTypes.func.isRequired,
		deleteTaskIconClick: PropTypes.func.isRequired,
		completeTaskIconClick: PropTypes.func.isRequired
	};

	state = {
		search: ""
	};

	onSearchChange = value => {
		this.setState({
			search: value
		});
	};

	render() {
		const {
			tasks = [],
			addTaskButtonClick,
			taskClick,
			deleteTaskIconClick,
			completeTaskIconClick,
			onTaskListScroll
		} = this.props;
		const { search = "" } = this.state;
		return (
			<Fragment>
				<HeaderGrid
					container
					direction="row"
					justify="space-between"
					alignItems="center"
				>
					<Grid item xs={true}>
						<Typography variant="h4">Tasks</Typography>
					</Grid>
					<Grid item xs="auto">
						<Button
							variant="contained"
							color="primary"
							onClick={addTaskButtonClick}
						>
							Add Task
						</Button>
					</Grid>
				</HeaderGrid>
				<SearchTextField
					label="Search"
					onChange={({ target: { value } }) =>
						this.onSearchChange(value)
					}
					fullWidth={true}
				/>
				<TasksWrapper onScroll={onTaskListScroll}>
					{tasks
						.filter(
							({ name, complete }) =>
								name.toLowerCase().includes(search) && !complete
						)
						.sort(
							(
								{ name: aName, due: aDue },
								{ name: bName, due: bDue }
							) =>
								search === ""
									? aDue - bDue
									: aName.toLowerCase().indexOf(search) -
									  bName.toLowerCase().indexOf(search)
						)
						.map((task, i) => (
							<Task
								key={`${i}${task.name}`}
								task={task}
								taskClick={taskClick}
								deleteTaskIconClick={deleteTaskIconClick}
								completeTaskIconClick={completeTaskIconClick}
							/>
						))}
				</TasksWrapper>
			</Fragment>
		);
	}
}
