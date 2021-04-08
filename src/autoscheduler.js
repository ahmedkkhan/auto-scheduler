class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="homeScreen">
                <button class="btn btn-primary btn-lg btn-block" onClick={this.props.createSchedule}>Create Schedule</button>
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
            breakFreqHours: 1,
            breakFreqMins: 0
        };

        this.addTask = this.addTask.bind(this);
        this.reset = this.reset.bind(this);
        this.processSchedule = this.processSchedule.bind(this);

        // Form input handlers
        this.handleChange = this.handleChange.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
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

        // Compute the break frequency in seconds
        let breakFreq = (this.state.breakFreqHours * 3600) + (this.state.breakFreqMins * 60);

        // Create the schedule data structure
        let currentTaskID = 0;
        inputList.forEach((task) => {
            // Skip tasks with no duration
            if(task.duration === 0) {
                return;
            }

            // If this isn't the first task, add a break between tasks
            // This break will have the same task ID as the subsequent task
            // If the user specified 0 as the between-task break length, do nothing
            if(currentTaskID !== 0 && this.state.betweenTaskBreakLength !== 0) {   
                schedule.tasks.push({
                    name: "Break",
                    duration: this.state.betweenTaskBreakLength,
                    urgency: 0,
                    id: currentTaskID,
                    status: "pending"
                });
            }

            // Split tasks that are too long
            // Don't split tasks if the user specified a mid-task break length of 0
            while(task.breaks === true && task.duration > breakFreq && this.state.midTaskBreakLength !== 0) {
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

    updateSettings(event) {
        event.preventDefault();
        if(event.target.id === "settings-mtb") {
            this.setState({
                midTaskBreakLength: event.target.value * 60
            });
        }
        else if(event.target.id === "settings-btb") {
            this.setState({
                betweenTaskBreakLength: event.target.value * 60
            });
        }
        else if(event.target.id === "settings-freq-hrs") {
            this.setState({
                breakFreqHours: event.target.value
            });
        }
        else if(event.target.id === "settings-freq-mins") {
            this.setState({
                breakFreqMins: event.target.value
            });
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
                <div class="form-row">
                    <div class="form-group col-md-3">
                        <input type="text" class="form-control" id={"name-" + i} value={this.state.tasks[i].name} onChange={this.handleChange}></input>
                    </div>
                    <div class="form-group col-md-2">
                        <input type="number" class="form-control" id={"hrs-" + i} min="0" max="100" value={this.state.tasks[i].hrs} onChange={this.handleChange}></input>                        
                    </div>
                    <div class="form-group col-md-2">
                        <input type="number" class="form-control" id={"mins-" + i} min="0" max="100" value={this.state.tasks[i].mins} onChange={this.handleChange}></input>
                    </div>
                    <div class="form-group col-md-3">
                        <select class="form-control" id={"urgency-" + i} value={this.state.tasks[i].urgency} onChange={this.handleChange}>
                            <option value="1">Very Urgent</option>
                            <option value="2">Somewhat Urgent</option>
                            <option value="3">Not Urgent</option>
                        </select>
                    </div>
                    <div class="custom-control custom-checkbox col-md-2">
                        <input class="custom-control-label" value="" type="checkbox" id={"breaks-" + i} checked={this.state.tasks[i].breaks} onChange={this.handleChange}></input>
                    </div>
                </div>
            );
        };

        return (
            <div id="scheduleBuilder">
                <h2>Schedule Builder</h2>
                <form onKeyPress={this.preventEnterKeySubmit}>
                    <table>
                        <div class="form-row">
                            <div class="form-group col-md-3">Task Name</div>
                            <div class="form-group col-md-2">Hours</div>
                            <div class="form-group col-md-2">Minutes</div>
                            <div class="form-group col-md-3">Urgency</div>
                            <div class="form-group col-md-2">Add Break</div>
                        </div>
                        { rows.map((value, index) => {
                            return value;
                        }) }
                        <div class="form-row"><br/></div>
                        <div class="form-row">
                            <td><button class="btn btn-primary" onClick={this.addTask}>Add Another Task</button></td>
                            <td></td>
                            <td><button class="btn btn-danger" type="reset" onClick={this.reset}>Reset Schedule</button></td>
                            <td><button class="btn btn-success" onClick={this.processSchedule}>Start Schedule</button></td>
                        </div>
                        
                    </table>
                    <br/><br/>
                    <h2>Settings</h2>
                    <table>
                        <div class="form-row">
                            <td><b>Mid-task break duration (mins):</b></td>
                            <td><input type="number" id="settings-mtb" value={this.state.midTaskBreakLength / 60} min="0" onChange={this.updateSettings}></input></td>
                        </div>
                        <div class="form-row">
                            <td><b>Between-task break duration (mins):</b></td>
                            <td><input type="number" id="settings-btb" value={this.state.betweenTaskBreakLength / 60} min="0" onChange={this.updateSettings}></input></td>
                        </div>
                        <div class="form-row">
                            <td><b>Time before mid-task breaks (hrs:mins):</b></td>
                            <td>
                                <input type="number" id="settings-freq-hrs" min="0" max="100" value={this.state.breakFreqHours} onChange={this.updateSettings}></input>
                                <b>:</b>
                                <input type="number" id="settings-freq-mins" min="0" max="100" value={this.state.breakFreqMins} onChange={this.updateSettings}></input>
                            </td>
                        </div>
                    </table>
                </form>
            </div>
        );
    }
}

class ScheduleDisplay extends React.Component {
    constructor(props) {
        super(props);

        // Deep copy the schedule into this components state
        this.state = {
            schedule: JSON.parse(JSON.stringify(this.props.schedule))
        };
    }

    render() {
        return (
            null
        )
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
        this.setState({
            schedule: schedule,
            currentScreen: "ScheduleDisplay"
        });
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

                { this.state.currentScreen === "ScheduleDisplay" && <ScheduleDisplay
                    schedule={this.state.schedule}
                /> }
            </div>
        );
    }
}

ReactDOM.render(
    <AutoScheduler />,
    document.getElementById('reactEntry')
);
