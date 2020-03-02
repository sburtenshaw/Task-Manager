import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { TextField, Button } from "@material-ui/core";
import { MuiPickersUtilsProvider, DateTimePicker } from "@material-ui/pickers";

import MomentUtils from "@date-io/moment";

const FieldWrapper = styled.div`
	margin-bottom: 24px;
`;

export default class ViewTaskDrawerContent extends Component {
	static propTypes = {
		task: PropTypes.object.isRequired,
		updateTask: PropTypes.func.isRequired
	};

	state = {
		id: null,
		name: {
			error: false,
			value: ""
		},
		description: {
			error: false,
			value: ""
		},
		due: {
			error: false,
			value: null
		}
	};

	componentDidMount() {
		const { task: { id, name, description, due } = {} } = this.props;
		this.setState({
			id,
			name: {
				error: false,
				value: name
			},
			description: {
				error: false,
				value: description
			},
			due: {
				error: false,
				value: due
			}
		});
	}

	onSubmit = e => {
		const { id, name, description, due } = this.state;
		e.preventDefault();
		this.props.updateTask(id, {
			id,
			name: name.value,
			description: description.value,
			due: due.value
		});
	};

	onChange = (field, value) => {
		this.setState({
			[field]: {
				error: value === "",
				value
			}
		});
	};

	getErrorText = field => {
		const {
			[field]: { error, value = "" }
		} = this.state;
		if (!error) return null;
		switch (field) {
			case "name":
				if (value === "") return "Required";
				break;
			case "description":
				if (value === "") return "Required";
				break;
			case "due":
				if (value === "") return "Required";
				break;
			default:
				return null;
		}
	};

	hasChanged = () => {
		const {
			task: {
				name: propsName,
				description: propsDescription,
				due: propsDue
			} = {}
		} = this.props;
		const {
			name: { value: stateName },
			description: { value: stateDescription },
			due: { value: stateDue }
		} = this.state;
		return (
			propsName !== stateName ||
			propsDescription !== stateDescription ||
			propsDue !== stateDue
		);
	};

	render() {
		const { name, description, due } = this.state;
		return (
			<form noValidate autoComplete="off" onSubmit={this.onSubmit}>
				<FieldWrapper>
					<TextField
						label="Task Name"
						variant="outlined"
						fullWidth={true}
						value={name.value}
						error={name.error}
						helperText={this.getErrorText("name")}
						onChange={({ target: { value } }) =>
							this.onChange("name", value)
						}
					/>
				</FieldWrapper>
				<FieldWrapper>
					<TextField
						label="Task Description"
						multiline
						rows="4"
						variant="outlined"
						fullWidth={true}
						value={description.value}
						error={description.error}
						helperText={this.getErrorText("description")}
						onChange={({ target: { value } }) =>
							this.onChange("description", value)
						}
					/>
				</FieldWrapper>
				<FieldWrapper>
					<MuiPickersUtilsProvider utils={MomentUtils}>
						<DateTimePicker
							margin="normal"
							label="Task Due"
							value={due.value}
							error={due.error}
							helperText={this.getErrorText("due")}
							variant="outlined"
							fullWidth={true}
							onChange={value => this.onChange("due", value)}
							autoOk={true}
							disablePast={true}
						/>
					</MuiPickersUtilsProvider>
				</FieldWrapper>
				<Button
					variant="contained"
					color="primary"
					fullWidth={true}
					type="submit"
					disabled={
						name.value === "" ||
						name.error ||
						description.value === "" ||
						description.error ||
						due.value === "" ||
						due.error ||
						!this.hasChanged()
					}
				>
					Update Task
				</Button>
			</form>
		);
	}
}
