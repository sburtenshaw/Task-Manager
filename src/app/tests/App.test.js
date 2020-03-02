import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

describe("App tests", () => {
	const date = new Date();
	const processedTestTask = {
		id: 1,
		completed: false,
		name: "test task",
		description: "test task",
		due: date
	};
	const newTestTask = {
		name: "test task",
		description: "test task",
		due: date
	};
	const AppComponent = new App();
	AppComponent.storage = {
		getTasks: jest.fn(() => Promise.resolve([processedTestTask])),
		addTask: jest.fn(task =>
			Promise.resolve({ id: 1, completed: false, ...task })
		)
	};

	test("getTasksFromStorage correctly gets tasks from storage and sets state", () => {
		expect(AppComponent.tasksLoading).toBeFalsy();
		AppComponent.getTasksFromStorage().then(() => {
			expect(AppComponent.storage.getTasks).toHaveBeenCalled();
			expect(AppComponent.state.tasks).toEqual([processedTestTask]);
			expect(AppComponent.tasksLoading).toBeFalsy();
		});
		expect(AppComponent.tasksLoading).toBeTruthy();
	});

	test("addTask correctly adds a task", () => {
		AppComponent.addTask(newTestTask).then(() => {
			expect(AppComponent.storage.addTask).toHaveBeenCalled();
			expect(AppComponent.state.tasks).toEqual([processedTestTask]);
			expect(AppComponent.state.manageTaskDrawer).toEqual({
				open: false,
				state: null,
				id: null
			});
		});
	});

	test("updateTask correctly updates a task", () => {});

	test("deleteTask correctly deletes a task", () => {});

	test("getTask returns the correct task", () => {});

	test("addTaskButtonClick correctly opens the addTask drawer", () => {});

	test("taskClick correctly opens the viewTask drawer", () => {});

	test("closeManageTaskDrawer correctly closes the manage task drawer", () => {});

	test("deleteTaskIconClick correctly opens the confirm delete task modal", () => {});

	test("closeDeleteTaskDiolog correctly closes the delete task dialog without deleting the task", () => {});

	test("confirmDeleteTaskClick correctly deletes the task and closes the dialog", () => {});

	test("completeTaskIconClick correctly marks the task as complete", () => {});
});
