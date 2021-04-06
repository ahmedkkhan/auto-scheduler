class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="homeScreen">
                <button onClick={this.props.createSchedule}>Create Schedule</button>
                <br />
                { this.props.exists && <button onClick={this.props.resumeHandler}>Resume Schedule</button> }
            </div>
        );
    }
}

class ScheduleBuilder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            numTasks: 1
        };

        this.addTask = this.addTask.bind(this);
    }

    // Adds a new task input to the form
    addTask(event) {
        event.preventDefault();
        this.setState((state) => ({
            numTasks: state.numTasks + 1
        }))
    }

    render() {
        // Add rows to the table based on the number of tasks specified
        let rows = [];
        for(let i = 0; i < this.state.numTasks; ++i) {
            rows.push(
                <tr>
                    <td><input type="text" id=""></input></td>
                    <td>
                        <input type="number" id="" min="0" max="100"></input>
                        <b>:</b>
                        <input type="number" id="" min="0" max="100"></input>
                    </td>
                    <td>
                        <select id="">
                            <option value="1">Very Urgent</option>
                            <option value="2">Somewhat Urgent</option>
                            <option value="3">Not Urgent</option>
                        </select>
                    </td>
                    <td><input type="checkbox" id=""></input></td> 
                </tr>
            );
        };

        return (
            <div id="scheduleBuilder">
                <h2>Schedule Builder</h2>
                <form>
                    <table>
                        <tr>
                            <td><b>Task Name</b></td>
                            <td><b>Duration (hrs:mins)</b></td>
                            <td><b>Urgency</b></td>
                            <td><b>Add Breaks</b></td>
                        </tr>
                        { rows.map((value, index) => {
                            return value;
                        }) }
                        <tr><br/></tr>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><button onClick={this.addTask}>Add Another Task</button></td>
                        </tr>
                    </table>
                </form>
            </div>
        );
    }
}


// parent react component
// contains the state of the scheduler and renders the components
class AutoScheduler extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleExists: false,
            currentScreen: "HomeScreen",
        };

        this.createSchedule = this.createSchedule.bind(this);
    }

    // Remove this module from the DOM 
    // Load the schedule builder component
    createSchedule() {
        this.setState({
            currentScreen: "ScheduleBuilder"
        });
    }

    render() {
        return (
            <div id="container">
                { this.state.currentScreen === "HomeScreen" && <HomeScreen 
                    exists={this.state.scheduleExists}
                    createSchedule={this.createSchedule}
                /> }

                { this.state.currentScreen == "ScheduleBuilder" && <ScheduleBuilder /> }
            </div>
        );
    }
}

ReactDOM.render(
    <AutoScheduler />,
    document.getElementById('reactEntry')
);
