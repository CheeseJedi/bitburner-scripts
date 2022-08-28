/** @param {NS} ns */
// BitBurner Game Script - Purchase and/or upgrade Hacknet Nodes.
// CJ 2022
// Based (very loosely) on an example from the games documentation, 
// however prioritises upgrading all nodes at the same rate rather
// than maxing out one node at a time, to make nodes more effective
// in a shorter period of time.
export async function main(ns) {
	ns.disableLog("getServerMoneyAvailable");
	ns.disableLog("sleep");
	ns.clearLog();
	ns.tail();

	// Adjust these values, and (re)run script.
	let count = 8; // Hacknet nodes start getting a bit pricey around the 20th.
	let level = 50; // Range 1 - 200
	let ram = 1; // Range 1 - 64 GB
	let cores = 1; // Range 1 - 16 cores

	// Clamp function based on Min and Max mathematical functions.
	// This JS example syntax from: https://www.webtips.dev/webtips/javascript/how-to-clamp-numbers-in-javascript
	const Clamp = (num, min, max) => Math.min(Math.max(num, min), max);

	async function SufficientMoney(amount, budgetAllocation = 0.5, sleepMs = 3000) {
		// Returns when the 'home' money multiplied by the budgetAmount is equal to or exceeds the specified amount.
		// A budgetAllocation of 0.5 will mean the 'home' money needs to be double what's specified in amount, 
		// preventing all of the money on 'home' being used up in one go.
		while (true) {
			if (ns.getServerMoneyAvailable("home") * budgetAllocation >= amount) { break; }
			await ns.sleep(sleepMs);
		}
	}

	async function PurchaseNodes(count) {
		while (ns.hacknet.numNodes() < count) {
			let cost = ns.hacknet.getPurchaseNodeCost();
			await SufficientMoney(cost);
			let idx = ns.hacknet.purchaseNode();
			ns.print("Purchsed node with index " + idx + " for $"
				+ cost.toLocaleString("en-US", { style: "decimal", minimumFractionDigits: 2 }));
		};
		ns.print("HackNet Node Total: " + ns.hacknet.numNodes() + " of " + count);
	}

	async function UpgradeNodeLevels(level) {
		// === Upgrade Levels === Max of 200. 
		const MIN_LEVEL = 1;
		const MAX_LEVEL = 200;
		let targetLevel = Clamp(level, MIN_LEVEL, MAX_LEVEL);
		let lowestLevel = MAX_LEVEL;
		for (let i = 0; i < ns.hacknet.numNodes(); i++) {
			lowestLevel = Math.min(lowestLevel, ns.hacknet.getNodeStats(i).level);
		}
		if (lowestLevel > targetLevel) { return; }
		for (let thisLevel = lowestLevel; thisLevel < targetLevel + 1; thisLevel++) {
			for (let i = 0; i < ns.hacknet.numNodes(); i++) {
				if (ns.hacknet.getNodeStats(i).level >= thisLevel) { continue; }
				let cost = ns.hacknet.getLevelUpgradeCost(i, 1);
				await SufficientMoney(cost);
				ns.print("Level upgrading on node " + i + " to " + thisLevel);
				ns.hacknet.upgradeLevel(i, 1);
			}
		}
		ns.print("All nodes at or better than level " + targetLevel);
	}

	async function UpgradeNodeRAM(ram) {
		// === Upgrade RAM === Max of 64.
		const MIN_RAM = 1;
		const MAX_RAM = 64;
		let targetRam = Clamp(ram, MIN_RAM, MAX_RAM);
		let lowestRAM = MAX_RAM;
		for (let i = 0; i < ns.hacknet.numNodes(); i++) {
			lowestRAM = Math.min(lowestRAM, ns.hacknet.getNodeStats(i).ram);
		}
		if (lowestRAM > targetRam) { return; }
		for (let thisRAM = lowestRAM; thisRAM < targetRam + 1; thisRAM++) { // perhaps suboptimal due to RAM powers of two, but works.
			for (let i = 0; i < ns.hacknet.numNodes(); i++) {
				if (ns.hacknet.getNodeStats(i).ram >= thisRAM) { continue; }
				let cost = ns.hacknet.getRamUpgradeCost(i, 1);
				await SufficientMoney(cost);
				ns.print("RAM upgrading on node " + i + " to " + thisRAM + " GB");
				ns.hacknet.upgradeRam(i, 1);
			}
		}
		ns.print("All nodes at or better than " + targetRam + "GB RAM");
	}

	async function UpgradeNodeCores(cores) {
		// === Upgrade Cores === Max of 16.
		const MIN_CORES = 1;
		const MAX_CORES = 16;
		let targetCores = Clamp(cores, MIN_CORES, MAX_CORES);
		let lowestCoreCount = MAX_CORES;
		for (let i = 0; i < ns.hacknet.numNodes(); i++) {
			lowestCoreCount = Math.min(lowestCoreCount, ns.hacknet.getNodeStats(i).cores);
		}
		if (lowestCoreCount > targetCores) { return; }
		for (let thisCores = lowestCoreCount; thisCores < targetCores + 1; thisCores++) {
			for (let i = 0; i < ns.hacknet.numNodes(); i++) {
				if (ns.hacknet.getNodeStats(i).cores >= thisCores) { continue; }
				let cost = ns.hacknet.getCoreUpgradeCost(i, 1);
				await SufficientMoney(cost);
				ns.print("Core upgrading on node " + i + " to " + thisCores);
				ns.hacknet.upgradeCore(i, 1);
			}
		}
		ns.print("All nodes at or better than " + targetCores + " cores");
	}


	await PurchaseNodes(count);
	await UpgradeNodeLevels(level);
	await UpgradeNodeRAM(ram);
	await UpgradeNodeCores(cores);

}
