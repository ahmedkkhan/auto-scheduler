class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="homeScreen">
                <div>
                    Auto Scheduler is a web application that helps you plan out your day to improve productivity. Click the button below to get started.
                </div>
                <hr /> 
                <button class="btn btn-primary btn-lg btn-block" onClick={this.props.createSchedule}>Create Schedule</button>
                { this.props.exists ? <button class="btn btn-success btn-lg btn-block" onClick={this.props.resumeHandler}>Resume Schedule</button> : <button class="btn btn-secondary btn-lg btn-block">Resume Schedule</button> }
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
        let lastUrgency = 0;

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
                    urgency: lastUrgency,
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
            // Use this task's urgency for the urgency of the subsequent break
            lastUrgency = task.urgency;
        });

        // console.log(schedule);        

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
                        <select class="form-control urgent" id={"urgency-" + i} value={this.state.tasks[i].urgency} onChange={this.handleChange}>
                            <option value="1">Very Urgent</option>
                            <option value="2">Somewhat Urgent</option>
                            <option value="3">Not Urgent</option>
                        </select>
                    </div>
                    <div class="form-check col-md-2">
                        <input class="form-check-input" value="" type="checkbox" id={"breaks-" + i} checked={this.state.tasks[i].breaks} onChange={this.handleChange}></input>
                    </div>
                </div>
            );
        };

        return (
            <div id="scheduleBuilder">
                <h3>Schedule Builder</h3>
                <br />
                <div id="scheduleBuilderTitle">
                    Build your list of tasks in the table below. Auto Scheduler will automatically order and display your tasks when you hit the "Start Schedule" button. 
                    Tasks are sorted by urgency level, with longer tasks given priority.
                    <hr />    
                </div>

                <form onKeyPress={this.preventEnterKeySubmit}>
                    <table id="scheduleBuilderTable">
                        <div class="form-row">
                            <div class="form-group col-md-3">Task Name</div>
                            <div class="form-group col-md-4">Duration (hours : mins)</div>
                            <div class="form-group col-md-3">Urgency</div>
                            <div class="form-group col-md-2">Add Break</div>
                        </div>
                        { rows.map((value, index) => {
                            return value;
                        }) }
                        <div class="form-row"><br/></div>
                        <div class="form-row">
                            <button class="btn btn-primary form-group col-md-3" onClick={this.addTask}>Add Another Task</button>
                            <div class="form-group col-md-2"></div>
                            <button class="btn btn-danger form-group col-md-3" type="reset" onClick={this.reset}>Reset Schedule</button>
                            <button class="btn btn-success form-group col-md-3" onClick={this.processSchedule}>Start Schedule</button>
                        </div>
                        <hr />
                    </table>
                    <h3>Settings</h3>
                    <table id="settingsTable">
                        <div class="form-group row">
                            <label for="settings-mtb" class="col-form-label col-md-7">Mid-task break duration (mins)</label>
                            <div class="form-row col-md">
                            <input type="number" class="form-control" id="settings-mtb" value={this.state.midTaskBreakLength / 60} min="0" onChange={this.updateSettings} />
                            </div>
                        </div>
                        <div class="form-group row">
                            <label for="settings-freq-hrs" class="col-form-label col-md-7">Time before mid-task breaks (hrs:mins)</label>
                                <div class="form-row col-md">
                                    <input type="number" class="form-control" id="settings-freq-hrs" min="0" max="100" value={this.state.breakFreqHours} onChange={this.updateSettings} />
                                </div>
                                <div class="form-row col-md">
                                    <input type="number" class="form-control" id="settings-freq-mins" min="0" max="100" value={this.state.breakFreqMins} onChange={this.updateSettings}/>
                                </div>
                        </div>
                        <div class="form-group row">
                            <label for="settings-btb" class="col-form-label col-md-7">Between-task break duration (mins):</label>
                            <div class="form-row col-md">
                                <input type="number" class="form-control" id="settings-btb" value={this.state.betweenTaskBreakLength / 60} min="0" onChange={this.updateSettings} />
                            </div>
                        </div>
                    </table>
                </form>
                <br /><br /><br />
            </div>
        );
    }
}

class ScheduleDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.updateTimer = this.updateTimer.bind(this);
        this.checkTask = this.checkTask.bind(this);
        this.markTaskAsDone = this.markTaskAsDone.bind(this);
        this.finishSchedule = this.finishSchedule.bind(this);
        this.closeSchedule = this.closeSchedule.bind(this);

        this.acceptPopup = this.acceptPopup.bind(this);
        this.addTime = this.addTime.bind(this);
        this.reschedule = this.reschedule.bind(this);

        let time = 0;
        if(this.props.resume) {
            time = this.props.elapsedTime;
        }
        
        // Deep copy the schedule into this components state
        this.state = {
            elapsedTime: time,
            schedule: JSON.parse(JSON.stringify(this.props.schedule)),
            showPopup: false,
            popupTask: {},
            popupTaskNum: 0,
            popupObject: null,
            timer: setInterval(this.updateTimer, 1000)
        };

        // Initalize the schedule to start immediately
        // Set the first task to ongoing
        if(!this.props.resume) {
            this.state.schedule.tasks[0].status = "ongoing";
        }
    }

    updateTimer() {
        // Add a second to the elapsed time
        this.setState((state) => ({
            elapsedTime: state.elapsedTime + 1
        }));
        // Save the state to local storage
        localStorage.setItem("schedule", JSON.stringify(this.state.schedule));
        localStorage.setItem("elapsedTime", JSON.stringify(this.state.elapsedTime));
        // console.log("Saved timer: " + this.state.elapsedTime);
    }

    // Event handler for "I'm done with this task" button 
    markTaskAsDone() {
        let foundOngoing = false;
        let completed = false;
        // Loop until we find the ongoing task
        this.state.schedule.tasks.forEach((task) => {
            if(task.status === "ongoing") {
                foundOngoing = true;
                // Mark the task as completed
                task.status = "completed";
                // Reset the timer
                this.state.elapsedTime = 0;
                completed = true;
            }
            // Mark the next task as ongoing if we completed the previous one
            else if(foundOngoing && completed) {
                task.status = "ongoing";
                completed = false;
            }
        });

        // If there was not an ongoing tasks, we've finished the schdule
        if(!foundOngoing) {
            this.finishSchedule();
        }

        // Make sure the popup is disabled
        this.state.popupObject = null;
        this.state.showPopup = false;
        
        // Force an update to the component since we have updated state
        this.forceUpdate();
    }

    finishSchedule() {
        // Remove any state from localStorge
        localStorage.removeItem("schedule");
        localStorage.removeItem("elapsedTime");
        this.closeSchedule();
    }

    closeSchedule() {
        clearInterval(this.state.timer);
        // Call endSchedule to return to home screen
        this.props.endSchedule();
    }
    
    checkTask() {
        let updatedState = false;
        let foundOngoing = false;
        let completed = false;
        let counter = 0;
        // Loop until we find the ongoing task
        this.state.schedule.tasks.forEach((task) => {
            if(task.status === "ongoing") {
                foundOngoing = true;
                // Check if the duration is less than the elapsed time
                if(task.duration <= this.state.elapsedTime) {
                    // Mark the task as completed
                    task.status = "completed";
                    updatedState = true;
                    // Reset the timer
                    this.state.elapsedTime = 0;
                    completed = true;
                    // Create the popup
                    this.state.popupTask = JSON.parse(JSON.stringify(task));
                    this.state.showPopup = true;
                    this.state.popupTaskNum = counter;
                    // Set the pop-up to clear after 30 seconds
                    this.state.popupObject = setTimeout(this.acceptPopup, 30000);
                    // Play ding sound on popup
                    let ding = new Audio("audio/ding.mp3");
                    ding.play();
                }
            }
            // Mark the next task as ongoing if we completed the previous one
            else if(foundOngoing && completed) {
                task.status = "ongoing";
                completed = false;
            }
            // Increment counter to store task list index
            counter +=1;
        });

        // If there was not an ongoing tasks, we've finished the schdule
        if(!foundOngoing) {
            this.finishSchedule();
        }

        // Force an update to the component since if we have updated state
        if(updatedState) {
            this.forceUpdate();
        }
    }

    // Functions for the post-task popup
    acceptPopup() {
        this.setState({
            showPopup: false,
            popupObject: null
        });
    }

    addTime() {
        // Insert a new task (same as task that just ended w/ 30 min duration)
        this.state.schedule.tasks.splice(this.state.popupTaskNum + 1, 0, {
            name: this.state.popupTask.name + " (+30 mins)",
            status: "ready",
            duration: 1800,
            urgency: this.state.popupTask.urgency,
            id: this.state.popupTask.currentTaskID
        });

        // Set the ready task to ongoing and ongoing task
        this.state.schedule.tasks.forEach((task) => {
            if(task.status === "ready") {
                task.status = "ongoing";
            }
            else if(task.status === "ongoing") {
                task.status = "pending";
            }
        });

        // Remove the popup
        this.state.popupObject = null;
        this.state.showPopup = false;

        // Force the task to update
        this.forceUpdate();
    }

    // Function for popup
    // Create a new task that is identical to this, and put it as the last task with this urgency level
    reschedule() {
        // If we don't find a task with lower urgency, reschedule to the last task
        let rescheduleIndex = this.state.schedule.tasks.length;
        let idx = 0;
        // only reschedule this task for after the next ongoing task
        let foundOngoing = false;
        this.state.schedule.tasks.forEach((task) => { 
            if(task.status === "ongoing") {
                foundOngoing = true;
            }
            else if(foundOngoing && task.urgency > this.state.popupTask.urgency){
                rescheduleIndex = idx;
            }
            idx++;
        });

        this.state.schedule.tasks.splice(rescheduleIndex, 0, {
            name: this.state.popupTask.name + " (rescheduled)",
            status: "pending",
            duration:  this.state.popupTask.duration,
            urgency: this.state.popupTask.urgency,
            id: this.state.popupTask.currentTaskID
        });
        
        // Remove the popup
        this.state.popupObject = null;
        this.state.showPopup = false;

        // Force the task to update
        this.forceUpdate();
    }
    
    render() {
        // Call checkTasks before rendering
        this.checkTask();

        // Compute the sections of the timer
        let taskTimer = 0;
        let elapsedHours = parseInt(this.state.elapsedTime / 3600);
        let elapsedMins = parseInt((this.state.elapsedTime % 3600) / 60);
        if(elapsedMins < 10) {
            elapsedMins = "0" + elapsedMins;
        }
        let elapsedSecs = parseInt(this.state.elapsedTime % 60);
        if(elapsedSecs < 10) {
            elapsedSecs = "0" + elapsedSecs;
        }

        return (
            <div id="scheduleDisplay">
                <h3>Schedule</h3>
                { this.state.showPopup && <TaskPopup 
                    taskname={this.state.popupTask.name}
                    accept={this.acceptPopup}
                    addTime={this.addTime}
                    reschedule={this.reschedule}
                /> }
                <div id="scheduleHeader">
                    <p>Time elapsed for this task: {elapsedHours}:{elapsedMins}:{elapsedSecs}</p>
                    <button class="btn btn-primary col-md-3" onClick={this.markTaskAsDone}>I'm done with this task</button>
                    <button class="btn btn-danger col-md-3" onClick={this.closeSchedule}>End schedule early</button>
                </div>
                <br/>
                <table class="table">
                    <thead>
                        <tr class="schedule-row">
                            <th scope="col">Task Name</th>
                            <th scope="col">Duration (Hours : Mins)</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.state.schedule.tasks.map((value, index) => {
                            let classText = "";
                            taskTimer = value.duration;
                            if(value.status === "ongoing") {
                                classText = "table-primary";
                                taskTimer = value.duration - this.state.elapsedTime;
                            } else if(value.status === "completed") {
                                classText = "table-success";
                            } else { // "pending"
                                classText = "table-warning";
                            }
                            
                            return (
                                <tr class={`schedule-row ${classText}`}>
                                    <td scope="col">{value.name}</td>
                                    <td scope="col"> 
                                        {parseInt( taskTimer / 3600)}
                                        :
                                        {parseInt( (taskTimer % 3600) / 60 ) >= 10 ? parseInt( (taskTimer % 3600) / 60) : "0" + parseInt( (taskTimer % 3600) / 60)}
                                        :
                                        {parseInt(  (taskTimer % 3600) % 60 )  >= 10 ? parseInt( (taskTimer % 3600) % 60 ) : "0" + parseInt(  (taskTimer % 3600) % 60) }
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <br /><br /><br />
            </div>
        )
    }
}

class TaskPopup extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="taskPopup">
                <p>Did u finish {this.props.taskname}?</p>
                <p>
                    <button class="btn btn-success" onClick={this.props.accept}>Yes!</button>
                    <button class="btn btn-secondary" onClick={this.props.reschedule}>Reschedule for Later</button>
                    <button class="btn btn-secondary" onClick={this.props.addTime}> Add 30 Minutes</button>
                </p>
            </div>
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
            elapsedTime: 0,
            currentScreen: "HomeScreen",
            resume: false
        };

        this.openScheduleBuilder = this.openScheduleBuilder.bind(this);
        this.makeSchedule = this.makeSchedule.bind(this);
        this.endSchedule = this.endSchedule.bind(this);
        this.resumeSchedule = this.resumeSchedule.bind(this);
        this.loadLocalSchedule = this.loadLocalSchedule.bind(this);
    }

    componentDidMount() {
        this.loadLocalSchedule();
    }

    // Attempt to load a schedule from disk, and updtate state accordingly
    loadLocalSchedule() {
        // Check the local storage to see if a schedule already exists
        let localSchedule = JSON.parse(localStorage.getItem("schedule"));
        let localElapsedTime = JSON.parse(localStorage.getItem("elapsedTime"));

        if(localSchedule !== null && localSchedule !== undefined && localSchedule["tasks"] !== undefined) {
            // If the schedule exists, load it
            this.setState({
                scheduleExists: true,
                schedule: localSchedule,
                elapsedTime: localElapsedTime
            });
        }

        this.forceUpdate();
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

    // Ends the schedule, returns to the main menu
    endSchedule(schedule) {
        this.setState({
            schedule: {},
            currentScreen: "HomeScreen",
            resume: false
        });
        this.loadLocalSchedule();
    }

    // Resume the schedule from localStorage
    resumeSchedule() {
        this.setState({
            currentScreen: "ScheduleDisplay",
            resume: true,
        });
    }

    render() {
        return (
            <div id="container">
                { this.state.currentScreen === "HomeScreen" && <HomeScreen 
                    exists={this.state.scheduleExists}
                    createSchedule={this.openScheduleBuilder}
                    resumeHandler={this.resumeSchedule}
                /> }

                { this.state.currentScreen === "ScheduleBuilder" && <ScheduleBuilder 
                    makeSchedule={this.makeSchedule}
                /> }

                { this.state.currentScreen === "ScheduleDisplay" && <ScheduleDisplay
                    resume={this.state.resume}
                    elapsedTime={this.state.elapsedTime}
                    schedule={this.state.schedule}
                    endSchedule={this.endSchedule}
                /> }
            </div>
        );
    }
}

ReactDOM.render(
    <AutoScheduler />,
    document.getElementById('reactEntry')
);
