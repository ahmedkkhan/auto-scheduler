class homeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <p>Hello world!</p>
        );
    }
}

ReactDOM.render(
    <homeScreen />,
    document.getElementById('reactEntry')
);