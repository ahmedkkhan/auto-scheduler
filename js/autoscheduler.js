var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HomeScreen = function (_React$Component) {
    _inherits(HomeScreen, _React$Component);

    function HomeScreen(props) {
        _classCallCheck(this, HomeScreen);

        return _possibleConstructorReturn(this, (HomeScreen.__proto__ || Object.getPrototypeOf(HomeScreen)).call(this, props));
    }

    _createClass(HomeScreen, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "homeScreen" },
                React.createElement(
                    "button",
                    { "class": "btn btn-primary btn-lg btn-block", onClick: this.props.createSchedule },
                    "Create Schedule"
                ),
                React.createElement("br", null),
                this.props.exists && React.createElement(
                    "button",
                    { onClick: this.props.resumeHandler },
                    "Resume Schedule"
                )
            );
        }
    }]);

    return HomeScreen;
}(React.Component);

var ScheduleBuilder = function (_React$Component2) {
    _inherits(ScheduleBuilder, _React$Component2);

    function ScheduleBuilder(props) {
        _classCallCheck(this, ScheduleBuilder);

        // Break length and frequency are in seconds
        // Break frequency refers to how long a task can be before adding a break
        var _this2 = _possibleConstructorReturn(this, (ScheduleBuilder.__proto__ || Object.getPrototypeOf(ScheduleBuilder)).call(this, props));

        _this2.state = {
            numTasks: 1,
            tasks: [ScheduleBuilder.createTask()],
            midTaskBreakLength: 600,
            betweenTaskBreakLength: 900,
            breakFreqHours: 1,
            breakFreqMins: 0
        };

        _this2.addTask = _this2.addTask.bind(_this2);
        _this2.reset = _this2.reset.bind(_this2);
        _this2.processSchedule = _this2.processSchedule.bind(_this2);

        // Form input handlers
        _this2.handleChange = _this2.handleChange.bind(_this2);
        _this2.updateSettings = _this2.updateSettings.bind(_this2);
        return _this2;
    }

    // Creates a new task object for the state to hold


    _createClass(ScheduleBuilder, [{
        key: "addTask",


        // Adds a new task input to the form
        value: function addTask(event) {
            event.preventDefault();
            this.setState(function (state) {
                return {
                    numTasks: state.numTasks + 1,
                    tasks: [].concat(_toConsumableArray(state.tasks), [ScheduleBuilder.createTask()])
                };
            });
        }

        // Reset the schedule builder

    }, {
        key: "reset",
        value: function reset() {
            this.setState({
                numTasks: 1,
                tasks: [ScheduleBuilder.createTask()]
            });
        }

        // Process the schedule and pass schedule to the container component

    }, {
        key: "processSchedule",
        value: function processSchedule(event) {
            var _this3 = this;

            event.preventDefault();

            // User input data lives in the state
            // Use it to create an appropriate schedule
            var schedule = {
                tasks: []
            };

            // Deep clone the tasks list
            var inputList = JSON.parse(JSON.stringify(this.state.tasks));

            // Compute task durations in seconds
            inputList.forEach(function (element) {
                element.duration = element.hrs * 3600 + element.mins * 60;
            });

            // Sort tasks based on urgency, breaking ties with longer tasks first
            inputList.sort(function (a, b) {
                if (a.urgency > b.urgency) {
                    return 1;
                } else if (a.urgency < b.urgency) {
                    return -1;
                } else {
                    // break ties using task duration
                    if (a.duration > b.duration) {
                        return -1;
                    }
                    return 1;
                }
            });

            // Compute the break frequency in seconds
            var breakFreq = this.state.breakFreqHours * 3600 + this.state.breakFreqMins * 60;

            // Create the schedule data structure
            var currentTaskID = 0;
            inputList.forEach(function (task) {
                // Skip tasks with no duration
                if (task.duration === 0) {
                    return;
                }

                // If this isn't the first task, add a break between tasks
                // This break will have the same task ID as the subsequent task
                // If the user specified 0 as the between-task break length, do nothing
                if (currentTaskID !== 0 && _this3.state.betweenTaskBreakLength !== 0) {
                    schedule.tasks.push({
                        name: "Break",
                        duration: _this3.state.betweenTaskBreakLength,
                        urgency: 0,
                        id: currentTaskID,
                        status: "pending"
                    });
                }

                // Split tasks that are too long
                // Don't split tasks if the user specified a mid-task break length of 0
                while (task.breaks === true && task.duration > breakFreq && _this3.state.midTaskBreakLength !== 0) {
                    // Push back the max duration for part of the task
                    schedule.tasks.push({
                        name: task.name,
                        duration: breakFreq,
                        urgency: task.urgency,
                        id: currentTaskID,
                        status: "pending"
                    });
                    // Update the remaining task duration
                    task.duration -= breakFreq;
                    // Push back a break
                    schedule.tasks.push({
                        name: "Mid-Task Break",
                        duration: _this3.state.midTaskBreakLength,
                        urgency: task.urgency,
                        id: currentTaskID,
                        status: "pending"
                    });
                }

                // Push back the task
                schedule.tasks.push({
                    name: task.name,
                    duration: task.duration,
                    urgency: task.urgency,
                    id: currentTaskID,
                    status: "pending"
                });

                currentTaskID++;
            });

            console.log(schedule);

            this.props.makeSchedule(schedule);
        }

        // Form's calls this onKeyPress to prevent entry key from submitting form

    }, {
        key: "preventEnterKeySubmit",
        value: function preventEnterKeySubmit(event) {
            // 13 is enter key
            if (event.which === 13) {
                event.preventDefault();
            }
        }
    }, {
        key: "updateSettings",
        value: function updateSettings(event) {
            event.preventDefault();
            if (event.target.id === "settings-mtb") {
                this.setState({
                    midTaskBreakLength: event.target.value * 60
                });
            } else if (event.target.id === "settings-btb") {
                this.setState({
                    betweenTaskBreakLength: event.target.value * 60
                });
            } else if (event.target.id === "settings-freq-hrs") {
                this.setState({
                    breakFreqHours: event.target.value
                });
            } else if (event.target.id === "settings-freq-mins") {
                this.setState({
                    breakFreqMins: event.target.value
                });
            }
        }

        // Updates state for form value change

    }, {
        key: "handleChange",
        value: function handleChange(event) {
            var id = event.target.id;
            var value = event.target.value;

            // Get input type
            var input_type = id.split('-')[0];
            // Get the numeric id
            var id_num = id.split('-')[1];

            // Update the value
            // This forces the state to update and re-render
            if (input_type === "breaks") {
                this.state.tasks[id_num][input_type] = !this.state.tasks[id_num][input_type];
            } else {
                this.state.tasks[id_num][input_type] = value;
            }
            this.forceUpdate();
        }
    }, {
        key: "render",
        value: function render() {
            // Add rows to the table based on the number of tasks specified
            var rows = [];
            for (var i = 0; i < this.state.numTasks; ++i) {
                rows.push(React.createElement(
                    "div",
                    { "class": "form-row" },
                    React.createElement(
                        "div",
                        { "class": "form-group col-md-3" },
                        React.createElement("input", { type: "text", "class": "form-control", id: "name-" + i, value: this.state.tasks[i].name, onChange: this.handleChange })
                    ),
                    React.createElement(
                        "div",
                        { "class": "form-group col-md-2" },
                        React.createElement("input", { type: "number", "class": "form-control", id: "hrs-" + i, min: "0", max: "100", value: this.state.tasks[i].hrs, onChange: this.handleChange })
                    ),
                    React.createElement(
                        "div",
                        { "class": "form-group col-md-2" },
                        React.createElement("input", { type: "number", "class": "form-control", id: "mins-" + i, min: "0", max: "100", value: this.state.tasks[i].mins, onChange: this.handleChange })
                    ),
                    React.createElement(
                        "div",
                        { "class": "form-group col-md-3" },
                        React.createElement(
                            "select",
                            { "class": "form-control", id: "urgency-" + i, value: this.state.tasks[i].urgency, onChange: this.handleChange },
                            React.createElement(
                                "option",
                                { value: "1" },
                                "Very Urgent"
                            ),
                            React.createElement(
                                "option",
                                { value: "2" },
                                "Somewhat Urgent"
                            ),
                            React.createElement(
                                "option",
                                { value: "3" },
                                "Not Urgent"
                            )
                        )
                    ),
                    React.createElement(
                        "div",
                        { "class": "custom-control custom-checkbox col-md-2" },
                        React.createElement("input", { "class": "custom-control-label", value: "", type: "checkbox", id: "breaks-" + i, checked: this.state.tasks[i].breaks, onChange: this.handleChange })
                    )
                ));
            };

            return React.createElement(
                "div",
                { id: "scheduleBuilder" },
                React.createElement(
                    "h3",
                    null,
                    "Schedule Builder"
                ),
                React.createElement(
                    "form",
                    { onKeyPress: this.preventEnterKeySubmit },
                    React.createElement(
                        "table",
                        null,
                        React.createElement(
                            "div",
                            { "class": "form-row" },
                            React.createElement(
                                "div",
                                { "class": "form-group col-md-3" },
                                "Task Name"
                            ),
                            React.createElement(
                                "div",
                                { "class": "form-group col-md-4" },
                                "Duration (hours : mins)"
                            ),
                            React.createElement(
                                "div",
                                { "class": "form-group col-md-3" },
                                "Urgency"
                            ),
                            React.createElement(
                                "div",
                                { "class": "form-group col-md-2" },
                                "Add Break"
                            )
                        ),
                        rows.map(function (value, index) {
                            return value;
                        }),
                        React.createElement(
                            "div",
                            { "class": "form-row" },
                            React.createElement("br", null)
                        ),
                        React.createElement(
                            "div",
                            { "class": "form-row" },
                            React.createElement(
                                "button",
                                { "class": "btn btn-primary form-group col-md-3", onClick: this.addTask },
                                "Add Another Task"
                            ),
                            React.createElement("div", { "class": "form-group col-md-2" }),
                            React.createElement(
                                "button",
                                { "class": "btn btn-danger form-group col-md-3", type: "reset", onClick: this.reset },
                                "Reset Schedule"
                            ),
                            React.createElement(
                                "button",
                                { "class": "btn btn-success form-group col-md-3", onClick: this.processSchedule },
                                "Start Schedule"
                            )
                        )
                    ),
                    React.createElement("br", null),
                    React.createElement("br", null),
                    React.createElement(
                        "h3",
                        null,
                        "Settings"
                    ),
                    React.createElement(
                        "table",
                        null,
                        React.createElement(
                            "div",
                            { "class": "form-row" },
                            React.createElement(
                                "td",
                                null,
                                "Mid-task break duration (mins):"
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement("input", { type: "number", id: "settings-mtb", value: this.state.midTaskBreakLength / 60, min: "0", onChange: this.updateSettings })
                            )
                        ),
                        React.createElement(
                            "div",
                            { "class": "form-row" },
                            React.createElement(
                                "td",
                                null,
                                "Between-task break duration (mins):"
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement("input", { type: "number", id: "settings-btb", value: this.state.betweenTaskBreakLength / 60, min: "0", onChange: this.updateSettings })
                            )
                        ),
                        React.createElement(
                            "div",
                            { "class": "form-row" },
                            React.createElement(
                                "td",
                                null,
                                "Time before mid-task breaks (hours : mins):"
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement("input", { type: "number", id: "settings-freq-hrs", min: "0", max: "100", value: this.state.breakFreqHours, onChange: this.updateSettings }),
                                React.createElement(
                                    "b",
                                    null,
                                    ":"
                                ),
                                React.createElement("input", { type: "number", id: "settings-freq-mins", min: "0", max: "100", value: this.state.breakFreqMins, onChange: this.updateSettings })
                            )
                        )
                    )
                )
            );
        }
    }], [{
        key: "createTask",
        value: function createTask() {
            var task = {
                name: "New Task",
                hrs: 1,
                mins: 0,
                urgency: 1,
                breaks: true
            };

            return task;
        }
    }]);

    return ScheduleBuilder;
}(React.Component);

var ScheduleDisplay = function (_React$Component3) {
    _inherits(ScheduleDisplay, _React$Component3);

    function ScheduleDisplay(props) {
        _classCallCheck(this, ScheduleDisplay);

        // Deep copy the schedule into this components state
        var _this4 = _possibleConstructorReturn(this, (ScheduleDisplay.__proto__ || Object.getPrototypeOf(ScheduleDisplay)).call(this, props));

        _this4.state = {
            elapsedTime: 0,
            schedule: JSON.parse(JSON.stringify(_this4.props.schedule))
        };

        // Initalize the schedule to start immediately
        // Set the first task to ongoing
        _this4.state.schedule.tasks[0].status = "ongoing";

        _this4.updateTimer = _this4.updateTimer.bind(_this4);
        _this4.checkTask = _this4.checkTask.bind(_this4);

        // Update the timer every second
        setInterval(_this4.updateTimer, 1000);
        return _this4;
    }

    _createClass(ScheduleDisplay, [{
        key: "updateTimer",
        value: function updateTimer() {
            // Add a second to the elapsed time
            this.setState(function (state) {
                return {
                    elapsedTime: state.elapsedTime + 1
                };
            });
        }
    }, {
        key: "checkTask",
        value: function checkTask() {
            // only check each time a minute has elapsed (a task cannot be shorter)
            if (this.state.duration % 60 == 0) {
                // Loop until we find the ongoing task
                var foundOngoing = false;
                this.state.schedule.tasks.forEach(function (task) {});

                // If there was not an ongoing tasks, we've finished the schdule
                if (!foundOngoing) {
                    // TODO
                }
            }
        }
    }, {
        key: "render",
        value: function render() {
            var _this5 = this;

            // Call checkTasks before rendering
            this.checkTask();

            // Compute the sections of the timer
            var taskTimer = 0;
            var elapsedHours = parseInt(this.state.elapsedTime / 3600);
            var elapsedMins = parseInt(this.state.elapsedTime % 3600 / 60);
            if (elapsedMins < 10) {
                elapsedMins = "0" + elapsedMins;
            }
            var elapsedSecs = parseInt(this.state.elapsedTime % 60);
            if (elapsedSecs < 10) {
                elapsedSecs = "0" + elapsedSecs;
            }

            return React.createElement(
                "div",
                { id: "scheduleDisplay" },
                React.createElement(
                    "h3",
                    null,
                    "Schedule"
                ),
                React.createElement(
                    "p",
                    null,
                    "Time elapsed for this task: ",
                    elapsedHours,
                    ":",
                    elapsedMins,
                    ":",
                    elapsedSecs
                ),
                React.createElement(
                    "table",
                    { "class": "table" },
                    React.createElement(
                        "thead",
                        null,
                        React.createElement(
                            "tr",
                            { "class": "schedule-row" },
                            React.createElement(
                                "th",
                                { scope: "col" },
                                "Task Name"
                            ),
                            React.createElement(
                                "th",
                                { scope: "col" },
                                "Duration (Hours : Mins)"
                            )
                        )
                    ),
                    React.createElement(
                        "tbody",
                        null,
                        this.state.schedule.tasks.map(function (value, index) {
                            var classText = "";
                            taskTimer = value.duration;
                            if (value.status === "ongoing") {
                                classText = "table-primary";
                                taskTimer = value.duration - _this5.state.elapsedTime;
                            } else if (value.status === "completed") {
                                classText = "table-success";
                            } else {
                                // "pending"
                                classText = "table-warning";
                            }

                            return React.createElement(
                                "tr",
                                { "class": "schedule-row " + classText },
                                React.createElement(
                                    "td",
                                    { scope: "col" },
                                    value.name
                                ),
                                React.createElement(
                                    "td",
                                    { scope: "col" },
                                    parseInt(taskTimer / 3600),
                                    ":",
                                    parseInt(taskTimer % 3600 / 60) >= 10 ? parseInt(taskTimer % 3600 / 60) : "0" + parseInt(taskTimer % 3600 / 60),
                                    ":",
                                    parseInt(taskTimer % 3600 / 360) >= 10 ? parseInt(taskTimer % 3600 / 360) : "0" + parseInt(taskTimer % 3600 / 360)
                                )
                            );
                        })
                    )
                )
            );
        }
    }]);

    return ScheduleDisplay;
}(React.Component);

// parent react component
// contains the state of the scheduler and renders the components


var AutoScheduler = function (_React$Component4) {
    _inherits(AutoScheduler, _React$Component4);

    function AutoScheduler(props) {
        _classCallCheck(this, AutoScheduler);

        var _this6 = _possibleConstructorReturn(this, (AutoScheduler.__proto__ || Object.getPrototypeOf(AutoScheduler)).call(this, props));

        _this6.state = {
            scheduleExists: false,
            schedule: {},
            currentScreen: "HomeScreen"
        };

        _this6.openScheduleBuilder = _this6.openScheduleBuilder.bind(_this6);
        _this6.makeSchedule = _this6.makeSchedule.bind(_this6);
        return _this6;
    }

    // Remove this module from the DOM 
    // Load the schedule builder component


    _createClass(AutoScheduler, [{
        key: "openScheduleBuilder",
        value: function openScheduleBuilder() {
            this.setState({
                currentScreen: "ScheduleBuilder"
            });
        }

        // Adds the schedule to this componenets state
        // Prepares the scheduleDisplay component

    }, {
        key: "makeSchedule",
        value: function makeSchedule(schedule) {
            this.setState({
                schedule: schedule,
                currentScreen: "ScheduleDisplay"
            });
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "container" },
                this.state.currentScreen === "HomeScreen" && React.createElement(HomeScreen, {
                    exists: this.state.scheduleExists,
                    createSchedule: this.openScheduleBuilder
                }),
                this.state.currentScreen === "ScheduleBuilder" && React.createElement(ScheduleBuilder, {
                    makeSchedule: this.makeSchedule
                }),
                this.state.currentScreen === "ScheduleDisplay" && React.createElement(ScheduleDisplay, {
                    schedule: this.state.schedule
                })
            );
        }
    }]);

    return AutoScheduler;
}(React.Component);

ReactDOM.render(React.createElement(AutoScheduler, null), document.getElementById('reactEntry'));