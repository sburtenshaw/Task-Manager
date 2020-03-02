import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import {
	CssBaseline,
	Container,
	SwipeableDrawer,
	Typography,
	Button,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
	DialogContentText
} from "@material-ui/core";
import { ChevronRight } from "@material-ui/icons";

import AddTaskDrawerContent from "./AddTaskDrawerContent";
import ViewTaskDrawerContent from "./ViewTaskDrawerContent";
import TaskList from "./TaskList";

import Storage from "./storage/Storage";

const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

const MainContainer = styled(Container)`
	padding: 24px;
	display: flex;
	flex-direction: column;
	height: 100vh;
	position: relative;
`;

const ManageTaskDrawer = styled(SwipeableDrawer)`
	.MuiDrawer-paper {
		min-width: 320px;
		padding: 24px 16px;
		width: 100%;
	}
	@media screen and (min-width: 768px) {
		.MuiDrawer-paper {
			width: 400px;
		}
	}
`;

const DrawerHeader = styled.div`
	margin-bottom: 24px;
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 32px;
`;

const CloseIcon = styled(ChevronRight)`
	padding-right: 12px;
	box-sizing: content-box;
	cursor: pointer;
	width: 32px;
	height: 32px;
`;

class DeleteTaskConfirmDialog extends Component {
	static propTypes = {
		open: PropTypes.bool.isRequired,
		id: PropTypes.number.isRequired,
		closeDeleteTaskDiolog: PropTypes.func.isRequired,
		confirmDeleteTaskClick: PropTypes.func.isRequired
	};

	render() {
		const {
			open,
			closeDeleteTaskDiolog,
			confirmDeleteTaskClick
		} = this.props;
		return (
			<Dialog
				aria-labelledby="Delete Task Confirm"
				open={open}
				onClose={this.onCancel}
			>
				<DialogTitle>Confirm</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<Typography variant="subtitle1">
							Are you sure you would like to delete this task?
						</Typography>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeDeleteTaskDiolog}>Cancel</Button>
					<Button
						onClick={confirmDeleteTaskClick}
						color="primary"
						variant="contained"
						autoFocus
					>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default class App extends Component {
	constructor(props) {
		super(props);
		this.storage = null;
		this.tasksLoading = false;
	}

	state = {
		manageTaskDrawer: {
			open: false,
			state: null,
			id: null
		},
		deleteTaskConfirmDialog: {
			open: false,
			id: null
		},
		tasks: []
	};

	componentDidMount() {
		this.storage = new Storage();
		this.getTasksFromStorage();
	}

	getTasksFromStorage = () => {
		this.tasksLoading = true;
		this.storage.getTasks().then(storedTasks => {
			this.updateStateTasks(storedTasks, () => {
				this.tasksLoading = false;
			});
		});
	};

	addTask = task => {
		this.storage.addTask(task).then(updatedTasks =>
			this.updateStateTasks(updatedTasks, () => {
				this.closeManageTaskDrawer();
			})
		);
	};

	updateTask = (updateId, updateTask) => {
		this.storage.updateTask(updateId, updateTask).then(updatedTasks =>
			this.updateStateTasks(updatedTasks, () => {
				this.closeManageTaskDrawer();
			})
		);
	};

	deleteTask = deleteId => {
		this.storage.deleteTask(deleteId).then(updatedTasks =>
			this.updateStateTasks(updatedTasks, () => {
				this.closeDeleteTaskDiolog();
			})
		);
	};

	updateStateTasks = (updatedTasks, callback) => {
		this.setState(
			{
				tasks: updatedTasks
			},
			() => {
				if (callback) callback();
			}
		);
	};

	getTaskFromState = getId => {
		const { tasks = [] } = this.state;
		return tasks.find(({ id }) => id === getId);
	};

	addTaskButtonClick = () => {
		this.setState({
			manageTaskDrawer: {
				open: true,
				state: "addTask",
				task: null
			}
		});
	};

	taskClick = id => {
		this.setState({
			manageTaskDrawer: {
				open: true,
				state: "viewTask",
				id
			}
		});
	};

	closeManageTaskDrawer = () => {
		this.setState({
			manageTaskDrawer: {
				open: false,
				state: null,
				id: null
			}
		});
	};

	deleteTaskIconClick = (e, id) => {
		e.stopPropagation();
		this.setState({
			deleteTaskConfirmDialog: {
				open: true,
				id
			}
		});
	};

	closeDeleteTaskDiolog = () => {
		this.setState({
			deleteTaskConfirmDialog: {
				open: false,
				id: null
			}
		});
	};

	confirmDeleteTaskClick = () => {
		this.deleteTask(this.state.deleteTaskConfirmDialog.id);
		this.closeDeleteTaskDiolog();
	};

	completeTaskIconClick = (e, completeId) => {
		const { tasks = [] } = this.state;
		e.stopPropagation();
		const updateTask = tasks.find(({ id }) => id === completeId);
		updateTask.complete = true;
		this.updateTask(completeId, updateTask);
	};

	onTaskListScroll = e => {
		const {
			target: { scrollTop, scrollHeight, offsetHeight } = {}
		} = e.nativeEvent;
		if (
			scrollTop + offsetHeight >= scrollHeight - 100 &&
			!this.tasksLoading
		) {
			this.getTasksFromStorage();
		}
	};

	getDrawerContent = () => {
		const { manageTaskDrawer: { state, id } = {} } = this.state;
		switch (state) {
			case "addTask":
				return (
					<Fragment>
						<DrawerHeader>
							<CloseIcon onClick={this.closeManageTaskDrawer} />
							<Typography variant="h5">Add Task</Typography>
						</DrawerHeader>
						<AddTaskDrawerContent addTask={this.addTask} />
					</Fragment>
				);
			case "viewTask":
				return (
					<Fragment>
						<DrawerHeader>
							<CloseIcon onClick={this.closeManageTaskDrawer} />
							{/*<Typography variant="h5">View Task</Typography>*/}
						</DrawerHeader>
						<ViewTaskDrawerContent
							task={this.getTaskFromState(id)}
							updateTask={this.updateTask}
						/>
					</Fragment>
				);
			default:
				return null;
		}
	};

	render() {
		const {
			manageTaskDrawer: { open: manageTaskDrawerOpen } = {},
			deleteTaskConfirmDialog: { open: deleteTaskConfirmDialogOpen, id },
			tasks = []
		} = this.state;
		return (
			<Fragment>
				<CssBaseline />
				<MainContainer>
					<TaskList
						tasks={tasks}
						addTaskButtonClick={this.addTaskButtonClick}
						taskClick={this.taskClick}
						deleteTaskIconClick={this.deleteTaskIconClick}
						completeTaskIconClick={this.completeTaskIconClick}
						onTaskListScroll={this.onTaskListScroll}
					/>
					<ManageTaskDrawer
						anchor="right"
						open={manageTaskDrawerOpen}
						onClose={this.closeManageTaskDrawer}
						onOpen={() => {}}
						disableBackdropTransition={!iOS}
						disableDiscovery={iOS}
					>
						{this.getDrawerContent()}
					</ManageTaskDrawer>
					{deleteTaskConfirmDialogOpen && (
						<DeleteTaskConfirmDialog
							open={deleteTaskConfirmDialogOpen}
							id={id}
							closeDeleteTaskDiolog={this.closeDeleteTaskDiolog}
							confirmDeleteTaskClick={this.confirmDeleteTaskClick}
						/>
					)}
				</MainContainer>
			</Fragment>
		);
	}
}
