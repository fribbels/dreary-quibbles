let optimizerStatToJsonSubStat
let optimizerStatToAffixStat
let optimizerPartToPartId
let initialized = false

export const RelicRollFixer = {
  fixMainStatvalue: (relic) => {
    if (!initialized) RelicRollFixer.initialize()

    let enhance = relic.enhance
    let stat = relic.main.stat
    let partId = optimizerPartToPartId[relic.part]
    let grade = relic.grade
    let query = `${grade}${partId}`
    let affixes = DB.getMetadata().relics.relicMainAffixes[query].affixes
    let affix = Object.values(affixes).find(x => x.property == optimizerStatToAffixStat[stat])
    if (!affix) return value

    let step = affix.step
    let base = affix.base
    let totalValue = base + step * enhance
    let scaledValue = Utils.isFlat(stat) ? totalValue : totalValue * 100

    return Utils.precisionRound(scaledValue, 5)
  },

  fixSubStatValue: (stat, value, grade) => {
    if (!initialized) RelicRollFixer.initialize()

    // Can't fix speed values
    if (stat == Constants.Stats.SPD) return value

    let statsByGrade = relicRollValues[grade]
    if (!statsByGrade) return value

    let convertedStatType = optimizerStatToJsonSubStat[stat]
    if (!convertedStatType) return value
    if (!statsByGrade[convertedStatType]) return value

    let rollsMapping = statsByGrade[convertedStatType]
    let rolls = rollsMapping[value]
    if (!rolls) return value
    // Duplicate entries are arrays when stats collide
    if (rolls.length) rolls = rolls[0]

    let affixes = DB.getMetadata().relics.relicSubAffixes[grade].affixes
    let matched = Object.values(affixes).find(x => x.property == optimizerStatToAffixStat[stat])
    if (!matched) return value

    let base = matched.base
    let step = matched.step

    let oneRoll = base + step * 2
    let totalValue = oneRoll * rolls
    let scaledValue = Utils.isFlat(stat) ? totalValue : totalValue * 100

    return Utils.precisionRound(scaledValue, 5)
  },

  initialize: () => {
    initialized = true
    let conversions = CharacterConverter.getConstantConversions()
    optimizerStatToAffixStat = Utils.flipMapping(conversions.statConversion)
    optimizerPartToPartId = Utils.flipMapping(conversions.partConversion)

    optimizerStatToJsonSubStat = Utils.flipMapping({
      'ATK': Constants.Stats.ATK,
      'HP': Constants.Stats.HP,
      'DEF': Constants.Stats.DEF,
      'ATK_': Constants.Stats.ATK_P,
      'HP_': Constants.Stats.HP_P,
      'DEF_': Constants.Stats.DEF_P,
      'SPD': Constants.Stats.SPD,
      'CRIT Rate_': Constants.Stats.CR,
      'CRIT DMG_': Constants.Stats.CD,
      'Effect Hit Rate_': Constants.Stats.EHR,
      'Effect RES_': Constants.Stats.RES,
      'Break Effect_': Constants.Stats.BE,
    })
  }
}

// https://github.com/kel-z/HSR-Data/blob/main/output/relic_roll_vals.json
let relicRollValues = {
  "2": {
    "HP": {
      "13": 0.8,
      "15": 0.9,
      "16": 1.0
    },
    "ATK": {
      "6": 0.8,
      "7": 0.9,
      "8": 1.0
    },
    "DEF": {
      "6": 0.8,
      "7": 0.9,
      "8": 1.0
    },
    "HP_": {
      "1.3": 0.8,
      "1.5": 0.9,
      "1.7": 1.0
    },
    "ATK_": {
      "1.3": 0.8,
      "1.5": 0.9,
      "1.7": 1.0
    },
    "DEF_": {
      "1.7": 0.8,
      "1.9": 0.9,
      "2.1": 1.0
    },
    "SPD": {
      "1": [
        0.8,
        0.9,
        1.0
      ]
    },
    "CRIT Rate_": {
      "1": 0.8,
      "1.1": 0.9,
      "1.2": 1.0
    },
    "CRIT DMG_": {
      "2": 0.8,
      "2.3": 0.9,
      "2.5": 1.0
    },
    "Effect Hit Rate_": {
      "1.3": 0.8,
      "1.5": 0.9,
      "1.7": 1.0
    },
    "Effect RES_": {
      "1.3": 0.8,
      "1.5": 0.9,
      "1.7": 1.0
    },
    "Break Effect_": {
      "2": 0.8,
      "2.3": 0.9,
      "2.5": 1.0
    }
  },
  "3": {
    "HP": {
      "20": 0.8,
      "22": 0.9,
      "25": 1.0,
      "40": 1.6,
      "43": 1.7,
      "45": 1.8,
      "48": 1.9,
      "50": 2.0
    },
    "ATK": {
      "10": 0.8,
      "11": 0.9,
      "12": 1.0,
      "20": 1.6,
      "21": 1.7,
      "22": 1.8,
      "24": 1.9,
      "25": 2.0
    },
    "DEF": {
      "10": 0.8,
      "11": 0.9,
      "12": 1.0,
      "20": 1.6,
      "21": 1.7,
      "22": 1.8,
      "24": 1.9,
      "25": 2.0
    },
    "HP_": {
      "2": 0.8,
      "2.3": 0.9,
      "2.5": 1.0,
      "4.1": 1.6,
      "4.4": 1.7,
      "4.6": 1.8,
      "4.9": 1.9,
      "5.1": 2.0
    },
    "ATK_": {
      "2": 0.8,
      "2.3": 0.9,
      "2.5": 1.0,
      "4.1": 1.6,
      "4.4": 1.7,
      "4.6": 1.8,
      "4.9": 1.9,
      "5.1": 2.0
    },
    "DEF_": {
      "2.5": 0.8,
      "2.9": 0.9,
      "3.2": 1.0,
      "5.1": 1.6,
      "5.5": 1.7,
      "5.8": 1.8,
      "6.1": 1.9,
      "6.4": 2.0
    },
    "SPD": {
      "1": [
        0.8,
        0.9,
        1.0
      ],
      "2": [
        1.6,
        1.7,
        1.8,
        1.9,
        2.0
      ]
    },
    "CRIT Rate_": {
      "1.5": 0.8,
      "1.7": 0.9,
      "1.9": 1.0,
      "3.1": 1.6,
      "3.3": 1.7,
      "3.4": 1.8,
      "3.6": 1.9,
      "3.8": 2.0
    },
    "CRIT DMG_": {
      "3.1": 0.8,
      "3.4": 0.9,
      "3.8": 1.0,
      "6.2": 1.6,
      "6.6": 1.7,
      "6.9": 1.8,
      "7.3": 1.9,
      "7.7": 2.0
    },
    "Effect Hit Rate_": {
      "2": 0.8,
      "2.3": 0.9,
      "2.5": 1.0,
      "4.1": 1.6,
      "4.4": 1.7,
      "4.6": 1.8,
      "4.9": 1.9,
      "5.1": 2.0
    },
    "Effect RES_": {
      "2": 0.8,
      "2.3": 0.9,
      "2.5": 1.0,
      "4.1": 1.6,
      "4.4": 1.7,
      "4.6": 1.8,
      "4.9": 1.9,
      "5.1": 2.0
    },
    "Break Effect_": {
      "3.1": 0.8,
      "3.4": 0.9,
      "3.8": 1.0,
      "6.2": 1.6,
      "6.6": 1.7,
      "6.9": 1.8,
      "7.3": 1.9,
      "7.7": 2.0
    }
  },
  "4": {
    "HP": {
      "27": 0.8,
      "30": 0.9,
      "33": 1.0,
      "54": 1.6,
      "57": 1.7,
      "60": 1.8,
      "64": 1.9,
      "67": 2.0,
      "81": 2.4,
      "84": 2.5,
      "88": 2.6,
      "91": 2.7,
      "94": 2.8,
      "98": 2.9,
      "101": 3.0,
      "108": 3.2,
      "111": 3.3,
      "115": 3.4,
      "118": 3.5,
      "121": 3.6,
      "125": 3.7,
      "128": 3.8,
      "132": 3.9,
      "135": 4.0
    },
    "ATK": {
      "13": 0.8,
      "15": 0.9,
      "16": 1.0,
      "27": 1.6,
      "28": 1.7,
      "30": 1.8,
      "32": 1.9,
      "33": 2.0,
      "40": 2.4,
      "42": 2.5,
      "44": 2.6,
      "45": 2.7,
      "47": 2.8,
      "49": 2.9,
      "50": 3.0,
      "54": 3.2,
      "55": 3.3,
      "57": 3.4,
      "59": 3.5,
      "60": 3.6,
      "62": 3.7,
      "64": 3.8,
      "66": 3.9,
      "67": 4.0
    },
    "DEF": {
      "13": 0.8,
      "15": 0.9,
      "16": 1.0,
      "27": 1.6,
      "28": 1.7,
      "30": 1.8,
      "32": 1.9,
      "33": 2.0,
      "40": 2.4,
      "42": 2.5,
      "44": 2.6,
      "45": 2.7,
      "47": 2.8,
      "49": 2.9,
      "50": 3.0,
      "54": 3.2,
      "55": 3.3,
      "57": 3.4,
      "59": 3.5,
      "60": 3.6,
      "62": 3.7,
      "64": 3.8,
      "66": 3.9,
      "67": 4.0
    },
    "HP_": {
      "2.7": 0.8,
      "3.1": 0.9,
      "3.4": 1.0,
      "5.5": 1.6,
      "5.8": 1.7,
      "6.2": 1.8,
      "6.5": 1.9,
      "6.9": 2.0,
      "8.2": 2.4,
      "8.6": 2.5,
      "8.9": 2.6,
      "9.3": 2.7,
      "9.6": 2.8,
      "10": 2.9,
      "10.3": 3.0,
      "11": 3.2,
      "11.4": 3.3,
      "11.7": 3.4,
      "12": 3.5,
      "12.4": 3.6,
      "12.7": 3.7,
      "13.1": 3.8,
      "13.4": 3.9,
      "13.8": 4.0
    },
    "ATK_": {
      "2.7": 0.8,
      "3.1": 0.9,
      "3.4": 1.0,
      "5.5": 1.6,
      "5.8": 1.7,
      "6.2": 1.8,
      "6.5": 1.9,
      "6.9": 2.0,
      "8.2": 2.4,
      "8.6": 2.5,
      "8.9": 2.6,
      "9.3": 2.7,
      "9.6": 2.8,
      "10": 2.9,
      "10.3": 3.0,
      "11": 3.2,
      "11.4": 3.3,
      "11.7": 3.4,
      "12": 3.5,
      "12.4": 3.6,
      "12.7": 3.7,
      "13.1": 3.8,
      "13.4": 3.9,
      "13.8": 4.0
    },
    "DEF_": {
      "3.4": 0.8,
      "3.8": 0.9,
      "4.3": 1.0,
      "6.9": 1.6,
      "7.3": 1.7,
      "7.7": 1.8,
      "8.2": 1.9,
      "8.6": 2.0,
      "10.3": 2.4,
      "10.8": 2.5,
      "11.2": 2.6,
      "11.6": 2.7,
      "12": 2.8,
      "12.5": 2.9,
      "12.9": 3.0,
      "13.8": 3.2,
      "14.2": 3.3,
      "14.6": 3.4,
      "15.1": 3.5,
      "15.5": 3.6,
      "15.9": 3.7,
      "16.4": 3.8,
      "16.8": 3.9,
      "17.2": 4.0
    },
    "SPD": {
      "1": [
        0.8,
        0.9
      ],
      "2": 1.0,
      "3": [
        1.6,
        1.7,
        1.8,
        1.9
      ],
      "4": [
        2.0,
        2.4
      ],
      "5": [
        2.5,
        2.6,
        2.7,
        2.8,
        2.9
      ],
      "6": [
        3.0,
        3.2,
        3.3,
        3.4
      ],
      "7": [
        3.5,
        3.6,
        3.7,
        3.8,
        3.9
      ],
      "8": 4.0
    },
    "CRIT Rate_": {
      "2": 0.8,
      "2.3": 0.9,
      "2.5": 1.0,
      "4.1": 1.6,
      "4.4": 1.7,
      "4.6": 1.8,
      "4.9": 1.9,
      "5.1": 2.0,
      "6.2": 2.4,
      "6.4": 2.5,
      "6.7": 2.6,
      "6.9": 2.7,
      "7.2": 2.8,
      "7.5": 2.9,
      "7.7": 3.0,
      "8.2": 3.2,
      "8.5": 3.3,
      "8.8": 3.4,
      "9": 3.5,
      "9.3": 3.6,
      "9.5": 3.7,
      "9.8": 3.8,
      "10.1": 3.9,
      "10.3": 4.0
    },
    "CRIT DMG_": {
      "4.1": 0.8,
      "4.6": 0.9,
      "5.1": 1.0,
      "8.2": 1.6,
      "8.8": 1.7,
      "9.3": 1.8,
      "9.8": 1.9,
      "10.3": 2.0,
      "12.4": 2.4,
      "12.9": 2.5,
      "13.4": 2.6,
      "13.9": 2.7,
      "14.5": 2.8,
      "15": 2.9,
      "15.5": 3.0,
      "16.5": 3.2,
      "17.1": 3.3,
      "17.6": 3.4,
      "18.1": 3.5,
      "18.6": 3.6,
      "19.1": 3.7,
      "19.6": 3.8,
      "20.2": 3.9,
      "20.7": 4.0
    },
    "Effect Hit Rate_": {
      "2.7": 0.8,
      "3.1": 0.9,
      "3.4": 1.0,
      "5.5": 1.6,
      "5.8": 1.7,
      "6.2": 1.8,
      "6.5": 1.9,
      "6.9": 2.0,
      "8.2": 2.4,
      "8.6": 2.5,
      "8.9": 2.6,
      "9.3": 2.7,
      "9.6": 2.8,
      "10": 2.9,
      "10.3": 3.0,
      "11": 3.2,
      "11.4": 3.3,
      "11.7": 3.4,
      "12": 3.5,
      "12.4": 3.6,
      "12.7": 3.7,
      "13.1": 3.8,
      "13.4": 3.9,
      "13.8": 4.0
    },
    "Effect RES_": {
      "2.7": 0.8,
      "3.1": 0.9,
      "3.4": 1.0,
      "5.5": 1.6,
      "5.8": 1.7,
      "6.2": 1.8,
      "6.5": 1.9,
      "6.9": 2.0,
      "8.2": 2.4,
      "8.6": 2.5,
      "8.9": 2.6,
      "9.3": 2.7,
      "9.6": 2.8,
      "10": 2.9,
      "10.3": 3.0,
      "11": 3.2,
      "11.4": 3.3,
      "11.7": 3.4,
      "12": 3.5,
      "12.4": 3.6,
      "12.7": 3.7,
      "13.1": 3.8,
      "13.4": 3.9,
      "13.8": 4.0
    },
    "Break Effect_": {
      "4.1": 0.8,
      "4.6": 0.9,
      "5.1": 1.0,
      "8.2": 1.6,
      "8.8": 1.7,
      "9.3": 1.8,
      "9.8": 1.9,
      "10.3": 2.0,
      "12.4": 2.4,
      "12.9": 2.5,
      "13.4": 2.6,
      "13.9": 2.7,
      "14.5": 2.8,
      "15": 2.9,
      "15.5": 3.0,
      "16.5": 3.2,
      "17.1": 3.3,
      "17.6": 3.4,
      "18.1": 3.5,
      "18.6": 3.6,
      "19.1": 3.7,
      "19.6": 3.8,
      "20.2": 3.9,
      "20.7": 4.0
    }
  },
  "5": {
    "HP": {
      "33": 0.8,
      "38": 0.9,
      "42": 1.0,
      "67": 1.6,
      "71": 1.7,
      "76": 1.8,
      "80": 1.9,
      "84": 2.0,
      "101": 2.4,
      "105": 2.5,
      "110": 2.6,
      "114": 2.7,
      "118": 2.8,
      "122": 2.9,
      "127": 3.0,
      "135": 3.2,
      "139": 3.3,
      "143": 3.4,
      "148": 3.5,
      "152": 3.6,
      "156": 3.7,
      "160": 3.8,
      "165": 3.9,
      "169": 4.0,
      "173": 4.1,
      "177": 4.2,
      "182": 4.3,
      "186": 4.4,
      "190": 4.5,
      "194": 4.6,
      "198": 4.7,
      "203": 4.8,
      "207": 4.9,
      "211": 5.0,
      "215": 5.1,
      "220": 5.2,
      "224": 5.3,
      "228": 5.4,
      "232": 5.5,
      "237": 5.6,
      "241": 5.7,
      "245": 5.8,
      "249": 5.9,
      "254": 6.0
    },
    "ATK": {
      "16": 0.8,
      "19": 0.9,
      "21": 1.0,
      "33": 1.6,
      "35": 1.7,
      "38": 1.8,
      "40": 1.9,
      "42": 2.0,
      "50": 2.4,
      "52": 2.5,
      "55": 2.6,
      "57": 2.7,
      "59": 2.8,
      "61": 2.9,
      "63": 3.0,
      "67": 3.2,
      "69": 3.3,
      "71": 3.4,
      "74": 3.5,
      "76": 3.6,
      "78": 3.7,
      "80": 3.8,
      "82": 3.9,
      "84": 4.0,
      "86": 4.1,
      "88": 4.2,
      "91": 4.3,
      "93": 4.4,
      "95": 4.5,
      "97": 4.6,
      "99": 4.7,
      "101": 4.8,
      "103": 4.9,
      "105": 5.0,
      "107": 5.1,
      "110": 5.2,
      "112": 5.3,
      "114": 5.4,
      "116": 5.5,
      "118": 5.6,
      "120": 5.7,
      "122": 5.8,
      "124": 5.9,
      "127": 6.0
    },
    "DEF": {
      "16": 0.8,
      "19": 0.9,
      "21": 1.0,
      "33": 1.6,
      "35": 1.7,
      "38": 1.8,
      "40": 1.9,
      "42": 2.0,
      "50": 2.4,
      "52": 2.5,
      "55": 2.6,
      "57": 2.7,
      "59": 2.8,
      "61": 2.9,
      "63": 3.0,
      "67": 3.2,
      "69": 3.3,
      "71": 3.4,
      "74": 3.5,
      "76": 3.6,
      "78": 3.7,
      "80": 3.8,
      "82": 3.9,
      "84": 4.0,
      "86": 4.1,
      "88": 4.2,
      "91": 4.3,
      "93": 4.4,
      "95": 4.5,
      "97": 4.6,
      "99": 4.7,
      "101": 4.8,
      "103": 4.9,
      "105": 5.0,
      "107": 5.1,
      "110": 5.2,
      "112": 5.3,
      "114": 5.4,
      "116": 5.5,
      "118": 5.6,
      "120": 5.7,
      "122": 5.8,
      "124": 5.9,
      "127": 6.0
    },
    "HP_": {
      "3.4": 0.8,
      "3.8": 0.9,
      "4.3": 1.0,
      "6.9": 1.6,
      "7.3": 1.7,
      "7.7": 1.8,
      "8.2": 1.9,
      "8.6": 2.0,
      "10.3": 2.4,
      "10.8": 2.5,
      "11.2": 2.6,
      "11.6": 2.7,
      "12": 2.8,
      "12.5": 2.9,
      "12.9": 3.0,
      "13.8": 3.2,
      "14.2": 3.3,
      "14.6": 3.4,
      "15.1": 3.5,
      "15.5": 3.6,
      "15.9": 3.7,
      "16.4": 3.8,
      "16.8": 3.9,
      "17.2": 4.0,
      "17.7": 4.1,
      "18.1": 4.2,
      "18.5": 4.3,
      "19": 4.4,
      "19.4": 4.5,
      "19.8": 4.6,
      "20.3": 4.7,
      "20.7": 4.8,
      "21.1": 4.9,
      "21.6": 5.0,
      "22": 5.1,
      "22.4": 5.2,
      "22.8": 5.3,
      "23.3": 5.4,
      "23.7": 5.5,
      "24.1": 5.6,
      "24.6": 5.7,
      "25": 5.8,
      "25.4": 5.9,
      "25.9": 6.0
    },
    "ATK_": {
      "3.4": 0.8,
      "3.8": 0.9,
      "4.3": 1.0,
      "6.9": 1.6,
      "7.3": 1.7,
      "7.7": 1.8,
      "8.2": 1.9,
      "8.6": 2.0,
      "10.3": 2.4,
      "10.8": 2.5,
      "11.2": 2.6,
      "11.6": 2.7,
      "12": 2.8,
      "12.5": 2.9,
      "12.9": 3.0,
      "13.8": 3.2,
      "14.2": 3.3,
      "14.6": 3.4,
      "15.1": 3.5,
      "15.5": 3.6,
      "15.9": 3.7,
      "16.4": 3.8,
      "16.8": 3.9,
      "17.2": 4.0,
      "17.7": 4.1,
      "18.1": 4.2,
      "18.5": 4.3,
      "19": 4.4,
      "19.4": 4.5,
      "19.8": 4.6,
      "20.3": 4.7,
      "20.7": 4.8,
      "21.1": 4.9,
      "21.6": 5.0,
      "22": 5.1,
      "22.4": 5.2,
      "22.8": 5.3,
      "23.3": 5.4,
      "23.7": 5.5,
      "24.1": 5.6,
      "24.6": 5.7,
      "25": 5.8,
      "25.4": 5.9,
      "25.9": 6.0
    },
    "DEF_": {
      "4.3": 0.8,
      "4.8": 0.9,
      "5.4": 1.0,
      "8.6": 1.6,
      "9.1": 1.7,
      "9.7": 1.8,
      "10.2": 1.9,
      "10.8": 2.0,
      "12.9": 2.4,
      "13.5": 2.5,
      "14": 2.6,
      "14.5": 2.7,
      "15.1": 2.8,
      "15.6": 2.9,
      "16.2": 3.0,
      "17.2": 3.2,
      "17.8": 3.3,
      "18.3": 3.4,
      "18.9": 3.5,
      "19.4": 3.6,
      "19.9": 3.7,
      "20.5": 3.8,
      "21": 3.9,
      "21.6": 4.0,
      "22.1": 4.1,
      "22.6": 4.2,
      "23.2": 4.3,
      "23.7": 4.4,
      "24.3": 4.5,
      "24.8": 4.6,
      "25.3": 4.7,
      "25.9": 4.8,
      "26.4": 4.9,
      "27": 5.0,
      "27.5": 5.1,
      "28": 5.2,
      "28.6": 5.3,
      "29.1": 5.4,
      "29.7": 5.5,
      "30.2": 5.6,
      "30.7": 5.7,
      "31.3": 5.8,
      "31.8": 5.9,
      "32.4": 6.0
    },
    "SPD": {
      "2": [
        0.8,
        0.9,
        1.0
      ],
      "4": [
        1.6,
        1.7,
        1.8,
        1.9
      ],
      "5": 2.0,
      "6": [
        2.4,
        2.5,
        2.6
      ],
      "7": [
        2.7,
        2.8,
        2.9,
        3.0
      ],
      "8": [
        3.2,
        3.3,
        3.4
      ],
      "9": [
        3.5,
        3.6,
        3.7,
        3.8
      ],
      "10": [
        3.9,
        4.0,
        4.1,
        4.2
      ],
      "11": [
        4.3,
        4.4,
        4.5,
        4.6
      ],
      "12": [
        4.7,
        4.8,
        4.9
      ],
      "13": [
        5.0,
        5.1,
        5.2,
        5.3
      ],
      "14": [
        5.4,
        5.5,
        5.6,
        5.7
      ],
      "15": [
        5.8,
        5.9,
        6.0
      ]
    },
    "CRIT Rate_": {
      "2.5": 0.8,
      "2.9": 0.9,
      "3.2": 1.0,
      "5.1": 1.6,
      "5.5": 1.7,
      "5.8": 1.8,
      "6.1": 1.9,
      "6.4": 2.0,
      "7.7": 2.4,
      "8.1": 2.5,
      "8.4": 2.6,
      "8.7": 2.7,
      "9": 2.8,
      "9.3": 2.9,
      "9.7": 3.0,
      "10.3": 3.2,
      "10.6": 3.3,
      "11": 3.4,
      "11.3": 3.5,
      "11.6": 3.6,
      "11.9": 3.7,
      "12.3": 3.8,
      "12.6": 3.9,
      "12.9": 4.0,
      "13.2": 4.1,
      "13.6": 4.2,
      "13.9": 4.3,
      "14.2": 4.4,
      "14.5": 4.5,
      "14.9": 4.6,
      "15.2": 4.7,
      "15.5": 4.8,
      "15.8": 4.9,
      "16.2": 5.0,
      "16.5": 5.1,
      "16.8": 5.2,
      "17.1": 5.3,
      "17.4": 5.4,
      "17.8": 5.5,
      "18.1": 5.6,
      "18.4": 5.7,
      "18.7": 5.8,
      "19.1": 5.9,
      "19.4": 6.0
    },
    "CRIT DMG_": {
      "5.1": 0.8,
      "5.8": 0.9,
      "6.4": 1.0,
      "10.3": 1.6,
      "11": 1.7,
      "11.6": 1.8,
      "12.3": 1.9,
      "12.9": 2.0,
      "15.5": 2.4,
      "16.2": 2.5,
      "16.8": 2.6,
      "17.4": 2.7,
      "18.1": 2.8,
      "18.7": 2.9,
      "19.4": 3.0,
      "20.7": 3.2,
      "21.3": 3.3,
      "22": 3.4,
      "22.6": 3.5,
      "23.3": 3.6,
      "23.9": 3.7,
      "24.6": 3.8,
      "25.2": 3.9,
      "25.9": 4.0,
      "26.5": 4.1,
      "27.2": 4.2,
      "27.8": 4.3,
      "28.5": 4.4,
      "29.1": 4.5,
      "29.8": 4.6,
      "30.4": 4.7,
      "31.1": 4.8,
      "31.7": 4.9,
      "32.4": 5.0,
      "33": 5.1,
      "33.6": 5.2,
      "34.3": 5.3,
      "34.9": 5.4,
      "35.6": 5.5,
      "36.2": 5.6,
      "36.9": 5.7,
      "37.5": 5.8,
      "38.2": 5.9,
      "38.8": 6.0
    },
    "Effect Hit Rate_": {
      "3.4": 0.8,
      "3.8": 0.9,
      "4.3": 1.0,
      "6.9": 1.6,
      "7.3": 1.7,
      "7.7": 1.8,
      "8.2": 1.9,
      "8.6": 2.0,
      "10.3": 2.4,
      "10.8": 2.5,
      "11.2": 2.6,
      "11.6": 2.7,
      "12": 2.8,
      "12.5": 2.9,
      "12.9": 3.0,
      "13.8": 3.2,
      "14.2": 3.3,
      "14.6": 3.4,
      "15.1": 3.5,
      "15.5": 3.6,
      "15.9": 3.7,
      "16.4": 3.8,
      "16.8": 3.9,
      "17.2": 4.0,
      "17.7": 4.1,
      "18.1": 4.2,
      "18.5": 4.3,
      "19": 4.4,
      "19.4": 4.5,
      "19.8": 4.6,
      "20.3": 4.7,
      "20.7": 4.8,
      "21.1": 4.9,
      "21.6": 5.0,
      "22": 5.1,
      "22.4": 5.2,
      "22.8": 5.3,
      "23.3": 5.4,
      "23.7": 5.5,
      "24.1": 5.6,
      "24.6": 5.7,
      "25": 5.8,
      "25.4": 5.9,
      "25.9": 6.0
    },
    "Effect RES_": {
      "3.4": 0.8,
      "3.8": 0.9,
      "4.3": 1.0,
      "6.9": 1.6,
      "7.3": 1.7,
      "7.7": 1.8,
      "8.2": 1.9,
      "8.6": 2.0,
      "10.3": 2.4,
      "10.8": 2.5,
      "11.2": 2.6,
      "11.6": 2.7,
      "12": 2.8,
      "12.5": 2.9,
      "12.9": 3.0,
      "13.8": 3.2,
      "14.2": 3.3,
      "14.6": 3.4,
      "15.1": 3.5,
      "15.5": 3.6,
      "15.9": 3.7,
      "16.4": 3.8,
      "16.8": 3.9,
      "17.2": 4.0,
      "17.7": 4.1,
      "18.1": 4.2,
      "18.5": 4.3,
      "19": 4.4,
      "19.4": 4.5,
      "19.8": 4.6,
      "20.3": 4.7,
      "20.7": 4.8,
      "21.1": 4.9,
      "21.6": 5.0,
      "22": 5.1,
      "22.4": 5.2,
      "22.8": 5.3,
      "23.3": 5.4,
      "23.7": 5.5,
      "24.1": 5.6,
      "24.6": 5.7,
      "25": 5.8,
      "25.4": 5.9,
      "25.9": 6.0
    },
    "Break Effect_": {
      "5.1": 0.8,
      "5.8": 0.9,
      "6.4": 1.0,
      "10.3": 1.6,
      "11": 1.7,
      "11.6": 1.8,
      "12.3": 1.9,
      "12.9": 2.0,
      "15.5": 2.4,
      "16.2": 2.5,
      "16.8": 2.6,
      "17.4": 2.7,
      "18.1": 2.8,
      "18.7": 2.9,
      "19.4": 3.0,
      "20.7": 3.2,
      "21.3": 3.3,
      "22": 3.4,
      "22.6": 3.5,
      "23.3": 3.6,
      "23.9": 3.7,
      "24.6": 3.8,
      "25.2": 3.9,
      "25.9": 4.0,
      "26.5": 4.1,
      "27.2": 4.2,
      "27.8": 4.3,
      "28.5": 4.4,
      "29.1": 4.5,
      "29.8": 4.6,
      "30.4": 4.7,
      "31.1": 4.8,
      "31.7": 4.9,
      "32.4": 5.0,
      "33": 5.1,
      "33.6": 5.2,
      "34.3": 5.3,
      "34.9": 5.4,
      "35.6": 5.5,
      "36.2": 5.6,
      "36.9": 5.7,
      "37.5": 5.8,
      "38.2": 5.9,
      "38.8": 6.0
    }
  }
}