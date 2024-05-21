import React, {useState} from 'react';
import {Text, Box, Newline, useInput, useApp} from 'ink';

export default function App() {
	const [text, setText] = useState(' ');
	const {exit} = useApp();
	useInput((input, key) => {
		if (key.ctrl && input === 'd') {
			// save the file
			exit();
		} else {
			let newText;
			if (key.return) {
				newText = text + '\n ';
			} else {
				newText = text + input;
			}
			setText(newText);
		}
	});
	return (
		<>
			<Box justifyContent="center">
				<Text color="green" bold>
					Input your text
				</Text>
				<Newline />
			</Box>
			{text.split('\n').map((t, i, arr) => (
				<Text key={i}>
					{'>'}
					{t}
					{i == arr.length - 1 ? '_' : ''}
				</Text>
			))}
		</>
	);
}
