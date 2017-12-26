import React from "react";
import { connect } from 'react-redux';

const lines = {
    LINE_001: 'I went for a walk down the road',
    LINE_002: 'Peanuts',
    LINE_003: 'Pineapple',
    LINE_004: 'Grapes',
    LINE_005: 'Melons',
    LINE_006: 'Oranges',
    LINE_007: 'Coconuts'
};

const dialogue = {
    SEQUENCE_001: {
        random: true,
        contents: [
            {lineCode: 'LINE_001'},
            {lineCode: 'LINE_002'},
            {lineCode: 'LINE_003'},
            {lineCode: 'LINE_004'},
            {lineCode: 'LINE_005'},
            {lineCode: 'LINE_006'},
            {lineCode: 'LINE_007'}
        ]
    }
};

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentLine: 'LINE_001',
            currentText: '',
            letterElapsed: 0,
            lineDisplayed: false,
            numCharsDisplayed: 0,
            sequence: 'SEQUENCE_001',
            lineIndex: 0
        };
        this.tick = this.tick.bind(this);
        this.nextLine = this.nextLine.bind(this);
        this.start = null;
    }

    componentDidMount() {
        requestAnimationFrame(this.tick);
    }

    tick(timestamp) {
        if (!this.start) {
            this.start = timestamp;
        }

        const elapsed = (timestamp - this.start) / 1000;
        this.start = timestamp;

        let newState = {};

        const textSpeed = 0.075;
        if (!this.state.lineDisplayed) {
            newState.letterElapsed = this.state.letterElapsed + elapsed;
            if (newState.letterElapsed > textSpeed) {
                newState.letterElapsed -= textSpeed;
                newState.numCharsDisplayed = this.state.numCharsDisplayed + 1;

                const currentSequence = dialogue[this.state.sequence];
                const currentSequenceLine = currentSequence.contents[this.state.lineIndex];
                const currentLine = lines[currentSequenceLine.lineCode];
                newState.currentText = currentLine.substring(0, newState.numCharsDisplayed);
                if (newState.numCharsDisplayed == currentLine.length) {
                    newState.lineDisplayed = true;
                }
            }
        }

        this.setState(newState);

        requestAnimationFrame(this.tick);
    }

    render() {
        return (
            <div className='game'>
                <p onClick={this.nextLine}>{this.state.currentText}</p>
            </div>
        );
    }

    nextLine() {
        const currentSequence = dialogue[this.state.sequence];
        if (this.state.lineDisplayed) {

            let nextLineIndex;
            if (currentSequence.random) {
                nextLineIndex = Math.floor(Math.random() * (currentSequence.contents.length - 1));
            } else {
                nextLineIndex = (this.state.lineIndex + 1) % currentSequence.contents.length;
            }

            this.setState({
                currentText: '',
                letterElapsed: 0,
                lineDisplayed: false,
                numCharsDisplayed: 0,
                lineIndex: nextLineIndex
            });
        } else {
            this.setState({
                currentText: lines[currentSequence.contents[this.state.lineIndex].lineCode],
                lineDisplayed: true,
            });
        }
    }
}

const mapStateToProps = () => {
    return {};
};

export default connect(mapStateToProps)(App);