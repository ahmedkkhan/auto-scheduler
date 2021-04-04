var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HomeScreen = function (_React$Component) {
    _inherits(HomeScreen, _React$Component);

    function HomeScreen(props) {
        _classCallCheck(this, HomeScreen);

        var _this = _possibleConstructorReturn(this, (HomeScreen.__proto__ || Object.getPrototypeOf(HomeScreen)).call(this, props));

        _this.state = {
            scheduleExists: false
        };
        return _this;
    }

    // Remove this module from the DOM 
    // Load the schedule builder component


    _createClass(HomeScreen, [{
        key: "createSchedule",
        value: function createSchedule() {}
    }, {
        key: "resumeSchedule",
        value: function resumeSchedule() {}
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { id: "homescreen" },
                React.createElement(
                    "h1",
                    null,
                    "Auto-scheduler"
                ),
                React.createElement(
                    "button",
                    { onClick: this.createSchedule },
                    "Create Schedule"
                ),
                React.createElement("br", null),
                this.state.scheduleExists && React.createElement(
                    "button",
                    { onClick: this.resumeSchedule },
                    "Resume Schedule"
                )
            );
        }
    }]);

    return HomeScreen;
}(React.Component);

var ScheduleBuilder = function (_React$Component2) {
    _inherits(ScheduleBuilder, _React$Component2);

    function ScheduleBuilder() {
        _classCallCheck(this, ScheduleBuilder);

        return _possibleConstructorReturn(this, (ScheduleBuilder.__proto__ || Object.getPrototypeOf(ScheduleBuilder)).apply(this, arguments));
    }

    return ScheduleBuilder;
}(React.Component);

ReactDOM.render(React.createElement(HomeScreen, null), document.getElementById('reactEntry'));