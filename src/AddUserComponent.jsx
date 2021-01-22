import React from 'react';
import './AddUserComponent.css';


const ID_FIELD_NAME = 'id';
const NAME_FIELD_NAME = 'Name';
const AGE_FIELD_NAME = 'Age';
const JOB_TITLE_FIELD_NAME = 'JobTitle';
	
	
class AddUserComponent extends React.Component {
	constructor() {
	    super();
		
		this.submit = this.submit.bind(this);
		this.close = this.close.bind(this);
		this.valueChanged = this.valueChanged.bind(this);
		
		this.state = {
			fieldsToValues: undefined,
			editMode: false,
			submitButtonText: ''
		};
    }
	
	static getDerivedStateFromProps(props, state) {
		if (state.fieldsToValues !== undefined) {
			return state;
		}
		
		var editedUser = props.getEditedUser();
		var editMode = editedUser !== undefined;
		var initialFieldsToValues = {};
		initialFieldsToValues[ID_FIELD_NAME] = editMode ? editedUser.id : '';
		initialFieldsToValues[NAME_FIELD_NAME] = editMode ? editedUser.name : '';
		initialFieldsToValues[AGE_FIELD_NAME] = editMode ? editedUser.age : '';
		initialFieldsToValues[JOB_TITLE_FIELD_NAME] = editMode ? editedUser.jobTitle : '';
		return {
			fieldsToValues: initialFieldsToValues,
			editMode: editMode,
			submitButtonText: editMode ? 'Edit' : 'Add'
		};
	}
    
    render() {
		return (
			<div className='popup' onSubmit={this.add} noValidate>
			  <div className='popup_inner'>
			    <div className='popup_element'>
				  <input disabled={this.state.editMode} onChange={this.valueChanged} id={ID_FIELD_NAME} type='text' value={this.state.fieldsToValues[ID_FIELD_NAME]} placeholder='ID' />
				</div>
				<div className='popup_element'>
				  <input onChange={this.valueChanged} id={NAME_FIELD_NAME} type='text' value={this.state.fieldsToValues[NAME_FIELD_NAME]} placeholder='Name' />
				</div>
				<div className='popup_element'>
				  <input onChange={this.valueChanged} id={AGE_FIELD_NAME} type='text' value={this.state.fieldsToValues[AGE_FIELD_NAME]} placeholder='Age' />
				</div>
				<div className='popup_element'>
				  <input onChange={this.valueChanged} id={JOB_TITLE_FIELD_NAME} type='text' value={this.state.fieldsToValues[JOB_TITLE_FIELD_NAME]} placeholder='Job Title' />
				</div>
				<div className='popup_element'>
				  <button onClick={this.submit}>{this.state.submitButtonText}</button>
				  <button onClick={this.close}>Close</button>
			    </div>
			  </div>
			</div>
		);
    }
  
    submit() {
		if (!this.validateData()) {
			return;
		}
		
		var requestOptions = {
		    method: 'POST',
		    headers: { 'Content-Type': 'application/json' },
		    body: JSON.stringify(this.state.fieldsToValues)
		};
		fetch(`http://localhost:27017/user`, requestOptions)
		    .then(() => {
				this.props.finish();
			})
			.catch(console.log);
    }
	
	close() {
		this.props.close();
	}
	
	validateData() {
		var id = this.state.fieldsToValues[ID_FIELD_NAME];
		var hasId = id.length > 0;
		var hasName = this.state.fieldsToValues[NAME_FIELD_NAME].length > 0;
		var hasAge = this.state.fieldsToValues[AGE_FIELD_NAME].length > 0;
		var hasJobTitle = this.state.fieldsToValues[JOB_TITLE_FIELD_NAME].length > 0;
		var allFieldsFilled = hasId && hasName && hasAge && hasJobTitle;
		if (!allFieldsFilled) {
			alert("All fields are mandatory!");
			return false;
		}
		
		if (!this.state.editMode && this.props.hasUser(id) === true) {
			alert("A user with this ID already exists.")
			return false;
		}
		
		// Other validation criteria...
		
		return true;
	}
	
	valueChanged(e) {
		var fieldsToValuesCopy = this.state.fieldsToValues;
		fieldsToValuesCopy[e.target.id] = e.target.value;
		this.setState({fieldsToValues: fieldsToValuesCopy});
	}
}
export default AddUserComponent;