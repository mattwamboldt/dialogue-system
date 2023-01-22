import React from 'react';

const lines = {
    LINE_001: 'I went for a walk down the road',
    LINE_002: 'Peanuts',
    LINE_003: 'Pineapple',
    LINE_004: 'Grapes',
    LINE_005: 'Melons',
    LINE_006: 'Oranges',
    LINE_007: 'Coconuts',
};

const dialogue = {
    SEQUENCE_001: {
        random: true,
        contents: [
            { lineCode: 'LINE_001' },
            { lineCode: 'LINE_002' },
            { lineCode: 'LINE_003' },
            { lineCode: 'LINE_004' },
            { lineCode: 'LINE_005' },
            { lineCode: 'LINE_006' },
            { lineCode: 'LINE_007' },
        ],
    },
};

interface IState {
    currentLine: string,
    currentText: string,
    letterElapsed: number,
    lineDisplayed: boolean,
    numCharsDisplayed: number,
    sequence: string,
    lineIndex: number
}

class App extends React.Component<any, IState> {
    private start: number;

    public constructor(props) {
        super(props);

        this.state = {
            currentLine: 'LINE_001',
            currentText: '',
            letterElapsed: 0,
            lineDisplayed: false,
            numCharsDisplayed: 0,
            sequence: 'SEQUENCE_001',
            lineIndex: 0,
        };

        this.start = null;
    }

    public componentDidMount() {
        requestAnimationFrame(this.tick);
    }

    public tick = (timestamp: number) => {
        if (!this.start) {
            this.start = timestamp;
        }

        const elapsed = (timestamp - this.start) / 1000;
        this.start = timestamp;

        const newState: any = {};

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
                if (newState.numCharsDisplayed === currentLine.length) {
                    newState.lineDisplayed = true;
                }
            }
        }

        this.setState(newState);

        requestAnimationFrame(this.tick);
    };

    public render() {
        return (
            <div className="game">
                <p onClick={this.nextLine}>{this.state.currentText}</p>
            </div>
        );
    }

    private nextLine = () => {
        const currentSequence = dialogue[this.state.sequence];
        if (this.state.lineDisplayed) {
            let nextLineIndex: number;
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
                lineIndex: nextLineIndex,
            });
        } else {
            this.setState({
                currentText: lines[currentSequence.contents[this.state.lineIndex].lineCode],
                lineDisplayed: true,
            });
        }
    };
}

export default App;
