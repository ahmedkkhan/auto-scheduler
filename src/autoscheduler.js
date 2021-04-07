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
            numTasks: 1,
            tasks: [ScheduleBuilder.createTask()]
        };

        this.addTask = this.addTask.bind(this);
        this.reset = this.reset.bind(this);
        this.processSchedule = this.processSchedule.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    // Creates a new task object for the state to hold
    static createTask() {
        let task = {
            name: "New Task",
            hrs: 1,
            mins: 0,
            urgency: 1,
            breaks: true,
        };

        return task;
    }

    // Adds a new task input to the form
    addTask(event) {
        event.preventDefault();
        this.setState((state) => ({
            numTasks: state.numTasks + 1,
            tasks: [...state.tasks, ScheduleBuilder.createTask()]
        }))
    }

    // Reset the schedule builder
    reset() {
        this.setState({
            numTasks: 1
        });
    }

    // Process the schedule and pass schedule to the container component
    processSchedule(event) {
        event.preventDefault();

        let schedule = {};

        this.props.makeSchedule(schedule);
    }

    // Form's calls this onKeyPress to prevent entry key from submitting form
    preventEnterKeySubmit(event) {
        // 13 is enter key
        if (event.which === 13) {
            event.preventDefault();
        }
    }

    // Updates state for form value change
    handleChange(event) {
        let id = event.target.id;
        let value = event.target.value;

        // Get input type
        let input_type = id.split('-')[0]; 
        // Get the numeric id
        let id_num = id.split('-')[1];

        // Update the value
        // This forces the state to update and re-render
        if(input_type === "breaks") {
            this.state.tasks[id_num][input_type] = !this.state.tasks[id_num][input_type];
        } else {
            this.state.tasks[id_num][input_type] = value;
        }
        this.forceUpdate();
    }

    render() {
        // Add rows to the table based on the number of tasks specified
        let rows = [];
        for(let i = 0; i < this.state.numTasks; ++i) {
            rows.push(
                <tr>
                    <td><input type="text" id={"name-" + i} value={this.state.tasks[i].name} onChange={this.handleChange}></input></td>
                    <td>
                        <input type="number" id={"hrs-" + i} min="0" max="100" value={this.state.tasks[i].hrs} onChange={this.handleChange}></input>
                        <b>:</b>
                        <input type="number" id={"mins-" + i} min="0" max="100" value={this.state.tasks[i].mins} onChange={this.handleChange}></input>
                    </td>
                    <td>
                        <select id={"urgency-" + i} value={this.state.tasks[i].urgency} onChange={this.handleChange}>
                            <option value="1">Very Urgent</option>
                            <option value="2">Somewhat Urgent</option>
                            <option value="3">Not Urgent</option>
                        </select>
                    </td>
                    <td><input type="checkbox" id={"breaks-" + i} checked={this.state.tasks[i].breaks} onChange={this.handleChange}></input></td> 
                </tr>
            );
        };

        return (
            <div id="scheduleBuilder">
                <h2>Schedule Builder</h2>
                <form onKeyPress={this.preventEnterKeySubmit}>
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
                            <td><button type="reset" onClick={this.reset}>Reset Schedule</button></td>
                            <td></td>
                            <td><button onClick={this.addTask}>Add Another Task</button></td>
                            <td><button onClick={this.processSchedule}>Start Schedule</button></td>
                        </tr>
                        
                    </table>
                    <br/><br/>
                    <h2>Settings</h2>
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
            schedule: {},
            currentScreen: "HomeScreen",
        };

        this.openScheduleBuilder = this.openScheduleBuilder.bind(this);
        this.makeSchedule = this.makeSchedule.bind(this);
    }

    // Remove this module from the DOM 
    // Load the schedule builder component
    openScheduleBuilder() {
        this.setState({
            currentScreen: "ScheduleBuilder"
        });
    }

    // Adds the schedule to this componenets state
    // Prepares the scheduleDisplay component
    makeSchedule(schedule) {
        
    }

    render() {
        return (
            <div id="container">
                { this.state.currentScreen === "HomeScreen" && <HomeScreen 
                    exists={this.state.scheduleExists}
                    createSchedule={this.openScheduleBuilder}
                /> }

                { this.state.currentScreen === "ScheduleBuilder" && <ScheduleBuilder 
                    makeSchedule={this.makeSchedule}
                /> }
            </div>
        );
    }
}

ReactDOM.render(
    <AutoScheduler />,
    document.getElementById('reactEntry')
);
