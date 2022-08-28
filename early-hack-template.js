/** @param {NS} ns */
// Almost identical to the example provided in the game's documentation.
export async function main(ns) {
    var target = ns.args[0];
    var moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 5;

    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}

// Standard function to allow the Bitburner terminal to autocomplete server names, as shown in the game's GitHub repo.
export function autocomplete(data, args) {
    return data.servers;
}
