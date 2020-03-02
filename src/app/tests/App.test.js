import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

describe("App tests", () => {
	test("addTask correctly adds a task", () => {

	});

	test("updateTask correctly updates a task", () => {

	});

	test("deleteTask correctly deletes a task", () => {

	});

	test("getTask returns the correct task", () => {

	});

	test("addTaskButtonClick correctly opens the addTask drawer", () => {

	});

	test("taskClick correctly opens the viewTask drawer", () => {

	});

	test("closeManageTaskDrawer correctly closes the manage task drawer", () => {

	});
	
	test("deleteTaskIconClick correctly opens the confirm delete task modal", () => {

	});
	
	test("closeDeleteTaskDiolog correctly closes the delete task dialog without deleting the task", () => {

	});
	
	test("confirmDeleteTaskClick correctly deletes the task and closes the dialog", () => {

	});
	
	test("completeTaskIconClick correctly marks the task as complete", () => {

	});
});

test("renders learn react link", () => {
	const { getByText } = render(<App />);
	const linkElement = getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
