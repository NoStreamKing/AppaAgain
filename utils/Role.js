

exports.mentionRole = (id) => {
    return `${process.env.ROLE_MENTION_FORMAT.replace('[ROLE_ID]',id)}`
};