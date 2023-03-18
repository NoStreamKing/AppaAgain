const fs = require('fs');
const { getJSONFromFile,saveJSONToFile } = require('./StorageCheck.js');
const pathToPets = '../Storage/Pets.json';
const hourInMilliseconds = 3600000;
const dayInMilliseconds = 86400000;
const minuteInMilliseconds = 60000;

const hungerDecrease = 2.85714286;
const thirstDecrease = 2.85714286;
const happinessDecrease = 2.85714286;
const healthDecrease = 2.85714286;

let gameItems = undefined;

exports.runPetChecks = async () => {

    getJSONFromFile('Items.json', "Pets").then((items) => {
        gameItems = items;
    });

    const hourlyActions = setInterval(() => {
        getJSONFromFile('Pets.json').then((players) => {
            players.forEach(function(player) {
                let petData = player.Player.pet;
                hungerCheck(petData);
            });
            saveJSONToFile('Pets.json', players);
        });
    }, hourInMilliseconds);

}

/**
 * 
 * @param {*} pet - the pet object
 */

function hungerCheck(pet){

    let petStats = pet.stats;
    let currentTime = new Date().getTime();
    let lastFedTime = pet.records.lastFed;

    if(currentTime - lastFedTime > hourInMilliseconds){
        if(petStats.hunger <= 0){
            petStats.health -= healthDecrease;
            pet.records.lastFed = currentTime;
            pet.records.lastWatered = currentTime;
        }
        if(petStats.hunger > 0){
            petStats.hunger -= hungerDecrease;
        }
    }

}




// Action: Feed a pet

exports.feedPet = async (interaction,playerId, itemName) => {
    return new Promise((resolve, reject) => {

        getJSONFromFile('Pets.json').then((players) => {

            let player = players.find(player => player.Player.id == playerId);
            let pet = player.Player.pet;
            let petStats = pet.stats;
            let petRecords = pet.records;
            let inventory = pet.inventory;


            if(petStats.hunger >= 100){
                interaction.reply(`Your pet is already full!`, { ephemeral: true });
                resolve(`Your pet is already full!`);
            }

            if(petStats.hunger < 100){
                let itemToUse = gameItems.find(item => item.name.toLowerCase() == itemName.toLowerCase());
                if(itemToUse == undefined){
                    interaction.reply(`That item doesn't exist!`, { ephemeral: true });
                }else{

                    let itemInInventory = hasItem(player, itemToUse.name);
                    if(itemInInventory == undefined || itemInInventory == 0){
                        interaction.reply(`You don't have that item!`, { ephemeral: true });
                        resolve(`You don't have that item!`);
                    }else{

                        inventory[itemToUse.name.toLowerCase()] -= 1;

                        petStats.hunger = capValue(petStats.hunger += itemToUse.Hunger,100);
                        petStats.thirst = capValue(petStats.thirst += itemToUse.Thirst,100);
                        petStats.happiness = capValue(petStats.happiness += itemToUse.Happiness,100);
        
                        interaction.reply(`You fed your pet!`, { ephemeral: true });
                        petRecords.lastFed = new Date().getTime();
                        petRecords.lastWatered = new Date().getTime();
                        saveJSONToFile('Pets.json', players);
                        resolve(`You fed your pet!`);

                    }

                }
            
            }

        }).catch((error) => {
            console.log(error);
            reject(`Error: ${error}`);
        });

    });



}

function hasItem(player, itemName){

    let playerInventory = player.Player.pet.inventory;
    return playerInventory[itemName.toLowerCase()];

}

function capValue(value, maxValue) {
    return Math.min(value, maxValue);
}
