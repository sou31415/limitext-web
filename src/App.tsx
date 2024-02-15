import React, { useState, useEffect } from 'react';
import { ADDRESS } from './secret';
import { BaseType, PostType } from './type';
import "./App.css";
const App: React.FC = () => {
	const [user, setUser] = useState<string>('');
	const [message, setMessage] = useState<string>('');
	const [messages, setMessages] = useState<Array<BaseType>>([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(ADDRESS, {
				mode: "cors",
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data: Array<BaseType> = await response.json();
			setMessages(data);
		};
		fetchData();
	}, []);

	const handleSubmit = async () => {
		const getCurrentUnixTimeBigInt = (): bigint => {
			const currentUnixTime = Math.floor(Date.now() / 1000);
			return BigInt(currentUnixTime);
		};
		await fetch(ADDRESS + '/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user: user, message: message, time: getCurrentUnixTimeBigInt }),
		});
	};

	return (
		<div>
			<div>
				<input type="text" value={user} placeholder="Your Name" onChange={(e) => setUser(e.target.value)} /><br />
				<input type="text" value={message} placeholder="Your Message" onChange={(e) => setMessage(e.target.value)} />
				<button onClick={handleSubmit}>Send Message</button>
			</div>
			<div>
				{messages.map(x => (
					<div className="container">
						<p className="box">Account : @{x.user}</p>
						<p className="box">{x.message}</p>
					</div>
				))}
			</div>
		</div>
	);
}
export default App;