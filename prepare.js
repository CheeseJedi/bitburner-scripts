/** @param {NS} ns */
// Based on the early-hack-template.js but no hacking, only weaken and grow, on repeat.
export async function main(ns) {
    var target = ns.args[0];
    var moneyThresh = ns.getServerMaxMoney(target) * 0.95;
    var securityThresh = ns.getServerMinSecurityLevel(target) + 1;
    ns.clearLog();
    while (true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            await ns.grow(target);
        } else {
            ns.print('Prepare for ' + target + ' completed, exiting. Current values: SecLvl '
                + ns.getServerSecurityLevel(target) + ' MoneyAvailable ' + ns.getServerMoneyAvailable(target));
            await ns.sleep(100 * 60 * 5);
            //break;
        }
    }
}

// Standard function to allow the Bitburner terminal to autocomplete server names, as shown in the game's GitHub repo.
export function autocomplete(data, args) {
    return data.servers;
}
