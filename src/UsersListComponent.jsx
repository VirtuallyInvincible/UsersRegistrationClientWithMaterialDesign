import React from 'react';
import './UsersListComponent.css';
import Constants from './constants.js';
import { DataGrid } from '@material-ui/data-grid';


// TODO: Insert deletion and edition functionality to the data grid
// TODO: Research styling the data grid
// TODO: Research about other Material Design components to replace primitive components, such as the buttons
// TODO: Convert to TypeScript
// TODO: Utilize cloud computing instead of storing the database locally


class UsersListComponent extends React.Component {
	constructor() {
		super();
		
		this.state = {
		    usersData: [],
			editedUser: undefined
		};
		
		this.refresh = this.refresh.bind(this);
		this.updateUsersData = this.updateUsersData.bind(this);
		this.hasUser = this.hasUser.bind(this);
		this.delete = this.delete.bind(this);
		this.edit = this.edit.bind(this);
		
		this.refresh();
    }
  
    render() {
		let columns = [
			{ field: 'idNumber', headerName: 'ID', width: 150 },
			{ field: 'name', headerName: 'Name', width: 150 },
			{ field: 'age', headerName: 'Age', width: 150 },
			{ field: 'jobTitle', headerName: 'Job Title', width: 150 },
			{ field: 'edit', width: 150 },
			{ field: 'delete', width: 150 }
		];

		return (
			<div>
			  <div style={{ height: 300, width: '100%' }}>
      			<DataGrid rows={this.state.usersData} columns={columns} checkboxSelection />
    		  </div>
			  <label>{Constants.NO_DATA_TEXT}</label>
			</div>
		);
    }
	
	edit(index) {
		this.setState({ editedUser: this.state.usersData[index] });
		this.props.showAddUserComponent();
	}
	
	delete(index, id) {
		var requestOptions = {
		    method: 'DELETE',
		    headers: { 'Content-Type': 'application/json' }
		};
		fetch(`http://localhost:27017/user/${id}`, requestOptions)
			.then(data => {
				this.state.usersData.splice(index, 1);
				this.setState({ usersData: this.state.usersData });
			})
		    .catch(console.log);
	}
	
	refresh() {
		fetch('http://localhost:27017/listUsers')
			.then(response => response.json())
			.then(data => this.updateUsersData(data.Data));
	}
	
	getEditedUser() {
		return this.state.editedUser;
	}
	
	clearEditedUser() {
		this.setState({ editedUser: undefined });
	}
	
	updateUsersData(newData) {
		let users = [];
		newData.forEach(user => {
                users.push({
					id: user.id,
					name: user.Name,
					age: user.Age,
					jobTitle: user.JobTitle
				});
            });
		this.setState({ usersData: users });
	}
	
	hasUser(id) {
		return this.state.usersData.find(user => user['id'] === id) !== undefined;
	}
}
export default UsersListComponent;