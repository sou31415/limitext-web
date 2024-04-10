import React, { useState, useEffect, useRef } from 'react';
import { ADDRESS } from './secret';
import { BaseType } from './type';
import "./App.css";
const App: React.FC = () => {
	const [user, setUser] = useState<string>("");
	const userRef = useRef<HTMLInputElement>(null!);
	const [message, setMessage] = useState<string>("");
	const messageRef = useRef<HTMLInputElement>(null!);
	const [messages, setMessages] = useState<Array<BaseType>>([]);
	const [pass, setPass] = useState<string>("");
	const passRef = useRef<HTMLInputElement>(null!);
	const [login, setLogin] = useState<boolean>(false);

	const handleLogin = async () => {
		setPass(passRef.current.value);
		setUser(userRef.current.value);
		const response = await fetch(ADDRESS + '/login/cert', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ user: userRef.current.value, pass: passRef.current.value }),
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
		<input type="text" placeholder="Enter your name..." ref={userRef} /><br />
		<input type="password" placeholder="Enter the password..." ref={passRef} /><br />
		<button onClick={handleLogin}>Login(Register)</button></center>
	</div>);
	const Logout = () => {
		setLogin(false);
		window.location.reload();
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
							<input type="text" placeholder="Your Message" ref={messageRef} />
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
			body: JSON.stringify({ user: user, message: messageRef.current.value, time: getCurrentUnixTimeBigInt().toString() }),
		});
	};

	return (
		<>
			<h1>Limitext</h1>
			{resource}
		</>
	);
}
export default App;