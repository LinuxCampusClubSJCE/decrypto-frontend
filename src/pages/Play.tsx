import { useEffect } from "react";
import { fetchData } from "../utils/fetch";

const Play = () => {
	useEffect(() => {
		(async () => {
			const data = await fetchData({ path: "/question/my" });
			console.log(data);
		})();
	}, []);

	return <div>Play</div>;
};
export default Play;
