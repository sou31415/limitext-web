import React, { useState, useEffect } from 'react';
import { ADDRESS } from './secret';
import { BaseType } from './type';
import "./App.css";
const App: React.FC = () => {
	const [user, setUser] = useState<string>('');
	const [message, setMessage] = useState<string>('');
	const [messages, setMessages] = useState<Array<BaseType>>([]);
	const [pass, setPass] = useState<string>("");
	const [login, setLogin] = useState<boolean>(false);

	const handleLogin = async () => {
		const response = await fetch(ADDRESS + '/login/cert', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user: user, pass: pass }),
		});
		const stat = await response.text();
		if (stat === "Ok") {
			alert('Succeeded Login!');
			setLogin(true);
		} else {
			alert('Failed Login. Please retry.');
		}
	};

	const [resource, setResource] = useState<JSX.Element>(<div><center>
		<input type="text" placeholder="Enter your name..." onChange={(e) => setUser(e.target.value)} /><br />
		<input type="password" placeholder="Enter the password..." onChange={(e) => setPass(e.target.value)} /><br />
		<button onClick={handleLogin}>Login(Register)</button></center>
	</div>);
	const Logout = () => {
		setLogin(false);
	}
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
			if (login) {
				setMessages(data.reverse());
				setResource(<div>
					<div><button onClick={Logout}>Logout</button>
						<center>
							<input type="text" value={message} placeholder="Your Message" onChange={(e) => setMessage(e.target.value)} />
							<br /><button onClick={handleSubmit}>Send Message</button>
						</center>
					</div>
					<div>
						{messages.map(x => (
							<div className="container">
								<p className="box">Account : @{x.user}</p>
								<p className="box">{x.message}</p>
							</div>
						))}
					</div>
				</div>)
			}
		};
		fetchData();
	}, [login, messages]);

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
			body: JSON.stringify({ user: user, message: message, time: getCurrentUnixTimeBigInt().toString() }),
		});
	};

	return (
		<>
			{resource}
		</>
	);
}
export default App;