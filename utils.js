const affectionMappping = {
    0: ':black_heart:',
    1: ':white_heart:',
    2: ':purple_heart:',
    3: ':blue_heart:',
    4: ':green_heart:',
    5: ':yellow_heart:',
    6: ':orange_heart:',
    7: ':brown_heart:',
    8: ':heart:',
    9: ':sparkling_heart:'
}

const getAffectionEmoji = (affection) => {
    const lowerBound = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
    const upperBound = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99]
    let index = 0;
    for (let i = 0; i < lowerBound.length; i++) {
        if (affection >= lowerBound[i] && affection <= upperBound[i]) {
            index = i;
            break;
        }
    }
    return affectionMappping[index];

}

const capitalize = (string) => {
    const lowerCased = string.toLowerCase();
    return lowerCased.charAt(0).toUpperCase() + lowerCased.slice(1);
}

module.exports = {
    getAffectionEmoji, capitalize
}