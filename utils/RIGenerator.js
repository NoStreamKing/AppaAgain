const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const { MessageAttachment } = require('discord.js');

exports.generateRankImage = async (rank,message) => {
    const canvas = createCanvas(375, 150);
    const context = canvas.getContext('2d');

    console.log(rank)

    Promise.all([
        loadImage('assets/background.png'),
        loadImage('assets/text.png'),
        loadImage(`assets/${rank.replaceAll(" ", "_")}_Rank.png`),
        loadImage('assets/small_appa.png'),
        loadImage('assets/small_appa.png')
    ]).then(([background, title, rank, icon1, icon2]) => {
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        const titleX = (canvas.width - title.width) / 2;
        const titleY = 10;
        context.drawImage(title, titleX, titleY);
        const iconPadding = 10;
        const iconY = canvas.height - icon1.height - iconPadding;
        const icon1X = iconPadding;
        const icon2X = canvas.width - icon2.width - iconPadding;
        context.drawImage(icon1, icon1X, iconY);
        context.drawImage(icon2, icon2X, iconY);
    
        // Resize the rank image to a maximum width of 85 pixels
        const maxRankWidth = 85;
        const rankAspectRatio = rank.width / rank.height;
        const newRankWidth = Math.min(maxRankWidth, rank.width);
        const newRankHeight = newRankWidth / rankAspectRatio;
        const rankX = (((canvas.width) / 2) - (newRankWidth / 2));
        const rankY = (10 + title.height);
        context.drawImage(rank, rankX, rankY, newRankWidth, newRankHeight);
        fs.writeFileSync('rank.png', canvas.toBuffer());
        
        message.reply({content: "Kayeteaa's rank is currently",files: [{ attachment: 'rank.png' }]}).then().catch(console.error);

    }).catch((error) => {
        console.error(error);
    });

};



