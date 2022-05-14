var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var checkStatus = function checkStatus(response) {
    if (response.ok) {
        return response;
    }
    throw new Error('Error is either 404 or 500');
};

var json = function json(response) {
    return response.json();
};

var ToDoList = function (_React$Component) {
    _inherits(ToDoList, _React$Component);

    function ToDoList(props) {
        _classCallCheck(this, ToDoList);

        var _this = _possibleConstructorReturn(this, (ToDoList.__proto__ || Object.getPrototypeOf(ToDoList)).call(this, props));

        _this.state = {
            inputValue: "",
            tasks: [],
            error: "",
            filter: "all",
            date: new Date()
        };

        _this.inputHandler = _this.inputHandler.bind(_this);
        _this.handleSubmit = _this.handleSubmit.bind(_this);
        _this.fetchGetRequest = _this.fetchGetRequest.bind(_this);
        _this.deleteATask = _this.deleteATask.bind(_this);
        _this.toggleComplete = _this.toggleComplete.bind(_this);
        _this.filterToggle = _this.filterToggle.bind(_this);
        return _this;
    }

    _createClass(ToDoList, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            this.fetchGetRequest();
        }
    }, {
        key: "fetchGetRequest",
        value: function fetchGetRequest() {
            var _this2 = this;

            fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=293").then(checkStatus).then(json).then(function (response) {
                console.log(response);
                _this2.setState({ tasks: response.tasks });
            }).catch(function (error) {
                _this2.setState({ error: error.message });
                console.log(error);
            });
        }
    }, {
        key: "filterToggle",
        value: function filterToggle(event) {
            console.log(event.target.name);
            this.setState({ filter: event.target.name });
        }
    }, {
        key: "toggleComplete",
        value: function toggleComplete(id, completed) {
            var _this3 = this;

            if (!id) {
                return; //return if the task has no id.
            }

            var newState = completed ? 'active' : 'complete';

            fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks/" + id + "/mark_" + newState + "?api_key=293", {
                method: 'PUT',
                mode: 'cors'
            }).then(checkStatus).then(json).then(function (data) {
                console.log(data);
                _this3.fetchGetRequest();
            }).catch(function (error) {
                _this3.setState({ error: error.message });
                console.log(error);
            });
        }
    }, {
        key: "inputHandler",
        value: function inputHandler(event) {
            this.setState({ inputValue: event.target.value });
        }
    }, {
        key: "handleSubmit",
        value: function handleSubmit(event) {
            var _this4 = this;

            event.preventDefault();
            var inputValue = this.state.inputValue;

            inputValue = inputValue.trim();
            if (!inputValue) {
                return; //return back if the inputValue is empty.
            }

            fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=293", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    task: {
                        content: inputValue
                    }
                })
            }).then(checkStatus).then(json).then(function (data) {
                console.log(data);
                _this4.setState({ inputValue: "" });
                _this4.fetchGetRequest();
            }).catch(function (error) {
                _this4.setState({ error: error.message });
                console.log(error);
            });
        }
    }, {
        key: "deleteATask",
        value: function deleteATask(id) {
            var _this5 = this;

            if (!id) {
                return; // return if the task has no id.
            }

            fetch("https://altcademy-to-do-list-api.herokuapp.com/tasks/" + id + "?api_key=293", {
                method: "DELETE",
                mode: "cors"
            }).then(checkStatus).then(json).then(function (data) {
                console.log(data);
                _this5.fetchGetRequest();
            }).catch(function (error) {
                _this5.setState({ error: error.message });
                console.log(error);
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this6 = this;

            var _state = this.state,
                inputValue = _state.inputValue,
                tasks = _state.tasks,
                filter = _state.filter,
                date = _state.date;


            return React.createElement(
                "div",
                { className: "container" },
                React.createElement(
                    "div",
                    { className: "row" },
                    React.createElement(
                        "div",
                        { className: "col-12" },
                        React.createElement(
                            "h2",
                            { className: "text-center mb-3" },
                            "To Do List"
                        ),
                        React.createElement(
                            "p",
                            { className: "text-center" },
                            date.toLocaleDateString()
                        ),
                        React.createElement("hr", null),
                        React.createElement(
                            "div",
                            { className: "mt-3 d-flex justify-content-around" },
                            React.createElement(
                                "label",
                                null,
                                React.createElement("input", { type: "checkbox", name: "all", checked: filter === 'all', onChange: this.filterToggle }),
                                "ALL"
                            ),
                            React.createElement(
                                "label",
                                null,
                                React.createElement("input", { type: "checkbox", name: "active", checked: filter === 'active', onChange: this.filterToggle }),
                                "ACTIVE"
                            ),
                            React.createElement(
                                "label",
                                null,
                                React.createElement("input", { type: "checkbox", name: "completed", checked: filter === "completed", onChange: this.filterToggle }),
                                "COMPLETED"
                            )
                        ),
                        React.createElement("hr", null),
                        tasks.length > 0 ? tasks.filter(function (task) {
                            if (filter === 'all') {
                                return true;
                            } else if (filter === "active") {
                                return !task.completed;
                            } else {
                                return task.completed;
                            }
                        }).map(function (task) {
                            return React.createElement(Task, { key: task.id, task: task, onDelete: _this6.deleteATask, onComplete: _this6.toggleComplete });
                        }) : React.createElement(
                            "p",
                            null,
                            "No Tasks Here!"
                        ),
                        React.createElement("hr", null),
                        React.createElement(
                            "div",
                            { className: "d-flex justify-content-center" },
                            React.createElement(
                                "form",
                                { onSubmit: this.handleSubmit, className: "form-inline my-4" },
                                React.createElement("input", { type: "text", className: "form-control mr-sm-6 mb-2",
                                    placeholder: "New Task",
                                    value: inputValue,
                                    onChange: this.inputHandler }),
                                React.createElement(
                                    "button",
                                    { type: "submit", className: "btn btn-primary mb-2" },
                                    "ADD"
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return ToDoList;
}(React.Component);

var Task = function (_React$Component2) {
    _inherits(Task, _React$Component2);

    function Task() {
        _classCallCheck(this, Task);

        return _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).apply(this, arguments));
    }

    _createClass(Task, [{
        key: "render",
        value: function render() {
            var _props = this.props,
                task = _props.task,
                onComplete = _props.onComplete,
                onDelete = _props.onDelete;
            var id = task.id,
                completed = task.completed,
                content = task.content;


            return React.createElement(
                "div",
                { className: "row mb-1" },
                React.createElement(
                    "p",
                    { className: "col" },
                    content
                ),
                React.createElement(
                    "button",
                    { className: "btn btn-sm btn-danger", onClick: function onClick() {
                            return onDelete(id);
                        } },
                    "Delete"
                ),
                React.createElement("input", { className: "d-inline-block mt-3 ml-3", type: "checkbox", onChange: function onChange() {
                        return onComplete(id, completed);
                    }, checked: completed })
            );
        }
    }]);

    return Task;
}(React.Component);

ReactDOM.render(React.createElement(ToDoList, null), document.getElementById('root'));