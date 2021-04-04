class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleExists: false
        };
    }

    // Remove this module from the DOM 
    // Load the schedule builder component
    createSchedule() {
        
    }
    
    resumeSchedule() {
        
    }

    render() {
        return (
            <div id="homescreen">
                <h1>Auto-scheduler</h1>
                <button onClick={ this.createSchedule }>Create Schedule</button>
                <br />
                { this.state.scheduleExists && <button onClick={this.resumeSchedule}>Resume Schedule</button> }
            </div>
        );
    }
}

class ScheduleBuilder extends React.Component {
    
}

ReactDOM.render(
    <HomeScreen />,
    document.getElementById('reactEntry')
);
