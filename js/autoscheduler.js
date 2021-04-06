var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
                    { onClick: this.props.createSchedule },
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

        var _this2 = _possibleConstructorReturn(this, (ScheduleBuilder.__proto__ || Object.getPrototypeOf(ScheduleBuilder)).call(this, props));

        _this2.state = {
            numTasks: 1
        };

        _this2.addTask = _this2.addTask.bind(_this2);
        return _this2;
    }

    // Adds a new task input to the form


    _createClass(ScheduleBuilder, [{
        key: "addTask",
        value: function addTask(event) {
            event.preventDefault();
            this.setState(function (state) {
                return {
                    numTasks: state.numTasks + 1
                };
            });
        }
    }, {
        key: "render",
        value: function render() {
            // Add rows to the table based on the number of tasks specified
            var rows = [];
            for (var i = 0; i < this.state.numTasks; ++i) {
                rows.push(React.createElement(
                    "tr",
                    null,
                    React.createElement(
                        "td",
                        null,
                        React.createElement("input", { type: "text", id: "" })
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement("input", { type: "number", id: "", min: "0", max: "100" }),
                        React.createElement(
                            "b",
                            null,
                            ":"
                        ),
                        React.createElement("input", { type: "number", id: "", min: "0", max: "100" })
                    ),
                    React.createElement(
                        "td",
                        null,
                        React.createElement(
                            "select",
                            { id: "" },
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
                        "td",
                        null,
                        React.createElement("input", { type: "checkbox", id: "" })
                    )
                ));
            };

            return React.createElement(
                "div",
                { id: "scheduleBuilder" },
                React.createElement(
                    "h2",
                    null,
                    "Schedule Builder"
                ),
                React.createElement(
                    "form",
                    null,
                    React.createElement(
                        "table",
                        null,
                        React.createElement(
                            "tr",
                            null,
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    "b",
                                    null,
                                    "Task Name"
                                )
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    "b",
                                    null,
                                    "Duration (hrs:mins)"
                                )
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    "b",
                                    null,
                                    "Urgency"
                                )
                            ),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    "b",
                                    null,
                                    "Add Breaks"
                                )
                            )
                        ),
                        rows.map(function (value, index) {
                            return value;
                        }),
                        React.createElement(
                            "tr",
                            null,
                            React.createElement("br", null)
                        ),
                        React.createElement(
                            "tr",
                            null,
                            React.createElement("td", null),
                            React.createElement("td", null),
                            React.createElement("td", null),
                            React.createElement(
                                "td",
                                null,
                                React.createElement(
                                    "button",
                                    { onClick: this.addTask },
                                    "Add Another Task"
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return ScheduleBuilder;
}(React.Component);

// parent react component
// contains the state of the scheduler and renders the components


var AutoScheduler = function (_React$Component3) {
    _inherits(AutoScheduler, _React$Component3);

    function AutoScheduler(props) {
        _classCallCheck(this, AutoScheduler);

        var _this3 = _possibleConstructorReturn(this, (AutoScheduler.__proto__ || Object.getPrototypeOf(AutoScheduler)).call(this, props));

        _this3.state = {
            scheduleExists: false,
            currentScreen: "HomeScreen"
        };

        _this3.createSchedule = _this3.createSchedule.bind(_this3);
        return _this3;
    }

    // Remove this module from the DOM 
    // Load the schedule builder component


    _createClass(AutoScheduler, [{
        key: "createSchedule",
        value: function createSchedule() {
            this.setState({
                currentScreen: "ScheduleBuilder"
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
                    createSchedule: this.createSchedule
                }),
                this.state.currentScreen == "ScheduleBuilder" && React.createElement(ScheduleBuilder, null)
            );
        }
    }]);

    return AutoScheduler;
}(React.Component);

ReactDOM.render(React.createElement(AutoScheduler, null), document.getElementById('reactEntry'));