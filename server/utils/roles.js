const constants = require("../lib/constants");

exports.getRoles = (user) => {
    let roles = [];

    if (user.isAdmin) {
        roles.push(constants.ADMIN);
    }

    if (user.isEmloyer) {
        roles.push(constants.EMPLOYER);
    }

    if (user.isFreelancer) {
        roles.push(constants.FREELANCER);
    }

    return roles;
}