const checkStatus = (response) => {
    if(response.ok) {
        return response;
    }
    throw new Error('Error is either 404 or 500');
}

const json = response => response.json();

class ToDoList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inputValue: "",
            tasks: [],
            error: "",
            filter: "all",
            date: new Date(),
        }

        this.inputHandler = this.inputHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fetchGetRequest = this.fetchGetRequest.bind(this);
        this.deleteATask = this.deleteATask.bind(this);
        this.toggleComplete = this.toggleComplete.bind(this);
        this.filterToggle = this.filterToggle.bind(this);
    }

    componentDidMount() {
      this.fetchGetRequest();
    }

    fetchGetRequest() {
        fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=293")
        .then(checkStatus)
        .then(json)
        .then(response => {
            console.log(response);
            this.setState({ tasks: response.tasks})
        }).catch(error => {
            this.setState({error: error.message});
            console.log(error);
        });
    }

    filterToggle(event) {
        console.log(event.target.name);
        this.setState({filter: event.target.name});
    }

    toggleComplete(id, completed) {
        if(!id) {
            return; //return if the task has no id.
        }

        const newState = completed ? 'active' : 'complete';

        fetch(`https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}/mark_${newState}?api_key=293`, {
            method: 'PUT',
            mode: 'cors',
        }).then(checkStatus)
          .then(json)
          .then(data => {
              console.log(data);
              this.fetchGetRequest();
          }).catch(error => {
              this.setState({error: error.message});
              console.log(error);
          })
    }

    inputHandler(event) {
        this.setState({inputValue: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        let { inputValue } = this.state;
        inputValue = inputValue.trim();
        if(!inputValue) {
            return //return back if the inputValue is empty.
        }

        fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=293", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                task: {
                    content: inputValue,
                }
            })
        }).then(checkStatus)
          .then(json)
          .then(data => {
              console.log(data);
              this.setState({ inputValue: ""});
              this.fetchGetRequest();
          }).catch(error => {
              this.setState({error: error.message});
              console.log(error);
          })
    }

    deleteATask(id) {
        if(!id) {
            return // return if the task has no id.
        }

        fetch(`https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}?api_key=293`, {
            method: "DELETE",
            mode: "cors",
        }).then(checkStatus)
          .then(json)
          .then(data => {
              console.log(data);
              this.fetchGetRequest();
          }).catch(error => {
              this.setState({error: error.message});
              console.log(error);
          })
    }
    
    render() {
        const {inputValue, tasks, filter, date} = this.state;
        
        return(
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <h2 className="text-center mb-3">To Do List</h2>
                            <p className="text-center">{date.toLocaleDateString()}</p>
                        
                        <hr />
                        <div className="mt-3 d-flex justify-content-around">
                                <label>
                                    <input type="checkbox" name="all" checked={filter === 'all'} onChange={this.filterToggle}/>
                                    ALL
                                </label>
                                <label>
                                    <input type="checkbox" name="active" checked={filter === 'active'} onChange={this.filterToggle}/>
                                    ACTIVE
                                </label>
                                <label>
                                    <input type="checkbox" name="completed" checked={filter === "completed"} onChange={this.filterToggle}/>
                                    COMPLETED
                                </label>
                        </div>
                        <hr />

                            {tasks.length > 0 ? tasks.filter(task => {
                                if(filter === 'all') {
                                    return true;
                                } else if (filter === "active") {
                                    return !task.completed;
                                } else {
                                    return task.completed;
                                }
                            }).map(task => {
                                return(<Task key={task.id} task={task} onDelete={this.deleteATask} onComplete={this.toggleComplete}/>);
                            }) : <p>No Tasks Here!</p>}

                            <hr />
                            <div className="d-flex justify-content-center">
                                <form onSubmit={this.handleSubmit} className="form-inline my-4">
                                        
                                        <input type="text" className="form-control mr-sm-6 mb-2"
                                        placeholder="New Task"
                                        value={inputValue}
                                        onChange={this.inputHandler}/>

                                        <button type="submit" className="btn btn-primary mb-2">ADD</button>

                                </form>
                            </div>

                    </div>
                </div>
            </div>
            
        )
    }
}

class Task extends React.Component {
    render() {
        const {task, onComplete, onDelete} = this.props;
        const {id, completed, content} = task;

        return(
            <div className="row mb-1">
                <p className="col">{content}</p>
                <button className="btn btn-sm btn-danger" onClick={() => onDelete(id)}>
                    Delete
                </button>
                <input className="d-inline-block mt-3 ml-3" type="checkbox" onChange={() => onComplete(id, completed)} checked={completed} />
            </div>
        )
    }
}

ReactDOM.render(<ToDoList/>, document.getElementById('root'));