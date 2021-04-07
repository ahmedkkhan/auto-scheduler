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

        // Break length and frequency are in seconds
        // Break frequency refers to how long a task can be before adding a break
        this.state = {
            numTasks: 1,
            tasks: [ScheduleBuilder.createTask()],
            midTaskBreakLength: 600,
            betweenTaskBreakLength: 900,
            breakFreq: 3600
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
            numTasks: 1,
            tasks: [ScheduleBuilder.createTask()]
        });
    }

    // Process the schedule and pass schedule to the container component
    processSchedule(event) {
        event.preventDefault();

        // User input data lives in the state
        // Use it to create an appropriate schedule
        let schedule = {
            elapsedTime: 0,
            tasks: [],
        };

        // Deep clone the tasks list
        let inputList = JSON.parse(JSON.stringify(this.state.tasks));

        // Compute task durations in seconds
        inputList.forEach((element) => {
            element.duration = (element.hrs * 3600) + (element.mins * 60);
        });

        // Sort tasks based on urgency, breaking ties with longer tasks first
        inputList.sort((a, b) => {
            if(a.urgency > b.urgency) {
                return 1;
            } else if(a.urgency < b.urgency) {
                return -1;
            } else {
                // break ties using task duration
                if(a.duration > b.duration) {
                    return -1;
                }
                return 1;
            }
        });

        // Create the schedule data structure
        let currentTaskID = 0;
        inputList.forEach((task) => {
            // If this isn't the first task, add a break between tasks
            // This break will have the same task ID as the subsequent task
            if(currentTaskID !== 0) {   
                schedule.tasks.push({
                    name: "Break",
                    duration: this.state.betweenTaskBreakLength,
                    urgency: 0,
                    id: currentTaskID,
                    status: "pending"
                });
            }

            if(task.breaks === true && task.duration > this.state.breakFreq) {
                // Push back the max duration for part of the task
                schedule.tasks.push({
                    name: task.name,
                    duration: this.state.breakFreq,
                    urgency: task.urgency,
                    id: currentTaskID,
                    status: "pending"
                });
                // Update the remaining task duration
                task.duration -= this.state.breakFreq;
                // Push back a break
                schedule.tasks.push({
                    name: "Mid-Task Break",
                    duration: this.state.midTaskBreakLength,
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
