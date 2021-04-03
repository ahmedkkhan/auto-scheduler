// Short-hand, use e to call create elements
const e = React.createElement;

class homescreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return e("p", null, "Hello world");
    }
}

ReactDOM.render(
    e(homescreen, null, null),
    document.getElementById('reactEntry')
);