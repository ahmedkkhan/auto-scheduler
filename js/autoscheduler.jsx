class homescreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <p>Hello World!</p>
        );
    }
}

ReactDOM.render(
    <homescreen />,
    document.getElementById('reactEntry')
);