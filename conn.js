/** @param {NS} ns */
// BitBurner Game Script - Connects to a server specified in argument zero.
// CJ 2022
export async function main(ns) {
	let target = ns.args[0];
	let pathList = [];

	BuildPathFromTargetToHome(target, pathList);
	AutoType("connect " + pathList.join("; connect ", true));

	function BuildPathFromTargetToHome(serverName, pathList) {
		// Fills the pathList array with the server names needed to connect to the target.
		// Algorithm is recursive and starts from the target, working backwards to 'home',
		// based on the fact that the ns.scan() function returns the server's parent server
		// at element zero in it's results array.
		pathList.unshift(serverName); // Adds this server name to the TOP of the array.
		let serverList = ns.scan(serverName);
		if (serverList[0] != null) {
			if (serverList[0] == "home") { return; }
			BuildPathFromTargetToHome(serverList[0], pathList); // Recursive call.
		}
	}

	function AutoType(text, enterPress = true) {
		// Enter commands automatically, based on game documentation at:
		// https://bitburner.readthedocs.io/en/latest/netscript/advancedfunctions/inject_html.html

		// Acquire a reference to the terminal text field
		const terminalInput = document.getElementById("terminal-input");

		// Set the value to the command you want to run.
		terminalInput.value = text;

		// Get a reference to the React event handler.
		const handler = Object.keys(terminalInput)[1];

		// Perform an onChange event to set some internal values.
		terminalInput[handler].onChange({ target: terminalInput });

		if (enterPress) {
			// Simulate an enter press
			terminalInput[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
		}
	}
}

// Standard function to allow the Bitburner terminal to autocomplete server names, as shown in the game's GitHub repo.
export function autocomplete(data, args) {
	return data.servers;
}
