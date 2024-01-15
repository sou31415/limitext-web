import React, { useEffect, useState } from "react";
import "./App.css";
import { ADDRESS } from "./secret";
interface BaseType {
	user: string;
	message: string;
};
const App: React.FC = () => {
	const [info, setInfo] = useState<Array<BaseType>>([]);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(ADDRESS, {
					mode: "cors",
					method: "GET",
					headers: { "Content-Type": "application/json" }
				});
				const data: Array<BaseType> = await response.json();
				setInfo(data);
			} catch (error) {
				console.error(error);
			}
		};
		fetchData();
	}, []);
	const resource = info.map(x =>
		<>
			<p>user : {x.user}</p>
			<p>message : {x.message}</p>
		</>
	);
	return (
		<>
			{resource}
		</>
	);
}
export default App;