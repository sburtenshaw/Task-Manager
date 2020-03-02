export default class Storage {
	constructor() {
		this.localStorage = window.localStorage;

		this.tasks = null;
		this.currentOffset = 0;
	}

	getTasks() {
		return new Promise(resolve => {
			if (!this.tasks) {
				this.tasks = JSON.parse(
					this.localStorage.getItem("tasks") || "[]"
				);
			}
			if (this.currentOffset + 10 >= this.tasks.length) {
				resolve(this.tasks);
			} else {
				resolve(this.tasks.slice(0, this.currentOffset + 10));
				this.currentOffset += 10;
			}
		});
	}

	addTask(task) {
		return new Promise(resolve => {
			const updatedTasks = [
				...this.tasks,
				{ id: this.tasks.length + 1, complete: false, ...task }
			];
			this.localStorage.setItem("tasks", JSON.stringify(updatedTasks));
			resolve(updatedTasks);
		});
	}

	updateTask(updateId, updateTask) {
		return new Promise(resolve => {
			const updatedTasks = this.tasks.map(task =>
				task.id === updateId ? updateTask : task
			);
			this.localStorage.setItem("tasks", JSON.stringify(updatedTasks));
			resolve(updatedTasks);
		});
	}

	deleteTask(deleteId) {
		return new Promise(resolve => {
			const updatedTasks = this.tasks.filter(({ id }) => id !== deleteId);
			this.localStorage.setItem("tasks", JSON.stringify(updatedTasks));
			resolve(updatedTasks);
		});
	}
}
